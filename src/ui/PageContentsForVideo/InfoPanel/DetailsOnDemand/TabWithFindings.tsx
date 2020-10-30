import _ from "lodash";
import React from "react";
import styled from "styled-components";

import { TimeCode } from "../../../shared/TimeCode";
import { useVideoInfo } from "../../videoInfo";
import { EasterEggIcon } from "./EasterEggIcon";
import { TabBody } from "./shared/TabBody";
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
  active: hidden,
}) => {
  const videoInfo = useVideoInfo();
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
            <TimeCode timeOffset={finding.timeOffset} /> (
            {Math.round(finding.timeDuration / 1000)} sec)
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

const WrappedTabWithFindings = React.memo(TabWithFindings);
export { WrappedTabWithFindings as TabWithFindings };
