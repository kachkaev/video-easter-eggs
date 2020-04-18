import chalk from "chalk";
import path from "path";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../../lib/commands";
import {
  getLocalResourceStorageConfig,
  getVideoProcessingConfig,
} from "../../lib/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../lib/fileMappings";
import { videoResourceMaterialLookup } from "../../lib/resources/videos";
import { resourceStorageLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Uploading to s3..."));

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

  resourcePaths.push(
    videoResourceMaterialLookup.config.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
    ),
  );
  resourcePaths.push(
    videoResourceMaterialLookup.extractedMetadata.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
    ),
  );
  resourcePaths.push(
    videoResourceMaterialLookup.joinedFrameStripes.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
    ),
  );
  resourcePaths.push(
    videoResourceMaterialLookup.labeledEasterEggs.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
    ),
  );
  resourcePaths.push(
    videoResourceMaterialLookup.labeledSections.getResolvedPath(
      resourceStorageLookup.local,
      videoId,
    ),
  );

  const maxTimeOffset =
    extractedMetadata.duration - (videoConfig.tailCutoffDuration || 0);
  for (
    let timeOffset = 0;
    timeOffset < maxTimeOffset;
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
