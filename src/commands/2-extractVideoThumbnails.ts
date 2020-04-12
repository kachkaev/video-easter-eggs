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
  const timeOffsetMax = videoMetadata.duration - 1000; // cutting the tail to avoid a missing frame
  const chunkInterval = getVideoConfig().VIDEO_THUMBNAIL_INTERVAL * 60 * 30;
  let timeOffsetStart = 0;
  while (timeOffsetStart < timeOffsetMax) {
    const nextTimeOffsetStart = timeOffsetStart + chunkInterval;
    fileMappings.push(
      fileMappingMaterialLookup.extractVideoThumbnails.createFileMapping({
        sourcePath: getVideoConfig().downloadFilePath,
        getTargetPath: (timeOffset) =>
          getVideoConfig().getThumbnailFilePath(timeOffset),
        timeOffsetStart,
        timeOffsetInterval: getVideoConfig().VIDEO_THUMBNAIL_INTERVAL,
        timeOffsetEnd: Math.min(nextTimeOffsetStart, timeOffsetMax) - 1,
      }),
    );
    timeOffsetStart = nextTimeOffsetStart;
  }

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
