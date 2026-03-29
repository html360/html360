import c from "ansi-colors";
import { SingleBar } from "cli-progress";
import { formatTime, getRSS, toMB } from "./utils";
import { HtmlContext } from "./types";

export async function startProgressBar(
  ctx: HtmlContext,
  action: (increment: (errors: number) => void) => Promise<void>,
): Promise<void> {
  const start = performance.now();

  const progressBar = new SingleBar({
    format: [
      `${c.bgCyan.black(" html360 ")} |`,
      `${c.cyan("{bar}")}| `,
      `${c.cyan("{percentage}%")} | `,
      `${c.cyan("{value}/{total}")} | `,

      `${c.cyan("{time}")} | `,
      `${c.cyan(`Threads: ${ctx.threadCount}`)} | `,
      `${c.cyan("MAX RAM: {maxRAM} MB")} | `,
      `${c.red(`Errors: {errors}`)}`,
    ].join(""),
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  });

  let maxRAM = getRSS();
  const getMaxRAM = () => {
    const rss = getRSS();
    if (maxRAM < rss) {
      maxRAM = rss;
    }
    return maxRAM;
  };

  const getPayload = (totalTime: number, errors: number) => {
    const time = formatTime(totalTime);
    const maxRAM = toMB(getMaxRAM());
    return {
      time,
      maxRAM,
      errors,
    };
  };

  const increment = (errors: number) => {
    const time = performance.now() - start;
    progressBar.increment(getPayload(time, errors));
  };

  progressBar.start(ctx.imgPaths.length, 0, getPayload(0, 0));

  try {
    await action(increment);
  } finally {
    progressBar.stop();
  }
}
