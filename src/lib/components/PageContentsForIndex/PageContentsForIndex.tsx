import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../types";
import GlobalStyle from "../GlobalStyle";
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
  const chunkInterval = 155 * 1 * 1000;
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

  return (
    <>
      <GlobalStyle />
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      <SegmentsWrapper>
        {segments.map((segment) => (
          <TimelineSegment
            key={segment.timeOffsetStart}
            videoInfo={videoInfo}
            timeOffsetStart={segment.timeOffsetStart}
            timeOffsetInterval={segment.timeOffsetInterval}
            frameStripeWidth={3}
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
