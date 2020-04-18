import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../../resources/videos/types";
import { generateFramePreviewUrl, generateVideoUrl } from "../../../../ui";
import { timeFormat } from "../styling";
import PlayIcon from "./PlayIcon";

const Wrapper = styled.div`
  flex-grow: 0;
  max-width: 160px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const A = styled.a`
  display: block;
  border-bottom: none;
  position: relative;
  color: #888;

  :hover {
    color: #000;
    text-decoration: none;
  }
`;

const StyledPlayIcon = styled(PlayIcon)`
  position: absolute;
  display: none;
  width: 100%;
  height: 40%;
  top: 20%;
  color: #fff;

  ${A}:hover & {
    display: inline-block;
  }
`;

const Img = styled.img`
  display: block;
  width: 100%;
`;

const TimeStamp = styled.div`
  display: block;
  text-align: center;
  padding-top: 3px;
  font-size: 20px;
  font-variant-numeric: tabular-nums;
`;

const ActiveFrameDetails: React.FunctionComponent<{
  videoInfo: VideoInfo;
  activeTimeOffset: number;
}> = ({ videoInfo, activeTimeOffset }) => {
  const activeTime = Duration.fromMillis(activeTimeOffset);
  return (
    <Wrapper>
      <A
        href={generateVideoUrl(videoInfo, activeTimeOffset)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Img src={generateFramePreviewUrl(videoInfo, activeTimeOffset)} />
        <TimeStamp>{activeTime.toFormat(timeFormat)}</TimeStamp>
        <StyledPlayIcon />
      </A>
    </Wrapper>
  );
};

export default React.memo(ActiveFrameDetails);
