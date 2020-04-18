import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import {
  LabeledAnnotation,
  VideoInfo,
} from "../../../../resources/videos/types";
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
  height: 100%;
  opacity: 0.8;
  pointer-events: none;
  position: absolute;
`;

const EasterEggMark = styled.div`
  margin-top: -${underlineHeight - 1}px;
  top: 50%;
  height: ${underlineHeight}px;
  background: yellow;
  pointer-events: none;
  position: absolute;
  box-sizing: border-box;
`;

export interface TimelineSectionData {
  activeTimeOffset: number;
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}

const convertTimeToFrame = (
  timeOffset: number | undefined,
  sectionTimeOffset: number,
  sectionDuration: number,
  frameSamplingInterval: number,
  cap?: boolean,
) => {
  if (timeOffset === undefined) {
    return undefined;
  }
  const frame = Math.floor(
    (timeOffset - sectionTimeOffset) / frameSamplingInterval,
  );
  const maxFrame = Math.floor(sectionDuration / frameSamplingInterval);

  if (frame < 0) {
    return cap ? 0 : undefined;
  }
  if (frame > maxFrame) {
    return cap ? maxFrame : undefined;
  }

  return frame;
};

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

  const labeledEasterEggs: LabeledAnnotation[] = React.useMemo(
    () =>
      videoInfo.labeledEasterEggs.filter(
        (labeledEasterEgg) =>
          labeledEasterEgg.timeOffset <= timeOffset + timeDuration &&
          labeledEasterEgg.timeOffset + labeledEasterEgg.timeDuration >
            timeOffset,
      ),
    [videoInfo.labeledEasterEggs, timeOffset, timeDuration],
  );

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

  const activeFrame = convertTimeToFrame(
    activeTimeOffset,
    timeOffset,
    timeDuration,
    videoInfo.frameSamplingInterval,
  );

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
      {labeledEasterEggs.map((labeledEasterEgg, easterEggIndex) => {
        const firstFrame =
          convertTimeToFrame(
            labeledEasterEgg.timeOffset,
            timeOffset,
            timeDuration,
            videoInfo.frameSamplingInterval,
            true,
          ) ?? 0;
        const lastFrame =
          convertTimeToFrame(
            labeledEasterEgg.timeOffset +
              labeledEasterEgg.timeDuration +
              videoInfo.frameSamplingInterval,
            timeOffset,
            timeDuration,
            videoInfo.frameSamplingInterval,
            true,
          ) ?? 0;
        return (
          <EasterEggMark
            title={labeledEasterEgg.label}
            key={easterEggIndex}
            style={{
              left: firstFrame * frameStripeWidth + hourMarkWidth,
              width: (lastFrame - firstFrame) * frameStripeWidth,
            }}
          />
        );
      })}
      {typeof activeFrame === "number" ? (
        <ActiveFrame
          style={{
            left: activeFrame * frameStripeWidth + hourMarkWidth,
            width: frameStripeWidth,
          }}
        />
      ) : null}
    </Wrapper>
  );
};

export default React.memo(TimelineSection);
