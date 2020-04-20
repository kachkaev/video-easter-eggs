import styled from "styled-components";

const TabBody = styled.div<{ active?: boolean }>`
  padding-right: 15px;

  ${(p) => (!p.active ? "display: none;" : "")};

  p {
    margin-top: 0;
  }
`;

export default TabBody;
