import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const fontFamily = "Inter";

// Font locali in public/fonts: il render non dipende dalla rete.
// loadFont() blocca il render finché il font non è pronto.
for (const weight of ["400", "600", "800"]) {
  loadFont({
    family: fontFamily,
    url: staticFile(`fonts/inter-${weight}.woff2`),
    weight,
  });
}

export const colors = {
  ink: "#0b0b14",
  paper: "#f5f3ee",
  violet: "#7c5cff",
  cyan: "#00d4ff",
  pink: "#ff4d8d",
  yellow: "#ffd23f",
};
