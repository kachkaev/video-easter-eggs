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
  resolvedResourcePath: string,
): Promise<Buffer> =>
  getValueFromCache(
    resolvedResourcePath,
    async () => await storage.getResource(resolvedResourcePath),
  );

export const readFromYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
): Promise<Value> =>
  getValueFromCache(resolvedResourcePath, async () =>
    safeLoad(await storage.getResource(resolvedResourcePath, true)),
  );

export const readAllFromYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
): Promise<Value[]> =>
  getValueFromCache(resolvedResourcePath, async () =>
    safeLoadAll(await storage.getResource(resolvedResourcePath, true)),
  );

export const readFromJson = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
): Promise<Value> =>
  getValueFromCache(resolvedResourcePath, async () =>
    JSON.parse(await storage.getResource(resolvedResourcePath, true)),
  );

export const writeToYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
  contents: Value,
): Promise<void> =>
  await storage.putResource(resolvedResourcePath, safeDump(contents));

export const writeAllToYaml = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
  contents: Value[],
): Promise<void> =>
  await storage.putResource(
    resolvedResourcePath,
    contents
      .map((currentContents) => safeDump(currentContents))
      .join("\n---\n"),
  );

export const writeToJson = async <Value = unknown>(
  storage: ResourceStorageMaterial,
  resolvedResourcePath: string,
  contents: Value,
): Promise<void> => fs.writeJson(resolvedResourcePath, contents);
