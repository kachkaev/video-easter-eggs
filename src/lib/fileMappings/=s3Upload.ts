import fs from "fs-extra";

import { resourceStorageLookup } from "../resourceStorages";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface S3UploadMapping extends BaseFileMapping {
  type: "s3Upload";
  targetPath: string;
}

export type Creates3UploadMappingOptions = Omit<S3UploadMapping, "type">;

export const s3UploadMaterial: FileMappingMaterial<
  S3UploadMapping,
  Creates3UploadMappingOptions
> = {
  priority: 1,
  caption: "Uploading to s3",
  createFileMapping: (options) => ({
    type: "s3Upload",
    ...options,
  }),
  displayTargetPath: (fileMapping) => `🗑 ${fileMapping.targetPath}`,
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  process: async (fileMapping) => {
    await resourceStorageLookup.s3.putResource(
      fileMapping.targetPath,
      await fs.readFile(fileMapping.sourcePath),
    );
  },
};
