import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { LabeledAnnotation } from "../../../resources/videos/types";
import { activeTimeOffsetColor, easterEggMarkColor } from "../../styling";
import TimelineSectionBackground from "./SectionBackground";
import { TimelineListElementData } from "./types";

const Wrapper = styled.div`
  position: relative;
`;

const hourMarkWidth = 50;
const hourTickWidth = 6;
const underlineHeight = 2;

const HourMark = styled.div<{ disabled?: boolean }>`
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
  z-index: 1;

  ${(p) =>
    p.disabled
      ? ""
      : `
  .no-touchscreen &:hover {
    color: #000;
  }
  `}
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
  background: ${activeTimeOffsetColor};
  height: 100%;
  opacity: 0.9;
  pointer-events: none;
  position: absolute;
`;

const EasterEggMark = styled.div`
  margin-top: -${underlineHeight - 1}px;
  top: 50%;
  height: ${underlineHeight}px;
  background: ${easterEggMarkColor};
  pointer-events: none;
  position: absolute;
  box-sizing: border-box;
`;

const convertTimeToFrame = (
  timeOffset: number,
  sectionTimeOffset: number,
  frameSamplingInterval: number,
): number => {
  return Math.floor((timeOffset - sectionTimeOffset) / frameSamplingInterval);
};

interface SectionProps extends TimelineListElementData {
  style: React.CSSProperties;
  sectionIndex: number;
}

const Section: React.FunctionComponent<SectionProps> = ({
  style,
  sectionIndex,
  activeTimeOffset,
  frameStripeWidth,
  maxLabeledSectionDuration,
  onActiveTimeOffsetChange,
  videoInfo,
}) => {
  const { timeOffset, timeDuration } = videoInfo.labeledSections[sectionIndex];

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

  const timeEnd = timeOffset + timeDuration;
  const currentHour = Duration.fromMillis(timeEnd - 1).toFormat("hh");
  const prevHour = Duration.fromMillis(timeOffset).toFormat("hh");

  const maxWidth =
    Math.floor(maxLabeledSectionDuration / videoInfo.frameSamplingInterval) *
    frameStripeWidth;
  const sectionWidth =
    Math.floor(timeDuration / videoInfo.frameSamplingInterval) *
    frameStripeWidth;

  const canvasHeight = videoInfo.frameStripeHeight;

  const activeFrame = convertTimeToFrame(
    activeTimeOffset ?? -1,
    timeOffset,
    videoInfo.frameSamplingInterval,
  );
  const frameCount = convertTimeToFrame(
    timeOffset + timeDuration,
    timeOffset,
    videoInfo.frameSamplingInterval,
  );

  const startOfHourTimeOffset =
    Math.floor((timeEnd - 1) / 60 / 60 / 1000) * 60 * 60 * 1000;

  const handleHourMarkClick: React.MouseEventHandler = React.useCallback(() => {
    onActiveTimeOffsetChange(startOfHourTimeOffset);
  }, [onActiveTimeOffsetChange, startOfHourTimeOffset]);

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
      {sectionIndex === 0 || currentHour !== prevHour ? (
        <>
          <HourMark
            onClick={handleHourMarkClick}
            disabled={startOfHourTimeOffset === activeTimeOffset}
          >
            {currentHour}
          </HourMark>
          <HourTick />
        </>
      ) : null}
      <TimelineSectionBackground
        videoInfo={videoInfo}
        sectionIndex={sectionIndex}
        frameStripeWidth={frameStripeWidth}
        style={{
          left: hourMarkWidth,
        }}
      />
      {labeledEasterEggs.map((labeledEasterEgg, easterEggIndex) => {
        const firstFrame = Math.max(
          convertTimeToFrame(
            labeledEasterEgg.timeOffset,
            timeOffset,
            videoInfo.frameSamplingInterval,
          ),
          0,
        );
        const lastFrame = Math.min(
          convertTimeToFrame(
            labeledEasterEgg.timeOffset + labeledEasterEgg.timeDuration,
            timeOffset,
            videoInfo.frameSamplingInterval,
          ),
          frameCount,
        );
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
      {activeFrame >= 0 && activeFrame < frameCount ? (
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

export default React.memo(Section);
