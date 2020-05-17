import { createGlobalStyle, css } from "styled-components";
import normalize from "styled-normalize";

import { baseColor } from "../../shared/styling";

const base = css`
  body {
    color: ${baseColor};
    font-family: "-apple-system", BlinkMacSystemFont, Avenir Next, Avenir,
      Helvetica, sans-serif;
    margin: 0;
    line-height: 1.4em;
  }

  a {
    color: #0366d6;
    text-decoration: none;
    .no-touchscreen &:hover {
      text-decoration: underline;
    }
  }

  code {
    background: rgba(27, 31, 35, 0.05);
    padding: 0.1em 0.2em;
    border-radius: 3px;
  }
`;

const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${base}
`;

export default GlobalStyle;
