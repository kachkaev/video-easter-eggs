import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos";

const TimelineList = dynamic(() => import("./TimelineList"), { ssr: false });

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0px;
  min-height: 0px;
  position: relative;
`;

export interface TimelineProps {
  videoInfo: VideoInfo;
}

const Timeline: React.FunctionComponent<TimelineProps> = (props) => {
  return (
    <Wrapper>
      <TimelineList {...props} />
    </Wrapper>
  );
};

export default Timeline;
