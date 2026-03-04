import c from "ansi-colors";

const INFO = c.cyan.bold("[INFO]:");
const OK = c.green.bold("[OK]:");
const ERROR = c.red.bold("[ERROR]:");

export const logger = {
  info: (msg: string) => console.log(`${INFO} ${c.cyan(msg)}`),

  success: (msg: string) => console.log(`${OK} ${c.green(msg)}`),

  error: (err: any) => {
    if (typeof err === "string") {
      console.error(`${ERROR} ${c.red(err)}`);
    } else {
      console.error(`${ERROR}\n`, err);
    }
  },
};

