import _ from "lodash";
import React from "react";
import styled from "styled-components";

import Wrapper from "../../../TimeCode";
import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const EasterEgg = styled.div`
  margin: 0;
  padding-left: 20px;
  margin-bottom: 1em;
  position: relative;

  &:last-child {
    margin-bottom: 20px;
  }
`;

const EasterEggNumber = styled.span`
  display: inline-block;
  width: 15px;
  margin-left: -20px;
  padding-right: 5px;
  white-space: nowrap;
  text-align: right;
`;

const TabWithFindings: React.FunctionComponent<TabProps> = ({
  videoInfo,
  active: hidden,
  activeTimeOffset,
  onActiveTimeOffsetChange,
}) => {
  const findings = React.useMemo(() => {
    const nonLoopSections = videoInfo.labeledSections.filter(
      (labeledSection) => labeledSection.label !== "loop",
    );
    return _.orderBy(
      [...videoInfo.labeledEasterEggs, ...nonLoopSections],
      (finding) => finding.timeOffset,
    );
  }, [videoInfo]);

  return (
    <TabBody active={hidden}>
      {findings.map((finding, index) => {
        const easterEggIndex = videoInfo.labeledEasterEggs.indexOf(finding);
        return (
          <EasterEgg key={index} data-time={finding.timeOffset}>
            {easterEggIndex !== -1 ? (
              <EasterEggNumber>{easterEggIndex + 1}.</EasterEggNumber>
            ) : null}
            <Wrapper
              timeOffset={finding.timeOffset}
              isActive={finding.timeOffset === activeTimeOffset}
              onActiveTimeOffsetChange={onActiveTimeOffsetChange}
            />{" "}
            ({Math.round(finding.timeDuration / 1000)} sec)
            <br />
            {finding.label}
          </EasterEgg>
        );
      })}
    </TabBody>
  );
};

export default React.memo(TabWithFindings);
