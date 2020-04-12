import execa from "execa";
import fs from "fs-extra";
import path from "path";

import { ensureProgramIsAvailable } from "../io";
import { BaseFileMapping, FileMappingMaterial } from "./types";

export interface DownloadVideoMapping extends BaseFileMapping {
  type: "downloadVideo";
  height: number;
}

export type CreateDownloadVideoMappingOptions = Omit<
  DownloadVideoMapping,
  "type"
>;

export const downloadVideoMaterial: FileMappingMaterial<
  DownloadVideoMapping,
  CreateDownloadVideoMappingOptions
> = {
  priority: 1,
  caption: "Downloading video",
  createFileMapping: (options) => ({
    type: "downloadVideo",
    ...options,
  }),
  extractExpectedFilePaths: (fileMapping) => [fileMapping.targetPath],
  probe: async (reportProblem) => {
    await ensureProgramIsAvailable("youtube-dl", reportProblem, {
      commandPurposes: "download the video",
    });
  },
  process: async (fileMapping) => {
    await fs.ensureDir(path.dirname(fileMapping.targetPath));
    await execa(
      "youtube-dl",
      [
        "--format",
        `mp4[height=${fileMapping.height}]`,
        "--output",
        fileMapping.targetPath,
        fileMapping.sourcePath,
      ],
      {
        stdio: "inherit",
      },
    );
  },
};
