import type React from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { Keeper, type KeeperPose } from "./Keeper";
import { Lever } from "./Lever";
import {
  boatX,
  camera,
  DOCK_Y,
  eyesAlive,
  eyesAmount,
  eyesApproach,
  fogAmount,
  GALLERY_Y,
  keeperOutside,
  leverAngle,
  nightAmount,
  skyColors,
} from "./timeline";

// Mondo laterale (2400 × 1920) visto da una camera che si muove e zooma.

const SEA_Y = 1450;
const INK = "#14161f";
const LH_X = 1700; // faro

const stars = new Array(90).fill(true).map((_, i) => ({
  x: random(`s${i}`) * 2400,
  y: random(`t${i}`) * 1100,
  r: 1.2 + random(`r${i}`) * 2.4,
  p: random(`p${i}`) * 6.28,
}));

const wave = (y: number, amp: number, len: number, shift: number) => {
  let d = `M -600 ${y}`;
  for (let x = -600; x <= 3000; x += 30) d += ` L ${x} ${y + Math.sin((x + shift) / len) * amp}`;
  return `${d} L 3000 2600 L -600 2600 Z`;
};

const Boat = ({ x, t }: { readonly x: number; readonly t: number }) => (
  <g transform={`translate(${x} ${SEA_Y + Math.sin(t * 3) * 5})`}>
    <path d="M -110 -20 L 120 -20 L 92 22 L -86 22 Z" fill="#6b3b24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-100} y={-26} width={212} height={10} fill="#8a4d2f" stroke={INK} strokeWidth={4} />
    <rect x={40} y={-70} width={56} height={44} rx={6} fill="#d8d2c4" stroke={INK} strokeWidth={4} />
    <rect x={-122} y={-34} width={16} height={34} fill="#333" stroke={INK} strokeWidth={3} />
  </g>
);

const Lighthouse = ({ t, lightOn }: { readonly t: number; readonly lightOn: boolean }) => {
  const angle = t * 1.6;
  const sweep = Math.cos(angle);
  const face = Math.max(0, Math.sin(angle));
  const lampY = 690;
  return (
    <g>
      {lightOn ? (
        <>
          <polygon
            points={`${LH_X},${lampY - 10} ${LH_X + sweep * 1500},${lampY - 160 - face * 80} ${LH_X + sweep * 1500},${lampY + 160 + face * 80} ${LH_X},${lampY + 10}`}
            fill="url(#beamGrad)"
            opacity={0.3 + face * 0.4}
          />
          <circle cx={LH_X} cy={lampY} r={120 + face * 110} fill="url(#lampGlow)" />
        </>
      ) : null}
      {/* torre */}
      <polygon points={`${LH_X - 75},760 ${LH_X + 75},760 ${LH_X + 115},1385 ${LH_X - 115},1385`} fill="#e9e4da" stroke={INK} strokeWidth={6} />
      <clipPath id="towerC">
        <polygon points={`${LH_X - 75},760 ${LH_X + 75},760 ${LH_X + 115},1385 ${LH_X - 115},1385`} />
      </clipPath>
      <g clipPath="url(#towerC)" fill="#b3263a">
        <rect x={LH_X - 200} y={860} width={400} height={90} />
        <rect x={LH_X - 200} y={1050} width={400} height={90} />
        <rect x={LH_X - 200} y={1240} width={400} height={90} />
      </g>
      {/* porta e finestra */}
      <rect x={LH_X - 34} y={1270} width={68} height={115} rx={30} fill="#3b2a20" stroke={INK} strokeWidth={5} />
      <rect x={LH_X - 18} y={980} width={36} height={52} rx={8} fill={lightOn ? "#ffd66b" : "#1b1f2b"} stroke={INK} strokeWidth={4} />
      {/* ballatoio */}
      <rect x={LH_X - 125} y={742} width={250} height={20} rx={4} fill="#2b2f3b" stroke={INK} strokeWidth={4} />
      {new Array(9).fill(true).map((_, i) => (
        <line key={i} x1={LH_X - 120 + i * 30} y1={742} x2={LH_X - 120 + i * 30} y2={700} stroke={INK} strokeWidth={4} />
      ))}
      <line x1={LH_X - 124} y1={700} x2={LH_X + 124} y2={700} stroke={INK} strokeWidth={5} />
      {/* lanterna */}
      <rect x={LH_X - 55} y={625} width={110} height={118} rx={8} fill={lightOn ? "#fff1b8" : "#262b38"} stroke={INK} strokeWidth={6} />
      <line x1={LH_X} y1={625} x2={LH_X} y2={743} stroke={INK} strokeWidth={4} opacity={0.5} />
      <path d={`M ${LH_X - 72} 628 L ${LH_X} 560 L ${LH_X + 72} 628 Z`} fill="#2b2f3b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <circle cx={LH_X} cy={552} r={10} fill="#2b2f3b" stroke={INK} strokeWidth={4} />
    </g>
  );
};

const Eyes = ({
  t,
  a,
  p,
  alive,
}: {
  readonly t: number;
  readonly a: number;
  readonly p: number;
  readonly alive?: (i: number) => number;
}) => {
  if (a <= 0) return null;
  return (
    <g opacity={a}>
      {new Array(9).fill(true).map((_, i) => {
        const baseX = -100 + i * 150 + random(`ex${i}`) * 60;
        const x = baseX + p * 260;
        const y = SEA_Y + 25 + random(`ey${i}`) * 150 - p * 20;
        const s = 1.5 + random(`es${i}`) * 0.8 + p * 1.0;
        const blink = Math.sin(t * 2 + i * 1.7) > 0.96 ? 0.15 : 1;
        return (
          <g key={i} opacity={alive ? alive(i) : 1} transform={`translate(${x} ${y}) scale(${s} ${s * blink})`}>
            <circle cx={-16} cy={0} r={9} fill="#e8ffb0" />
            <circle cx={16} cy={0} r={9} fill="#e8ffb0" />
            <circle cx={0} cy={0} r={60} fill="#d9ff8a" opacity={0.12} />
          </g>
        );
      })}
    </g>
  );
};

const Props = ({ t }: { readonly t: number }) => {
  const show = (at: number) => Math.min(1, Math.max(0, (t - at) / 0.25));
  const pop = (at: number) => {
    const s = show(at);
    return { opacity: s, scale: s < 1 ? 0.6 + s * 0.6 : 1 };
  };
  const crate = pop(18.15);
  const radio = pop(19.2);
  const book = pop(20.05);
  return (
    <g>
      <g transform={`translate(985 ${DOCK_Y}) scale(${crate.scale})`} opacity={crate.opacity}>
        <rect x={-34} y={-58} width={68} height={58} fill="#9a6a3c" stroke={INK} strokeWidth={4} />
        <line x1={-34} y1={-29} x2={34} y2={-29} stroke={INK} strokeWidth={3} />
      </g>
      <g transform={`translate(1060 ${DOCK_Y}) scale(${radio.scale})`} opacity={radio.opacity}>
        <rect x={-26} y={-34} width={52} height={34} rx={5} fill="#3a3326" stroke={INK} strokeWidth={4} />
        <circle cx={-10} cy={-17} r={8} fill="#111" />
        <line x1={14} y1={-34} x2={22} y2={-62} stroke={INK} strokeWidth={4} />
      </g>
      <g transform={`translate(1115 ${DOCK_Y}) scale(${book.scale})`} opacity={book.opacity}>
        <rect x={-26} y={-14} width={52} height={14} fill="#7a1f26" stroke={INK} strokeWidth={4} />
        <rect x={-22} y={-26} width={44} height={12} fill="#2c3e6b" stroke={INK} strokeWidth={4} />
      </g>
    </g>
  );
};

// Cosa succede nel mondo, in funzione del tempo: ogni episodio ne passa una sua.
export type WorldScene = {
  readonly camera: (t: number) => { x: number; y: number; zoom: number };
  readonly sky: (t: number) => { top: string; bottom: string };
  readonly night: (t: number) => number;
  readonly keeper: (t: number) => KeeperPose | null;
  readonly boatX: (t: number) => number | null;
  readonly eyes: (t: number) => { amount: number; approach: number; alive?: (i: number) => number };
  readonly fog: (t: number) => number;
  readonly props: boolean;
  readonly darkness?: (t: number) => number; // velo nero sul mondo (gli occhi restano visibili)
  readonly extra?: (t: number) => React.ReactNode; // personaggi/oggetti in più, sopra il buio
};

export const ep1Scene: WorldScene = {
  camera,
  sky: skyColors,
  night: nightAmount,
  keeper: keeperOutside,
  boatX,
  eyes: (t) => ({ amount: eyesAmount(t), approach: eyesApproach(t), alive: (i) => eyesAlive(t, i) }),
  fog: fogAmount,
  props: true,
  extra: (t) => <Lever x={1762} y={GALLERY_Y - 4} angle={leverAngle(t)} />,
};

export const World = ({
  lightOn = true,
  scene = ep1Scene,
}: {
  readonly lightOn?: boolean;
  readonly scene?: WorldScene;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cam = scene.camera(t);
  const sky = scene.sky(t);
  const night = scene.night(t);
  const k = scene.keeper(t);
  const fog = scene.fog(t);
  const eyes = scene.eyes(t);
  const boat = scene.boatX(t);
  const dark = scene.darkness ? scene.darkness(t) : 0;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2c2" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="#fff2c2" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lanternGlow">
          <stop offset="0" stopColor="#ffbe66" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffbe66" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="fogG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b8c9b0" stopOpacity="0" />
          <stop offset="0.6" stopColor="#b8c9b0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#b8c9b0" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#skyG)" />
      <g transform={`translate(${540 - cam.x * cam.zoom} ${1250 - cam.y * cam.zoom}) scale(${cam.zoom})`}>
        {/* stelle e luna (parallasse leggera) */}
        <g opacity={night} transform={`translate(${cam.x * 0.5} ${cam.y * 0.3})`}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x - 600} cy={s.y - 300} r={s.r} fill="white" opacity={0.4 + 0.4 * Math.sin(t * 2 + s.p)} />
          ))}
          <circle cx={-180} cy={80} r={95} fill="#f3eccf" opacity={0.9} />
          <circle cx={-180} cy={80} r={190} fill="#f3eccf" opacity={0.07} />
        </g>
        <Lighthouse t={t} lightOn={lightOn} />
        {/* scoglio */}
        <path
          d="M 1020 1460 Q 1060 1380 1180 1385 L 2050 1380 Q 2180 1390 2230 1470 L 2260 1520 L 1000 1520 Z"
          fill="#2a2d36"
          stroke={INK}
          strokeWidth={6}
        />
        <path d="M 1150 1385 L 2080 1382" stroke="#3e4250" strokeWidth={10} />
        {/* pontile */}
        <rect x={780} y={DOCK_Y} width={330} height={18} fill="#7b5636" stroke={INK} strokeWidth={5} />
        {[800, 880, 960, 1040].map((px) => (
          <rect key={px} x={px} y={DOCK_Y + 18} width={16} height={90} fill="#5a3d26" stroke={INK} strokeWidth={4} />
        ))}
        {scene.props ? <Props t={t} /> : null}
        {boat !== null ? <Boat x={boat} t={t} /> : null}
        {k ? <Keeper {...k} /> : null}
        {/* mare */}
        <path d={wave(SEA_Y, 10, 60, t * 40)} fill="#1c3550" opacity={0.95} />
        <path d={wave(SEA_Y + 70, 14, 90, -t * 55)} fill="#13283f" />
        <path d={wave(SEA_Y + 170, 18, 120, t * 70)} fill="#0b1a2c" />
        {/* nebbia */}
        <rect x={-600} y={1000} width={3600} height={900} fill="url(#fogG)" opacity={fog} />
        {dark > 0 ? <rect x={-2000} y={-2000} width={7000} height={6000} fill="#000" opacity={dark} /> : null}
        {scene.extra ? scene.extra(t) : null}
        <Eyes t={t} a={eyes.amount} p={eyes.approach} alive={eyes.alive} />
      </g>
    </svg>
  );
};
