import chalk from "chalk";
import fs from "fs-extra";

import { autoStartCommandIfNeeded, Command } from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import {
  FrameStripe,
  videoResourceMaterialLookup,
} from "../../lib/videoResources";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Combining frame stripes..."));

  const { videoDir } = getVideoProcessingConfig();
  const videoConfig = await videoResourceMaterialLookup.config.get(videoDir);
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    videoDir,
  );

  const frameStripes: FrameStripe[] = [];

  const maxTimeOffset =
    extractedMetadata.duration - (videoConfig.tailCutoffInterval || 0);
  for (
    let timeOffset = 0;
    timeOffset < maxTimeOffset;
    timeOffset += videoConfig.frameSamplingInterval
  ) {
    frameStripes.push(
      await fs.readJson(
        videoResourceMaterialLookup.frameStripes.getPath(videoDir, timeOffset),
      ),
    );
  }

  await videoResourceMaterialLookup.joinedFrameStripes.set(
    videoDir,
    frameStripes,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
