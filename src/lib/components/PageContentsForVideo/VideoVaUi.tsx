import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useSize } from "react-use";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { VideoInfo } from "../../resources/videos/types";
import { generateVideoUrl } from "../../ui";
import ActiveFrameDetails from "./ActiveFrameDetails";
import TimelineSection from "./TimelineSection";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;

  flex-direction: column;
`;

const LabeledSectionsWrapper = styled.div`
  flex-grow: 1;
`;

const frameStripeWidth = 2;

const VideoVaUi: React.FunctionComponent<{
  videoInfo: VideoInfo;
}> = ({ videoInfo }) => {
  const [activeTimeOffset, setActiveTimeOffset] = React.useState(0);

  const { labeledSections } = videoInfo;

  const maxLabeledSectionDuration = React.useMemo(() => {
    let result = labeledSections[0].timeDuration;
    labeledSections.forEach((labeledSection) => {
      if (labeledSection.timeDuration > result) {
        result = labeledSection.timeDuration;
      }
    });
    return result;
  }, [labeledSections]);

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

  const [timeline] = useSize(
    ({ width, height }) => (
      <LabeledSectionsWrapper>
        <FixedSizeList
          itemCount={labeledSections.length}
          height={height}
          itemSize={videoInfo.frameStripeHeight}
          width={width}
        >
          {({ index, style }) => {
            const labeledSection = labeledSections[index];
            return (
              <TimelineSection
                style={style}
                key={labeledSection.timeOffset}
                videoInfo={videoInfo}
                timeOffset={labeledSection.timeOffset}
                timeDuration={labeledSection.timeDuration}
                timeDurationForWidth={maxLabeledSectionDuration}
                frameStripeWidth={frameStripeWidth}
                activeTimeOffset={
                  activeTimeOffset >= labeledSection.timeOffset &&
                  activeTimeOffset <
                    labeledSection.timeOffset + labeledSection.timeDuration
                    ? activeTimeOffset
                    : undefined
                }
                onActiveTimeOffsetChange={setActiveTimeOffset}
              />
            );
          }}
        </FixedSizeList>
      </LabeledSectionsWrapper>
    ),
    { width: 0, height: 0 },
  );

  return (
    <Wrapper>
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      {timeline}
    </Wrapper>
  );
};

export default VideoVaUi;
