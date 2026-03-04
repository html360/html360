// @ts-check
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcPath = path.join(__dirname, "../src");
const distPath = path.join(__dirname, "../dist");
const svgPath = path.join(__dirname, "../src/html360.svg");
const icoPath = path.join(distPath, "html360.ico");
const libPath = path.dirname(fileURLToPath(import.meta.resolve("pannellum")));

build().catch(() => process.exit(1));

async function build() {
  console.log("🏗️  Building html360...");

  await fs.rm(distPath, { recursive: true, force: true });

  const [favicon, icoBuffer, pannellumJs, pannellumCss, rawTemplate] =
    await Promise.all([
      getSvgDataUri(svgPath),
      createIcoBufferFromSvg(svgPath),
      fs.readFile(path.join(libPath, "pannellum.js"), "utf8"),
      fs.readFile(path.join(libPath, "pannellum.css"), "utf8"),
      fs.readFile(path.join(srcPath, "template.html"), "utf8"),
    ]);

  const compiledTemplate = rawTemplate
    .replace("{{FAVICON}}", favicon)
    .replace("{{PANNELLUM_JS}}", pannellumJs)
    .replace("{{PANNELLUM_CSS}}", pannellumCss);

  await fs.mkdir(distPath);

  await fs.writeFile(path.join(distPath, "template.html"), compiledTemplate);

  /** @type {import('esbuild').BuildOptions} */
  const options = {
    target: "node20",
    platform: "node",
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    packages: 'external',
    entryPoints: {
      index: "./src/index.ts",
    },
    outdir: "dist",
    write: true,
  }
  await esbuild.build(options);

  await fs.copyFile(
    path.join(srcPath, "menu.bat"),
    path.join(distPath, "menu.bat"),
  );

  await fs.writeFile(icoPath, icoBuffer);

  console.log("✅ Build complete.");
}

/**
 * @param {string} svgPath
 */
async function getSvgDataUri(svgPath) {
  const svgRaw = await fs.readFile(svgPath, "utf8");
  const svgMinified = svgRaw.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml,${encodeURIComponent(svgMinified)}`;
}

/**
 * @param {string} svgPath
 */
async function createIcoBufferFromSvg(svgPath) {
  const pngBuffer = await sharp(svgPath).resize(256, 256).png().toBuffer();
  return await pngToIco(pngBuffer);
}
