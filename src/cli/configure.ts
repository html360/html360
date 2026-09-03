import fs from "node:fs";
import path from "node:path";
import os from "os";
import * as p from "@clack/prompts";
import { Config, defaultConfig } from "./types/config";
import { CanceledError } from "./canceled-error";

const CONFIG_PATH = path.join(os.homedir(), ".html360.json");

export async function configure() {
  const config = readConfig();

  p.intro("Configure global settings for all panoramas");

  const newConfig: Config =
    await p.group(
      {
        tabTitle: () =>
          p.text({
            message: "Enter tab title (default is image name):",
            initialValue: config.tabTitle,
          }),
        title: () =>
          p.text({
            message: "Enter panorama title:",
            initialValue: config.title,
          }),
        useImageNameAsTitle: (opt: any) => {
          const results = opt.results as Partial<Config>;
          return !results.title ?
            p.confirm({
              message: "Use image name as panorama title?",
              initialValue: config.useImageNameAsTitle,
            }) : Promise.resolve(false);
        },
        author: () =>
          p.text({
            message: "Enter author:",
            initialValue: config.author,
          }),
        authorUrl: () =>
          p.text({
            message: "Enter author url:",
            initialValue: config.authorUrl,
            validate: (value) => {
              if (!value) return;

              // Simple URL regex check (accepts http://, https://, or root-relative paths if needed)
              const urlPattern =
                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
              if (!urlPattern.test(value)) {
                return "Please enter a valid URL (e.g., https://example.com) or leave it empty.";
              }
            },
          }),
        useAutoNav: () =>
          p.confirm({
            message: "Enable auto-navigation for panoramas?",
            initialValue: config.useAutoNav,
          }),
      },
      {
        onCancel: () => {
          p.cancel("Configuration canceled.");
          throw new CanceledError();
        },
      },
    );

  const updatedConfig = { ...config, ...newConfig };
  saveConfig(updatedConfig);

  p.outro(
    "Configuration successfully saved to '.html360.json' in your home folder!",
  );
}

export function readConfig(): Config {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return { ...defaultConfig, ...config };
  }

  return defaultConfig;
}

function saveConfig(config: Config) {
  const value = { ...defaultConfig, ...config };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(value, null, 2), "utf8");
}
