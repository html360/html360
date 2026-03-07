import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import c from "ansi-colors";
import { SingleBar } from "cli-progress";
import sharp from "sharp";
import { logger } from "./logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildHtml360(imgPaths: string[]) {
  const errors: FileError[] = [];
  const templateHtml = await getTemplateHtml();

  await startProgressBar(imgPaths.length, async (progressBar) => {
    for (const imgPath of imgPaths) {
      const fileName = path.basename(imgPath);

      try {
        await processImage(imgPath, templateHtml);
      } catch (error) {
        errors.push({ fileName, error });
      } finally {
        progressBar.increment({ errors: errors.length });
      }
    }
  });

  errors.forEach(logFileError);
}

async function processImage(imgPath: string, templateHtml: string) {
  const absoluteImgPath = path.resolve(imgPath);

  const webpBuffer = await sharp(absoluteImgPath)
    .resize(8192, 4096, { fit: "inside" })
    .webp({ quality: 85 })
    .toBuffer();

  const base64Image = `data:image/webp;base64,${webpBuffer.toString("base64")}`;

  const html = templateHtml.replace("{{PANORAMA_DATA}}", base64Image);

  const resultFileName = getResultFileName(absoluteImgPath);
  await fs.writeFile(resultFileName, html);
}

async function getTemplateHtml(): Promise<string> {
  return fs.readFile(path.join(__dirname, "template.html"), "utf8");
}

async function startProgressBar(
  total: number,
  action: (progressBar: SingleBar) => Promise<void>,
): Promise<void> {
  const progressBar = new SingleBar({
    format: `${c.bgCyan.black(" html360 ")} |${c.cyan("{bar}")}| ${c.cyan("{percentage}%")} | ${c.cyan("{value}/{total} Files")} | ${c.red("{errors} Errors")}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  progressBar.start(total, 0, { errors: 0 });

  try {
    await action(progressBar);
  } finally {
    progressBar.stop();
  }
}

function getResultFileName(absoluteImgPath: string) {
  const outputDir = path.dirname(absoluteImgPath);
  const outputFileName = path.parse(absoluteImgPath).name + ".html";
  const finalPath = path.join(outputDir, outputFileName);
  return finalPath;
}

function logFileError({fileName, error}: FileError) {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Failed to process ${fileName}: ${message}`);
}

type FileError = {
  fileName: string;
  error: any;
};
