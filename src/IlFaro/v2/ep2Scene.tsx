import { Easing, interpolate, interpolateColors } from "remotion";
import { BoatmanFigure } from "./Boatman";
import { GALLERY_Y, lerpKeys } from "./timeline";
import type { WorldScene } from "./World";

// Ep.2 "Spenta" — tempi in secondi del video (la voce parte a 2 s).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LH_X = 1700;
export const LEVER_AT = 4.5;

const cameraKeys: readonly (readonly number[])[] = [
  [0, 1720, 760, 1.5],
  [4.8, 1720, 760, 1.5],
  [9, 1300, 1150, 0.62],
  [16.6, 1250, 1180, 0.62],
  [18.6, 1600, 790, 1.3],
  [19.1, 1600, 790, 1.3],
  [19.15, 1640, 1290, 1.3],
  [25.2, 1670, 1290, 1.42],
  [36, 1560, 1250, 1.2],
  [39.5, 1380, 1200, 0.7],
  [48, 1360, 1200, 0.72],
];

const skyKeys: readonly [number, string, string][] = [
  [0, "#12070a", "#4d1a20"],
  [4.5, "#12070a", "#4d1a20"],
  [5.2, "#030305", "#0b0b12"],
  [19, "#04050a", "#10141f"],
  [36, "#06040a", "#22101a"],
  [48, "#0a0306", "#3a1015"],
];

// l'occhio i-esimo: acceso → spento (una alla volta) → si riaccende
const eyeAlive = (t: number, i: number) =>
  interpolate(t, [13.9 + i * 0.22, 14.05 + i * 0.22], [1, 0], clamp) +
  interpolate(t, [38 + i * 0.13, 38.15 + i * 0.13], [0, 1], clamp);

const Lever = ({ t }: { readonly t: number }) => {
  const angle = interpolate(t, [LEVER_AT, LEVER_AT + 0.35], [-35, 40], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <g transform={`translate(${LH_X + 62} ${GALLERY_Y - 4})`}>
      <rect x={-16} y={-40} width={32} height={40} rx={4} fill="#3a3f4c" stroke="#14161f" strokeWidth={4} />
      <g transform={`rotate(${angle} 0 -30)`}>
        <line x1={0} y1={-30} x2={0} y2={-90} stroke="#14161f" strokeWidth={8} strokeLinecap="round" />
        <circle cx={0} cy={-94} r={11} fill="#c22a3a" stroke="#14161f" strokeWidth={4} />
      </g>
    </g>
  );
};

export const ep2Scene: WorldScene = {
  camera: (t) => ({ x: lerpKeys(t, cameraKeys, 1), y: lerpKeys(t, cameraKeys, 2), zoom: lerpKeys(t, cameraKeys, 3) }),
  sky: (t) => {
    const times = skyKeys.map((k) => k[0]);
    return {
      top: interpolateColors(t, times, skyKeys.map((k) => k[1])),
      bottom: interpolateColors(t, times, skyKeys.map((k) => k[2])),
    };
  },
  night: (t) => interpolate(t, [4.5, 6], [0.3, 0.7], clamp),
  keeper: (t) => {
    if (t >= 19.15) return null; // è sceso dentro il faro
    // sul lato destro del ballatoio, mano sulla leva
    if (t < LEVER_AT) return { x: 1805, y: GALLERY_Y, facing: -1, armFront: 55, worried: true };
    const pull = interpolate(t, [LEVER_AT, LEVER_AT + 0.35], [55, 25], clamp);
    if (t < 6) return { x: 1805, y: GALLERY_Y, facing: -1, armFront: pull, worried: true };
    // guarda il mare; su "Ma sei vivo" abbassa le braccia e respira
    const sigh = t > 17.8 ? Math.sin((t - 17.8) * 3) * 3 : 0;
    return { x: 1600, y: GALLERY_Y, facing: -1, worried: t < 17.8, armFront: t < 17.8 ? 50 : 4, armBack: t < 17.8 ? 30 : -4, bob: sigh };
  },
  boatX: () => null,
  eyes: (t) => ({
    amount: 1,
    approach: interpolate(t, [0, 10], [0.6, 0.72], clamp), // "si fermano anche loro"
    alive: (i) => eyeAlive(t, i),
  }),
  fog: (t) => interpolate(t, [0, 9, 36, 40], [0.45, 0.2, 0.2, 0.5], clamp),
  props: true,
  darkness: (t) =>
    t < LEVER_AT ? 0 : t < 19.15 ? interpolate(t, [LEVER_AT, LEVER_AT + 0.6], [0, 0.55], clamp) : t < 36 ? 0.45 : 0.4,
  extra: (t) => (
    <>
      <Lever t={t} />
      {/* alla porta: prima solo la luce della lanterna, poi il barcaiolo */}
      {t >= 19.15 && t < 36 ? (
        <circle cx={LH_X - 150} cy={1300} r={200} fill="url(#lanternGlow)" opacity={interpolate(t, [19.6, 20.4], [0, 0.9 + Math.sin(t * 17) * 0.08], clamp)} />
      ) : null}
      {t >= 36 ? <BoatmanFigure x={LH_X - 125} y={1385} t={t} glint={interpolate(t, [38.4, 38.8], [0, 1], clamp)} /> : null}
    </>
  ),
};

export const ep2LightOn = (t: number) => t < LEVER_AT || (t < LEVER_AT + 0.4 && Math.sin(t * 80) > 0);
