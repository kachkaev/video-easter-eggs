import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos/types";
import TimelineSegmentCanvas from "./TimelineSegmentCanvas";

const Wrapper = styled.div`
  position: relative;
`;

const ActiveFrame = styled.div`
  background: red;
  pointer-events: none;
  background: red;
  opacity: 0.5;
  height: 100%;
  position: absolute;
`;

const TimelineSegment: React.FunctionComponent<{
  activeTimeOffset?: number;
  frameStripeWidth: number;
  onActiveTimeOffsetChange?: (value: number) => void;
  timeOffsetInterval: number;
  timeOffsetStart: number;
  videoInfo: VideoInfo;
}> = ({
  activeTimeOffset,
  frameStripeWidth,
  onActiveTimeOffsetChange,
  timeOffsetInterval,
  timeOffsetStart,
  videoInfo,
}) => {
  const canvasWidth =
    Math.floor(timeOffsetInterval / videoInfo.frameSamplingInterval) *
    frameStripeWidth;

  const canvasHeight = videoInfo.frameStripeHeight;

  const cappedActiveFrame =
    typeof activeTimeOffset === "number" &&
    activeTimeOffset >= timeOffsetStart &&
    activeTimeOffset < timeOffsetStart + timeOffsetInterval
      ? Math.floor(
          (activeTimeOffset - timeOffsetStart) /
            videoInfo.frameSamplingInterval,
        )
      : undefined;

  const handleWrapperMouseDown: React.MouseEventHandler = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      if (onActiveTimeOffsetChange) {
        onActiveTimeOffsetChange(
          timeOffsetStart +
            Math.floor(x / frameStripeWidth) * videoInfo.frameSamplingInterval,
        );
      }
    },
    [
      frameStripeWidth,
      onActiveTimeOffsetChange,
      timeOffsetStart,
      videoInfo.frameSamplingInterval,
    ],
  );

  return (
    <Wrapper
      onMouseDown={handleWrapperMouseDown}
      style={{
        width: canvasWidth,
        height: canvasHeight,
      }}
    >
      <TimelineSegmentCanvas
        videoInfo={videoInfo}
        frameStripeWidth={frameStripeWidth}
        timeOffsetStart={timeOffsetStart}
        timeOffsetInterval={timeOffsetInterval}
      />
      {typeof cappedActiveFrame === "number" ? (
        <ActiveFrame
          style={{
            left: cappedActiveFrame * frameStripeWidth,
            width: frameStripeWidth,
          }}
        />
      ) : null}
    </Wrapper>
  );
};

export default React.memo(TimelineSegment);
