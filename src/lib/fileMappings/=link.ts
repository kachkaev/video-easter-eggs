import fs from "fs-extra";
import path from "path";

import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface LinkMapping extends BaseFileMapping {
  type: "link";
  sourcePath: string;
  targetPath: string;
}

export type CreateLinkMappingOptions = Omit<LinkMapping, "type">;

export const linkMaterial: FileMappingMaterial<
  LinkMapping,
  CreateLinkMappingOptions
> = {
  priority: 4,
  caption: "Link creation",
  createFileMapping: (options) => ({
    type: "link",
    ...options,
  }),
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  process: async (fileMapping) => {
    await fs.remove(fileMapping.targetPath);
    await fs.ensureSymlink(
      path.relative(
        path.dirname(fileMapping.targetPath),
        fileMapping.sourcePath,
      ),
      fileMapping.targetPath,
    );
  },
};
