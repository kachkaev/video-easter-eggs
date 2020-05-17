import execa from "execa";
import fs from "fs-extra";

import { ensureProgramIsAvailable } from "../io";
import { ExtractedVideoMetadata } from "../resources/videos";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface ExtractVideoMetadataMapping extends BaseFileMapping {
  type: "extractVideoMetadata";
  sourcePath: string;
  targetPath: string;
}

export type CreateExtractVideoMetadataMappingOptions = Omit<
  ExtractVideoMetadataMapping,
  "type"
>;

export const extractVideoMetadataMaterial: FileMappingMaterial<
  ExtractVideoMetadataMapping,
  CreateExtractVideoMetadataMappingOptions
> = {
  priority: 1,
  caption: "Extracting video metadata",
  createFileMapping: (options) => ({
    type: "extractVideoMetadata",
    ...options,
  }),
  displayTargetPath: (fileMapping) => fileMapping.targetPath,
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  probe: async (reportProblem) => {
    await ensureProgramIsAvailable("ffprobe", reportProblem, {
      commandPurposes: "extract video metadata",
    });
  },

  process: async (fileMapping) => {
    // https://superuser.com/a/945604
    const { stdout } = await execa("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      fileMapping.sourcePath,
    ]);
    const videoMetadata: ExtractedVideoMetadata = {
      duration: Number.parseFloat(stdout) * 1000,
    };
    await fs.writeJson(fileMapping.targetPath, videoMetadata);
  },
};
