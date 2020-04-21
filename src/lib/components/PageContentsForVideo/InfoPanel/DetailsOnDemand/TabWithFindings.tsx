import _ from "lodash";
import React from "react";
import styled from "styled-components";

import Wrapper from "../../../TimeCode";
import TabBody from "./components/TabBody";
import EasterEggIcon from "./EasterEggIcon";
import { TabProps } from "./types";

const EasterEgg = styled.div`
  margin: 0;
  margin-bottom: 1em;
  position: relative;

  &:last-child {
    margin-bottom: 20px;
  }
`;

const EasterEggMark = styled.span`
  opacity: 0.4;
`;

const StyledEasterEggIcon = styled(EasterEggIcon)`
  width: 1em;
  padding-top: 0.25em;
  display: inline-block;
  vertical-align: top;
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
        const easterEggIndexToDisplay =
          videoInfo.labeledEasterEggs.indexOf(finding) + 1;
        return (
          <EasterEgg key={index} data-time={finding.timeOffset}>
            <Wrapper
              timeOffset={finding.timeOffset}
              isActive={finding.timeOffset === activeTimeOffset}
              onActiveTimeOffsetChange={onActiveTimeOffsetChange}
            />{" "}
            ({Math.round(finding.timeDuration / 1000)} sec)
            {easterEggIndexToDisplay > 0 ? (
              <EasterEggMark title={`Easter egg # ${easterEggIndexToDisplay}`}>
                {" "}
                <StyledEasterEggIcon /> {easterEggIndexToDisplay}
              </EasterEggMark>
            ) : null}
            <br />
            {finding.label}
          </EasterEgg>
        );
      })}
    </TabBody>
  );
};

export default React.memo(TabWithFindings);
