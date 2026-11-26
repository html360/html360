import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEMPLATE_HTML } from "../../utils/html-chunks";
import { readConfig } from "../configure/configure";
import { MultiresOptions } from "./multires-options";
import { Config } from "../../types/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type MultiresContext = {
  imgPaths: string[];
  options: MultiresOptions;
  templateHtml: string;
  config: Config;
};

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
