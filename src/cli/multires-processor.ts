import { html360Gen } from "html360-gen";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { logger } from "./logger";
import { defaultState, State } from "../core/state";
import { getMultiresContext } from "./context";
import { isNil } from "./utils/utils";
import { MultiresOptions } from "./types/multires-options";
import pkg from "../../package.json" with { type: "json" };
import { getAutoNavState, prepareImgPaths } from "./utils/processor";
import { buildMultiresItems } from "./multires-item-builder";
import { MultiresItem } from "./types/process-item";

export function buildMultires(imgPaths: string[], options: MultiresOptions) {
  imgPaths = prepareImgPaths(imgPaths);
  const ctx = getMultiresContext(imgPaths, options);
  const items = buildMultiresItems(imgPaths, ctx);

  for (const item of items) {
    logger.info(`Start ${item.imgFileName}`);
    processItem(item);
    logger.success(`Finish ${item.imgFileName}`);
  }
}

function processItem(item: MultiresItem) {
  if (fs.existsSync(item.htmlDir)) {
    fs.rmSync(item.htmlDir, { recursive: true, force: true });
  }

  const args = getHtml360GenArgs(item);
  const result = spawnSync(html360Gen.getBinaryPath(), args, {
    stdio: "inherit", // Пробрасываем логи Python-скрипта в консоль
    shell: false, // node запустит html360-gen напрямую, а не внутри cmd или bash
  });

  if (result.status !== 0) {
    throw Error(`Error while processing ${item.imgPath}`);
  }

  let html = item.ctx.templateHtml
    .replace("{{TITLE}}", item.tabTitle)
    .replace(
      "{{PANORAMA_DATA}}",
      "<!-- In multiresolution mode {{PANORAMA_DATA}} is empty -->",
    )
    .replace("{{STATE}}", getStateJSON(item));

  fs.writeFileSync(item.htmlPath, html);
}

function getHtml360GenArgs(item: MultiresItem): string[] {
  const opts = item.ctx.options;

  const args = [item.imgPath];
  args.push("--output", item.htmlDir);
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

function getStateJSON(item: MultiresItem) {
  const state: State = {
    ...defaultState,
    imgName: item.imgName,
    htmlFileName: item.htmlFileName,
    tourCandidatesUrls: item.relativeUrls,
    autoNav: getAutoNavState(item.ctx.config, item.relativeUrls, item.index),
    isMultires: true,
    tabTitle: item.tabTitle,
    title: item.ctx.config.title || (item.ctx.config.useImageNameAsTitle ? item.imgName : ""),
    author: item.ctx.config.author,
    authorURL: item.ctx.config.authorUrl,
    version: pkg.version,
  };

  return JSON.stringify(state);
}
