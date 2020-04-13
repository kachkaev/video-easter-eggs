import chalk from "chalk";
import globby from "globby";
import path from "path";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../../lib/fileMappings";
import { videoResourceMaterialLookup } from "../../lib/videoResources";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting frame stripes..."));

  const { videoDir } = getVideoProcessingConfig();

  const foundFramePreviews = await globby(
    videoResourceMaterialLookup.framePreviews.getDirPath(videoDir),
    {
      onlyFiles: true,
      expandDirectories: {
        extensions: [videoResourceMaterialLookup.framePreviews.extension],
      },
    },
  );

  const framePreviewExtensionRegexp = new RegExp(
    `${videoResourceMaterialLookup.framePreviews.extension}$`,
  );

  const { frameStripeHeight } = await videoResourceMaterialLookup.config.get(
    videoDir,
  );

  const fileMappings: BaseFileMapping[] = foundFramePreviews.map(
    (framePreviewPath) =>
      fileMappingMaterialLookup.extractVideoFrameStripe.createFileMapping({
        sourcePath: framePreviewPath,
        targetPath: path.resolve(
          videoResourceMaterialLookup.frameStripes.getDirPath(videoDir),
          path.relative(
            videoResourceMaterialLookup.framePreviews.getDirPath(videoDir),
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

autoStartCommandIfNeeded(command, __filename);

export default command;
