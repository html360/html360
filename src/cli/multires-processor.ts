import { html360Gen } from "html360-gen";
import fs from "node:fs";
import path, { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { logger } from "./logger";
import { defaultState, State } from "../core/state";
import { MultiresContext, MultiresOptions } from "./types";
import { getMultiresContext } from "./context";
import pkg from "../../package.json" with { type: "json" };
import { isNil } from "./utils";

export function buildMultires(imgPaths: string[], options: MultiresOptions) {
  imgPaths = imgPaths.map((x) => path.resolve(x));
  const ctx = getMultiresContext(imgPaths, options);

  for (const imgPath of imgPaths) {
    const fileName = path.basename(imgPath);
    try {
      logger.info(`Start ${fileName}`);
      processImage(imgPath, ctx);
      logger.success(`Finish ${fileName}`);
    } catch (error) {
      logger.error(error);
    }
  }
}

function processImage(imgPath: string, ctx: MultiresContext) {
  const output = getOutputInfo(imgPath);

  if (fs.existsSync(output.dir)) {
    fs.rmSync(output.dir, { recursive: true, force: true });
  }

  const args = getHtml360GenArgs(imgPath, output.dir, ctx);
  const result = spawnSync(html360Gen.getBinaryPath(), args, {
    stdio: "inherit", // Пробрасываем логи Python-скрипта в консоль
    shell: false, // node запустит html360-gen напрямую, а не внутри cmd или bash
  });

  if (result.status !== 0) {
    throw Error(`Error while processing ${imgPath}`);
  }

  let html = ctx.templateHtml
    .replace(
      "{{PANORAMA_DATA}}",
      "<!-- In multiresolution mode {{PANORAMA_DATA}} is empty -->",
    )
    .replace("{{STATE}}", getStateJSON(imgPath, ctx));

  fs.writeFileSync(output.htmlPath, html);
}

function getOutputInfo(imgPath: string): {
  dir: string;
  htmlPath: string;
  name: string;
} {
  const name = path.parse(imgPath).name;
  const dir = path.join(path.dirname(imgPath), name);
  const htmlPath = path.join(dir, "index.html");

  return {
    dir,
    htmlPath,
    name
  }
}

function getHtml360GenArgs(
  imgPath: string,
  outputDir: string,
  ctx: MultiresContext,
): string[] {
  const opts = ctx.options;

  const args = [imgPath];
  args.push("--output", outputDir);
  args.push("--quality", opts.quality || "95");

  if (opts.cylindrical) args.push("--cylindrical");
  if (!isNil(opts.haov)) args.push("--haov", opts.haov);
  if (!isNil(opts.hfov)) args.push("--hfov", opts.hfov);
  if (!isNil(opts.vaov)) args.push("--vaov", opts.vaov);
  if (!isNil(opts.voffset)) args.push("--voffset", opts.voffset);
  if (!isNil(opts.horizon)) args.push("--horizon", opts.horizon);
  if (!isNil(opts.tilesize)) args.push("--tilesize", opts.tilesize);
  if (!isNil(opts.fallbacksize)) args.push("--fallbacksize", opts.fallbacksize);
  if (!isNil(opts.cubesize)) args.push("--cubesize", opts.cubesize);
  if (!isNil(opts.backgroundcolor))
    args.push("--backgroundcolor", opts.backgroundcolor);
  if (!isNil(opts.avoidbackground)) args.push("--avoidbackground");
  if (!isNil(opts.png)) args.push("--png");
  if (!isNil(opts.gpu)) args.push("--gpu");
  if (!isNil(opts.debug)) args.push("--debug");

  return args;
}

function getStateJSON(imgPath: string, ctx: MultiresContext) {
  const output = getOutputInfo(imgPath);

  const state: State = {
    name: output.name,
    yaw: defaultState.yaw,
    pitch: defaultState.pitch,
    hfov: defaultState.hfov,
    hotspots: defaultState.hotspots,
    tourCandidatesUrls: getToursCandidatesUrls(imgPath, ctx),
    isEditMode: defaultState.isEditMode,
    isMultires: true,
    version: pkg.version,
  };

  return JSON.stringify(state);
}

function getToursCandidatesUrls(
  imgPath: string,
  ctx: MultiresContext,
): string[] {
  const outputDir = getOutputInfo(imgPath).dir;

  const tours = ctx.imgPaths
    .filter((x) => x !== imgPath)
    .map((x) => getOutputInfo(x).htmlPath)
    .map((x) => {
      let rel = path.relative(outputDir, x);

      // Node.js может вернуть 'file.html', но для браузера лучше './file.html'
      if (!rel.startsWith(".")) rel = "./" + rel;

      // Заменяем обратный слэш на прямой
      rel = rel.split(path.sep).join("/");

      return rel;
    });

  return tours;
}
