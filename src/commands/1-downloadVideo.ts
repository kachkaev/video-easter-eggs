import chalk from "chalk";
import fs from "fs-extra";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../lib/commands";
import { getCommonConfig, getVideoConfig } from "../lib/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../lib/fileMappings";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(
    chalk.green("Downloading the video and extracting its metadata..."),
  );

  if (getCommonConfig().RESET) {
    await fs.remove(getVideoConfig().downloadFilePath);
    await fs.remove(getVideoConfig().downloadMetadataFilePath);
  }

  const fileMappings: BaseFileMapping[] = [
    fileMappingMaterialLookup.downloadVideo.createFileMapping({
      sourcePath: getVideoConfig().VIDEO_URL,
      targetPath: getVideoConfig().downloadFilePath,
      height: getVideoConfig().VIDEO_HEIGHT,
    }),
    fileMappingMaterialLookup.extractVideoMetadata.createFileMapping({
      sourcePath: getVideoConfig().downloadFilePath,
      targetPath: getVideoConfig().downloadMetadataFilePath,
    }),
  ];

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
