import { Easing, interpolate, interpolateColors } from "remotion";

// Tutti i tempi sono in secondi della voce narrante (vedi assets/il-faro/ep1-words.json).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const smooth = Easing.bezier(0.45, 0, 0.55, 1);

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
  [25.3, 900, 1290, 1.2],
  [28.8, 1640, 1290, 1.2],
  [28.83, 1610, 760, 1.55],
  [31.2, 1600, 770, 1.5],
  [34.3, 1350, 1050, 0.55],
  [52.9, 1150, 1250, 0.62],
  [55.4, 1300, 1150, 0.7],
  [55.5, 1610, 760, 1.5],
  [59.8, 1580, 800, 1.4],
  [61.2, 1350, 1150, 0.62],
  [67.5, 1350, 1150, 0.66],
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
  [34, "#070c22", "#152648"],
  [52, "#08130f", "#2f4a33"], // verde malato
  [55.5, "#12070a", "#4d1a20"], // rosso cupo
  [67.5, "#0c0507", "#3a1015"],
];

export const skyColors = (t: number) => {
  const times = skyKeys.map((k) => k[0]);
  return {
    top: interpolateColors(t, times, skyKeys.map((k) => k[1])),
    bottom: interpolateColors(t, times, skyKeys.map((k) => k[2])),
  };
};

// quanto è "notte" (stelle, luna)
export const nightAmount = (t: number) => interpolate(t, [14, 24], [0, 1], clamp);

// --- Barca: arriva da sinistra, si ferma al pontile, riparte
export const boatX = (t: number) =>
  t < 15.8
    ? interpolate(t, [0, 15.8], [-260, 700], { ...clamp, easing: Easing.out(Easing.cubic) })
    : interpolate(t, [17.2, 25.2], [700, -420], { ...clamp, easing: Easing.in(Easing.quad) });

// --- Posa del guardiano nel mondo esterno
export const DOCK_Y = 1390;
export const GALLERY_Y = 742;

export const keeperOutside = (t: number) => {
  if (t < 16) {
    return { x: boatX(t) + 10, y: 1432, facing: 1 as const, walkPhase: null, worried: false, armFront: 8 };
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
  if (t < 25.3) {
    return { x: 900, y: DOCK_Y, facing: (t < 22.3 ? 1 : -1) as 1 | -1, walkPhase: null, worried: t > 21 && t < 22.4, armFront: t > 21 && t < 22.4 ? 40 : 8 };
  }
  if (t < 28.83) {
    const x = interpolate(t, [25.3, 28.8], [900, 1660], clamp);
    return { x, y: 1385, facing: 1 as const, walkPhase: t * 9, worried: false, armFront: 8 };
  }
  if (t < 52.9) {
    return { x: 1590, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: false, armFront: 8 };
  }
  if (t < 55.5) {
    return { x: 1590, y: GALLERY_Y, facing: -1 as const, walkPhase: null, worried: true, armFront: 70, armBack: 50 };
  }
  // scelta: allunga la mano verso la lanterna
  const reach = interpolate(t, [62, 63], [8, 95], clamp);
  return { x: 1625, y: GALLERY_Y, facing: (t < 61.8 ? -1 : 1) as 1 | -1, walkPhase: null, worried: true, armFront: reach };
};

// --- Occhi nella nebbia ("non sono navi")
export const eyesAmount = (t: number) => interpolate(t, [52.9, 54.2], [0, 1], clamp);
export const eyesApproach = (t: number) => interpolate(t, [52.9, 67.5], [0, 1], clamp);
export const fogAmount = (t: number) =>
  t < 45 ? interpolate(t, [25, 30], [0, 0.15], clamp) : interpolate(t, [52.9, 55], [0.25, 0.55], clamp);
