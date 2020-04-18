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
    logger.log(
      `${Duration.fromMillis(labeledEasterEgg.timeOffset - 1000).toFormat(
        "hh:mm:ss",
      )} (${Duration.fromMillis(labeledEasterEgg.timeDuration).toFormat(
        "s",
      )} сек) ${labeledEasterEgg.label}`,
    );
  });
  logger.log();
  logger.log(`Number of easter eggs: ${orderedLabeledEasterEggs.length}`);
  logger.log(`Number of loops: ${numberOfLoops}`);
  logger.log();
};

autoStartCommandIfNeeded(command, __filename);

export default command;
