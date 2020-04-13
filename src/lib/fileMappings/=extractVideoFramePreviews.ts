import execa from "execa";
import fs from "fs-extra";
import { Duration } from "luxon";
import path from "path";
import tmp, { DirOptions } from "tmp";
import util from "util";

import { ensureProgramIsAvailable } from "../io";
import { BaseFileMapping, FileMappingMaterial } from "./types";

const generateTempDir = util.promisify<DirOptions, string>(tmp.dir);

const getNFrames = (fileMapping: ExtractVideoFramePreviewsMapping) =>
  Math.floor(
    (fileMapping.timeOffsetEnd - fileMapping.timeOffsetStart) /
      fileMapping.timeOffsetInterval,
  ) + 1;

export interface ExtractVideoFramePreviewsMapping extends BaseFileMapping {
  type: "extractVideoFramePreviews";
  getTargetPath: (timeOffset: number) => string;
  timeOffsetStart: number;
  timeOffsetEnd: number;
  timeOffsetInterval: number;
}

export type CreateExtractVideoFramePreviewsMappingOptions = Omit<
  ExtractVideoFramePreviewsMapping,
  "type"
>;

export const extractVideoFramePreviewsMaterial: FileMappingMaterial<
  ExtractVideoFramePreviewsMapping,
  CreateExtractVideoFramePreviewsMappingOptions
> = {
  priority: 1,
  caption: "Extracting video frame previews",

  createFileMapping: (options) => ({
    type: "extractVideoFramePreviews",
    ...options,
  }),

  displayTargetPath: (fileMapping) =>
    `${fileMapping.getTargetPath(
      fileMapping.timeOffsetStart,
    )} (N frames: ${getNFrames(fileMapping)}, one each ${
      fileMapping.timeOffsetInterval
    }ms)`,

  extractExpectedFilePaths: (fileMapping) => {
    const filePaths: string[] = [];
    for (
      let timeOffset = fileMapping.timeOffsetStart;
      timeOffset <= fileMapping.timeOffsetEnd;
      timeOffset += fileMapping.timeOffsetInterval
    ) {
      filePaths.push(fileMapping.getTargetPath(timeOffset));
    }
    return filePaths;
  },

  probe: async (reportProblem) => {
    await ensureProgramIsAvailable("ffmpeg", reportProblem, {
      commandPurposes: "extract video frame previews",
    });
  },

  process: async (fileMapping) => {
    const tempDir = await generateTempDir({});
    await fs.ensureDir(tempDir);

    await execa("ffmpeg", [
      "-i",
      fileMapping.sourcePath,
      "-ss",
      Duration.fromMillis(fileMapping.timeOffsetStart).toFormat("hh:mm:ss.SSS"),
      "-vf",
      `fps=${1000 / fileMapping.timeOffsetInterval}`,
      "-vframes",
      `${getNFrames(fileMapping)}`,
      path.resolve(tempDir, "%d.jpg"),
    ]);

    let frame = 1;
    for (
      let timeOffset = fileMapping.timeOffsetStart;
      timeOffset <= fileMapping.timeOffsetEnd;
      timeOffset += fileMapping.timeOffsetInterval
    ) {
      const targetPath = fileMapping.getTargetPath(timeOffset);
      await fs.ensureDir(path.dirname(targetPath));
      await fs.move(path.resolve(tempDir, `${frame}.jpg`), targetPath, {
        overwrite: true,
      });
      frame += 1;
    }
    await fs.remove(tempDir);
  },
};
