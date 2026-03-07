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
const svgPath = path.join(__dirname, "../src/view/assets/html360.svg");
const icoPath = path.join(distPath, "html360.ico");

build();

async function build() {
  try {
    console.log("🏗️  Building html360...");

    await fs.rm(distPath, { recursive: true, force: true });
    await fs.mkdir(distPath);
    await Promise.all([buildHtmlTemplate(), buildCli()]);

    console.log("✅ Build complete.");
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function buildCli() {
  await Promise.all([
    createIco(),
    buildCliJs(),
    fs.copyFile(
      path.join(srcPath, "cli/menu.bat"),
      path.join(distPath, "menu.bat"),
    ),
  ]);
}

async function buildCliJs() {
  /** @type {import('esbuild').BuildOptions} */
  const options = {
    entryPoints: [path.join(srcPath, "cli/index.ts")],
    platform: "node",
    target: "node20",
    format: "esm",
    bundle: true,
    minify: true,
    sourcemap: true,
    write: true,
    packages: "external",
    outdir: "dist",
  };
  await esbuild.build(options);
}

async function buildHtmlTemplate() {
  const [favicon, js, css, rawTemplate] = await Promise.all([
    getFavicon(),
    buildTemplateJs(),
    buildTemplateCss(),
    fs.readFile(path.join(srcPath, "view/index.html"), "utf8"),
  ]);

  const compiledTemplate = rawTemplate
    .replace("{{FAVICON}}", favicon)
    .replace("{{CSS}}", css)
    .replace("{{JS}}", js);

  await fs.writeFile(path.join(distPath, "template.html"), compiledTemplate);
}

async function buildTemplateJs() {
  /** @type {import('esbuild').BuildOptions} */
  const options = {
    entryPoints: [path.join(srcPath, "view/ts/index.ts")],
    bundle: true,
    minify: true,
    sourcemap: true,
    write: false,
    platform: "browser",
    target: ["chrome58", "firefox57", "safari11", "edge16"],
  };
  const jsResult = await esbuild.build(options);

  // @ts-ignore
  return jsResult.outputFiles[0].text;
}

async function buildTemplateCss() {
  /** @type {import('esbuild').BuildOptions} */
  const options = {
    entryPoints: [path.join(srcPath, "view/css/index.css")],
    bundle: true,
    minify: true,
    write: false,
    platform: "browser",
    target: ["chrome58", "firefox57", "safari11", "edge16"],
    loader: { ".svg": "dataurl", ".png": "dataurl" },
  };
  const cssResult = await esbuild.build(options);

  // @ts-ignore
  return cssResult.outputFiles[0].text;
}

async function getFavicon() {
  const svgRaw = await fs.readFile(svgPath, "utf8");
  const svgMinified = svgRaw.replace(/\s+/g, " ").trim();
  return `data:image/svg+xml,${encodeURIComponent(svgMinified)}`;
}

async function createIco() {
  const pngBuffer = await sharp(svgPath).resize(256, 256).png().toBuffer();
  const icon = await pngToIco(pngBuffer);
  await fs.writeFile(icoPath, icon);
}
