import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { Keeper } from "./Keeper";

// Stanza del guardiano dentro il faro (inquadratura fissa, coordinate schermo).
// mode "registro": lampada accesa, legge seduto. mode "radio": buio verde, la radio si accende.

const INK = "#14161f";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Room = ({ mode }: { readonly mode: "registro" | "radio" }) => {
  const frame = useCurrentFrame(); // relativo alla Sequence
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const reading = mode === "registro";

  // lampada: tremola su "Poi, più niente" (≈ 9.9 s dall'inizio della scena registro)
  const flicker = reading && t > 9.7 && Math.sin(t * 47) * Math.sin(t * 13) > 0.35;
  const lamp = reading ? (flicker ? 0.25 : 1) : 0;
  const radioOn = !reading && t > 0.15;
  const pulse = radioOn ? 0.6 + 0.4 * Math.abs(Math.sin(t * 9)) : 0;

  // spinta lenta della camera sul volto
  const push = reading
    ? interpolate(t, [9.6, 11.4], [1, 1.55], clamp)
    : interpolate(t, [0, 4.3], [1, 1.12], clamp);
  const wall = reading ? "#3a2a22" : interpolateColors(t, [0, 4], ["#16201b", "#0f1813"]);

  const keeper = reading
    ? { x: 400, y: 1540, facing: 1 as const, sit: true, armFront: 75, armBack: 60, worried: t > 9.7, bob: Math.sin(t * 2) * 1.5 }
    : {
        x: 520,
        y: 1600,
        facing: (t < 3.3 ? 1 : -1) as 1 | -1,
        sit: false,
        armFront: t > 2 ? 60 : 10,
        armBack: t > 2 ? 40 : -10,
        worried: t > 1.2,
        bob: 0,
      };

  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, background: wall }}>
      <defs>
        <radialGradient id="lampLight">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="radioLight">
          <stop offset="0" stopColor="#7dff9a" stopOpacity="0.6" />
          <stop offset="1" stopColor="#7dff9a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${540 - 540 * push + (reading ? -40 : 0) * (push - 1)} ${1250 - 1250 * push}) scale(${push})`}>
        {/* assi del muro */}
        {new Array(12).fill(true).map((_, i) => (
          <line key={i} x1={i * 95} y1={0} x2={i * 95} y2={1700} stroke="black" strokeOpacity={0.18} strokeWidth={4} />
        ))}
        {/* finestra tonda sul mare */}
        <circle cx={230} cy={900} r={150} fill={reading ? "#0b1530" : "#13261c"} stroke={INK} strokeWidth={14} />
        <line x1={80} y1={900} x2={380} y2={900} stroke={INK} strokeWidth={8} />
        <line x1={230} y1={750} x2={230} y2={1050} stroke={INK} strokeWidth={8} />
        {!reading && t > 2.8 ? (
          <g opacity={interpolate(t, [2.8, 3.6], [0, 1], clamp)}>
            {[[150, 960], [270, 990], [320, 940]].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x - 9} cy={y} r={5} fill="#e8ffb0" />
                <circle cx={x + 9} cy={y} r={5} fill="#e8ffb0" />
              </g>
            ))}
          </g>
        ) : null}
        {/* pavimento */}
        <rect x={0} y={1600} width={1080} height={400} fill="#21160f" />
        <line x1={0} y1={1600} x2={1080} y2={1600} stroke={INK} strokeWidth={8} />
        {/* mensola + radio */}
        <rect x={640} y={980} width={340} height={18} fill="#6b4a2f" stroke={INK} strokeWidth={5} />
        <g transform="translate(810 980)">
          <rect x={-90} y={-110} width={180} height={110} rx={12} fill="#3a3326" stroke={INK} strokeWidth={6} />
          <circle cx={-40} cy={-55} r={32} fill="#111" />
          <rect x={10} y={-80} width={60} height={28} rx={4} fill={radioOn ? "#7dff9a" : "#1d2a22"} opacity={radioOn ? pulse : 1} />
          <line x1={60} y1={-110} x2={90} y2={-190} stroke={INK} strokeWidth={6} />
          {radioOn ? <circle cx={0} cy={-60} r={260} fill="url(#radioLight)" opacity={pulse} /> : null}
        </g>
        {/* tavolo, lampada, registro */}
        <rect x={560} y={1360} width={420} height={22} fill="#7b5636" stroke={INK} strokeWidth={5} />
        <rect x={590} y={1382} width={20} height={218} fill="#5a3d26" stroke={INK} strokeWidth={4} />
        <rect x={930} y={1382} width={20} height={218} fill="#5a3d26" stroke={INK} strokeWidth={4} />
        <g transform="translate(880 1360)">
          <line x1={0} y1={0} x2={0} y2={-120} stroke={INK} strokeWidth={8} />
          <path d="M -50 -110 L 50 -110 L 30 -170 L -30 -170 Z" fill="#2f5d4a" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-90} r={300} fill="url(#lampLight)" opacity={lamp} />
        </g>
        {reading ? (
          <g transform="translate(680 1360)">
            <rect x={-70} y={-16} width={140} height={16} fill="#efe6d0" stroke={INK} strokeWidth={4} />
            <rect x={-70} y={-20} width={140} height={6} fill="#7a1f26" />
          </g>
        ) : null}
        {/* sedia */}
        {reading ? (
          <g>
            <rect x={360} y={1480} width={120} height={16} fill="#5a3d26" stroke={INK} strokeWidth={4} />
            <rect x={360} y={1350} width={16} height={250} fill="#5a3d26" stroke={INK} strokeWidth={4} />
            <rect x={464} y={1496} width={14} height={104} fill="#5a3d26" stroke={INK} strokeWidth={4} />
          </g>
        ) : null}
        <Keeper {...keeper} y={reading ? 1480 : keeper.y} scale={1.4} />
        {/* buio generale */}
        <rect x={-400} y={-400} width={1900} height={2800} fill="black" opacity={reading ? 0.35 - lamp * 0.2 : 0.45} />
      </g>
    </svg>
  );
};
