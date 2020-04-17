import { localResourceStorageMaterial } from "./=local";
import { ResourceStorageMaterial } from "./types";

export const resourceStorageLookup = {
  local: localResourceStorageMaterial,
};

export const getResourceStorage = (
  resourceStorageType: unknown,
): ResourceStorageMaterial => {
  const result = resourceStorageLookup[`${resourceStorageType}`];
  if (!result) {
    throw new Error("Unsupported resource storage type");
  }
  return result;
};
