import chalk from "chalk";

import {
  autoStartCommandIfNeeded,
  Command,
  CommandError,
} from "../../lib/commands";
import { getVideoProcessingConfig } from "../../lib/envBasedConfigs";
import {
  FrameStripe,
  LabeledAnnotation,
  videoResourceMaterialLookup,
} from "../../lib/resources/videos";
import { calculateProcessedTimeDuration } from "../../lib/resources/videos/helpers";
import { resourceStorageLookup } from "../../lib/resourceStorages";

const calculateStripeDifference = (fs1: FrameStripe, fs2: FrameStripe) => {
  let maxChannelDifference = 0;
  for (let index = 0; index < fs1.length; index++) {
    const colorValue1 = fs1[index];
    const colorValue2 = fs2[index];
    for (let channelIndex = 0; channelIndex < 6; channelIndex += 2) {
      const channelDifference = Math.abs(
        parseInt(colorValue1.substr(channelIndex, 2), 16) -
          parseInt(colorValue2.substr(channelIndex, 2), 16),
      );
      if (channelDifference > maxChannelDifference) {
        maxChannelDifference = channelDifference;
      }
    }
  }
  return maxChannelDifference;
};

const command: Command = async (context) => {
  const { logger } = context;
  logger.log(chalk.green("Extracting labeled sections..."));

  const videoId = getVideoProcessingConfig().VIDEO_ID;
  const videoConfig = await videoResourceMaterialLookup.config.get(
    resourceStorageLookup.local,
    videoId,
  );
  const extractedMetadata = await videoResourceMaterialLookup.extractedMetadata.get(
    resourceStorageLookup.local,
    videoId,
  );

  const frameStripes = await videoResourceMaterialLookup.joinedFrameStripes.get(
    resourceStorageLookup.local,
    videoId,
  );

  if (!videoConfig.sectionLabeling) {
    throw new CommandError("sectionLabeling is not defined in video config");
  }

  const {
    minExpectedSectionDuration,
    frameStripeDifferenceTolerance,
    referenceFrameTimeOffset,
    referenceFrameTimeOffsetWithinSection,
    endingStartTime,
  } = videoConfig.sectionLabeling;
  const processedTimeDuration = calculateProcessedTimeDuration(
    videoConfig,
    extractedMetadata,
  );
  const endingTimeDuration = endingStartTime
    ? processedTimeDuration - endingStartTime
    : 0;

  const referenceFrameStripeIndex =
    referenceFrameTimeOffset / videoConfig.frameSamplingInterval;
  const referenceFrameStripe = frameStripes[referenceFrameStripeIndex];

  const labeledSections: LabeledAnnotation[] = [];

  const introDuration =
    referenceFrameTimeOffset - referenceFrameTimeOffsetWithinSection;
  if (introDuration) {
    labeledSections.push({
      type: "section",
      label: "intro",
      timeOffset: 0,
      timeDuration: introDuration,
    });
  }

  let lastFoundReferenceFrameTimeOffset = referenceFrameTimeOffset;
  let currentTimeOffset =
    lastFoundReferenceFrameTimeOffset + minExpectedSectionDuration;

  const maxTimeOffset = processedTimeDuration - endingTimeDuration;
  while (
    currentTimeOffset <
    maxTimeOffset - videoConfig.frameSamplingInterval
  ) {
    currentTimeOffset += videoConfig.frameSamplingInterval;
    const currentFrameStripe =
      frameStripes[currentTimeOffset / videoConfig.frameSamplingInterval];
    const stripeDifference = calculateStripeDifference(
      referenceFrameStripe,
      currentFrameStripe,
    );

    if (stripeDifference <= frameStripeDifferenceTolerance) {
      labeledSections.push({
        type: "section",
        label: "loop",
        timeOffset:
          lastFoundReferenceFrameTimeOffset -
          referenceFrameTimeOffsetWithinSection,
        timeDuration: currentTimeOffset - lastFoundReferenceFrameTimeOffset,
      });
      lastFoundReferenceFrameTimeOffset = currentTimeOffset;
      currentTimeOffset =
        lastFoundReferenceFrameTimeOffset + minExpectedSectionDuration;
    }
  }

  const lastLoopTimeOffset =
    lastFoundReferenceFrameTimeOffset - referenceFrameTimeOffsetWithinSection;
  labeledSections.push({
    type: "section",
    label: "loop",
    timeOffset: lastLoopTimeOffset,
    timeDuration: maxTimeOffset - lastLoopTimeOffset,
  });

  if (endingStartTime && endingTimeDuration) {
    labeledSections.push({
      type: "section",
      label: "ending",
      timeOffset: endingStartTime,
      timeDuration: endingTimeDuration,
    });
  }

  await videoResourceMaterialLookup.labeledSections.put(
    resourceStorageLookup.local,
    videoId,
    labeledSections,
  );
};

autoStartCommandIfNeeded(command, __filename);

export default command;
