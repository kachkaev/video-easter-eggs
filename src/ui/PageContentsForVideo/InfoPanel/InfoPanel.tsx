import * as React from "react";
import styled from "styled-components";

import { mobileMedia } from "../../shared/styling";
import { ActiveFrameDetails } from "./ActiveFrameDetails";
import { DetailsOnDemand } from "./DetailsOnDemand";

const Wrapper = styled.div`
  position: sticky;
  padding: 0 0 0 15px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: #f3f3f3;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1;
  width: 195px;

  ${mobileMedia} {
    width: auto;
    min-width: auto;
    flex-direction: row;
    max-height: 180px;
  }
`;

const InfoPanel: React.FunctionComponent<{ children?: never }> = () => {
  return (
    <Wrapper>
      <ActiveFrameDetails />
      <DetailsOnDemand />
    </Wrapper>
  );
};

const WrappedInfoPanel = React.memo(InfoPanel);
export { WrappedInfoPanel as InfoPanel };
