import path from "node:path";

const SUPPORTED_FORMATS: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export function isSupportedFileFormat(filePath: string): boolean {
  const ext = getExt(filePath);
  return Object.hasOwn(SUPPORTED_FORMATS, ext);
}

export function verifyFileFormat(filePath: string) {
  if (!isSupportedFileFormat(filePath)) {
    throw new Error(`Unsupported file format ${getExt(filePath)}`);
  }
}

export function getMimeType(filePath: string) {
  verifyFileFormat(filePath);
  const ext = getExt(filePath);
  return SUPPORTED_FORMATS[ext];
}

function getExt(filePath: string) {
  return path.extname(filePath).toLowerCase()
}