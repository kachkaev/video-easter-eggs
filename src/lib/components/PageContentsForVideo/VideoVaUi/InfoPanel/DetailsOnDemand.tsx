import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import { mobileMedia } from "../styling";

const Wrapper = styled.div`
  flex-grow: 1;
  padding-top: 30px;
  display: flex;
  flex-direction: column;

  ${mobileMedia} {
    padding-left: 30px;
    padding-top: 0;
  }
`;

const Body = styled.div`
  flex-grow: 1;
  ${mobileMedia} {
    display: none;
  }
`;
const Footer = styled.div`
  flex-grow: 0;
  font-size: 0.7em;
`;

export interface DetailsOnDemandProps {
  videoInfo: VideoInfo;
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}

const DetailsOnDemand: React.FunctionComponent<DetailsOnDemandProps> = (
  {
    // videoInfo,
    // activeTimeOffset,
  },
) => {
  // const activeTime = Duration.fromMillis(activeTimeOffset);
  return (
    <Wrapper>
      <Body />
      <Footer>
        <a
          href="http://en.kachkaev.ru"
          target="_blank"
          rel="noopener noreferrer"
        >
          viz by Alexander Kachkaev
        </a>
        <br />
        <a
          href="https://github.com/kachkaev/video-easter-eggs"
          target="_blank"
          rel="noopener noreferrer"
        >
          source on github
        </a>
      </Footer>
    </Wrapper>
  );
};

export default React.memo(DetailsOnDemand);
