import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { autoStartCommandIfNeeded, Command } from "../lib/commands";
import { getVideoConfig } from "../lib/envBasedConfigs";
import { VideoMetadata } from "../lib/fileMappings/=extractVideoMetadata";
import { VideoApiData } from "../lib/types";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Generate api data..."));

  const videoMetadata: VideoMetadata = await fs.readJson(
    getVideoConfig().downloadMetadataFilePath,
  );

  const frameStripes = await fs.readJson(
    getVideoConfig().combinedFrameStripesFilePath,
  );

  const videoApiData: VideoApiData = {
    url: getVideoConfig().VIDEO_URL,
    metadata: videoMetadata,
    frameStripeHeight: getVideoConfig().FRAME_STRIPE_HEIGHT,
    tailCutoffInterval: getVideoConfig().tailCutoffInterval,
    frameStripes,
  };

  await fs.writeJson(
    path.resolve(getVideoConfig().apiDataFilePath),
    videoApiData,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
