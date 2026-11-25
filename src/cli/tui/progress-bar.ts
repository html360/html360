import c from "ansi-colors";
import { SingleBar } from "cli-progress";

function createProgressBar(): SingleBar {
  const barsize = Math.min(40, (process.stdout.columns || 40) - 20);

  return new SingleBar({
    format: `${c.bgCyan.black(" html360 ")} ${c.cyan("|{bar}|")} ${c.cyan("{value}/{total}")}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    barsize,
  });
}


export async function withProgressBar<T>(
  initialTotal: number,
  fn: (bar: ReturnType<typeof createProgressBar>) => Promise<T>,
): Promise<T> {
  const progressBar = createProgressBar();
  progressBar.start(initialTotal, 0);

  try {
    return await fn(progressBar);
  } finally {
    progressBar.stop();
  }
}