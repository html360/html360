import path from "node:path";
import { AutoNavState, defaultMapState, MapState } from "../../core/state";
import { Config } from "../types/config";
import { getGps } from "./gps";
import { buildMapUrl } from "../../core/map-url";

export function prepareImgPaths(imgPaths: string[]): string[] {
  let result = imgPaths.map((x) => path.resolve(x));

  if (process.env.IS_HTML360_BAT_LAUNCH === 'true') {
    result.sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  }

  return result;
}

export const getRelativeUrl = (fromDirPath: string, toFilePath: string) => {
  // Получаем относительный путь (строится только от папки)
  let rel = path.relative(fromDirPath, toFilePath);

  // Сразу переводим ВСЕ слэши в Unix-формат (независимо от OS)
  rel = rel.split(path.sep).join("/");

  // Node.js может вернуть 'file.html', но для браузера лучше './file.html'
  if (!rel.startsWith(".")) rel = "./" + rel;

  return rel;
}

export function getAutoNavState(config: Config, urls: string[], index: number): AutoNavState | null {
  if (!config.useAutoNav || urls.length === 1) {
    return null;
  }

  const totalCount = urls.length;
  const pageNumber = index + 1;
  const prevIndex = index > 0 ? index - 1 : urls.length - 1;
  const nextIndex = index < totalCount - 1 ? index + 1 : 0;
  const prevUrl = urls[prevIndex];
  const nextUrl = urls[nextIndex];

  return {
    totalCount,
    pageNumber,
    prevUrl,
    nextUrl,
  };
}

export const getImgName = (imgPath: string) => path.parse(imgPath).name;

export const getMapState = async (config: Config, filePath: string): Promise<MapState> => {
  if (!config.addGps) {
    return defaultMapState;
  }

  const gps = await getGps(filePath);

  if (!gps) {
    return defaultMapState;
  }

  const template = config.mapUrlTemplate;
  const url = buildMapUrl(template, gps.lat, gps.lng);

  return {
    lat: gps.lat,
    lng: gps.lng,
    template,
    url
  };
}