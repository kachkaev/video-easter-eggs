import styled from "styled-components";

import { baseColor } from "./styling";

const ExternalLink = styled.a`
  color: ${baseColor};
  text-decoration: none;
  border-bottom: 1px solid #ccc;

  .no-touchscreen &:hover {
    text-decoration: none;
    border-bottom-color: ${baseColor};
  }
`;

ExternalLink.defaultProps = {
  rel: "noopener noreferrer",
  target: "_blank",
};

export default ExternalLink;
