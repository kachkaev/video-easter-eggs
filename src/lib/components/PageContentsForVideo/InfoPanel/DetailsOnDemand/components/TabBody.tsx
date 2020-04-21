import styled from "styled-components";

const TabBody = styled.div<{ active?: boolean }>`
  padding-right: 15px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;

  ${(p) => (!p.active ? "display: none;" : "")};

  p {
    margin-top: 0;
  }
`;

export default TabBody;
