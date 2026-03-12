export const SUPPORTED_FORMATS: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(2);

export const getRSS = () => process.memoryUsage().rss;

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Добавляем ведущий ноль, если число меньше 10 (padStart)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export async function silent(fn: () => Promise<any>) {
  try {
    await fn();
  } catch {}
}

export function getMimeType(ext: string) {
  const result = SUPPORTED_FORMATS[ext?.toLowerCase()];
  if (!result) {
    throw new Error(`Unsupported file format: ${ext}`);
  }

  return result;
}
