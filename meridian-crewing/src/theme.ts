const theme = {
  color: {
    navy900: "#081420",
    navy800: "#0B1F33",
    navy700: "#132C46",
    steel: "#3D5A73",
    steelLight: "#8FA6B8",
    rust: "#C1440E",
    rustLight: "#E0672B",
    paper: "#EDE8DE",
    paperDim: "#D9D2C3",
    brass: "#B08D57",
    white: "#F7F5F0",
  },
  font: {
    display: "'Oswald', 'Arial Narrow', sans-serif",
    body: "'IBM Plex Sans', -apple-system, sans-serif",
    mono: "'IBM Plex Mono', 'Courier New', monospace",
  },
  maxWidth: "1240px",
} as const;

export type Theme = typeof theme;
export default theme;
