import fs from 'node:fs/promises';
import path from 'node:path';
import { isSupportedFileFormat } from './supported-formats';

export type ResolveOptions = {
  recursive?: boolean;
}

const collator = new Intl.Collator(undefined, {
  numeric: true,      // Понимает числа: 2 идет перед 10
  sensitivity: 'base' // Игнорирует регистр: 'A' и 'a' равны
});

export async function resolvePaths(
  rawPaths: string[],
  options: ResolveOptions = {}
): Promise<string[]> {
  const resultSet = new Set<string>();

  if (process.env.IS_HTML360_BAT_LAUNCH === 'true') {
    rawPaths = [...rawPaths].sort(collator.compare);
  }

  for (const rawPath of rawPaths) {
    const resolvedPath = path.resolve(process.cwd(), rawPath);

    const stats = await fs.stat(resolvedPath);

    if (stats.isFile()) {
      resultSet.add(resolvedPath);
    } else if (stats.isDirectory()) {
      await collectFromDirectory(
        resolvedPath,
        resultSet,
        Boolean(options.recursive)
      );
    }
  }

  return Array.from(resultSet.keys());
}

export async function resolveAndVerifyPaths(rawPaths: string[],
  options: ResolveOptions = {}
): Promise<string[]> {
  const reuslt = await resolvePaths(rawPaths, options);

  if (reuslt.length === 0) {
    throw new Error('No supported images found.');
  }
  
  return reuslt;
}

async function collectFromDirectory(
  dirPath: string,
  resultSet: Set<string>,
  recursive: boolean
): Promise<void> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  entries.sort((a, b) => collator.compare(a.name, b.name));

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isFile() && isSupportedFileFormat(fullPath)) {
      resultSet.add(fullPath);
    } else if (entry.isDirectory() && recursive) {
      await collectFromDirectory(fullPath, resultSet, recursive);
    }
  }
}
