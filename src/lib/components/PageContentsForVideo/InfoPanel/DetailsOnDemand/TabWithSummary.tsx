import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { shortTimeFormat } from "../../styling";
import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const Nobr = styled.span`
  white-space: nowrap;
`;

const TabWithSummary: React.FunctionComponent<TabProps> = ({
  // activeTimeOffset,
  onActiveTimeOffsetChange,
  videoInfo,
  active: hidden,
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
    <TabBody active={hidden}>
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
      <p>
        <Nobr>Total segments: {videoInfo.labeledSections.length}</Nobr>{" "}
        <Nobr>Number of loops: {numberOfLoops}</Nobr>{" "}
        <Nobr>Found easter eggs: {videoInfo.labeledEasterEggs.length}</Nobr>
      </p>
      <p>
        Click on the timeline or navigate with arrow keys. To play the video at
        the current time code, click on the frame preview or press Enter
      </p>
    </TabBody>
  );
};

export default React.memo(TabWithSummary);
