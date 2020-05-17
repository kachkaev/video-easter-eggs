import dynamic from "next/dynamic";
import React from "react";
import styled from "styled-components";

const TimelineList = dynamic(() => import("./TimelineList"), { ssr: false });

const Wrapper = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0px;
  min-height: 0px;
  position: relative;
`;

const Timeline: React.FunctionComponent<{ children?: never }> = () => {
  return (
    <Wrapper>
      <TimelineList />
    </Wrapper>
  );
};

export default Timeline;
