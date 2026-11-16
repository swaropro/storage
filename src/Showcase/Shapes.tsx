import { Circle, Polygon, Star } from "@remotion/shapes";
import {
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily } from "./theme";

const orbitColors = [colors.cyan, colors.pink, colors.yellow, colors.violet];

const Orbit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const count = 10;
  return (
    <>
      {new Array(count).fill(true).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + frame / 40;
        const radius = 330 * enter;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              translate: `${Math.cos(angle) * radius - 28}px ${
                Math.sin(angle) * radius * 0.85 - 28
              }px`,
            }}
          >
            {i % 2 === 0 ? (
              <Circle radius={28} fill={orbitColors[i % 4]} />
            ) : (
              <Polygon
                points={3}
                radius={30}
                fill={orbitColors[i % 4]}
                style={{ rotate: `${frame * 4}deg` }}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const CenterStar = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - 6, fps, config: { damping: 9 } });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Star
        points={8}
        innerRadius={90}
        outerRadius={190}
        cornerRadius={14}
        fill={colors.yellow}
        style={{
          scale: pop,
          rotate: `${interpolate(frame, [0, 130], [0, 180])}deg`,
        }}
      />
    </div>
  );
};

const ShapesInner = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      <Orbit />
      <CenterStar />
      <Interactive.Div
        name="Didascalia"
        style={{
          position: "absolute",
          bottom: 110,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontSize: 64,
          fontWeight: 600,
          color: "white",
          opacity: interpolate(frame, [0.8 * fps, 1.4 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Forme, fisica, movimento
      </Interactive.Div>
    </>
  );
};

export const Shapes = Interactive.create({
  Component: ShapesInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
