import fs from "fs-extra";

import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface CopyMapping extends BaseFileMapping {
  type: "copy";
  targetPath: string;
}

export type CreateCopyMappingOptions = Omit<CopyMapping, "type">;

export const copyMaterial: FileMappingMaterial<
  CopyMapping,
  CreateCopyMappingOptions
> = {
  priority: 1,
  caption: "Copying file",
  createFileMapping: (options) => ({
    type: "copy",
    ...options,
  }),
  displayTargetPath: (fileMapping) => fileMapping.targetPath,
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  process: async (fileMapping) => {
    await fs.copy(fileMapping.sourcePath, fileMapping.targetPath);
  },
};
