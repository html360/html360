import path from "node:path";

export const SUPPORTED_FORMATS: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export function verifyFileFormat(filePath: string) {
  const ext = getExt(filePath);
  if (!(ext in SUPPORTED_FORMATS)) {
    throw new Error(`Unsupported file format ${ext}`);
  }
}

export function getMimeType(filePath: string) {
  const ext = getExt(filePath);
  const result = SUPPORTED_FORMATS[ext];
  if (!result) {
    throw new Error(`Unsupported file format ${ext}`);
  }

  return result;
}

export function getExt(filePath: string) {
  return path.extname(filePath).toLowerCase()
}