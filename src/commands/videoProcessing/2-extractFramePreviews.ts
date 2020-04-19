import chalk from "chalk";
import fs from "fs-extra";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../../lib/commands";
import {
  getCommonConfig,
  getVideoProcessingConfig,
} from "../../lib/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../lib/fileMappings";
import { videoResourceMaterialLookup } from "../../lib/resources/videos";
import { calculateProcessedTimeDuration } from "../../lib/resources/videos/helpers";
import { resourceStorageLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting frame previews..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;

  const videoConfig = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    resourceStorageLookup.local,
    videoId,
  );

  const resolvedDownloadPath = videoResourceMaterialLookup.download.getResolvedPath(
    resourceStorageLookup.local,
    videoId,
  );
  const resolvedFramePreviewDirPath = videoResourceMaterialLookup.framePreviews.getResolvedDirPath(
    resourceStorageLookup.local,
    videoId,
  );
  const getResolvedFramePreviewPath = (currentTimeOffset: number) =>
    videoResourceMaterialLookup.framePreviews.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
      currentTimeOffset,
    );

  if (getCommonConfig().RESET) {
    await fs.remove(resolvedFramePreviewDirPath);
  }

  const fileMappings: BaseFileMapping[] = [];
  const processedTimeDuration = calculateProcessedTimeDuration(
    videoConfig,
    extractedMetadata,
  );
  const chunkInterval = videoConfig.frameSamplingInterval * 60;
  let timeOffset = 0;
  while (timeOffset < processedTimeDuration) {
    const nextTimeOffset = timeOffset + chunkInterval;
    fileMappings.push(
      fileMappingMaterialLookup.extractVideoFramePreviews.createFileMapping({
        sourcePath: resolvedDownloadPath,
        getTargetPath: getResolvedFramePreviewPath,
        timeOffsetStart: timeOffset,
        timeOffsetInterval: videoConfig.frameSamplingInterval,
        timeOffsetEnd: Math.min(nextTimeOffset, processedTimeDuration) - 1,
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
