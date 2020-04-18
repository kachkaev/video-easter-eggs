import React from "react";
import { useSize } from "react-use";
import { FixedSizeList } from "react-window";
import styled from "styled-components";

import { VideoInfo } from "../../resources/videos/types";
import ActiveFrameDetails from "./ActiveFrameDetails";
import HotKeys from "./HotKeys";
import TimelineSection, { TimelineSectionData } from "./TimelineSection";

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

  const timelineSectionData: TimelineSectionData = {
    activeTimeOffset,
    frameStripeWidth,
    maxLabeledSectionDuration,
    onActiveTimeOffsetChange: setActiveTimeOffset,
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

  return (
    <Wrapper>
      <HotKeys
        activeTimeOffset={activeTimeOffset}
        onActiveTimeOffsetChange={setActiveTimeOffset}
        videoInfo={videoInfo}
      />
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      {timeline}
    </Wrapper>
  );
};

export default VideoVaUi;
