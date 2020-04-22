import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../resources/videos/types";
import { mobileMedia } from "../styling";
import ActiveTimeOffsetProvider from "./activeTimeOffset/ActiveTimeOffsetProvider";
import HotKeys from "./HotKeys";
import InfoPanel from "./InfoPanel";
import Timeline from "./Timeline";
import VizConfigProvider from "./vizConfig/VizConfigProvider";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 100%;
  display: flex;
  flex-direction: row;

  ${mobileMedia} {
    flex-direction: column;
  }
`;

const PageContentsForVideo: React.FunctionComponent<{
  videoInfo: VideoInfo;
}> = ({ videoInfo }) => {
  return (
    <VizConfigProvider>
      <ActiveTimeOffsetProvider>
        <Wrapper>
          <HotKeys videoInfo={videoInfo} />
          <InfoPanel videoInfo={videoInfo} />
          <Timeline videoInfo={videoInfo} />
        </Wrapper>
      </ActiveTimeOffsetProvider>
    </VizConfigProvider>
  );
};

export default PageContentsForVideo;
