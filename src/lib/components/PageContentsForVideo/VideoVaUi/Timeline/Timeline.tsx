import React from "react";
import { useSize } from "react-use";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos";
import TimelineSection, { TimelineSectionData } from "./TimelineSection";

const LabeledSectionsWrapper = styled.div`
  flex-grow: 1;
  overflow: hidden;
`;

const frameStripeWidth = 2;

export interface TimelineProps {
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}

const Timeline: React.FunctionComponent<TimelineProps> = ({
  activeTimeOffset,
  onActiveTimeOffsetChange,
  videoInfo,
}) => {
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

  const timelineSectionData: TimelineSectionData = {
    activeTimeOffset,
    frameStripeWidth,
    maxLabeledSectionDuration,
    onActiveTimeOffsetChange,
    videoInfo,
  };

  const [timeline] = useSize(
    ({ width, height }) => (
      <LabeledSectionsWrapper>
        <FixedSizeList
          itemData={timelineSectionData}
          itemCount={labeledSections.length}
          height={height}
          itemSize={videoInfo.frameStripeHeight}
          width={width}
        >
          {TimelineSection}
        </FixedSizeList>
      </LabeledSectionsWrapper>
    ),
    { width: 0, height: 0 },
  );

  return timeline;
};

export default Timeline;
