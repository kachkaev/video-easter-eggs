import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { LabeledAnnotation } from "../../../shared/resources/videos/types";
import {
  activeTimeOffsetColor,
  baseColor,
  easterEggMarkColor,
} from "../../shared/styling";
import { useVideoInfo } from "../videoInfo";
import { useVizConfig } from "../vizConfig";
import { TimelineSectionBackground } from "./SectionBackground";
import { TimelineListElementData } from "./types";

const Wrapper = styled.div`
  position: relative;
`;

const paddingLeft = 15;
const paddingRight = 15;
const hourMarkWidth = 30;
const hourTickWidth = 3;
const underlineHeight = 2;

const HourMark = styled.div<{ disabled?: boolean }>`
  position: absolute;
  top: 0;
  left: ${paddingLeft}px;
  width: ${hourMarkWidth}px;
  font-size: 20px;
  line-height: 14px;
  color: ${baseColor};
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
  left: ${paddingLeft + hourMarkWidth - hourTickWidth}px;
  width: ${hourTickWidth}px;
  top: 0;
  height: ${underlineHeight}px;
  background: ${baseColor};
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
  activeTimeOffset?: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}

const Section: React.FunctionComponent<SectionProps> = ({
  style,
  sectionIndex,
  sectionToDiffIndex,
  activeTimeOffset,
  frameStripeWidth,
  maxLabeledSectionDuration,
  onActiveTimeOffsetChange,
}) => {
  const videoInfo = useVideoInfo();
  const { timeOffset, timeDuration } = videoInfo.labeledSections[sectionIndex];
  const {
    vizConfig: { highlightEasterEggs },
  } = useVizConfig();

  const labeledEasterEggs: LabeledAnnotation[] = React.useMemo(
    () =>
      videoInfo.labeledEasterEggs.filter(
        (labeledEasterEgg) =>
          highlightEasterEggs &&
          labeledEasterEgg.timeOffset <= timeOffset + timeDuration &&
          labeledEasterEgg.timeOffset + labeledEasterEgg.timeDuration >
            timeOffset,
      ),
    [
      videoInfo.labeledEasterEggs,
      timeOffset,
      timeDuration,
      highlightEasterEggs,
    ],
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
      if (
        x >= paddingLeft + hourMarkWidth &&
        x < paddingLeft + hourMarkWidth + sectionWidth
      ) {
        onActiveTimeOffsetChange(
          timeOffset +
            Math.floor((x - hourMarkWidth - paddingLeft) / frameStripeWidth) *
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
        width: maxWidth + hourMarkWidth + paddingLeft + paddingRight,
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
        sectionIndex={sectionIndex}
        sectionToDiffIndex={sectionToDiffIndex}
        frameStripeWidth={frameStripeWidth}
        style={{
          left: paddingLeft + hourMarkWidth,
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
              left: paddingLeft + hourMarkWidth + firstFrame * frameStripeWidth,
              width: (lastFrame - firstFrame) * frameStripeWidth,
            }}
          />
        );
      })}
      {activeFrame >= 0 && activeFrame < frameCount ? (
        <ActiveFrame
          style={{
            left: paddingLeft + hourMarkWidth + activeFrame * frameStripeWidth,
            width: frameStripeWidth,
          }}
        />
      ) : null}
    </Wrapper>
  );
};

const WrappedSection = React.memo(Section);
export { WrappedSection as Section };
