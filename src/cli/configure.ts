import fs from "node:fs";
import path from "node:path";
import os from "os";
import * as p from "@clack/prompts";
import { Config, defaultConfig } from "./types/config";
import { CanceledError } from "./canceled-error";
import { mapUrlTemplate } from "../core/map-url";

const CONFIG_PATH = path.join(os.homedir(), ".html360.json");

// Simple URL regex check (accepts http://, https://, or root-relative paths if needed)
const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;

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

        authorUrl: (opt: any) => {
          const results = opt.results as Partial<Config>;
          return !!results.author ? p.text({
            message: "Enter author url:",
            initialValue: config.authorUrl,
            validate: (value) => {
              if (!value) return;

              if (!urlPattern.test(value)) {
                return "Please enter a valid URL (e.g., https://example.com) or leave it empty.";
              }
            },
          }) : Promise.resolve("");
        },

        useAutoNav: () =>
          p.confirm({
            message: "Enable auto-navigation for panoramas?",
            initialValue: config.useAutoNav,
          }),

        addGps: () =>
          p.confirm({
            message: "Add GPS coordinates to ponorama?",
            initialValue: config.addGps,
          }),

        mapUrlTemplate: async (opt: any) => {
          const results = opt.results as Partial<Config>;
          if (!results.addGps) return "";

          const options = [
            { value: mapUrlTemplate.nakarte, label: `Nakarte     - ${mapUrlTemplate.nakarte}` },
            { value: mapUrlTemplate.yandex, label: `Yandex Maps - ${mapUrlTemplate.yandex} ` },
            { value: mapUrlTemplate.google, label: `Google Maps - ${mapUrlTemplate.google}` },
            { value: "custom", label: "Custom URL" },
          ];

          const selected = await p.select({
            message: "Choose a map template url:",
            options,
            initialValue: options.some(
              (option) => option.value === config.mapUrlTemplate,
            )
              ? config.mapUrlTemplate
              : "custom",
          });

          // Возвращаем отмену в p.group для обработки через onCancel.
          if (p.isCancel(selected)) return selected;
          if (selected !== "custom") return selected;

          return p.text({
            message: "Enter a URL template using {{lat}} and {{lng}}:",
            placeholder: "https://my-maps.com/{{lat}},{{lng}}",
            initialValue: config.mapUrlTemplate,
            validate: (value) => {
              if (!value?.trim()) return "Template cannot be empty!";
              if (!value.includes("{{lat}}") || !value.includes("{{lng}}")) {
                return "Template must include {{lat}} and {{lng}} placeholders.";
              }
            },
          });
        }
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
