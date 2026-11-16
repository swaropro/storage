import {
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily } from "./theme";

const Word = ({
  text,
  color,
  delay,
}: {
  readonly text: string;
  readonly color: string;
  readonly delay: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - delay * fps,
    fps,
    config: { damping: 12, stiffness: 160 },
  });
  return (
    <div
      style={{
        fontSize: 190,
        fontWeight: 800,
        letterSpacing: -5,
        lineHeight: 1.05,
        color,
        scale: interpolate(pop, [0, 1], [0.4, 1]),
        opacity: interpolate(pop, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        rotate: `${interpolate(pop, [0, 1], [-8, 0])}deg`,
      }}
    >
      {text}
    </div>
  );
};

const KineticInner = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingLeft: 220,
        fontFamily,
      }}
    >
      <Word text="Testo." color={colors.ink} delay={0.2} />
      <Word text="Movimento." color={colors.violet} delay={0.9} />
      <Word text="Ritmo." color={colors.pink} delay={1.6} />
    </div>
  </>
);

export const Kinetic = Interactive.create({
  Component: KineticInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
