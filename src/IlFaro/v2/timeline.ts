import { Easing, interpolate, interpolateColors } from "remotion";

// Ep.1 v3 — tempi in secondi della voce narrante (public/il-faro/ep1-voce-v3.mp3):
//   0–25,2   gancio, regola, arrivo
//   25,2–43,6 NOTTE 12: tempesta, la luce si spegne, il guardiano la riaccende
//   43,6–65,4 NOTTE 39: 2:14, la radio, gli occhi, la scelta

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.45, 0, 0.55, 1);

export const EP1_END = 65.4;
export const N39 = 43.6; // inizio della notte 39 (2:14)

export const lerpKeys = (t: number, keys: readonly (readonly number[])[], i: number) =>
  interpolate(
    t,
    keys.map((k) => k[0]),
    keys.map((k) => k[i]),
    { ...clamp, easing: smooth },
  );

// --- Camera: [secondo, x, y, zoom] = punto del mondo messo a (540, 1250) dello schermo
export const cameraKeys: readonly (readonly number[])[] = [
  [0, 1150, 1250, 0.55],
  [7.2, 1000, 1330, 0.7],
  [15.6, 820, 1360, 1.0],
  [16.4, 870, 1300, 1.4],
  [22.2, 900, 1300, 1.4],
  [23.6, 560, 1380, 0.85],
  [25.2, 600, 1370, 0.8],
  // notte 12: tempesta
  [25.25, 1560, 1120, 0.72],
  [29.6, 1560, 1080, 0.8],
  [31.4, 1560, 1120, 0.74],
  [33.8, 1500, 1260, 1.05],
  [34.6, 1640, 1260, 1.05],
  // 34,6–36,25: scena interna delle scale (Stairwell.tsx)
  [36.25, 1720, 780, 1.45],
  [37.9, 1720, 780, 1.45],
  [39.2, 1660, 900, 1.0],
  [41, 1300, 1180, 0.62],
  [43.5, 1260, 1220, 0.6],
  // notte 39
  [50.8, 1150, 1250, 0.62],
  [53.3, 1300, 1150, 0.7],
  [53.4, 1610, 760, 1.5],
  [57.7, 1580, 800, 1.4],
  [59.1, 1350, 1150, 0.62],
  [EP1_END, 1350, 1150, 0.66],
];

export const camera = (t: number) => ({
  x: lerpKeys(t, cameraKeys, 1),
  y: lerpKeys(t, cameraKeys, 2),
  zoom: lerpKeys(t, cameraKeys, 3),
});

// --- Cielo: il colore segue la tensione
const skyKeys: readonly [number, string, string][] = [
  [0, "#2b1d4a", "#e0794a"], // tramonto
  [15, "#1f1a45", "#b8574a"],
  [24, "#0a1230", "#1f3560"], // notte
  [25.3, "#0d1220", "#2b3548"], // tempesta
  [31.4, "#05070c", "#121822"], // buio
  [37.8, "#0b1020", "#263449"], // la luce torna
  [42.5, "#070c22", "#152648"],
  [50, "#08130f", "#2f4a33"], // verde malato
  [53.4, "#12070a", "#4d1a20"], // rosso cupo
  [EP1_END, "#0c0507", "#3a1015"],
];

export const skyColors = (t: number) => {
  const times = skyKeys.map((k) => k[0]);
  return {
    top: interpolateColors(t, times, skyKeys.map((k) => k[1])),
    bottom: interpolateColors(t, times, skyKeys.map((k) => k[2])),
  };
};

// stelle e luna: nascoste dalle nuvole durante la tempesta
export const nightAmount = (t: number) =>
  interpolate(t, [14, 24], [0, 1], clamp) * interpolate(t, [25, 25.6, 40, 42.5], [1, 0.1, 0.1, 1], clamp);

// pioggia e lampi (notte 12)
export const rainAmount = (t: number) => interpolate(t, [25.3, 26, 39.2, 41], [0, 1, 1, 0], clamp);
export const THUNDER = [27.8, 31.15];
export const flashAmount = (t: number) =>
  THUNDER.reduce((acc, at) => {
    const d = t - at;
    if (d < 0 || d > 0.6) return acc;
    return Math.max(acc, d < 0.08 ? 0.75 : d < 0.16 ? 0.15 : d < 0.24 ? 0.6 : interpolate(d, [0.24, 0.6], [0.6, 0], clamp));
  }, 0);

// --- La lanterna: trema, si spegne col fulmine, torna dopo la leva
export const LEVER_UP_AT = 36.8;
// scena interna: le scale della torre
export const STAIRS_FROM = 34.6;
export const STAIRS_TO = 36.25;
export const lanternOn = (t: number) => {
  if (t >= 29.8 && t < 31.2) return Math.sin(t * 70) * Math.sin(t * 23) > -0.2;
  if (t >= 31.2 && t < 37.25) return false;
  if (t >= 37.25 && t < 37.8) return Math.sin(t * 90) > 0;
  return true;
};
// leva del generatore: 40° = giù (spento), -35° = su (acceso)
export const leverAngle = (t: number) =>
  interpolate(t, [LEVER_UP_AT, LEVER_UP_AT + 0.3], [40, -35], { ...clamp, easing: Easing.out(Easing.quad) });

// --- Barca: arriva da sinistra, si ferma al pontile, riparte
export const boatX = (t: number) =>
  t < 15.8
    ? interpolate(t, [0, 15.8], [-260, 700], { ...clamp, easing: Easing.out(Easing.cubic) })
    : t < 25.25
      ? interpolate(t, [17.2, 25.2], [700, -420], { ...clamp, easing: Easing.in(Easing.quad) })
      : null;

// --- Posa del guardiano nel mondo esterno (null = è dentro il faro)
export const DOCK_Y = 1390;
export const GALLERY_Y = 742;
const BASE_Y = 1385;

export const keeperOutside = (t: number) => {
  if (t < 16) {
    return { x: (boatX(t) ?? 0) + 10, y: 1432, facing: 1 as const, walkPhase: null, worried: false, armFront: 8 };
  }
  if (t < 16.8) {
    const p = interpolate(t, [16, 16.8], [0, 1], clamp);
    return {
      x: interpolate(p, [0, 1], [710, 900]),
      y: interpolate(p, [0, 1], [1432, DOCK_Y]) - Math.sin(p * Math.PI) * 90,
      facing: 1 as const,
      walkPhase: null,
      worried: false,
      armFront: 60,
    };
  }
  if (t < 25.25) {
    return { x: 900, y: DOCK_Y, facing: (t < 22.3 ? 1 : -1) as 1 | -1, walkPhase: null, worried: t > 21 && t < 22.4, armFront: t > 21 && t < 22.4 ? 40 : 8 };
  }
  // NOTTE 12 — alla base del faro, guarda la lanterna nella tempesta
  if (t < 33.85) {
    const shock = t > 31.2;
    return { x: 1460, y: BASE_Y, facing: 1 as const, walkPhase: null, worried: t > 29.8, armFront: shock ? 70 : 8, armBack: shock ? 45 : -8, stance: 8 };
  }
  // corre verso la porta
  if (t < STAIRS_FROM) {
    return { x: interpolate(t, [33.85, STAIRS_FROM], [1460, 1700], clamp), y: BASE_Y, facing: 1 as const, walkPhase: t * 15, worried: true };
  }
  if (t < STAIRS_TO) return null; // dentro la torre: scena delle scale
  // sbuca sul ballatoio e corre alla leva
  if (t < 36.65) {
    return { x: interpolate(t, [STAIRS_TO, 36.6], [1660, 1805], clamp), y: GALLERY_Y, facing: 1 as const, walkPhase: t * 15, worried: true };
  }
  // tira la leva (la mano sale con la leva)
  if (t < 39.1) {
    const arm = interpolate(t, [LEVER_UP_AT, LEVER_UP_AT + 0.3], [30, 60], clamp);
    return { x: 1805, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: t < 37.8, armFront: arm };
  }
  // respira: è andata
  if (t < N39) {
    return { x: 1805, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: false, armFront: 4, armBack: -4, bob: Math.sin(t * 3) * 3 };
  }
  // NOTTE 39
  if (t < 50.8) {
    return { x: 1590, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: false, armFront: 8 };
  }
  if (t < 53.4) {
    return { x: 1590, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: true, armFront: 70, armBack: 50 };
  }
  // scelta: allunga la mano verso la lanterna
  const reach = interpolate(t, [59.9, 60.9], [8, 95], clamp);
  return { x: 1625, y: GALLERY_Y, facing: (t < 59.7 ? -1 : 1) as 1 | -1, walkPhase: null, worried: true, armFront: reach };
};

// --- Occhi nel mare
// notte 12: un solo paio si apre e si richiude ("O almeno… così credi")
// notte 39: tutti, nella nebbia ("non sono navi")
export const eyesAmount = (t: number) => (t >= 41.3 && t < 43.2 ? 1 : interpolate(t, [50.8, 52.1], [0, 1], clamp));
export const eyesApproach = (t: number) => (t < 50 ? 0.3 : interpolate(t, [50.8, EP1_END], [0, 1], clamp));
export const eyesAlive = (t: number, i: number) => {
  if (t < 44) {
    if (i !== 6) return 0;
    return interpolate(t, [41.5, 41.8, 42.6, 42.85], [0, 1, 1, 0], clamp);
  }
  return 1;
};
export const fogAmount = (t: number) =>
  t < 43 ? interpolate(t, [25.3, 27, 39, 42], [0, 0.25, 0.25, 0.12], clamp) : interpolate(t, [50.8, 52.9], [0.25, 0.55], clamp);
