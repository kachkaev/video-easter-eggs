import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { ExternalLink } from "../../shared/ExternalLink";
import { generateFramePreviewUrl } from "../../shared/generateFramePreviewUrl";
import { generateVideoUrl } from "../../shared/generateVideoUrl";
import { baseColor, mobileMedia, timeFormat } from "../../shared/styling";
import { useActiveTimeOffset } from "../activeTimeOffset";
import { useVideoInfo } from "../videoInfo";
import { PlayIcon } from "./PlayIcon";

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

const A = styled(ExternalLink)`
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
  color: ${baseColor};
  display: flex;
`;

const NavigationButton = styled.a<{ disabled?: boolean }>`
  color: ${baseColor};
  display: inline-block;
  flex-grow: 0;
  cursor: default;

  .no-touchscreen &:hover {
    text-decoration: none;
  }

  ${(p) =>
    p.disabled
      ? `color: #ccc;`
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
  children?: never;
}> = () => {
  const videoInfo = useVideoInfo();
  const { activeTimeOffset, setActiveTimeOffset } = useActiveTimeOffset();

  const minAllowedTimeOffset = 0;
  const maxAllowedTimeOffset =
    videoInfo.processedTimeDuration - videoInfo.frameSamplingInterval;

  const handleNavigationButtonClick = React.useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      const factor =
        (event.shiftKey ? 10 : 1) *
        (Number.parseInt(`${event.currentTarget.dataset.factor}`) ?? 1);
      setActiveTimeOffset((value) =>
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
      setActiveTimeOffset,
      videoInfo.frameSamplingInterval,
    ],
  );

  return (
    <Wrapper>
      <A href={generateVideoUrl(videoInfo, activeTimeOffset)}>
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

const WrappedActiveFrameDetails = React.memo(ActiveFrameDetails);
export { WrappedActiveFrameDetails as ActiveFrameDetails };
