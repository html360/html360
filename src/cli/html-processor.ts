import path from "node:path";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { pipeline, finished } from "node:stream/promises";
import pLimit from "p-limit";
import { Base64Encode } from "base64-stream";
import sharp from "sharp";
import { logger } from "./logger";
import { startProgressBar } from "./progress-bar";
import { silent } from "./utils";
import { getMimeType, verifyFileFormat } from "./supported-formats";
import { writeAsync } from "./stream-utils";
import { defaultState, State } from "../core/state";
import { HtmlContext, FileError, HtmlOptions } from "./types";
import { getHtmlContext } from "./context";
import pkg from "../../package.json" with { type: "json" };

export async function buildHtml(imgPaths: string[], options: HtmlOptions) {
  imgPaths = imgPaths.map((x) => path.resolve(x));
  const errors: FileError[] = [];
  const ctx = await getHtmlContext(imgPaths, options);
  const limit = pLimit(ctx.threadCount);

  await startProgressBar(ctx, async (incProgressBar) => {
    const tasks = imgPaths.map((imgPath) =>
      limit(async () => {
        const fileName = path.basename(imgPath);

        try {
          await processImage(imgPath, ctx);
        } catch (error) {
          errors.push({ fileName, error });
        } finally {
          incProgressBar(errors.length);
        }
      }),
    );
    await Promise.all(tasks);
  });

  errors.forEach(logFileError);
}

async function processImage(imgPath: string, ctx: HtmlContext) {
  verifyFileFormat(imgPath);
  const { options, htmlChunks } = ctx;
  const htmlPath = getHtmlPath(imgPath, options);
  const fileHandle = await fsPromises.open(htmlPath, "w");
  try {
    const writeStream = fileHandle.createWriteStream();

    await writeAsync(writeStream, htmlChunks.first);
    await writeImage(writeStream, imgPath, options);
    await writeAsync(writeStream, htmlChunks.beforeState);
    await writeState(writeStream, imgPath, ctx);
    await writeAsync(writeStream, htmlChunks.last);

    writeStream.end();
    await finished(writeStream);
    await fileHandle.close();
  } catch (error) {
    await silent(() => fileHandle.close());
    await silent(() => fsPromises.unlink(htmlPath));
    throw error;
  }
}

async function writeImage(
  writeStream: fs.WriteStream,
  imgPath: string,
  options: HtmlOptions,
) {
  if (options.raw) {
    const mimeType = getMimeType(imgPath);
    writeStream.write(`data:${mimeType};base64,`);

    const readStream = fs.createReadStream(imgPath);

    await pipeline(readStream, new Base64Encode(), writeStream, {
      end: false,
    });
  } else {
    writeStream.write("data:image/webp;base64,");

    const transformer = sharp(imgPath)
      .resize(8192, 4096, { fit: "inside" })
      .webp({ quality: 85 });

    await pipeline(transformer, new Base64Encode(), writeStream, {
      end: false,
    });
  }
}

async function writeState(
  writeStream: fs.WriteStream,
  imgPath: string,
  ctx: HtmlContext,
) {
  const state: State = {
    name: getHtmlName(imgPath, ctx.options),
    yaw: defaultState.yaw,
    pitch: defaultState.pitch,
    hfov: defaultState.hfov,
    hotspots: defaultState.hotspots,
    tourCandidatesUrls: getToursCandidatesUrls(imgPath, ctx),
    isEditMode: defaultState.isEditMode,
    isMultires: false,
    version: pkg.version,
  };

  const json = JSON.stringify(state);
  await writeAsync(writeStream, json);
}

function getHtmlPath(imgPath: string, options: HtmlOptions) {
  const dir = path.dirname(imgPath);
  const name = getHtmlName(imgPath, options);
  return path.join(dir, name);
}

function getHtmlName(imgPath: string, options: HtmlOptions) {
  const name = path.parse(imgPath).name;
  const suffix = options.raw ? "_RAW" : "";
  return `${name}${suffix}.html`;
}

function getToursCandidatesUrls(imgPath: string, ctx: HtmlContext): string[] {
  const htmlPath = getHtmlPath(imgPath, ctx.options);
  const tours = ctx.imgPaths
    .filter((x) => x !== imgPath)
    .map((x) => getHtmlPath(x, ctx.options))
    .map((x) => {
      let rel = path.relative(path.dirname(htmlPath), x);

      // Node.js может вернуть 'file.html', но для браузера лучше './file.html'
      if (!rel.startsWith(".")) rel = "./" + rel;

      // Заменяем обратный слэш на прямой
      rel = rel.split(path.sep).join("/");

      return rel;
    });

  return tours;
}

function logFileError({ fileName, error }: FileError) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Failed to process ${fileName}: ${message}`);
}
