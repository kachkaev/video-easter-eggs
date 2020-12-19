import * as React from "react";
import styled from "styled-components";

import { GlobalStyle } from "./GlobalStyle";

const Container = styled.div``;

export const PageLayout: React.FunctionComponent = ({ children }) => {
  return (
    <Container>
      <GlobalStyle />
      {children}
    </Container>
  );
};
