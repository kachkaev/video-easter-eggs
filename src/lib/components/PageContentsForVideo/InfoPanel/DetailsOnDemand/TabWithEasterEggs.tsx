import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { timeFormat } from "../../styling";
import TabBody from "./components/TabBody";
import { TabProps } from "./types";

const Ol = styled.ol`
  margin: 0;
  padding: 0;
`;

const Li = styled.li`
  margin: 0;
  padding: 0;
  list-style-position: inside;
  margin-bottom: 5px;
`;

const TimeCode = styled.span`
  cursor: default;
`;

const TabWithSummary: React.FunctionComponent<TabProps> = ({
  videoInfo,
  active: hidden,
  onActiveTimeOffsetChange,
}) => {
  const handleLiClick = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault();
      const timeOffset =
        parseInt(`${event.currentTarget.dataset["time"]}`) || 0;
      onActiveTimeOffsetChange(timeOffset);
    },
    [onActiveTimeOffsetChange],
  );
  return (
    <TabBody active={hidden}>
      <Ol>
        {videoInfo.labeledEasterEggs.map((easteEgg, index) => (
          <Li
            key={index}
            data-time={easteEgg.timeOffset}
            onClick={handleLiClick}
          >
            <TimeCode>
              {Duration.fromMillis(easteEgg.timeOffset)
                .toFormat(timeFormat)
                .substring(0, 8)}
            </TimeCode>
          </Li>
        ))}
      </Ol>
    </TabBody>
  );
};

export default React.memo(TabWithSummary);
