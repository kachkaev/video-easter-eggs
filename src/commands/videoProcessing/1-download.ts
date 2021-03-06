import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "@kachkaev/commands";
import chalk from "chalk";
import fs from "fs-extra";

import {
  getCommonConfig,
  getVideoProcessingConfig,
} from "../../shared/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../shared/fileMappings";
import { videoResourceMaterialLookup } from "../../shared/resources/videos";
import { resourceStorageLookup } from "../../shared/resourceStorages";

export const download: Command = async (context) => {
  const { logger } = context;
  logger.log(
    chalk.green("Downloading the video and extracting its metadata..."),
  );

  const videoId = getVideoProcessingConfig().VIDEO_ID;

  const videoConfig = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );

  const resolvedDownloadPath = videoResourceMaterialLookup.download.getResolvedPath(
    resourceStorageLookup.local,
    videoId,
  );
  const resolvedMetadataPath = videoResourceMaterialLookup.extractedMetadata.getResolvedPath(
    resourceStorageLookup.local,
    videoId,
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

autoStartCommandIfNeeded(download, __filename);
