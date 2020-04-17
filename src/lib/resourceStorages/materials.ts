import { localResourceStorageMaterial } from "./=local";

export const resourceStorageMaterialLookup = {
  local: localResourceStorageMaterial,
};

export type ResourceStorageType = keyof typeof resourceStorageMaterialLookup;
