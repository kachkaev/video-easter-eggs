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
  logger.log(chalk.green("Downloading the video..."));

  if (getCommonConfig().RESET) {
    await fs.remove(getVideoConfig().downloadFilePath);
  }

  const fileMappings: BaseFileMapping[] = [
    fileMappingMaterialLookup.downloadVideo.createFileMapping({
      sourcePath: getVideoConfig().VIDEO_URL,
      targetPath: getVideoConfig().downloadFilePath,
      height: getVideoConfig().VIDEO_HEIGHT,
    }),
  ];

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
