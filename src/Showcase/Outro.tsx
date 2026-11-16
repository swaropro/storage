import {
  Easing,
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily } from "./theme";

const Underline = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        height: 18,
        borderRadius: 9,
        background: `linear-gradient(90deg, ${colors.cyan}, ${colors.violet}, ${colors.pink})`,
        width: `${interpolate(frame, [0.9 * fps, 1.7 * fps], [0, 100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        })}%`,
      }}
    />
  );
};

const OutroInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  return (
    <>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: 10,
          }}
        >
          <Interactive.Div
            name="Chiusura"
            style={{
              fontSize: 150,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1.05,
              textAlign: "center",
              opacity: rise,
              translate: `0px ${(1 - rise) * 60}px`,
            }}
          >
            La tua storia
            <br />
            inizia qui.
          </Interactive.Div>
          <Underline />
        </div>
        <Interactive.Div
          name="Firma"
          style={{
            marginTop: 70,
            fontSize: 44,
            color: "#b9b6d3",
            opacity: interpolate(frame, [1.8 * fps, 2.4 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Fatto con Remotion · React + codice
        </Interactive.Div>
      </div>
    </>
  );
};

export const Outro = Interactive.create({
  Component: OutroInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
