import chalk from "chalk";
import fs from "fs-extra";
import path from "path";

import { autoStartCommandIfNeeded, Command } from "../lib/commands";
import { getVideoConfig } from "../lib/envBasedConfigs";
import { VideoMetadata } from "../lib/fileMappings/=extractVideoMetadata";
import { getRelativeBasePathForTimeOffset } from "../lib/getRelativeBasePathForTimeOffset";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Combining frame stripes..."));

  // if (getCommonConfig().RESET) {
  //   await fs.remove(getVideoConfig().combinedFrameStripesFilePath);
  // }

  const videoMetadata: VideoMetadata = await fs.readJson(
    getVideoConfig().downloadMetadataFilePath,
  );

  const combinedData: unknown[] = [];

  const maxTimeOffset =
    videoMetadata.duration - getVideoConfig().tailCutoffInterval;
  for (
    let timeOffset = 0;
    timeOffset < maxTimeOffset;
    timeOffset += getVideoConfig().VIDEO_THUMBNAIL_INTERVAL
  ) {
    combinedData.push(
      await fs.readJson(
        path.resolve(
          getVideoConfig().frameStipesDir,
          `${getRelativeBasePathForTimeOffset(timeOffset)}.json`,
        ),
      ),
    );
  }

  await fs.writeJson(
    getVideoConfig().combinedFrameStripesFilePath,
    combinedData,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
