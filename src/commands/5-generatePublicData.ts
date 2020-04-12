import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { autoStartCommandIfNeeded, Command } from "../lib/commands";
import { getCommonConfig, getVideoConfig } from "../lib/envBasedConfigs";
import { VideoMetadata } from "../lib/fileMappings/=extractVideoMetadata";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Generate public data..."));

  const videoMetadata: VideoMetadata = await fs.readJson(
    getVideoConfig().downloadMetadataFilePath,
  );

  const frameStripes = await fs.readJson(
    getVideoConfig().combinedFrameStripesFilePath,
  );

  const publicThumbnailDir = path.resolve(
    getVideoConfig().publicDataDir,
    "thumbnails",
  );

  const publicVideoData = {
    url: getVideoConfig().VIDEO_URL,
    thumbnailBaseUrl: `/${path.relative(
      getCommonConfig().publicDir,
      publicThumbnailDir,
    )}`,
    metadata: videoMetadata,
    tailCutoffInterval: getVideoConfig().tailCutoffInterval,
    frameStripes,
  };

  await fs.ensureDir(getVideoConfig().publicDataDir);
  await fs.ensureSymlink(getVideoConfig().thumbnailDir, publicThumbnailDir);
  await fs.writeJson(
    path.resolve(getVideoConfig().publicDataDir, "data.json"),
    publicVideoData,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
