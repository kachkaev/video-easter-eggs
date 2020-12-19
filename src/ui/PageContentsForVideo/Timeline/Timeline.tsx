import dynamic from "next/dynamic";
import * as React from "react";
import styled from "styled-components";

import { TimelineListProps } from "./TimelineList";

const TimelineList = dynamic<TimelineListProps>(
  () => import("./TimelineList").then((mod) => mod.TimelineList),
  { ssr: false },
);

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0px;
  min-height: 0px;
  position: relative;
`;

export const Timeline: React.FunctionComponent<{ children?: never }> = () => {
  return (
    <Wrapper>
      <TimelineList />
    </Wrapper>
  );
};
