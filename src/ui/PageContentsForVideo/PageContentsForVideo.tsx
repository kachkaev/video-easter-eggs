import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../shared/resources/videos/types";
import { mobileMedia } from "../shared/styling";
import ActiveTimeOffsetProvider from "./activeTimeOffset/ActiveTimeOffsetProvider";
import HotKeys from "./HotKeys";
import InfoPanel from "./InfoPanel";
import Timeline from "./Timeline";
import VideoInfoContext from "./videoInfo/VideoInfoContext";
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
    <VideoInfoContext.Provider value={videoInfo}>
      <VizConfigProvider>
        <ActiveTimeOffsetProvider>
          <Wrapper>
            <HotKeys />
            <InfoPanel />
            <Timeline />
          </Wrapper>
        </ActiveTimeOffsetProvider>
      </VizConfigProvider>
    </VideoInfoContext.Provider>
  );
};

export default PageContentsForVideo;
