import { localResourceStorageMaterial } from "./=local";
import { s3ResourceStorageMaterial } from "./=s3";
import { ResourceStorageMaterial } from "./types";

export const resourceStorageLookup = {
  local: localResourceStorageMaterial,
  s3: s3ResourceStorageMaterial,
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
