#!/usr/bin/env node
import { program } from "commander";
import { buildHtml } from "./html-processor";
import { buildMultires } from "./multires-processor";
import { installMenu, uninstallMenu } from "./menu";
import { logger } from "./logger";
import pkg from "../../package.json" with { type: "json" };

try {
  program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, "-v");

  program
    .argument("<image...>", "List of images to process")
    .option(
      "-r, --raw",
      "Disable 8K optimization and keep original image quality",
    )
    .action(buildHtml);

  program
    .command("multires")
    .description("Generate multiresolution tiles for deep zoom")
    .argument("<image...>", "List of images to process")
    .option(
      "-C, --cylindrical",
      "input projection is cylindrical (default is equirectangular)",
    )
    .option(
      "-H, --haov <value>",
      "horizontal angle of view (defaults to 360.0 for full panorama)",
    )
    .option(
      "-F, --hfov <value>",
      "starting horizontal field of view (defaults to 100.0)",
    )
    .option(
      "-V, --vaov <value>",
      "vertical angle of view (defaults to 180.0 for full panorama)",
    )
    .option(
      "-O, --voffset <value>",
      "starting pitch position (defaults to 0.0)",
    )
    .option(
      "-e, --horizon <value>",
      "offset of the horizon in pixels (negative if above middle, defaults to 0)",
    )
    .option("-s, --tilesize <value>", "tile size in pixels (defaults to 512)")
    .option(
      "-f, --fallbacksize <value>",
      "fallback tile size in pixels (defaults to 1024)",
    )
    .option(
      "-c, --cubesize <value>",
      "cube size in pixels, or 0 to retain all details (defaults to 0)",
    )
    .option(
      "-b, --backgroundcolor <value>",
      "RGB triple of values [0, 1] defining background color shown past the edges of a partial panorama (defaults to '[0.0, 0.0, 0.0]')",
    )
    .option(
      "-B, --avoidbackground",
      "viewer should limit view to avoid showing background, so using --backgroundcolor is not needed",
    )
    .option("-q, --quality <value>", "JPEG quality (defaults to 95)")
    .option(
      "--png",
      "output PNG tiles instead of JPEG tiles",
    )
    .option(
      "-G, --gpu",
      "perform image remapping by nona on the GPU",
    )
    .option(
      "-d, --debug",
      "debug mode (print status info and keep intermediate files)",
    )
    .action(buildMultires);

  program
    .command("install-menu")
    .description('Add html360 to Windows "Send To" menu')
    .action(installMenu);

  program
    .command("uninstall-menu")
    .description('Remove html360 from Windows "Send To" menu')
    .action(uninstallMenu);

  if (process.argv.length > 2) {
    await program.parseAsync(process.argv);
  } else {
    program.help();
  }
} catch (error) {
  logger.error(error);
  process.exit(1);
}
