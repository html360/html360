import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getHtmlChunks } from "../../utils/html-chunks";
import { readConfig } from "../configure/configure";
import { Config } from "../../types/config";
import { HtmlChunks } from "../../utils/html-chunks";
import { HtmlOptions } from "./html-options";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type HtmlContext = {
  imgPaths: string[];
  options: HtmlOptions;
  threadCount: number;
  htmlChunks: HtmlChunks;
  config: Config;
};

export async function getHtmlContext(
  imgPaths: string[],
  options: HtmlOptions,
): Promise<HtmlContext> {
  const config = readConfig();
  const htmlChunks = await getHtmlChunks();
  const cpuCount = os.cpus().length;
  const threadCount = Math.max(1, Math.min(cpuCount - 1, imgPaths.length));

  return { config, imgPaths, options, htmlChunks, threadCount };
}
