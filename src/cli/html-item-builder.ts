import path from "node:path";
import { HtmlOptions } from "./types/html-options";
import { HtmlContext } from "./types/html-context";
import { getImgName, getRelativeUrl } from "./utils/processor";
import { HtmlItem } from "./types/process-item";

export function buildHtmlItems(imgPaths: string[], ctx: HtmlContext): HtmlItem[] {
  return imgPaths.map((imgPath, index) => {
    const imgName = getImgName(imgPath);
    const imgFileName = path.basename(imgPath);
    const htmlPath = getHtmlPath(imgPath, ctx.options);
    const htmlFileName = getHtmlFileName(imgPath, ctx.options);
    const htmlDir = path.dirname(htmlPath);
    const tabTitle = ctx.config.tabTitle || imgName;
    const relativeUrls = ctx.imgPaths
      .map((x) => getHtmlPath(x, ctx.options))
      .map((x) => getRelativeUrl(htmlDir, x));

    return {
      index,
      imgPath,
      imgName,
      imgFileName,
      htmlPath,
      htmlFileName,
      htmlDir,
      tabTitle,
      relativeUrls,
      ctx,
    }
  });
}

function getHtmlPath(imgPath: string, options: HtmlOptions) {
  const dir = path.dirname(imgPath);
  const name = getHtmlFileName(imgPath, options);
  return path.join(dir, name);
}

function getHtmlFileName(imgPath: string, options: HtmlOptions) {
  const name = getImgName(imgPath);
  const suffix = options.raw ? "_RAW" : "";
  return `${name}${suffix}.html`;
}
