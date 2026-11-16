// Font e colori della serie. Il font Inter è in public/fonts (vedi src/Showcase/theme.ts).
export { fontFamily } from "../Showcase/theme";

export const palette = {
  light: "#ffe7a3",
  gold: "#ffd23f",
  green: "#5ee38a",
  red: "#ff3b4e",
  white: "#ffffff",
  muted: "#9aa6bd",
  ink: "#05070f",
  paper: "#efe6d0",
};

export const toneColor = {
  normal: palette.white,
  gold: palette.gold,
  red: palette.red,
} as const;

// Ombra per tenere leggibile il testo bianco su qualunque sfondo.
export const textShadow =
  "0 6px 0 rgba(0,0,0,0.55), 0 0 24px rgba(0,0,0,0.6)";
