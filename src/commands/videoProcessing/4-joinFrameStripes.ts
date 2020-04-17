import chalk from "chalk";
import fs from "fs-extra";

import { autoStartCommandIfNeeded, Command } from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import {
  FrameStripe,
  videoResourceMaterialLookup,
} from "../../lib/resources/videos";
import { resourceStorageMaterialLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Joining frame stripes..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;
  const videoConfig = await videoResourceMaterialLookup.config.get(
    "local",
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    "local",
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
      await fs.readJson(
        resourceStorageMaterialLookup.local.resolvePath(
          videoResourceMaterialLookup.frameStripes.getRelativePath(
            videoId,
            timeOffset,
          ),
        ),
      ),
    );
  }

  await videoResourceMaterialLookup.joinedFrameStripes.put(
    "local",
    videoId,
    frameStripes,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
