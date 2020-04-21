import copy from "copy-to-clipboard";
import { Duration } from "luxon";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { VideoInfo } from "../../resources/videos";
import { generateVideoUrl } from "../../ui";
import { timeFormat } from "../styling";

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
  const activeSectionIndex = videoInfo.labeledSections.findIndex(
    (section) =>
      section.timeOffset <= activeTimeOffset &&
      section.timeOffset + section.timeDuration > activeTimeOffset,
  );

  useHotkeys("left,shift+left,right,shift+right", (event) => {
    event.preventDefault();
    const delta =
      (event.shiftKey ? 10 : 1) *
      videoInfo.frameSamplingInterval *
      (event.key === "ArrowLeft" ? -1 : 1);
    onActiveTimeOffsetChange((timeOffset) =>
      Math.min(
        Math.max(timeOffset + delta, 0),
        (Math.floor(
          videoInfo.processedTimeDuration / videoInfo.frameSamplingInterval,
        ) -
          1) *
          videoInfo.frameSamplingInterval,
      ),
    );
  });

  useHotkeys(
    "up,shift+up,down,shift+down",
    (event) => {
      event.preventDefault();
      const delta =
        (event.shiftKey ? 5 : 1) * (event.key === "ArrowUp" ? -1 : 1);
      const activeTimeOffsetWithinActiveSection =
        activeTimeOffset -
        (videoInfo.labeledSections[activeSectionIndex]?.timeOffset ?? 0);
      const newSection = videoInfo.labeledSections[activeSectionIndex + delta];
      if (newSection) {
        onActiveTimeOffsetChange(
          newSection.timeOffset +
            Math.min(
              activeTimeOffsetWithinActiveSection,
              newSection.timeDuration - videoInfo.frameSamplingInterval,
            ),
        );
      }
    },
    {},
    [activeSectionIndex, activeTimeOffset, videoInfo],
  );

  useHotkeys(
    "enter",
    (event) => {
      event.preventDefault();
      const newWindow = window.open(
        generateVideoUrl(videoInfo, activeTimeOffset),
        "_blank",
        'rel="noopener noreferrer"',
      );
      newWindow?.focus();
    },
    {},
    [activeTimeOffset, videoInfo],
  );

  useHotkeys(
    "cmd+shift+c",
    (event) => {
      event.preventDefault();
      const activeTime = Duration.fromMillis(activeTimeOffset);
      copy(activeTime.toFormat(timeFormat));
    },
    {},
    [activeTimeOffset],
  );

  useHotkeys(
    "cmd+ctrl+c",
    (event) => {
      event.preventDefault();
      copy(`${activeTimeOffset}`);
    },
    {},
    [activeTimeOffset],
  );

  return null;
};

export default HotKeys;
