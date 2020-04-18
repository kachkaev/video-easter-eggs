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
  timeDuration: number;
  timeOffset: number;
  videoInfo: VideoInfo;
}> = ({
  activeTimeOffset,
  frameStripeWidth,
  onActiveTimeOffsetChange,
  timeDuration,
  timeOffset,
  videoInfo,
}) => {
  const canvasWidth =
    Math.floor(timeDuration / videoInfo.frameSamplingInterval) *
    frameStripeWidth;

  const canvasHeight = videoInfo.frameStripeHeight;

  const cappedActiveFrame =
    typeof activeTimeOffset === "number" &&
    activeTimeOffset >= timeOffset &&
    activeTimeOffset < timeOffset + timeDuration
      ? Math.floor(
          (activeTimeOffset - timeOffset) / videoInfo.frameSamplingInterval,
        )
      : undefined;

  const handleWrapperMouseDown: React.MouseEventHandler = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      if (onActiveTimeOffsetChange) {
        onActiveTimeOffsetChange(
          timeOffset +
            Math.floor(x / frameStripeWidth) * videoInfo.frameSamplingInterval,
        );
      }
    },
    [
      frameStripeWidth,
      onActiveTimeOffsetChange,
      timeOffset,
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
        timeOffset={timeOffset}
        timeDuration={timeDuration}
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
