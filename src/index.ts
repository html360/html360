#!/usr/bin/env node
import { program } from "commander";
import { buildHtml360 } from "./processor";
import { installMenu, uninstallMenu } from "./menu";
import { logger } from "./logger";
import pkg from "../package.json" with { type: "json" };

try {
  program.name(pkg.name).description(pkg.description).version(pkg.version);

  program
    .argument("<image...>", "List of images to process")
    .action(buildHtml360);

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
