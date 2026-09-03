import { HtmlContext } from "./html-context";
import { MultiresContext } from "./multires-context";

type Item = {
  index: number;
  imgPath: string;
  imgName: string;
  imgFileName: string;
  htmlPath: string;
  htmlFileName: string;
  htmlDir: string;
  tabTitle: string;
  relativeUrls: string[];
};

export type HtmlItem = Item & {
  ctx: HtmlContext;
};

export type MultiresItem = Item & {
  ctx: MultiresContext;
};

