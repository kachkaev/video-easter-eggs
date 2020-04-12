import execa from "execa";
import fs from "fs-extra";
import { Duration } from "luxon";
import path from "path";

import { ensureProgramIsAvailable } from "../io";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface ExtractVideoThumbnailMapping extends BaseFileMapping {
  type: "extractVideoThumbnail";
  timeOffset: number;
}

export type CreateExtractVideoThumbnailMappingOptions = Omit<
  ExtractVideoThumbnailMapping,
  "type"
>;

export const extractVideoThumbnailMaterial: FileMappingMaterial<
  ExtractVideoThumbnailMapping,
  CreateExtractVideoThumbnailMappingOptions
> = {
  priority: 1,
  caption: "Extracting thumbnail",
  createFileMapping: (options) => ({
    type: "extractVideoThumbnail",
    ...options,
  }),
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  probe: async (reportProblem) => {
    await ensureProgramIsAvailable("ffmpeg", reportProblem, {
      commandPurposes: "extract video thumbnail",
    });
  },
  process: async (fileMapping) => {
    await fs.ensureDir(path.dirname(fileMapping.targetPath));
    const timeOffsetAsDuration = Duration.fromMillis(fileMapping.timeOffset);
    await execa("ffmpeg", [
      "-i",
      fileMapping.sourcePath,
      "-ss",
      timeOffsetAsDuration.toFormat("hh:mm:ss.SSS"),
      "-vframes",
      "1",
      fileMapping.targetPath,
    ]);
  },
};
