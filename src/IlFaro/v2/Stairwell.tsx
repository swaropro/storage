import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Keeper } from "./Keeper";

// Interno della torre: il guardiano sale di corsa le rampe a zig-zag, la camera lo segue verso l'alto.
// Tempi relativi alla Sequence (≈1,7 s).

const INK = "#14161f";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// rampe: da (x1,y1) a (x2,y2), alternando direzione
const FLIGHTS = [
  { x1: 170, y1: 2900, x2: 880, y2: 2550 },
  { x1: 880, y1: 2550, x2: 200, y2: 2200 },
  { x1: 200, y1: 2200, x2: 880, y2: 1850 },
  { x1: 880, y1: 1850, x2: 200, y2: 1500 },
  { x1: 200, y1: 1500, x2: 880, y2: 1150 },
];

// percorso del guardiano: [secondo, x, y]
const PATH: readonly [number, number, number][] = [
  [0, 170, 2900],
  [0.5, 880, 2550],
  [0.56, 880, 2550],
  [1.06, 200, 2200],
  [1.12, 200, 2200],
  [1.65, 880, 1850],
];

const Flight = ({ x1, y1, x2, y2 }: (typeof FLIGHTS)[number]) => {
  const steps = 12;
  const dir = Math.sign(x2 - x1);
  let d = `M ${x1} ${y1 + 26}`;
  for (let i = 0; i < steps; i++) {
    const xa = x1 + ((x2 - x1) * i) / steps;
    const xb = x1 + ((x2 - x1) * (i + 1)) / steps;
    const yb = y1 + ((y2 - y1) * (i + 1)) / steps;
    d += ` L ${xa} ${yb} L ${xb} ${yb}`;
  }
  d += ` L ${x2} ${y2 + 60} L ${x1} ${y1 + 86} Z`;
  return (
    <g>
      <path d={d} fill="#5a4330" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {/* corrimano */}
      <line x1={x1} y1={y1 - 90} x2={x2} y2={y2 - 90} stroke="#2b2f3b" strokeWidth={8} strokeLinecap="round" />
      {new Array(5).fill(true).map((_, i) => {
        const x = x1 + ((x2 - x1) * (i + 0.5)) / 5;
        const y = y1 + ((y2 - y1) * (i + 0.5)) / 5;
        return <line key={i} x1={x} y1={y - 90} x2={x} y2={y} stroke="#2b2f3b" strokeWidth={5} />;
      })}
      {/* pianerottolo */}
      <rect x={dir > 0 ? x2 - 10 : x2 - 110} y={y2} width={120} height={22} fill="#5a4330" stroke={INK} strokeWidth={5} />
    </g>
  );
};

export const Stairwell = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const times = PATH.map((p) => p[0]);
  const x = interpolate(t, times, PATH.map((p) => p[1]), clamp);
  const y = interpolate(t, times, PATH.map((p) => p[2]), clamp);
  const facing = (t < 0.53 || (t >= 1.09 && t < 1.7) ? 1 : -1) as 1 | -1;
  // camera: segue il guardiano verso l'alto
  const camY = 1300 - y;
  const flash = (t > 0.8 && t < 0.88) || (t > 0.96 && t < 1.02) ? 1 : 0;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#141218" }}>
      <g transform={`translate(0 ${camY})`}>
        {/* muro di pietra */}
        {new Array(26).fill(true).map((_, row) =>
          new Array(6).fill(true).map((__, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * 190 - (row % 2) * 95}
              y={900 + row * 90}
              width={182}
              height={82}
              rx={10}
              fill="#211e26"
              stroke="#120f15"
              strokeWidth={5}
            />
          )),
        )}
        {/* feritoie: da qui entra la luce dei lampi */}
        {[2700, 2350, 2000, 1650, 1300].map((wy, i) => (
          <g key={wy}>
            <rect x={i % 2 ? 120 : 900} y={wy - 260} width={44} height={120} rx={20} fill={flash ? "#dfe8ff" : "#1b2740"} stroke={INK} strokeWidth={6} />
            {flash ? (
              <polygon
                points={`${i % 2 ? 142 : 922},${wy - 200} ${i % 2 ? 520 : 540},${wy + 40} ${i % 2 ? 300 : 760},${wy + 80}`}
                fill="#dfe8ff"
                opacity={0.18}
              />
            ) : null}
          </g>
        ))}
        {FLIGHTS.map((f, i) => (
          <Flight key={i} {...f} />
        ))}
        <Keeper x={x} y={y} facing={facing} walkPhase={t * 16} worried scale={1.35} />
      </g>
      {/* pareti curve della torre, ai lati */}
      <rect x={0} y={0} width={70} height={1920} fill="#0c0b0f" />
      <rect x={1010} y={0} width={70} height={1920} fill="#0c0b0f" />
      <rect x={0} y={0} width={1080} height={1920} fill="black" opacity={0.25} />
    </svg>
  );
};
