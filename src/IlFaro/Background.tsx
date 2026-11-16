import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { palette } from "./theme";

const stars = new Array(70).fill(true).map((_, i) => ({
  x: random(`sx${i}`) * 1080,
  y: random(`sy${i}`) * 1000,
  r: 1 + random(`sr${i}`) * 2.2,
  phase: random(`sp${i}`) * Math.PI * 2,
}));

const Sky = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070f" />
          <stop offset="0.55" stopColor="#0d1830" />
          <stop offset="1" stopColor="#1a2b4a" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="white"
          opacity={0.35 + 0.35 * Math.sin(frame / 18 + s.phase)}
        />
      ))}
    </svg>
  );
};

const wavePath = (y: number, amp: number, len: number, shift: number) => {
  let d = `M -200 ${y}`;
  for (let x = -200; x <= 1300; x += 20) {
    d += ` L ${x} ${y + Math.sin((x + shift) / len) * amp}`;
  }
  return `${d} L 1300 1920 L -200 1920 Z`;
};

const Sea = () => {
  const frame = useCurrentFrame();
  const layers = [
    { y: 1330, amp: 10, len: 70, speed: 1.2, color: "#0f2240" },
    { y: 1420, amp: 14, len: 90, speed: -1.6, color: "#0b1a33" },
    { y: 1540, amp: 18, len: 110, speed: 2.1, color: "#081327" },
    { y: 1680, amp: 22, len: 130, speed: -2.6, color: "#050d1c" },
  ];
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0 }}
    >
      {layers.map((l, i) => (
        <path
          key={i}
          d={wavePath(l.y, l.amp, l.len, frame * l.speed)}
          fill={l.color}
        />
      ))}
    </svg>
  );
};

// Faro: torre a strisce, lanterna che brilla e fascio che ruota.
const Lighthouse = ({ lightOn }: { readonly lightOn: boolean }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const angle = (frame / fps) * 1.6; // radianti al secondo
  const sweep = Math.cos(angle); // -1..1, finto 3D
  const facing = Math.max(0, Math.sin(angle)); // quanto il fascio "guarda" verso di noi
  const lampX = 760;
  const lampY = 860;
  const beamLen = 1200;
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0 }}
    >
      <defs>
        <linearGradient
          id="beam"
          x1={lampX}
          y1={lampY}
          x2={lampX + sweep * beamLen}
          y2={lampY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={palette.light} stopOpacity="0.85" />
          <stop offset="1" stopColor={palette.light} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="glow">
          <stop offset="0" stopColor={palette.light} stopOpacity="0.9" />
          <stop offset="1" stopColor={palette.light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="tower" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9cfd8" />
          <stop offset="0.6" stopColor="#8d96a6" />
          <stop offset="1" stopColor="#4b5466" />
        </linearGradient>
        <clipPath id="towerClip">
          <polygon points="700,930 820,930 860,1400 660,1400" />
        </clipPath>
      </defs>
      <g transform="translate(150 0)">
      {lightOn ? (
        <>
          <polygon
            points={`${lampX},${lampY - 8} ${lampX + sweep * beamLen},${
              lampY - 120 - facing * 60
            } ${lampX + sweep * beamLen},${lampY + 120 + facing * 60} ${lampX},${
              lampY + 8
            }`}
            fill="url(#beam)"
            opacity={0.35 + facing * 0.4}
          />
          <circle
            cx={lampX}
            cy={lampY}
            r={110 + facing * 90}
            fill="url(#glow)"
            opacity={0.6 + facing * 0.4}
          />
        </>
      ) : null}

      {/* scoglio */}
      <path
        d="M 560 1420 Q 600 1360 680 1380 L 860 1370 Q 960 1380 1000 1440 L 1010 1480 L 540 1480 Z"
        fill="#11151f"
      />
      {/* torre */}
      <polygon points="700,930 820,930 860,1400 660,1400" fill="url(#tower)" />
      <g clipPath="url(#towerClip)" fill="#b3263a" opacity={0.92}>
        <rect x={600} y={1000} width={320} height={70} />
        <rect x={600} y={1150} width={320} height={70} />
        <rect x={600} y={1300} width={320} height={70} />
      </g>
      {/* ballatoio e lanterna */}
      <rect x={680} y={918} width={160} height={16} rx={4} fill="#2a2f3b" />
      <rect
        x={712}
        y={830}
        width={96}
        height={88}
        rx={6}
        fill={lightOn ? "#fff3c4" : "#2b3140"}
        stroke="#2a2f3b"
        strokeWidth={8}
      />
      <path d="M 700 832 L 760 780 L 820 832 Z" fill="#2a2f3b" />
      {/* finestrella */}
      <rect x={748} y={1090} width={22} height={34} rx={4} fill={lightOn ? "#ffd66b" : "#1d2230"} />
      </g>
    </svg>
  );
};

export const Background = ({ lightOn = true }: { readonly lightOn?: boolean }) => (
  <>
    <Sky />
    <Lighthouse lightOn={lightOn} />
    <Sea />
  </>
);
