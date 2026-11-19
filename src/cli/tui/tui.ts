import c from "ansi-colors";

export const visibleLength = (str: string) => c.unstyle(str).length;