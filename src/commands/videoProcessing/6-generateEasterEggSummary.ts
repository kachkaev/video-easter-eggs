import chalk from "chalk";
import _ from "lodash";
import { Duration } from "luxon";

import { autoStartCommandIfNeeded, Command } from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import { videoResourceMaterialLookup } from "../../lib/resources/videos";
import { resourceStorageLookup } from "../../lib/resourceStorages";

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Generating Easter egg summary..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;

  const labeledSections = await videoResourceMaterialLookup.labeledSections.get(
    resourceStorageLookup.local,
    videoId,
  );
  const labeledEasterEggs = await videoResourceMaterialLookup.labeledEasterEggs.get(
    resourceStorageLookup.local,
    videoId,
  );

  const orderedLabeledEasterEggs = _.orderBy(
    labeledEasterEggs,
    (labeledEasterEgg) => labeledEasterEgg.timeOffset,
  );

  const numberOfLoops = labeledSections.filter(
    (labeledSection) => labeledSection.label === "loop",
  ).length;

  logger.log();
  orderedLabeledEasterEggs.forEach((labeledEasterEgg) => {
    const timeCodeIsNotSupported =
      labeledEasterEgg.timeOffset > 60 * 60 * 1000 * 10;

    const timeOffsetToShow = labeledEasterEgg.timeOffset - 1000;
    logger.log(
      `${Duration.fromMillis(timeOffsetToShow).toFormat("hh:mm:ss")}${
        timeCodeIsNotSupported
          ? ` &t=${Math.floor(timeOffsetToShow / 1000)}s`
          : ""
      } (${Duration.fromMillis(labeledEasterEgg.timeDuration).toFormat(
        "s",
      )} sec) ${labeledEasterEgg.label}`,
    );
  });
  logger.log();
  logger.log(`Number of easter eggs: ${orderedLabeledEasterEggs.length}`);
  logger.log(`Number of loops: ${numberOfLoops}`);
  logger.log();
};

autoStartCommandIfNeeded(command, __filename);

export default command;
