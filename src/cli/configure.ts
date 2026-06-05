import fs from "node:fs";
import path from "node:path";
import os from "os";
import * as p from "@clack/prompts";
import { Config, defaultConfig } from "./config";

const CONFIG_PATH = path.join(os.homedir(), ".html360.json");

export async function configure() {
  const config = readConfig();

  p.intro("Configure global settings for all panoramas");

  const newConfig: Pick<Config, "author" | "authorUrl"> = await p.group(
    {
      author: () =>
        p.text({
          message: "Enter author:",
          placeholder: "Example: Superman",
          initialValue: config.author,
        }),
      authorUrl: () =>
        p.text({
          message: "Enter author url:",
          placeholder: "Example: https://example.com",
          initialValue: config.authorUrl,
          validate: (value) => {
            // Allow empty value if the user doesn't want to provide a URL
            if (!value) return; 

            // Simple URL regex check (accepts http://, https://, or root-relative paths if needed)
            const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
            if (!urlPattern.test(value)) {
              return "Please enter a valid URL (e.g., https://example.com) or leave it empty.";
            }
          }          
        }),
    },
    {
      onCancel: () => {
        p.cancel("Configuration canceled.");
        process.exit(0);
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
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    return { ...defaultConfig, ...config };
  } catch {
    return defaultConfig;
  }
}

function saveConfig(config: Config) {
  const value = { ...defaultConfig, ...config };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(value, null, 2), "utf8");
}
