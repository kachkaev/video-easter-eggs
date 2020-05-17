import React from "react";
import styled from "styled-components";

import GlobalStyle from "./GlobalStyle";

const Container = styled.div``;

const PageLayout: React.FunctionComponent = ({ children }) => {
  return (
    <Container>
      <GlobalStyle />
      {children}
    </Container>
  );
};

export default PageLayout;
