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
import { resourceStorageLookup } from "../../shared/resourceStorages";

const uploadVideoData: Command = async ({ logger }) => {
  logger.log(chalk.green("Uploading video data to s3..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;

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

autoStartCommandIfNeeded(uploadVideoData, __filename);
