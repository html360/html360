import c from "ansi-colors";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { pipeline, finished } from "node:stream/promises";
import pLimit from "p-limit";
import { Base64Encode } from "base64-stream";
import sharp from "sharp";
import { startProgressBar } from "./tui/progress-bar";
import { formatTime, getMaxRamMB, silent } from "./utils/utils";
import { getMimeType, verifyFileFormat } from "./supported-formats";
import { writeAsync } from "./utils/stream";
import { defaultState, State } from "../core/state";
import { getHtmlContext } from "./context";
import pkg from "../../package.json" with { type: "json" };
import { HtmlOptions } from "./types/html-options";
import { FileError } from "./types/file-rrror";
import { getAutoNavState, getMapState, prepareImgPaths } from "./utils/processor";
import { buildHtmlItems } from "./html-item-builder";
import { HtmlItem } from "./types/process-item";
import { HtmlContext } from "./types/html-context";
import { printBox } from "./tui/box";

export async function buildHtml(imgPaths: string[], options: HtmlOptions) {
  imgPaths = prepareImgPaths(imgPaths);

  const errors: FileError[] = [];
  const ctx = await getHtmlContext(imgPaths, options);
  const limit = pLimit(ctx.threadCount);
  const items = buildHtmlItems(imgPaths, ctx);

  const startTime = performance.now();
  await startProgressBar(ctx, async (incProgressBar) => {
    const tasks = items.map(x =>
      limit(async () => {
        try {
          await processItem(x);
        } catch (error) {
          errors.push({ fileName: x.imgFileName, error });
        } finally {
          incProgressBar();
        }
      }),
    );
    await Promise.all(tasks);
  });
  finalizeBuild(startTime, errors, ctx);
}

async function processItem(item: HtmlItem) {
  verifyFileFormat(item.imgPath);
  const { htmlChunks } = item.ctx;

  const fileHandle = await fsPromises.open(item.htmlPath, "w");
  try {
    const writeStream = fileHandle.createWriteStream();

    await writeFirst(writeStream, item);
    await writeImage(writeStream, item);
    await writeAsync(writeStream, htmlChunks.beforeState);
    await writeState(writeStream, item);
    await writeAsync(writeStream, htmlChunks.last);

    writeStream.end();
    await finished(writeStream);
    await fileHandle.close();
  } catch (error) {
    await silent(() => fileHandle.close());
    await silent(() => fsPromises.unlink(item.htmlPath));
    throw error;
  }
}

async function writeFirst(writeStream: fs.WriteStream, item: HtmlItem) {
  const first = item.ctx.htmlChunks.first.replace("{{TITLE}}", item.tabTitle);
  await writeAsync(writeStream, first);
}

async function writeImage(writeStream: fs.WriteStream, item: HtmlItem) {
  if (item.ctx.options.raw) {
    const mimeType = getMimeType(item.imgPath);
    writeStream.write(`data:${mimeType};base64,`);

    const readStream = fs.createReadStream(item.imgPath);

    await pipeline(readStream, new Base64Encode(), writeStream, {
      end: false,
    });
  } else {
    writeStream.write("data:image/webp;base64,");

    const transformer = sharp(item.imgPath)
      .resize(8192, 4096, { fit: "inside" })
      .webp({ quality: 85 });

    await pipeline(transformer, new Base64Encode(), writeStream, {
      end: false,
    });
  }
}

async function writeState(writeStream: fs.WriteStream, item: HtmlItem) {
  const map = await getMapState(item.ctx.config, item.imgPath);

  const state: State = {
    ...defaultState,
    imgName: item.imgName,
    htmlFileName: item.htmlFileName,
    tourCandidatesUrls: item.relativeUrls,
    autoNav: getAutoNavState(
      item.ctx.config,
      item.relativeUrls,
      item.index
    ),
    map: map,
    isMultires: false,
    tabTitle: item.tabTitle,
    title: item.ctx.config.title || (item.ctx.config.useImageNameAsTitle ? item.imgName : ""),
    author: item.ctx.config.author,
    authorURL: item.ctx.config.authorUrl,
    version: pkg.version,
  };

  const json = JSON.stringify(state);
  await writeAsync(writeStream, json);
}

function finalizeBuild(startTime: number, errors: FileError[], ctx: HtmlContext) {
  const title = errors.length === 0 ? c.green("Build completed") : c.red("Build faild");
  const time = formatTime(performance.now() - startTime);
  const threads = String(ctx.threadCount);
  const maxRamMB = `${getMaxRamMB().toFixed(0)} MB`;
  const errorsCount = c.red(String(errors.length));

  printBox(c.bold(title), [
    ["Time", time],
    ["Threads", threads],
    ["Max RAM", maxRamMB],
    errors.length > 0 ? ["Errors", errorsCount] : null,
  ], 26);

  if (errors.length > 0) {
    throw new AggregateError(errors, `Build failed with ${errors.length} error(s)`);
  }
}
