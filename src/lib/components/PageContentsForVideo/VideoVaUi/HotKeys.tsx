import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { VideoInfo } from "../../../resources/videos";
import { generateVideoUrl } from "../../../ui";

interface HotKeysProps {
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}

const HotKeys: React.FunctionComponent<HotKeysProps> = ({
  activeTimeOffset,
  onActiveTimeOffsetChange,
  videoInfo,
}) => {
  const activeSegmentIndex = videoInfo.labeledSections.findIndex(
    (section) =>
      section.timeOffset <= activeTimeOffset &&
      section.timeOffset + section.timeDuration > activeTimeOffset,
  );

  useHotkeys("left,shift+left,right,shift+right", (event) => {
    event.preventDefault();
    const delta =
      (event.shiftKey ? 10000 : videoInfo.frameSamplingInterval) *
      (event.key === "ArrowLeft" ? -1 : 1);
    onActiveTimeOffsetChange((timeOffset) =>
      Math.min(Math.max(timeOffset + delta, 0), videoInfo.processedDuration),
    );
  });

  useHotkeys(
    "up,shift+up,down,shift+down",
    (event) => {
      event.preventDefault();
      const delta =
        (event.shiftKey ? 5 : 1) * (event.key === "ArrowUp" ? -1 : 1);
      const activeTimeOffsetWithinActiveSegment =
        activeTimeOffset -
        videoInfo.labeledSections[activeSegmentIndex].timeOffset;
      const newSegment = videoInfo.labeledSections[activeSegmentIndex + delta];
      if (newSegment) {
        onActiveTimeOffsetChange(
          newSegment.timeOffset +
            Math.min(
              activeTimeOffsetWithinActiveSegment,
              newSegment.timeDuration - videoInfo.frameSamplingInterval,
            ),
        );
      }
    },
    {},
    [activeSegmentIndex, activeTimeOffset, videoInfo],
  );

  useHotkeys(
    "enter",
    (event) => {
      event.preventDefault();
      const newWindow = window.open(
        generateVideoUrl(videoInfo, activeTimeOffset),
        "_blank",
      );
      newWindow?.focus();
    },
    {},
    [activeTimeOffset, videoInfo],
  );
  return null;
};

export default HotKeys;
