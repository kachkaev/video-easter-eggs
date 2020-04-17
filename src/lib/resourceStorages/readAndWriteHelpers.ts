import fs from "fs-extra";
import { safeDump, safeLoad, safeLoadAll } from "js-yaml";
import LRUCache from "lru-cache";

import { ResourceStorageMaterial } from "./types";

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

export const readFromBinary = async (
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
): Promise<Buffer> =>
  getValueFromCache(
    relativePathToFile,
    async () => await fs.readFile(relativePathToFile),
  );

export const readFromYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
): Promise<Value> =>
  getValueFromCache(relativePathToFile, async () =>
    safeLoad(await fs.readFile(relativePathToFile, "utf8")),
  );

export const readAllFromYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
): Promise<Value[]> =>
  getValueFromCache(relativePathToFile, async () =>
    safeLoadAll(await fs.readFile(relativePathToFile, "utf8")),
  );

export const readFromJson = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
): Promise<Value> =>
  getValueFromCache(
    relativePathToFile,
    async () => await fs.readJson(relativePathToFile),
  );

export const writeToYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
  contents: Value,
): Promise<void> =>
  await fs.writeFile(relativePathToFile, safeDump(contents), "utf8");

export const writeAllToYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
  contents: Value[],
): Promise<void> =>
  await fs.writeFile(
    relativePathToFile,
    contents
      .map((currentContents) => safeDump(currentContents))
      .join("\n---\n"),
    "utf8",
  );

export const writeToJson = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  relativePathToFile: string,
  contents: Value,
): Promise<void> => fs.writeJson(relativePathToFile, contents);
