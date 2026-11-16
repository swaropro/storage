import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Keeper } from "./Keeper";

// Piano terra del faro: il guardiano scende le scale e va alla finestra.
// Tempi relativi alla Sequence (parte a 25,2 s).

const INK = "#14161f";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const GroundFloor = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lantern = interpolate(t, [1.0, 2.2], [0, 1], clamp) * (0.85 + Math.sin(t * 17) * 0.08);

  // scende le scale (0–1.3 s), poi cammina verso la finestra (1.3–2.6 s)
  const onStairs = t < 1.3;
  const x = onStairs ? interpolate(t, [0, 1.3], [930, 720], clamp) : interpolate(t, [1.3, 2.6], [720, 420], clamp);
  const y = onStairs ? interpolate(t, [0, 1.3], [1180, 1560], clamp) : 1560;
  const walking = t < 2.6;

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#1d1a1f" }}>
      <defs>
        <radialGradient id="winGlow">
          <stop offset="0" stopColor="#ffbe66" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffbe66" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* pietre */}
      {new Array(40).fill(true).map((_, i) => (
        <rect
          key={i}
          x={(i % 6) * 190 - (Math.floor(i / 6) % 2) * 95}
          y={600 + Math.floor(i / 6) * 150}
          width={180}
          height={140}
          rx={14}
          fill="#27232a"
          stroke="#141216"
          strokeWidth={6}
        />
      ))}
      {/* scale a destra */}
      {new Array(8).fill(true).map((_, i) => (
        <rect key={i} x={760 + i * 34} y={1560 - i * 50} width={340} height={22} fill="#4b3a2c" stroke={INK} strokeWidth={4} />
      ))}
      {/* pavimento */}
      <rect x={0} y={1560} width={1080} height={400} fill="#151217" />
      <line x1={0} y1={1560} x2={1080} y2={1560} stroke={INK} strokeWidth={8} />
      {/* finestra tonda con la lanterna fuori */}
      <circle cx={230} cy={1120} r={140} fill="#070910" stroke={INK} strokeWidth={16} />
      <circle cx={180} cy={1180} r={160} fill="url(#winGlow)" opacity={lantern} />
      <circle cx={180} cy={1180} r={16} fill="#ffcf6a" opacity={lantern} />
      <line x1={90} y1={1120} x2={370} y2={1120} stroke={INK} strokeWidth={8} />
      <line x1={230} y1={980} x2={230} y2={1260} stroke={INK} strokeWidth={8} />
      {/* luce calda che entra dalla finestra sul pavimento */}
      <polygon points={`120,1240 340,1240 520,1560 60,1560`} fill="#ffbe66" opacity={0.12 * lantern} />
      <Keeper x={x} y={y} facing={-1} walkPhase={walking ? t * 10 : null} worried scale={1.5} armFront={walking ? 8 : 40} />
      <rect x={0} y={0} width={1080} height={1920} fill="black" opacity={0.35} />
    </svg>
  );
};
