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
import { videoResourceMaterialLookup } from "../../lib/resources/videos";
import { resourceStorageMaterialLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(
    chalk.green("Downloading the video and extracting its metadata..."),
  );

  const videoId = getVideoProcessingConfig().VIDEO_ID;
  const videoConfig = await videoResourceMaterialLookup.config.get(
    "local",
    videoId,
  );

  const resolvedDownloadPath = resourceStorageMaterialLookup.local.resolvePath(
    videoResourceMaterialLookup.download.getRelativePath(videoId),
  );
  const resolvedMetadataPath = resourceStorageMaterialLookup.local.resolvePath(
    videoResourceMaterialLookup.extractedMetadata.getRelativePath(videoId),
  );

  if (getCommonConfig().RESET) {
    await fs.remove(resolvedDownloadPath);
    await fs.remove(resolvedMetadataPath);
  }

  const fileMappings: BaseFileMapping[] = [
    fileMappingMaterialLookup.downloadVideo.createFileMapping({
      sourcePath: videoConfig.url,
      targetPath: resolvedDownloadPath,
      height: videoConfig.framePreviewHeight,
    }),
    fileMappingMaterialLookup.extractVideoMetadata.createFileMapping({
      sourcePath: resolvedDownloadPath,
      targetPath: resolvedMetadataPath,
    }),
  ];

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
