import { ProcessItem } from "../../types/process-item";
import { HtmlContext } from "./html-context";

export type HtmlItem = ProcessItem & {
  ctx: HtmlContext;
};

