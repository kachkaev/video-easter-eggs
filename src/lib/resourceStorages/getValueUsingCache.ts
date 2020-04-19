import LRUCache from "lru-cache";
import sleep from "sleep-promise";

const valueCache = new LRUCache<string, unknown>({
  maxAge: 5 * 60 * 1000,
  max: 1000,
});
const statusCache = new LRUCache<string, true>({
  maxAge: 60 * 1000,
  max: 100,
});

export const getValueUsingCache = async <Value = unknown>(
  id: string,
  fallback: () => Promise<Value>,
): Promise<Value> => {
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
