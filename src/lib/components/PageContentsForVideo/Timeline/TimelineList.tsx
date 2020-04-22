import React from "react";
import { useSize } from "react-use";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos";
import { useActiveTimeOffset } from "../activeTimeOffset";
import { useVizConfig } from "../vizConfig";
import TimelineListElement from "./TimelineListElement";
import { TimelineListElementData } from "./types";

const SizeWrapper = styled.div`
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: visible;
`;
const frameStripeWidth = 2;
const dummyElementCountAtStart = 2;
const dummyElementCountAtEnd = 2;

export interface TimelineProps {
  videoInfo: VideoInfo;
}

const Timeline: React.FunctionComponent<TimelineProps> = ({ videoInfo }) => {
  const { activeTimeOffset } = useActiveTimeOffset();
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

  const listRef = React.useRef<FixedSizeList>(null);

  const {
    vizConfig: { diffWithActiveSection },
  } = useVizConfig();

  const sectionToDiffIndex = React.useMemo(
    () =>
      diffWithActiveSection
        ? videoInfo.labeledSections.findIndex(
            (labeledSection) =>
              activeTimeOffset >= labeledSection.timeOffset &&
              activeTimeOffset <
                labeledSection.timeOffset + labeledSection.timeDuration,
          )
        : -1,

    [activeTimeOffset, diffWithActiveSection, videoInfo.labeledSections],
  );

  const timelineListElementData: TimelineListElementData = {
    dummyElementCountAtStart,
    frameStripeWidth,
    maxLabeledSectionDuration,
    sectionToDiffIndex,
    videoInfo,
  };

  const prevIndex = React.useRef(-1);
  React.useEffect(() => {
    const sectionIndex = labeledSections.findIndex(
      (labeledSection) =>
        activeTimeOffset <
        labeledSection.timeOffset + labeledSection.timeDuration,
    );
    if (sectionIndex == -1) {
      return;
    }

    const index = sectionIndex + dummyElementCountAtStart;

    const indexDelta = prevIndex.current - index;
    if (!indexDelta) {
      return;
    }

    if (prevIndex.current >= 0 && listRef.current) {
      listRef.current.scrollToItem(index, "smart");
    }

    prevIndex.current = index;
  }, [labeledSections, activeTimeOffset, videoInfo.frameStripeHeight]);

  const [timelineList] = useSize(
    ({ width, height }) => (
      <SizeWrapper>
        <FixedSizeList
          ref={listRef}
          itemData={timelineListElementData}
          itemCount={
            labeledSections.length +
            dummyElementCountAtStart +
            dummyElementCountAtEnd
          }
          height={height}
          itemSize={videoInfo.frameStripeHeight}
          width={width}
          overscanCount={50}
        >
          {TimelineListElement}
        </FixedSizeList>
      </SizeWrapper>
    ),
    { width: 0, height: 0 },
  );

  return timelineList;
};

export default Timeline;
