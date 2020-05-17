import chalk from "chalk";

import { autoStartCommandIfNeeded, Command } from "../../shared/commands";
import { getVideoProcessingConfig } from "../../shared/envBasedConfigs";
import {
  FrameStripe,
  videoResourceMaterialLookup,
} from "../../shared/resources/videos";
import { calculateProcessedTimeDuration } from "../../shared/resources/videos/helpers";
import { resourceStorageLookup } from "../../shared/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Joining frame stripes..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;
  const videoConfig = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    resourceStorageLookup.local,
    videoId,
  );

  const frameStripes: FrameStripe[] = [];

  const processedTimeDuration = calculateProcessedTimeDuration(
    videoConfig,
    extractedMetadata,
  );

  for (
    let timeOffset = 0;
    timeOffset < processedTimeDuration;
    timeOffset += videoConfig.frameSamplingInterval
  ) {
    frameStripes.push(
      await videoResourceMaterialLookup.frameStripes.get(
        resourceStorageLookup.local,
        videoId,
        timeOffset,
      ),
    );
  }

  await videoResourceMaterialLookup.joinedFrameStripes.put(
    resourceStorageLookup.local,
    videoId,
    frameStripes,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
