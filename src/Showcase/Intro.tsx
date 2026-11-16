import {
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily } from "./theme";

const blobs = [
  { color: "#5a3cff", size: 1100, x: [-200, 300], y: [-300, -100] },
  { color: "#00b4ff", size: 900, x: [1300, 900], y: [400, 200] },
  { color: "#ff3d8b", size: 800, x: [400, 700], y: [700, 500] },
];

const GradientBackground = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.size,
            height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
            opacity: 0.55,
            translate: `${interpolate(frame, [0, durationInFrames], b.x)}px ${interpolate(
              frame,
              [0, durationInFrames],
              b.y,
            )}px`,
          }}
        />
      ))}
    </div>
  );
};

const AnimatedWord = ({ text }: { readonly text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", overflow: "hidden", paddingBottom: 20 }}>
      {text.split("").map((letter, i) => {
        const progress = spring({
          frame: frame - 8 - i * 3,
          fps,
          config: { damping: 200 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              translate: `0px ${(1 - progress) * 220}px`,
              opacity: progress,
            }}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
};

const IntroInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <GradientBackground />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily,
          color: "white",
        }}
      >
        <Interactive.Div
          name="Etichetta"
          style={{
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: 10,
            color: colors.cyan,
            opacity: interpolate(frame, [0, 0.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          DEMO · 20 SECONDI
        </Interactive.Div>
        <Interactive.Div
          name="Titolo"
          style={{ fontSize: 220, fontWeight: 800, letterSpacing: -6 }}
        >
          <AnimatedWord text="Remotion" />
        </Interactive.Div>
        <Interactive.Div
          name="Sottotitolo"
          style={{
            fontSize: 56,
            fontWeight: 400,
            opacity: interpolate(frame, [1.4 * fps, 2.2 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [1.4 * fps, 2.2 * fps],
              ["0px 30px", "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          Video creati con il codice
        </Interactive.Div>
      </div>
    </>
  );
};

export const Intro = Interactive.create({
  Component: IntroInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
