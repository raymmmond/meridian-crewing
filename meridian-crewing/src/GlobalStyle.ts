import { createGlobalStyle } from "styled-components";
import theme from "./theme";

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }

  html { scroll-behavior: smooth; }

  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }

  body {
    margin: 0;
    background: ${theme.color.navy800};
    color: ${theme.color.paper};
    font-family: ${theme.font.body};
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    margin: 0;
    font-family: ${theme.font.display};
    text-transform: uppercase;
    letter-spacing: 0.01em;
  }

  p { margin: 0; }

  a { color: inherit; text-decoration: none; }

  button { font-family: inherit; cursor: pointer; }

  :focus-visible {
    outline: 2px solid ${theme.color.rustLight};
    outline-offset: 3px;
  }
`;

export default GlobalStyle;
