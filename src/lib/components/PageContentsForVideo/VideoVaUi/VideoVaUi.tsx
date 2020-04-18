import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos/types";
import HotKeys from "./HotKeys";
import InfoPanel from "./InfoPanel";
import { mobileMedia } from "./styling";
import Timeline from "./Timeline";

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;

  ${mobileMedia} {
    flex-direction: column;
  }
`;

const VideoVaUi: React.FunctionComponent<{
  videoInfo: VideoInfo;
}> = ({ videoInfo }) => {
  const [activeTimeOffset, setActiveTimeOffset] = React.useState(0);

  React.useEffect(() => {
    document.title = videoInfo.shortTitle;
  }, [videoInfo]);

  return (
    <Wrapper>
      <HotKeys
        activeTimeOffset={activeTimeOffset}
        onActiveTimeOffsetChange={setActiveTimeOffset}
        videoInfo={videoInfo}
      />
      <InfoPanel
        activeTimeOffset={activeTimeOffset}
        onActiveTimeOffsetChange={setActiveTimeOffset}
        videoInfo={videoInfo}
      />
      <Timeline
        activeTimeOffset={activeTimeOffset}
        onActiveTimeOffsetChange={setActiveTimeOffset}
        videoInfo={videoInfo}
      />
    </Wrapper>
  );
};

export default VideoVaUi;
