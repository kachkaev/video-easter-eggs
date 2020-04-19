import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { VideoInfo } from "../../../resources/videos/types";
import { mobileMedia, shortTimeFormat } from "../styling";

const Wrapper = styled.div`
  flex-grow: 1;
  padding-top: 20px;
  display: flex;
  flex-direction: column;

  ${mobileMedia} {
    padding-left: 30px;
    padding-top: 7px;
  }
`;

const Body = styled.div`
  font-size: 0.7em;
  line-height: 1.5em;

  p {
    margin-top: 0;
  }
`;

const Nobr = styled.span`
  white-space: nowrap;
`;

export interface DetailsOnDemandProps {
  videoInfo: VideoInfo;
  activeTimeOffset: number;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}

const DetailsOnDemand: React.FunctionComponent<DetailsOnDemandProps> = ({
  videoInfo,
  onActiveTimeOffsetChange,
}) => {
  const referenceFrameTimeOffset =
    videoInfo.sectionLabeling?.referenceFrameTimeOffset;

  const numberOfLoops = React.useMemo(
    () =>
      videoInfo.labeledSections.filter(
        (labeledSection) => labeledSection.label === "loop",
      ).length,
    [videoInfo.labeledSections],
  );

  const handleReferenceFrameClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (typeof referenceFrameTimeOffset === "number") {
        onActiveTimeOffsetChange(referenceFrameTimeOffset);
      }
    },
    [onActiveTimeOffsetChange, referenceFrameTimeOffset],
  );

  return (
    <Wrapper>
      <Body>
        {typeof referenceFrameTimeOffset === "number" ? (
          <p>
            The{" "}
            <a href={videoInfo.url} target="_blank" rel="noopener noreferrer">
              video
            </a>{" "}
            is split into segments based on{" "}
            <a href="#" onClick={handleReferenceFrameClick}>
              {Duration.fromMillis(referenceFrameTimeOffset).toFormat(
                shortTimeFormat,
              )}
            </a>{" "}
            as&nbsp;a&nbsp;reference
          </p>
        ) : null}
        <p>Click on the timeline or navigate with arrow keys</p>
        <p>
          <Nobr>Total segments: {videoInfo.labeledSections.length}</Nobr>{" "}
          <Nobr>Number of loops: {numberOfLoops}</Nobr>{" "}
          <Nobr>Found easter eggs: {videoInfo.labeledEasterEggs.length}</Nobr>
        </p>
        <p>
          ✏️ by <a href="http://en.kachkaev.ru">Alexander Kachkaev</a>
          <br />
          {videoInfo.urlOfCommentWithTimestamps ? (
            <>
              👀{" "}
              <a
                href={videoInfo.urlOfCommentWithTimestamps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Comment with timestamps
              </a>
              <br />
            </>
          ) : null}
          💻{" "}
          <a
            href="https://github.com/kachkaev/video-easter-eggs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source on GitHub
          </a>
        </p>
      </Body>
    </Wrapper>
  );
};

export default React.memo(DetailsOnDemand);
