import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos/types";
import { generateVideoUrl } from "../../../ui";
import ActiveFrameDetails from "./ActiveFrameDetails";
import TimelineSegment from "./TimelineSegment";

const LabeledSectionsWrapper = styled.div`
  padding: 20px;
`;

const VideoVaUi: React.FunctionComponent<{
  videoInfo: VideoInfo;
}> = ({ videoInfo }) => {
  const [activeTimeOffset, setActiveTimeOffset] = React.useState(0);

  const { labeledSections } = videoInfo;

  const activeSegmentIndex = labeledSections.findIndex(
    (section) =>
      section.timeOffset <= activeTimeOffset &&
      section.timeOffset + section.timeDuration > activeTimeOffset,
  );

  useHotkeys("left,shift+left,right,shift+right", (event) => {
    event.preventDefault();
    const delta =
      (event.shiftKey ? 10000 : videoInfo.frameSamplingInterval) *
      (event.key === "ArrowLeft" ? -1 : 1);
    setActiveTimeOffset((timeOffset) =>
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
        activeTimeOffset - labeledSections[activeSegmentIndex].timeOffset;
      const newSegment = labeledSections[activeSegmentIndex + delta];
      if (newSegment) {
        setActiveTimeOffset(
          newSegment.timeOffset +
            Math.min(
              activeTimeOffsetWithinActiveSegment,
              newSegment.timeDuration - videoInfo.frameSamplingInterval,
            ),
        );
      }
    },
    {},
    [activeSegmentIndex, activeTimeOffset, labeledSections, videoInfo],
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

  return (
    <>
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      <LabeledSectionsWrapper>
        {labeledSections.map((labeledSection) => (
          <TimelineSegment
            key={labeledSection.timeOffset}
            videoInfo={videoInfo}
            timeOffset={labeledSection.timeOffset}
            timeDuration={labeledSection.timeDuration}
            frameStripeWidth={2}
            activeTimeOffset={
              activeTimeOffset >= labeledSection.timeOffset &&
              activeTimeOffset <
                labeledSection.timeOffset + labeledSection.timeDuration
                ? activeTimeOffset
                : undefined
            }
            onActiveTimeOffsetChange={setActiveTimeOffset}
          />
        ))}
      </LabeledSectionsWrapper>
    </>
  );
};

export default VideoVaUi;
