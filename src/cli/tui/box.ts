import c from "ansi-colors";
import { visibleLength } from "./tui";

export type BoxRow = [string, string] | null | undefined;

export function renderBox(
  title: string,
  rows: BoxRow[],
  width: number,
): string {
  const cleanRows = rows.filter(x => x != null);
  const maxLabelLen = Math.max(...cleanRows.map((r) => visibleLength(r[0]))) + 1;

  const formatRow = ([ label, value ]: NonNullable<BoxRow>) => {
    const paddedLabel = `${label}:`.padEnd(maxLabelLen);
    const plainText = ` ${paddedLabel} ${value}`;
    const rightPadding = " ".repeat(Math.max(1, width - visibleLength(plainText)));
    return `${c.gray("│")} ${c.white(paddedLabel)} ${c.gray(value)}${rightPadding}${c.gray("│")}`;
  };

  const titlePadding = " ".repeat(Math.max(1, width - visibleLength(title) - 1));

  return [
    c.gray(`┌${"─".repeat(width)}┐`),
    `${c.gray("│")} ${c.white(title)}${titlePadding}${c.gray("│")}`,
    c.gray(`├${"─".repeat(width)}┤`),
    ...cleanRows.map(formatRow),
    c.gray(`└${"─".repeat(width)}┘`),
  ].join("\n");
}


export function printBox(
  title: string,
  rows: BoxRow[],
  width: number,
): void {
  console.log(renderBox(title, rows, width));
}