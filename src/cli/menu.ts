import path from "node:path";
import fs from "node:fs/promises";
import ws from "windows-shortcuts";
import { fileURLToPath } from "url";
import { logger } from "./logger";
import { silent } from "./utils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_BAT_PATH = path.join(__dirname, "menu.bat");

const MENU_ICO_PATH = path.join(__dirname, "html360.ico");

const MENU_ITEMS = {
  Q8K: "html360 (8K).lnk",
  RAW: "html360 (Raw Original).lnk",
  MULTIRES: "html360 (Multiresolution).lnk",
};

export async function installMenu(): Promise<void> {
  if (process.platform !== "win32") {
    throw new Error("This feature is only available on Windows.");
  }

  await clear();
  const menuItems = getMenuItems();
  await Promise.all(menuItems.map((x) => createMenu(x.path, x.args)));
  logger.success(`"Send To" menu shortcut created successfully!`);
}

export async function uninstallMenu(): Promise<void> {
  await clear();
  logger.success("Menu shortcut removed successfully.");
}

function getMenuItems(): MenuItems[] {
  const result = [
    {
      path: getLinkPath(MENU_ITEMS.Q8K),
      args: "",
    },
    {
      path: getLinkPath(MENU_ITEMS.RAW),
      args: "-r",
    },
    {
      path: getLinkPath(MENU_ITEMS.MULTIRES),
      args: "multires",
    },
  ];

  return result;
}

function getLinkPath(name: string): string {
  const appData = process.env.APPDATA;

  if (!appData) {
    throw new Error("APPDATA environment variable is missing");
  }

  return path.join(appData, "Microsoft", "Windows", "SendTo", name);
}

function createMenu(path: string, args: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ws.create(
      path,
      {
        target: MENU_BAT_PATH,
        icon: MENU_ICO_PATH,
        args: args,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });
}

async function clear() {
  for (const name of Object.values(MENU_ITEMS)) {
    const path = getLinkPath(name);
    await silent(() => fs.unlink(path));
  }
}

type MenuItems = {
  path: string;
  args: string;
};
