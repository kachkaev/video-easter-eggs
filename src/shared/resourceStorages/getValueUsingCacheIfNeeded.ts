import LRUCache from "lru-cache";
import sleep from "sleep-promise";

import { getApiResourceStorage } from "../io/api";

let valueCache: LRUCache<string, unknown> | undefined = undefined;
let statusCache: LRUCache<string, unknown> | undefined = undefined;

try {
  const apiResourceStorage = getApiResourceStorage();
  valueCache = new LRUCache<string, unknown>({
    maxAge: apiResourceStorage.maxAgeOfCachedValue,
    max: 1000,
  });
  statusCache = new LRUCache<string, true>({
    maxAge: apiResourceStorage.maxDurationOfGet,
    max: 100,
  });
} catch {
  // not using cache below
}

export const getValueUsingCacheIfNeeded = async <Value = unknown>(
  id: string,
  fallback: () => Promise<Value>,
): Promise<Value> => {
  if (!statusCache || !valueCache) {
    return await fallback();
  }

  while (statusCache.has(id)) {
    await sleep(100);
  }

  if (!valueCache.has(id)) {
    statusCache.set(id, true);
    try {
      valueCache.set(id, await fallback());
    } catch (e) {
      valueCache.set(id, e);
    }

    statusCache.del(id);
  }

  const result = valueCache.get(id);
  if (result instanceof Error) {
    throw result;
  }

  return result as Value;
};
