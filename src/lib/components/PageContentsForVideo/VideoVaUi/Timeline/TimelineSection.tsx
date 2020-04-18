import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import TimelineSectionBackground from "./TimelineSectionBackground";

const Wrapper = styled.div`
  position: relative;
`;

const hourMarkWidth = 50;
const hourTickWidth = 6;
const underlineHeight = 2;

const HourMark = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${hourMarkWidth}px;
  font-size: 20px;
  line-height: 14px;
  color: #999;
  padding-right: 10px;
  text-align: right;
  box-sizing: border-box;
  cursor: default;
`;

const HourTick = styled.div`
  position: absolute;
  left: ${hourMarkWidth - hourTickWidth}px;
  width: ${hourTickWidth}px;
  top: 0;
  height: ${underlineHeight}px;
  background: #999;
`;

const ActiveFrame = styled.div`
  background: red;
  pointer-events: none;
  background: red;
  opacity: 0.8;
  height: 100%;
  position: absolute;
`;

export interface TimelineSectionData {
  activeTimeOffset: number;
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}

const TimelineSection: React.FunctionComponent<{
  style: React.CSSProperties;
  index: number;
  data: TimelineSectionData;
}> = ({
  style,
  index,
  data: {
    activeTimeOffset,
    frameStripeWidth,
    maxLabeledSectionDuration,
    onActiveTimeOffsetChange,
    videoInfo,
  },
}) => {
  const { timeOffset, timeDuration } = videoInfo.labeledSections[index];

  const timeEnd = timeOffset + timeDuration - 1;
  const currentHour = Duration.fromMillis(timeEnd).toFormat("hh");
  const prevHour = Duration.fromMillis(timeOffset).toFormat("hh");

  const maxWidth =
    Math.floor(maxLabeledSectionDuration / videoInfo.frameSamplingInterval) *
    frameStripeWidth;
  const sectionWidth =
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

  const handleHourMarkClick: React.MouseEventHandler = React.useCallback(() => {
    onActiveTimeOffsetChange(
      Math.floor(timeEnd / 60 / 60 / 1000) * 60 * 60 * 1000,
    );
  }, [onActiveTimeOffsetChange, timeEnd]);

  const handleWrapperMouseDown: React.MouseEventHandler = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      if (x >= hourMarkWidth && x < sectionWidth + hourMarkWidth) {
        onActiveTimeOffsetChange(
          timeOffset +
            Math.floor((x - hourMarkWidth) / frameStripeWidth) *
              videoInfo.frameSamplingInterval,
        );
      }
    },
    [
      frameStripeWidth,
      onActiveTimeOffsetChange,
      timeOffset,
      videoInfo.frameSamplingInterval,
      sectionWidth,
    ],
  );

  return (
    <Wrapper
      onMouseDown={handleWrapperMouseDown}
      style={{
        ...style,
        width: maxWidth + hourMarkWidth,
        height: canvasHeight,
      }}
    >
      {index === 0 || currentHour !== prevHour ? (
        <>
          <HourMark onClick={handleHourMarkClick}>{currentHour}</HourMark>
          <HourTick />
        </>
      ) : null}
      <TimelineSectionBackground
        videoInfo={videoInfo}
        frameStripeWidth={frameStripeWidth}
        timeOffset={timeOffset}
        timeDuration={timeDuration}
        style={{
          left: hourMarkWidth,
        }}
      />
      {typeof cappedActiveFrame === "number" ? (
        <ActiveFrame
          style={{
            left: cappedActiveFrame * frameStripeWidth + hourMarkWidth,
            width: frameStripeWidth,
          }}
        />
      ) : null}
    </Wrapper>
  );
};

export default React.memo(TimelineSection);
