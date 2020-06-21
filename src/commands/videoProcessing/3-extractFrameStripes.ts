import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "@kachkaev/commands";
import chalk from "chalk";
import globby from "globby";
import path from "path";

import { getVideoProcessingConfig } from "../../shared/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../shared/fileMappings";
import { videoResourceMaterialLookup } from "../../shared/resources/videos";
import { resourceStorageLookup } from "../../shared/resourceStorages";

export const extractFrameStripes: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting frame stripes..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;

  const resolvedFramePreviewDirPath = videoResourceMaterialLookup.framePreviews.getResolvedDirPath(
    resourceStorageLookup.local,
    videoId,
  );
  const resolvedFrameStripeDirPath = videoResourceMaterialLookup.framePreviews.getResolvedDirPath(
    resourceStorageLookup.local,
    videoId,
  );

  const foundFramePreviews = await globby(resolvedFramePreviewDirPath, {
    onlyFiles: true,
    expandDirectories: {
      extensions: [videoResourceMaterialLookup.framePreviews.extension],
    },
  });

  const framePreviewExtensionRegexp = new RegExp(
    `${videoResourceMaterialLookup.framePreviews.extension}$`,
  );

  const { frameStripeHeight } = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );

  const fileMappings: BaseFileMapping[] = foundFramePreviews.map(
    (framePreviewPath) =>
      fileMappingMaterialLookup.extractVideoFrameStripe.createFileMapping({
        sourcePath: framePreviewPath,
        targetPath: path.resolve(
          resolvedFrameStripeDirPath,
          path.relative(
            resolvedFramePreviewDirPath,
            framePreviewPath.replace(
              framePreviewExtensionRegexp,
              videoResourceMaterialLookup.frameStripes.extension,
            ),
          ),
        ),
        height: frameStripeHeight,
      }),
  );

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(extractFrameStripes, __filename);
