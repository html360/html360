import c from "ansi-colors";
import { SingleBar } from "cli-progress";
import { HtmlContext } from "../types/html-context";

export async function startProgressBar(
  ctx: HtmlContext,
  action: (increment: () => void) => Promise<void>,
): Promise<void> {
  const barsize = Math.min(40, (process.stdout.columns || 40) - 20);

  const progressBar = new SingleBar({
    format: `${c.bgCyan.black(" html360 ")} ${c.cyan("|{bar}|")} ${c.cyan("{value}/{total}")}`,
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
    barsize,
  });

  const increment = () => {
    progressBar.increment();
  };

  progressBar.start(ctx.imgPaths.length, 0);

  try {
    await action(increment);
  } finally {
    progressBar.stop();
  }
}
