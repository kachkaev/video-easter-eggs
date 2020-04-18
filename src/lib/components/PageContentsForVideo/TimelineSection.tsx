import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../resources/videos/types";
import TimelineSectionBackground from "./TimelineSectionBackground";

// const ListItem = React.useMemo(
//   () => ({ index, style }) => {
//     const labeledSection = labeledSections[index];
//     return (
//       <TimelineSection
//         style={style}
//         key={labeledSection.timeOffset}
//         frameStripeWidth={frameStripeWidth}
//         maxLabeledSectionDuration={maxLabeledSectionDuration}
//         timeDuration={labeledSection.timeDuration}
//         timeOffset={labeledSection.timeOffset}
//         videoInfo={videoInfo}
//         activeTimeOffset={
//           activeTimeOffset >= labeledSection.timeOffset &&
//           activeTimeOffset <
//             labeledSection.timeOffset + labeledSection.timeDuration
//             ? activeTimeOffset
//             : undefined
//         }
//         onActiveTimeOffsetChange={setActiveTimeOffset}
//       />
//     );
//   },
//   [activeTimeOffset, labeledSections, maxLabeledSectionDuration, videoInfo],
// );

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

export interface TimelineSectionData {
  activeTimeOffset: number;
  frameStripeWidth: number;
  maxLabeledSectionDuration: number;
  onActiveTimeOffsetChange: (value: number) => void;
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

  const handleWrapperMouseDown: React.MouseEventHandler = React.useCallback(
    (e) => {
      const x = e.nativeEvent.offsetX;
      if (x < sectionWidth) {
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
      sectionWidth,
    ],
  );

  return (
    <Wrapper
      onMouseDown={handleWrapperMouseDown}
      style={{
        ...style,
        width: maxWidth,
        height: canvasHeight,
      }}
    >
      <TimelineSectionBackground
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

export default React.memo(TimelineSection);
