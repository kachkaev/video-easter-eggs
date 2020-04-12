import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

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
import { getRelativeBasePathForTimeOffset } from "../lib/io/getRelativeBasePathForTimeOffset";

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
  const maxTimeOffset =
    videoMetadata.duration - getVideoConfig().tailCutoffInterval;
  const chunkInterval = getVideoConfig().VIDEO_THUMBNAIL_INTERVAL * 60 * 15;
  let timeOffset = 0;
  while (timeOffset < maxTimeOffset) {
    const nextTimeOffset = timeOffset + chunkInterval;
    fileMappings.push(
      fileMappingMaterialLookup.extractVideoThumbnails.createFileMapping({
        sourcePath: getVideoConfig().downloadFilePath,
        getTargetPath: (currentTimeOffset: number) =>
          path.resolve(
            getVideoConfig().thumbnailDir,
            `${getRelativeBasePathForTimeOffset(currentTimeOffset)}.jpg`,
          ),
        timeOffsetStart: timeOffset,
        timeOffsetInterval: getVideoConfig().VIDEO_THUMBNAIL_INTERVAL,
        timeOffsetEnd: Math.min(nextTimeOffset, maxTimeOffset) - 1,
      }),
    );
    timeOffset = nextTimeOffset;
  }

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
