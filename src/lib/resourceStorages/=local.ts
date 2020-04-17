import path from "path";

import { getCommonConfig } from "../envBasedConfigs";
import { ResourceStorageMaterial } from "./types";

export const localResourceStorageMaterial: ResourceStorageMaterial = {
  resolvePath: (relativeResourcePath) =>
    path.resolve(getCommonConfig().VAR_DIR, relativeResourcePath),
};
