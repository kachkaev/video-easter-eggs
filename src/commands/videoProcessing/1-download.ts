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
  logger.log(
    chalk.green("Downloading the video and extracting its metadata..."),
  );

  const { videoDir } = getVideoProcessingConfig();
  const videoConfig = await videoResourceMaterialLookup.config.get(videoDir);

  if (getCommonConfig().RESET) {
    await fs.remove(videoResourceMaterialLookup.download.getPath(videoDir));
    await fs.remove(
      videoResourceMaterialLookup.extractedMetadata.getPath(videoDir),
    );
  }

  const fileMappings: BaseFileMapping[] = [
    fileMappingMaterialLookup.downloadVideo.createFileMapping({
      sourcePath: videoConfig.url,
      targetPath: videoResourceMaterialLookup.download.getPath(videoDir),
      height: videoConfig.framePreviewHeight,
    }),
    fileMappingMaterialLookup.extractVideoMetadata.createFileMapping({
      sourcePath: videoResourceMaterialLookup.download.getPath(videoDir),
      targetPath: videoResourceMaterialLookup.extractedMetadata.getPath(
        videoDir,
      ),
    }),
  ];

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
