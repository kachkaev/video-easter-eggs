import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos/types";
import { generateFramePreviewUrl, generateVideoUrl } from "../../../ui";
import { mobileMedia, timeFormat } from "../styling";
import PlayIcon from "./PlayIcon";

const Wrapper = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  width: 180px;
  min-width: 180px;
  max-width: 180px;
  padding-top: 20px;
  padding-right: 15px;
  padding-bottom: 10px;

  ${mobileMedia} {
    padding-top: 10px;
  }
`;

const A = styled.a`
  display: block;
  border-bottom: none;
  position: relative;
`;

const StyledPlayIcon = styled(PlayIcon)`
  position: absolute;
  display: none;
  left: 50%;
  top: 50%;
  height: 40%;
  transform: translate(-50%, -50%);
  color: #fff;

  .no-touchscreen ${A}:hover & {
    display: inline-block;
  }
`;

const Img = styled.img`
  display: block;
  width: 100%;
`;

const Navigation = styled.div`
  display: block;
  padding-top: 5px;
  font-size: 20px;
  color: #888;
  display: flex;
`;

const NavigationButton = styled.a<{ disabled?: boolean }>`
  color: #888;
  display: inline-block;
  flex-grow: 0;
  cursor: default;

  .no-touchscreen &:hover {
    text-decoration: none;
  }

  ${(p) =>
    p.disabled
      ? `opacity: 0.5;`
      : `
  .no-touchscreen &:hover {
    color: #000;
  }
  `}
`;

const TimeCode = styled.div`
  flex-grow: 1;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

const ActiveFrameDetails: React.FunctionComponent<{
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
  videoInfo: VideoInfo;
}> = ({ videoInfo, activeTimeOffset, onActiveTimeOffsetChange }) => {
  const minAllowedTimeOffset = 0;
  const maxAllowedTimeOffset =
    videoInfo.processedTimeDuration - videoInfo.frameSamplingInterval;

  const handleNavigationButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const factor =
        (event.shiftKey ? 5 : 1) *
        (Number.parseInt(`${event.currentTarget.dataset.factor}`) ?? 1);
      onActiveTimeOffsetChange((value) =>
        Math.min(
          Math.max(
            value + factor * videoInfo.frameSamplingInterval,
            minAllowedTimeOffset,
          ),
          maxAllowedTimeOffset,
        ),
      );
    },
    [
      minAllowedTimeOffset,
      maxAllowedTimeOffset,
      onActiveTimeOffsetChange,
      videoInfo.frameSamplingInterval,
    ],
  );

  return (
    <Wrapper>
      <A
        href={generateVideoUrl(videoInfo, activeTimeOffset)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Img src={generateFramePreviewUrl(videoInfo, activeTimeOffset)} />
        <StyledPlayIcon />
      </A>
      <Navigation>
        <NavigationButton
          disabled={activeTimeOffset <= minAllowedTimeOffset}
          href="#"
          data-factor="-1"
          onClick={handleNavigationButtonClick}
        >
          ◀
        </NavigationButton>
        <TimeCode>
          {Duration.fromMillis(activeTimeOffset).toFormat(timeFormat)}
        </TimeCode>
        <NavigationButton
          disabled={activeTimeOffset >= maxAllowedTimeOffset}
          href="#"
          data-factor="1"
          onClick={handleNavigationButtonClick}
        >
          ▶
        </NavigationButton>
      </Navigation>
    </Wrapper>
  );
};

export default React.memo(ActiveFrameDetails);
