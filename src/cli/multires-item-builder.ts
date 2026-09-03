import path from "node:path";
import { MultiresContext } from "./types/multires-context";
import { MultiresItem } from "./types/process-item";
import { getImgName, getRelativeUrl } from "./utils/processor";

export function buildMultiresItems(imgPaths: string[], ctx: MultiresContext): MultiresItem[] {
  return imgPaths.map((imgPath, index) => {
    const imgName = getImgName(imgPath);
    const imgFileName = path.basename(imgPath);
    const info = getOutputInfo(imgPath);
    const htmlPath = info.htmlPath;
    const htmlFileName = info.htmlFileName;
    const htmlDir = info.dir;
    const tabTitle = ctx.config.tabTitle || imgName;;
    const relativeUrls = ctx.imgPaths
      .map((x) => getOutputInfo(x).htmlPath)
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

function getOutputInfo(imgPath: string): {
  dir: string;
  htmlPath: string;
  htmlFileName: string;
  name: string;
} {
  const name = getImgName(imgPath);
  const dir = path.join(path.dirname(imgPath), name);
  const htmlFileName = "index.html";
  const htmlPath = path.join(dir, htmlFileName);

  return {
    dir,
    htmlPath,
    htmlFileName,
    name,
  };
}
