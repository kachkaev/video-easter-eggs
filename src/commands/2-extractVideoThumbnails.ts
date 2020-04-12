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
import { VideoMetadata } from "../lib/fileMappings/=extractVideoMetadata";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting video thumbnails..."));

  if (getCommonConfig().RESET) {
    await fs.remove(getVideoConfig().thumbnailDir);
  }

  const videoMetadata: VideoMetadata = await fs.readJson(
    getVideoConfig().downloadMetadataFilePath,
  );

  const fileMappings: BaseFileMapping[] = [];
  let timeOffset = 0;
  while (timeOffset < videoMetadata.duration) {
    fileMappings.push(
      fileMappingMaterialLookup.extractVideoThumbnail.createFileMapping({
        sourcePath: getVideoConfig().downloadFilePath,
        targetPath: getVideoConfig().getThumbnailFilePath(timeOffset),
        timeOffset,
      }),
    );
    timeOffset += getVideoConfig().VIDEO_THUMBNAIL_INTERVAL;
  }

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
