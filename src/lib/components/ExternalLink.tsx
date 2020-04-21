import styled from "styled-components";

const ExternalLink = styled.a`
  color: #000;
  text-decoration: none;
  border-bottom: 1px solid #ccc;

  .no-touchscreen &:hover {
    text-decoration: none;
    border-bottom-color: #000;
  }
`;

ExternalLink.defaultProps = {
  rel: "noopener noreferrer",
  target: "_blank",
};

export default ExternalLink;
