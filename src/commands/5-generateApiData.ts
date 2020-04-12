import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { autoStartCommandIfNeeded, Command } from "../lib/commands";
import { getVideoConfig } from "../lib/envBasedConfigs";
import { VideoApiData, VideoMetadata } from "../lib/types";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Generating api data..."));

  const videoMetadata: VideoMetadata = await fs.readJson(
    getVideoConfig().downloadMetadataFilePath,
  );

  const frameStripes = await fs.readJson(
    getVideoConfig().combinedFrameStripesFilePath,
  );

  const apiData: VideoApiData = {
    info: {
      ...videoMetadata,
      url: getVideoConfig().VIDEO_URL,
      processedDuration:
        videoMetadata.duration - getVideoConfig().tailCutoffInterval,
      frameStripeHeight: getVideoConfig().FRAME_STRIPE_HEIGHT,
      thumbnailInterval: getVideoConfig().VIDEO_THUMBNAIL_INTERVAL,
    },
    thumbnailDir: getVideoConfig().thumbnailDir,
    frameStripes,
  };

  await fs.writeJson(
    path.resolve(getVideoConfig().videoDir, "apiData.json"),
    apiData,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
