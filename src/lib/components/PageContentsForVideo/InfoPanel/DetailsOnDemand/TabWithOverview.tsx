import React from "react";
import styled from "styled-components";

import ExternalLink from "../../../ExternalLink";
import TimeCode from "../../../TimeCode";
import { useVizConfig } from "../../vizConfig";
import Checkbox from "./components/Checkbox";
import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const Nobr = styled.span`
  white-space: nowrap;
`;

const TabWithOverview: React.FunctionComponent<TabProps> = ({
  activeTimeOffset,
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

  const { vizConfig, setVizConfig } = useVizConfig();

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const { id, checked } = e.currentTarget;
    setVizConfig((currentVizConfig) => ({
      ...currentVizConfig,
      [id]: checked,
    }));
  };

  return (
    <TabBody active={hidden}>
      {typeof referenceFrameTimeOffset === "number" ? (
        <p>
          The <ExternalLink href={videoInfo.url}>video</ExternalLink> is split
          into segments based on{" "}
          <TimeCode
            timeOffset={referenceFrameTimeOffset}
            isActive={activeTimeOffset === referenceFrameTimeOffset}
            onActiveTimeOffsetChange={onActiveTimeOffsetChange}
          />{" "}
          as&nbsp;a&nbsp;reference
        </p>
      ) : null}
      <p>
        <Nobr>Total segments: {videoInfo.labeledSections.length}</Nobr>{" "}
        <Nobr>Number of loops: {numberOfLoops}</Nobr>{" "}
        <Nobr>Easter eggs found: {videoInfo.labeledEasterEggs.length}</Nobr>
      </p>
      <p>
        Click on the timeline or navigate with arrow keys. To play the video at
        the current time code, click on the frame preview or press Enter
      </p>
      <p>
        <Checkbox
          checked={vizConfig.highlightEasterEggs}
          id="highlightEasterEggs"
          onChange={handleCheckboxClick}
          label="highlight Easter eggs"
        />
        <Checkbox
          checked={vizConfig.diffWithActiveSection}
          id="diffWithActiveSection"
          onChange={handleCheckboxClick}
          label="diff with active section"
        />
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;(helps spot Easter eggs)
      </p>
    </TabBody>
  );
};

export default React.memo(TabWithOverview);
