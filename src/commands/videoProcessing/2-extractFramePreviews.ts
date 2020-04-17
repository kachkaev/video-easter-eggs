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
import { resourceStorageMaterialLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting frame previews..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;

  const videoConfig = await videoResourceMaterialLookup.config.get(
    "local",
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    "local",
    videoId,
  );

  const resolvedDownloadPath = resourceStorageMaterialLookup.local.resolvePath(
    videoResourceMaterialLookup.download.getRelativePath(videoId),
  );
  const resolvedFramePreviewDirPath = resourceStorageMaterialLookup.local.resolvePath(
    videoResourceMaterialLookup.framePreviews.getRelativeDirPath(videoId),
  );
  const getResolvedFramePreviewPath = (currentTimeOffset: number) =>
    resourceStorageMaterialLookup.local.resolvePath(
      videoResourceMaterialLookup.framePreviews.getRelativePath(
        videoId,
        currentTimeOffset,
      ),
    );

  if (getCommonConfig().RESET) {
    await fs.remove(resolvedFramePreviewDirPath);
  }

  const fileMappings: BaseFileMapping[] = [];
  const maxTimeOffset =
    extractedMetadata.duration - (videoConfig.tailCutoffDuration || 0);
  const chunkInterval = videoConfig.frameSamplingInterval * 60;
  let timeOffset = 0;
  while (timeOffset < maxTimeOffset) {
    const nextTimeOffset = timeOffset + chunkInterval;
    fileMappings.push(
      fileMappingMaterialLookup.extractVideoFramePreviews.createFileMapping({
        sourcePath: resolvedDownloadPath,
        getTargetPath: getResolvedFramePreviewPath,
        timeOffsetStart: timeOffset,
        timeOffsetInterval: videoConfig.frameSamplingInterval,
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
