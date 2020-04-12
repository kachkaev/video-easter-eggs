import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../types";

const Wrapper = styled.div`
  position: sticky;
  padding: 10px 20px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: #fff;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
`;

const ImgA = styled.a`
  display: inline-block;
`;

ImgA.defaultProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};

const Img = styled.img`
  display: block;
  height: 100px;
`;

const TimeStamp = styled.div`
  display: inline-block;
  padding-left: 10px;
  font-size: 20px;
  vertical-align: top;
`;

const ActiveFrameDetails: React.FunctionComponent<{
  videoInfo: VideoInfo;
  activeTimeOffset: number;
}> = ({ videoInfo, activeTimeOffset }) => {
  const href = `${videoInfo.url}&t=${Math.floor(activeTimeOffset / 1000)}`;
  const imgSrc = `/api/videoThumbnail?timeOffset=${activeTimeOffset}`;
  const activeTime = Duration.fromMillis(activeTimeOffset);
  return (
    <Wrapper>
      <ImgA href={href}>
        <Img src={imgSrc} />
      </ImgA>
      <TimeStamp>{activeTime.toFormat("hh:mm:ss")}</TimeStamp>
    </Wrapper>
  );
};

export default React.memo(ActiveFrameDetails);
