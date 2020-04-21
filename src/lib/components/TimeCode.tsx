import { Duration } from "luxon";
import React from "react";
import styled from "styled-components";

import { activeTimeOffsetColor, shortTimeFormat } from "./styling";

const Wrapper = styled.span<{ isActive?: boolean }>`
  cursor: default;
  border-bottom: 1px dotted #ccc;

  .no-touchscreen &:hover {
    border-bottom-color: #000;
  }

  ${(p) =>
    p.isActive
      ? `
  border-bottom-color: rgba(0,0,0,0) !important;
  color: ${activeTimeOffsetColor}
`
      : ""};
`;

const TimeCode: React.FunctionComponent<{
  timeOffset: number;
  isActive?: boolean;
  onActiveTimeOffsetChange: React.Dispatch<React.SetStateAction<number>>;
}> = ({ isActive, onActiveTimeOffsetChange, timeOffset }) => {
  const handleLiClick = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault();
      onActiveTimeOffsetChange(timeOffset);
    },
    [onActiveTimeOffsetChange, timeOffset],
  );

  return (
    <Wrapper isActive={isActive} onClick={handleLiClick}>
      {Duration.fromMillis(timeOffset).toFormat(shortTimeFormat)}
    </Wrapper>
  );
};

export default React.memo(TimeCode);
