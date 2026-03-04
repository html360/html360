import path from "node:path";
import fs from "node:fs/promises";
import ws from "windows-shortcuts";
import { fileURLToPath } from "url";
import { logger } from "./logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_BAT_PATH = path.join(__dirname, "menu.bat");

const MENU_ICO_PATH = path.join(__dirname, "html360.ico");

export function installMenu(): Promise<void> {
  if (process.platform !== "win32") {
    throw new Error("This feature is only available on Windows.");
  }

  return new Promise((resolve, reject) => {
    ws.create(
      getLinkPath(),
      {
        target: MENU_BAT_PATH,
        icon: MENU_ICO_PATH,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          logger.success(`"Send To" menu shortcut created successfully!`);
          resolve();
        }
      },
    );
  });
}

export async function uninstallMenu(): Promise<void> {
  const linkPath = getLinkPath();
  if (!(await checkFile(linkPath))) {
    logger.info("No menu shortcut found to remove.");
    return;
  }

  await fs.unlink(linkPath);
  logger.success("Menu shortcut removed successfully.");
}

async function checkFile(path: string) {
  try {
    await fs.access(path, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function getLinkPath(): string {
  const appData = process.env.APPDATA;

  if (!appData) {
    throw new Error("APPDATA environment variable is missing");
  }

  return path.join(appData, "Microsoft", "Windows", "SendTo", "html360.lnk");
}
