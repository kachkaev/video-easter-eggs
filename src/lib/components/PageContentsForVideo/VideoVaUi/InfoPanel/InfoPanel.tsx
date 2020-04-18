import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import { mobileMedia } from "../styling";
import ActiveFrameDetails from "./ActiveFrameDetails";
import DetailsOnDemand from "./DetailsOnDemand";

const Wrapper = styled.div`
  position: sticky;
  padding: 0 15px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: #f3f3f3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1;
  width: 160px;
  min-width: 160px;

  ${mobileMedia} {
    width: auto;
    min-width: auto;
    flex-direction: row;
  }
`;

interface InfoPanelProps {
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}

const InfoPanel: React.FunctionComponent<InfoPanelProps> = ({
  videoInfo,
  activeTimeOffset,
  onActiveTimeOffsetChange,
}) => {
  return (
    <Wrapper>
      <ActiveFrameDetails
        videoInfo={videoInfo}
        activeTimeOffset={activeTimeOffset}
      />
      <DetailsOnDemand
        videoInfo={videoInfo}
        onActiveTimeOffsetChange={onActiveTimeOffsetChange}
        activeTimeOffset={activeTimeOffset}
      />
    </Wrapper>
  );
};

export default React.memo(InfoPanel);
