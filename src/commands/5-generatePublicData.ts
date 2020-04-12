import chalk from "chalk";
import fs from "fs-extra";
import globby from "globby";
import path from "path";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../lib/commands";
import { getCommonConfig, getVideoConfig } from "../lib/envBasedConfigs";
import {
  BaseFileMapping,
  fileMappingMaterialLookup,
  processFileMappings,
} from "../lib/fileMappings";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Generate public data..."));

  if (getCommonConfig().RESET) {
    await fs.remove(getVideoConfig().frameStipesDir);
  }

  const foundThumbnails = await globby(getVideoConfig().thumbnailDir, {
    onlyFiles: true,
    expandDirectories: { extensions: ["jpg"] },
  });

  const fileMappings: BaseFileMapping[] = foundThumbnails.map((thumbnailPath) =>
    fileMappingMaterialLookup.extractFrameStripe.createFileMapping({
      sourcePath: thumbnailPath,
      targetPath: path.resolve(
        getVideoConfig().frameStipesDir,
        path.relative(
          getVideoConfig().thumbnailDir,
          thumbnailPath.replace(".jpg", ".json"),
        ),
      ),
      height: getVideoConfig().FRAME_STRIPE_HEIGHT,
    }),
  );

  const processingResult = await processFileMappings(fileMappings, logger);

  if (processingResult.failedFileMappings.length) {
    throw new CommandError("Finished with errors");
  }
};

autoStartCommandIfNeeded(command, __filename);

export default command;
