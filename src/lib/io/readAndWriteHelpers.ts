import fs from "fs-extra";
import { safeDump, safeLoad, safeLoadAll } from "js-yaml";
import LRUCache from "lru-cache";

const lruCache = new LRUCache<string, unknown>(1000);

const getValueFromCache = async <Value = unknown>(
  id: string,
  fallback: () => Promise<Value>,
): Promise<Value> => {
  if (!lruCache.has(id)) {
    lruCache.set(id, await fallback());
  }
  return lruCache.get(id) as Value;
};

export const readFromYaml = async <Value = unknown>(
  pathToFile: string,
): Promise<Value> =>
  getValueFromCache(pathToFile, async () =>
    safeLoad(await fs.readFile(pathToFile, "utf8")),
  );

export const readAllFromYaml = async <Value = unknown>(
  pathToFile: string,
): Promise<Value[]> =>
  getValueFromCache(pathToFile, async () =>
    safeLoadAll(await fs.readFile(pathToFile, "utf8")),
  );

export const readFromJson = async <Value = unknown>(
  pathToFile: string,
): Promise<Value> =>
  getValueFromCache(pathToFile, async () => await fs.readJson(pathToFile));

export const writeToYaml = async <Value = unknown>(
  pathToFile: string,
  contents: Value,
): Promise<void> => await fs.writeFile(pathToFile, safeDump(contents), "utf8");

export const writeAllToYaml = async <Value = unknown>(
  pathToFile: string,
  contents: Value[],
): Promise<void> =>
  await fs.writeFile(
    pathToFile,
    contents
      .map((currentContents) => safeDump(currentContents))
      .join("\n---\n"),
    "utf8",
  );

export const writeToJson = async <Value = unknown>(
  pathToFile: string,
  contents: Value,
): Promise<void> => fs.writeJson(pathToFile, contents);
