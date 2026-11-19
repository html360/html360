import c from "ansi-colors";

const INFO = c.cyan("[INFO]:");
const OK = c.green.bold("[OK]:");
const ERROR = c.red.bold("[ERROR]:");

export const logger = {
  info: (msg: string) => console.log(`${INFO} ${msg}`),

  success: (msg: string) => console.log(`${OK} ${msg}`),

  error: (err: any) => {
    if (typeof err === "string") {
      console.error(`${ERROR} ${err}`);
    } else {
      console.error(`${ERROR}\n`, err);
    }
  },
};
