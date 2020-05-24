import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "@kachkaev/commands";
import chalk from "chalk";
import path from "path";

import {
  getLocalResourceStorageConfig,
  getVideoProcessingConfig,
} from "../../shared/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../shared/fileMappings";
import { videoResourceMaterialLookup } from "../../shared/resources/videos";
import { calculateProcessedTimeDuration } from "../../shared/resources/videos/helpers";
import { resourceStorageLookup } from "../../shared/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Uploading video frame previews to s3..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;
  const videoConfig = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    resourceStorageLookup.local,
    videoId,
  );

  const resourcePaths: string[] = [];

  const processedTimeDuration = calculateProcessedTimeDuration(
    videoConfig,
    extractedMetadata,
  );
  for (
    let timeOffset = 0;
    timeOffset < processedTimeDuration;
    timeOffset += videoConfig.frameSamplingInterval
  ) {
    resourcePaths.push(
      videoResourceMaterialLookup.framePreviews.getResolvedPath(
        resourceStorageLookup.local,
        videoId,
        timeOffset,
      ),
    );
  }

  const fileMappings: BaseFileMapping[] = resourcePaths.map((resourcePath) =>
    fileMappingMaterialLookup.s3Upload.createFileMapping({
      sourcePath: resourcePath,
      targetPath: path.relative(
        getLocalResourceStorageConfig().LOCAL_RESOURCE_STORAGE_DIR,
        resourcePath,
      ),
    }),
  );

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
