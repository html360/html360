import os from "node:os";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getHtmlChunks, TEMPLATE_HTML } from "./html-chunks";
import { HtmlContext, HtmlOptions, MultiresContext, MultiresOptions } from "./types";
import { readConfig } from "./configure";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getHtmlContext(
  imgPaths: string[],
  options: HtmlOptions,
): Promise<HtmlContext> {
  const config = readConfig();
  const htmlChunks = await getHtmlChunks();
  const cpuCount = os.cpus().length;
  const threadCount = Math.max(1, cpuCount - 1);

  return { config, imgPaths, options, htmlChunks, threadCount };
}

export function getMultiresContext(
  imgPaths: string[],
  options: MultiresOptions,
): MultiresContext {
  const config = readConfig();
  const templateHtml = fs.readFileSync(
      path.join(__dirname, TEMPLATE_HTML),
      "utf8",
    );

  return { config, imgPaths, options, templateHtml };
}
