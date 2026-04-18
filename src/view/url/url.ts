import { Nullable } from "../../core/types";

export const QUERY_PARAMS = {
  YAW: "yaw",
  PITCH: "pitch",
  HFOV: "hfov",
} as const;

export const parseYaw = (params: URLSearchParams) => parseOrientationValue(params,  QUERY_PARAMS.YAW, -360, 360);

export const parsePitch = (params: URLSearchParams) => parseOrientationValue(params,  QUERY_PARAMS.PITCH, -90, 90);

export const parseHfov = (params: URLSearchParams) => parseOrientationValue(params,  QUERY_PARAMS.HFOV, 50, 120);

export class SimpleUrl {
  beforeQuery: string;
  query: URLSearchParams;
  hash: string;

  constructor(url: Nullable<string>) {
    let hashParts = url?.split("#") ?? [];
    const queryParts = hashParts[0]?.split("?") ?? [];

    this.beforeQuery = queryParts[0] ?? "";
    this.query = queryParts[1]
      ? new URLSearchParams(queryParts[1])
      : new URLSearchParams();
    this.hash = hashParts[1] ?? "";
  }

  toString = () => {
    let result = this.beforeQuery;

    const query = this.query.toString();
    if (query) {
      result += `?${query}`;
    }

    if (this.hash) {
      result += `#${this.hash}`;
    }
    return result;
  };
}

function parseOrientationValue(
  params: URLSearchParams,
  key: Extract<
    (typeof QUERY_PARAMS)[keyof typeof QUERY_PARAMS],
    "yaw" | "pitch" | "hfov"
  >,
  min: number,
  max: number,
): Nullable<number> {
  const val = parseFloat(params.get(key) || "");
  return !isNaN(val) ? Math.max(min, Math.min(max, val)) : null;
}
