import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { pipeline, finished } from "node:stream/promises";
import pLimit from "p-limit";
import { Base64Encode } from "base64-stream";
import sharp from "sharp";
import { logger } from "./logger";
import { startProgressBar } from "./progress-bar";
import { silent } from "./utils/utils";
import { getMimeType, verifyFileFormat } from "./supported-formats";
import { writeAsync } from "./utils/stream";
import { defaultState, State } from "../core/state";
import { getHtmlContext } from "./context";
import pkg from "../../package.json" with { type: "json" };
import { HtmlOptions } from "./types/html-options";
import { FileError } from "./types/file-rrror";
import { getAutoNavState, prepareImgPaths } from "./utils/processor";
import { buildHtmlItems } from "./html-item-builder";
import { HtmlItem } from "./types/process-item";

export async function buildHtml(imgPaths: string[], options: HtmlOptions) {
  imgPaths = prepareImgPaths(imgPaths);

  const errors: FileError[] = [];
  const ctx = await getHtmlContext(imgPaths, options);
  const limit = pLimit(ctx.threadCount);
  const items = buildHtmlItems(imgPaths, ctx);

  await startProgressBar(ctx, async (incProgressBar) => {
    const tasks = items.map(x =>
      limit(async () => {
        try {
          await processItem(x);
        } catch (error) {
          errors.push({ fileName: x.imgFileName, error });
        } finally {
          incProgressBar(errors.length);
        }
      }),
    );
    await Promise.all(tasks);
  });

  if (errors.length > 0) {
    errors.forEach(logFileError);
    throw new Error("Build failed");
  }
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

function logFileError({ fileName, error }: FileError) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Failed to process ${fileName}: ${message}`);
}
