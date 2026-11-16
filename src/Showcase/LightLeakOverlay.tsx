import type { CSSProperties } from "react";
import {
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Light leak in CSS: una luce calda che attraversa lo schermo al cambio scena.
const LightLeakOverlayInner = ({
  style,
}: {
  readonly style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        mixBlendMode: "screen",
        opacity: interpolate(t, [0, 0.5, 1], [0, 1, 0]),
        background: `radial-gradient(ellipse 60% 90% at ${interpolate(
          t,
          [0, 1],
          [-10, 110],
        )}% 40%, rgba(255,190,90,0.95), rgba(255,80,120,0.6) 40%, transparent 75%)`,
        ...style,
      }}
    />
  );
};

export const LightLeakOverlay = Interactive.create({
  Component: LightLeakOverlayInner,
  layout: "none",
});
