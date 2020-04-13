import React from "react";
import styled from "styled-components";

import GlobalStyle from "./components/GlobalStyle";

const Container = styled.div`
  margin: 0 auto;
  padding: 0 20px 50px;
  position: relative;
  max-width: 35em;
  min-width: 270px;
`;

const PageLayout: React.FunctionComponent = ({ children }) => {
  return (
    <Container>
      <GlobalStyle />
      {children}
    </Container>
  );
};

export default PageLayout;
