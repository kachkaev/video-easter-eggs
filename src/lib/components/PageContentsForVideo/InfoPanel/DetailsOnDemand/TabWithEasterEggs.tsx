import React from "react";
import styled from "styled-components";

import Wrapper from "../../../TimeCode";
import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const EasterEgg = styled.div`
  margin: 0;
  padding-left: 20px;
  margin-bottom: 5px;

  &:last-child {
    margin-bottom: 20px;
  }
`;

const Number = styled.span`
  display: inline-block;
  width: 20px;
  margin-left: -20px;
`;

const TabWithSummary: React.FunctionComponent<TabProps> = ({
  videoInfo,
  active: hidden,
  activeTimeOffset,
  onActiveTimeOffsetChange,
}) => {
  return (
    <TabBody active={hidden}>
      {videoInfo.labeledEasterEggs.map((easterEgg, index) => (
        <EasterEgg key={index} data-time={easterEgg.timeOffset}>
          <Number>{index + 1}.</Number>
          <Wrapper
            timeOffset={easterEgg.timeOffset}
            isActive={easterEgg.timeOffset === activeTimeOffset}
            onActiveTimeOffsetChange={onActiveTimeOffsetChange}
          />{" "}
          ({Math.round(easterEgg.timeDuration / 1000)} sec)
          <br />
          {easterEgg.label}
        </EasterEgg>
      ))}
    </TabBody>
  );
};

export default React.memo(TabWithSummary);
