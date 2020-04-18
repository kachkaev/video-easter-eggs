import fs from "fs-extra";
import path from "path";

import { getLocalResourceStorageConfig } from "../envBasedConfigs";
import { ResourceStorageMaterial } from "./types";

export const localResourceStorageMaterial: ResourceStorageMaterial = {
  resolvePath: (relativeResourcePath) =>
    path.resolve(
      getLocalResourceStorageConfig().LOCAL_RESOURCE_STORAGE_DIR,
      relativeResourcePath,
    ),

  getResource: async (resolvedPath: string, asString?: boolean): Promise<any> =>
    asString
      ? await fs.readFile(resolvedPath, "utf8")
      : await fs.readFile(resolvedPath),

  putResource: async (resolvedPath, contents) => {
    await fs.writeFile(resolvedPath, contents);
  },
};
