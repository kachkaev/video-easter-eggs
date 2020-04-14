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
import { videoResourceMaterialLookup } from "../../lib/videoResources";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting frame previews..."));

  const { videoDir } = getVideoProcessingConfig();
  const videoConfig = await videoResourceMaterialLookup.config.get(videoDir);
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    videoDir,
  );

  if (getCommonConfig().RESET) {
    await fs.remove(
      videoResourceMaterialLookup.framePreviews.getDirPath(videoDir),
    );
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
        sourcePath: videoResourceMaterialLookup.download.getPath(videoDir),
        getTargetPath: (currentTimeOffset: number) =>
          videoResourceMaterialLookup.framePreviews.getPath(
            videoDir,
            currentTimeOffset,
          ),
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
