import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// L'antagonista: il barcaiolo. Cappotto lungo, cappello a tesa larga, barba grigia, lanterna.

const INK = "#14161f";
const COAT = "#262b37";
const HAT = "#1a1d26";
const SKIN = "#e9dccb";
const BEARD = "#b9b4ab";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Figura intera nel mondo (origine ai piedi). glint = occhi verdi come quelli nel mare.
export const BoatmanFigure = ({
  x,
  y,
  t,
  glint,
}: {
  readonly x: number;
  readonly y: number;
  readonly t: number;
  readonly glint: number;
}) => {
  const sway = Math.sin(t * 1.3) * 3;
  const flame = 0.85 + Math.sin(t * 17) * 0.08 + Math.sin(t * 7) * 0.07;
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* luce della lanterna */}
      <circle cx={-70} cy={-120} r={260} fill="url(#lanternGlow)" opacity={flame} />
      <ellipse cx={0} cy={2} rx={46} ry={8} fill="black" opacity={0.4} />
      {/* gambe */}
      <line x1={-10} y1={-60} x2={-14} y2={0} stroke={INK} strokeWidth={11} strokeLinecap="round" />
      <line x1={10} y1={-60} x2={14} y2={0} stroke={INK} strokeWidth={11} strokeLinecap="round" />
      {/* cappotto */}
      <path d="M -26 -190 Q 0 -198 26 -190 L 40 -40 Q 0 -30 -40 -40 Z" fill={COAT} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={0} y1={-188} x2={2} y2={-38} stroke="#1b1f29" strokeWidth={4} />
      {/* braccio con lanterna */}
      <line x1={-18} y1={-176} x2={-62} y2={-128 + sway} stroke={COAT} strokeWidth={15} strokeLinecap="round" />
      <g transform={`translate(-66 ${-120 + sway})`}>
        <line x1={0} y1={-14} x2={0} y2={0} stroke={INK} strokeWidth={4} />
        <rect x={-15} y={0} width={30} height={38} rx={5} fill="#ffcf6a" stroke={INK} strokeWidth={4} opacity={flame} />
        <rect x={-18} y={-4} width={36} height={8} rx={3} fill={INK} />
      </g>
      {/* testa */}
      <circle cx={0} cy={-220} r={28} fill={SKIN} stroke={INK} strokeWidth={4} />
      <path d="M -26 -214 Q -22 -176 0 -170 Q 22 -176 26 -214 Q 0 -200 -26 -214 Z" fill={BEARD} stroke={INK} strokeWidth={3} />
      <path d="M -10 -204 Q 0 -198 10 -204" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      {/* occhi */}
      <circle cx={-9} cy={-224} r={4} fill={glint > 0.5 ? "#d9ff8a" : INK} />
      <circle cx={9} cy={-224} r={4} fill={glint > 0.5 ? "#d9ff8a" : INK} />
      {glint > 0 ? <circle cx={0} cy={-224} r={40} fill="#d9ff8a" opacity={0.25 * glint} /> : null}
      {/* cappello */}
      <ellipse cx={0} cy={-242} rx={62} ry={12} fill={HAT} stroke={INK} strokeWidth={4} />
      <path d="M -30 -244 L -26 -282 Q 0 -292 26 -282 L 30 -244 Z" fill={HAT} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

// Primo piano dalla finestra (coordinate schermo, tempi relativi alla Sequence che parte a 29 s)
export const BoatmanCloseUp = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const push = interpolate(t, [0, 7], [1, 1.12], clamp);
  const smile = interpolate(t, [2.4, 3.2], [0, 1], clamp); // "Sorride."
  const flame = 0.85 + Math.sin(t * 17) * 0.08;
  const appear = interpolate(t, [0, 0.5], [0, 1], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#160f0b" }}>
      <defs>
        <radialGradient id="faceLight" cx="0.35" cy="0.8" r="0.8">
          <stop offset="0" stopColor="#ffb85c" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffb85c" stopOpacity="0" />
        </radialGradient>
        <clipPath id="porthole">
          <circle cx={540} cy={1050} r={400} />
        </clipPath>
      </defs>
      <g transform={`translate(${540 - 540 * push} ${1050 - 1050 * push}) scale(${push})`}>
        {/* muro di legno */}
        {new Array(12).fill(true).map((_, i) => (
          <line key={i} x1={i * 95} y1={0} x2={i * 95} y2={1920} stroke="black" strokeOpacity={0.25} strokeWidth={5} />
        ))}
        {/* vetro e notte fuori */}
        <circle cx={540} cy={1050} r={400} fill="#05070d" />
        <g clipPath="url(#porthole)" opacity={appear}>
          <circle cx={430} cy={1350} r={520} fill="url(#faceLight)" opacity={flame} />
          {/* spalle */}
          <path d="M 250 1500 Q 540 1290 830 1500 L 830 1500 Z" fill="#262b37" stroke={INK} strokeWidth={8} />
          {/* testa */}
          <circle cx={540} cy={1060} r={190} fill="#e9dccb" stroke={INK} strokeWidth={9} />
          <path d="M 360 1080 Q 380 1330 540 1360 Q 700 1330 720 1080 Q 540 1160 360 1080 Z" fill="#b9b4ab" stroke={INK} strokeWidth={8} />
          {/* sorriso che si allarga */}
          <path
            d={`M ${470 - smile * 50} 1150 Q 540 ${1165 + smile * 50} ${610 + smile * 50} 1150`}
            fill={smile > 0.2 ? "#2a0d10" : "none"}
            stroke={INK}
            strokeWidth={8}
            strokeLinecap="round"
          />
          {smile > 0.3 ? (
            <path
              d={`M ${445} 1158 L ${635} 1158`}
              stroke="#f1ead8"
              strokeWidth={10 * smile}
              opacity={smile}
            />
          ) : null}
          {/* occhi */}
          <circle cx={470} cy={1030} r={14} fill={INK} />
          <circle cx={610} cy={1030} r={14} fill={INK} />
          <path d="M 440 995 L 500 1005" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          <path d="M 640 995 L 580 1005" stroke={INK} strokeWidth={8} strokeLinecap="round" />
          {/* cappello */}
          <ellipse cx={540} cy={910} rx={330} ry={52} fill="#1a1d26" stroke={INK} strokeWidth={8} />
          <path d="M 400 905 L 420 740 Q 540 705 660 740 L 680 905 Z" fill="#1a1d26" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
          {/* gocce sul vetro */}
          {[[300, 820], [760, 900], [680, 1300], [360, 1240], [600, 760]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y + ((t * 40 + i * 50) % 120)} r={6} fill="white" opacity={0.18} />
          ))}
        </g>
        {/* cornice dell'oblò */}
        <circle cx={540} cy={1050} r={400} fill="none" stroke="#3b3f4a" strokeWidth={46} />
        <circle cx={540} cy={1050} r={400} fill="none" stroke={INK} strokeWidth={10} />
        {/* il guardiano di spalle, in primo piano */}
        <g transform="translate(170 1880) scale(2.6)">
          <circle cx={0} cy={-80} r={34} fill="#f4efe6" stroke={INK} strokeWidth={4} />
          <path d="M -34 -82 Q -33 -122 0 -122 Q 33 -122 34 -82 Z" fill="#a3262f" stroke={INK} strokeWidth={4} />
          <path d="M -60 0 Q -50 -50 0 -48 Q 50 -50 60 0 Z" fill="#f2c230" stroke={INK} strokeWidth={4} />
        </g>
      </g>
    </svg>
  );
};
