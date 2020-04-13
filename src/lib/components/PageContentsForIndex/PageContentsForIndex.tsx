import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";

import { generateVideoUrl } from "../../ui";
import { VideoInfo } from "../../videoResources/types";
import GlobalStyle from "../PageLayout/components/GlobalStyle";
import ActiveFrameDetails from "./components/ActiveFrameDetails";
import TimelineSegment from "./components/TimelineSegment";

const SegmentsWrapper = styled.div`
  padding: 20px;
`;

const PageContentsForIndex: React.FunctionComponent<{
  videoInfo: VideoInfo;
}> = ({ videoInfo }) => {
  const [activeTimeOffset, setActiveTimeOffset] = React.useState(0);

  const segments: Array<{
    timeOffsetStart: number;
    timeOffsetInterval: number;
  }> = [];

  let timeOffsetStart = 0;
  const chunkInterval = 77.5 * 1 * 1000;
  while (timeOffsetStart < videoInfo.processedDuration) {
    const timeOffsetInterval = Math.min(
      chunkInterval,
      videoInfo.processedDuration - timeOffsetStart,
    );
    segments.push({
      timeOffsetStart,
      timeOffsetInterval,
    });
    timeOffsetStart += chunkInterval;
  }

  const activeSegmentIndex = segments.findIndex(
    (segment) =>
      segment.timeOffsetStart <= activeTimeOffset &&
      segment.timeOffsetStart + segment.timeOffsetInterval > activeTimeOffset,
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
        activeTimeOffset - segments[activeSegmentIndex].timeOffsetStart;
      const newSegment = segments[activeSegmentIndex + delta];
      if (newSegment) {
        setActiveTimeOffset(
          newSegment.timeOffsetStart +
            Math.min(
              activeTimeOffsetWithinActiveSegment,
              newSegment.timeOffsetInterval - videoInfo.frameSamplingInterval,
            ),
        );
      }
    },
    {},
    [activeSegmentIndex, activeTimeOffset, segments, videoInfo],
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
      <GlobalStyle />
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      <SegmentsWrapper>
        {segments.slice(0, 100).map((segment) => (
          <TimelineSegment
            key={segment.timeOffsetStart}
            videoInfo={videoInfo}
            timeOffsetStart={segment.timeOffsetStart}
            timeOffsetInterval={segment.timeOffsetInterval}
            frameStripeWidth={2}
            activeTimeOffset={
              activeTimeOffset >= segment.timeOffsetStart &&
              activeTimeOffset <
                segment.timeOffsetStart + segment.timeOffsetInterval
                ? activeTimeOffset
                : undefined
            }
            onActiveTimeOffsetChange={setActiveTimeOffset}
          />
        ))}
      </SegmentsWrapper>
    </>
  );
};

export default PageContentsForIndex;
