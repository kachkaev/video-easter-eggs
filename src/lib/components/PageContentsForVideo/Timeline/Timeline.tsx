import React from "react";
import { useSize } from "react-use";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos";
import TimelineSection, { TimelineSectionData } from "./TimelineSection";

const SizeWrapper = styled.div`
  position: absolute !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: visible;
`;

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0px;
  min-height: 0px;
  position: relative;
`;

const frameStripeWidth = 2;
const listPadding = { top: 20, bottom: 20 };

// https://github.com/bvaughn/react-window#can-i-add-padding-to-the-top-and-bottom-of-a-list
const RawInnerListElement: React.RefForwardingComponent<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
> = ({ style, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        ...style,
        position: "absolute",
        height: `${
          parseFloat(`${style?.height ?? 0}`) +
          listPadding.top +
          listPadding.bottom
        }px`,
      }}
      {...rest}
    />
  );
};

const InnerListElement = React.forwardRef(RawInnerListElement);

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
    listPadding,
    maxLabeledSectionDuration,
    onActiveTimeOffsetChange,
    videoInfo,
  };

  const [timeline] = useSize(
    ({ width, height }) => (
      <SizeWrapper>
        <FixedSizeList
          innerElementType={InnerListElement}
          itemData={timelineSectionData}
          itemCount={labeledSections.length}
          height={height}
          itemSize={videoInfo.frameStripeHeight}
          width={width}
          overscanCount={50}
        >
          {TimelineSection}
        </FixedSizeList>
      </SizeWrapper>
    ),
    { width: 0, height: 0 },
  );

  return <Wrapper>{timeline}</Wrapper>;
};

export default Timeline;
