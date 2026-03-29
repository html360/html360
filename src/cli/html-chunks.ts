import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { HtmlChunks } from "./types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEMPLATE_HTML = "template.html";
const PANORAMA_DATA = "{{PANORAMA_DATA}}";
const STATE = "{{STATE}}";

export async function getHtmlChunks(): Promise<HtmlChunks> {
  const source = await fs.readFile(
    path.join(__dirname, TEMPLATE_HTML),
    "utf8",
  );

  verifyPlaceholder(source, PANORAMA_DATA);
  verifyPlaceholder(source, STATE)

  const [first, rest] = source.split(PANORAMA_DATA);
  const [beforeState, last] = rest.split(STATE);

  return {
    source,
    first,
    beforeState,
    last
  };
}

function verifyPlaceholder(htmlTemplate: string, placeholder: string) {
  if (!htmlTemplate.includes(placeholder)) {
    throw new Error(`Template placeholder ${placeholder} not found in ${TEMPLATE_HTML}`);
  }
}
