import execa from "execa";
import fs from "fs-extra";
import path from "path";

import { ensureProgramIsAvailable } from "../io";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface ExtractVideoFrameStripeMapping extends BaseFileMapping {
  type: "extractVideoFrameStripe";
  targetPath: string;
  height: number;
}

export type CreateExtractVideoFrameStripeMappingOptions = Omit<
  ExtractVideoFrameStripeMapping,
  "type"
>;

export const extractVideoFrameStripeMaterial: FileMappingMaterial<
  ExtractVideoFrameStripeMapping,
  CreateExtractVideoFrameStripeMappingOptions
> = {
  priority: 1,
  caption: "Extracting frame stripes",

  createFileMapping: (options) => ({
    type: "extractVideoFrameStripe",
    ...options,
  }),

  displayTargetPath: (fileMapping) => fileMapping.targetPath,
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  probe: async (reportProblem) => {
    await ensureProgramIsAvailable("convert", reportProblem, {
      commandPurposes: "extract frame stripes",
    });
  },

  process: async (fileMapping) => {
    const { stdout } = await execa("convert", [
      fileMapping.sourcePath,
      "-resize",
      `1x${fileMapping.height}!`,
      "txt:-",
    ]);

    const hexColors = stdout
      .split("\n")
      .slice(1)
      .map((line) => {
        const indexOfHash = line.indexOf("#");
        return line.slice(indexOfHash + 1, indexOfHash + 7);
      });

    await fs.ensureDir(path.dirname(fileMapping.targetPath));
    await fs.writeJson(fileMapping.targetPath, hexColors);
  },
};
