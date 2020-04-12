import execa from "execa";
import fs from "fs-extra";
import path from "path";

import { ensureProgramIsAvailable } from "../io";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface ExtractFrameStripeMapping extends BaseFileMapping {
  type: "extractFrameStripe";
  targetPath: string;
  height: number;
}

export type CreateExtractFrameStripeMappingOptions = Omit<
  ExtractFrameStripeMapping,
  "type"
>;

export const extractFrameStripeMaterial: FileMappingMaterial<
  ExtractFrameStripeMapping,
  CreateExtractFrameStripeMappingOptions
> = {
  priority: 1,
  caption: "Extracting frame stripes",

  createFileMapping: (options) => ({
    type: "extractFrameStripe",
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
