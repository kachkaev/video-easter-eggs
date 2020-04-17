import chalk from "chalk";

import { autoStartCommandIfNeeded, Command } from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import {
  FrameStripe,
  videoResourceMaterialLookup,
} from "../../lib/resources/videos";
import { resourceStorageLookup } from "../../lib/resourceStorages";

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

  const maxTimeOffset =
    extractedMetadata.duration - (videoConfig.tailCutoffDuration || 0);
  for (
    let timeOffset = 0;
    timeOffset < maxTimeOffset;
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
