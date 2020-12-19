import { Duration } from "luxon";
import * as React from "react";
import styled from "styled-components";

import { useActiveTimeOffset } from "../PageContentsForVideo/activeTimeOffset";
import { activeTimeOffsetColor, baseColor, shortTimeFormat } from "./styling";

const Wrapper = styled.span<{ isActive?: boolean }>`
  cursor: default;
  border-bottom: 1px dotted #ccc;

  .no-touchscreen &:hover {
    border-bottom-color: ${baseColor};
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
}> = ({ timeOffset }) => {
  const { activeTimeOffset, setActiveTimeOffset } = useActiveTimeOffset();
  const handleLiClick = React.useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault();
      setActiveTimeOffset(timeOffset);
    },
    [setActiveTimeOffset, timeOffset],
  );

  return (
    <Wrapper isActive={timeOffset === activeTimeOffset} onClick={handleLiClick}>
      {Duration.fromMillis(timeOffset).toFormat(shortTimeFormat)}
    </Wrapper>
  );
};

const WrappedTimeCode = React.memo(TimeCode);
export { WrappedTimeCode as TimeCode };
