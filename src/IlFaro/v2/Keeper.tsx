// Il guardiano: omino stilizzato con impermeabile giallo e berretto.
// Origine = punto tra i piedi. Altezza ~190 px a scala 1.

export type KeeperPose = {
  readonly x: number;
  readonly y: number;
  readonly facing?: 1 | -1;
  readonly walkPhase?: number | null; // radianti; null = fermo
  readonly sit?: boolean;
  readonly armFront?: number; // gradi, 0 = giù lungo il corpo, 90 = in avanti
  readonly armBack?: number;
  readonly worried?: boolean;
  readonly scale?: number;
  readonly bob?: number; // piccolo respiro / ondeggio
  readonly stance?: number; // gambe divaricate da fermo (gradi)
  readonly wave?: number | null; // braccio che saluta, alzato di lato (gradi, es. -140)
};

const INK = "#14161f";
const COAT = "#f2c230";
const COAT_SHADE = "#d9a516";
const HAT = "#a3262f";
const SKIN = "#f4efe6";

const limb = (x: number, y: number, len: number, deg: number) => {
  const r = (deg * Math.PI) / 180;
  return { x2: x + Math.sin(r) * len, y2: y + Math.cos(r) * len };
};

export const Keeper = ({
  x,
  y,
  facing = 1,
  walkPhase = null,
  sit = false,
  armFront = 8,
  armBack = -8,
  worried = false,
  scale = 1,
  bob = 0,
  stance = 0,
  wave = null,
}: KeeperPose) => {
  const walking = walkPhase !== null;
  const swing = walking ? Math.sin(walkPhase) * 28 : 0;
  const lift = walking ? Math.abs(Math.sin(walkPhase)) * 5 : 0;
  const hipY = sit ? -62 : -62;
  const legA = sit ? 80 : swing + stance;
  const legB = sit ? 80 : -swing - stance;
  const armF = walking ? -swing * 0.8 + 6 : armFront;
  const armB = walking ? swing * 0.8 - 6 : armBack;

  const leg = (deg: number) => {
    if (sit) {
      // coscia in avanti, stinco giù
      const knee = limb(0, hipY, 34, 90);
      return (
        <polyline
          points={`0,${hipY} ${knee.x2},${knee.y2} ${knee.x2},${knee.y2 + 40}`}
          fill="none"
          stroke={INK}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }
    const p = limb(0, hipY, 62, deg);
    return <line x1={0} y1={hipY} x2={p.x2} y2={p.y2} stroke={INK} strokeWidth={9} strokeLinecap="round" />;
  };

  const arm = (deg: number, front: boolean) => {
    const sx = front ? 6 : -4;
    const p = limb(sx, -128, 52, deg);
    return (
      <g>
        <line x1={sx} y1={-128} x2={p.x2} y2={p.y2} stroke={front ? COAT : COAT_SHADE} strokeWidth={13} strokeLinecap="round" />
        <line x1={sx} y1={-128} x2={p.x2} y2={p.y2} stroke={INK} strokeWidth={13} strokeLinecap="round" strokeOpacity={0.15} />
        <circle cx={p.x2} cy={p.y2} r={7} fill={SKIN} stroke={INK} strokeWidth={3} />
      </g>
    );
  };

  return (
    <g transform={`translate(${x} ${y - lift + bob}) scale(${facing * scale} ${scale})`}>
      {/* ombra */}
      <ellipse cx={0} cy={2} rx={36} ry={6} fill="black" opacity={0.25} />
      {wave === null ? arm(armB, false) : null}
      {leg(legB)}
      {leg(legA)}
      {/* impermeabile */}
      <path
        d="M -20 -140 Q 0 -148 20 -140 L 30 -58 Q 0 -50 -30 -58 Z"
        fill={COAT}
        stroke={INK}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      <line x1={2} y1={-138} x2={4} y2={-58} stroke={COAT_SHADE} strokeWidth={4} />
      {/* testa */}
      <circle cx={0} cy={-170} r={27} fill={SKIN} stroke={INK} strokeWidth={4} />
      {/* berretto */}
      <path d="M -27 -172 Q -26 -204 0 -204 Q 26 -204 27 -172 Z" fill={HAT} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-29} y={-178} width={58} height={10} rx={5} fill={HAT} stroke={INK} strokeWidth={3} />
      <circle cx={0} cy={-207} r={6} fill={HAT} stroke={INK} strokeWidth={3} />
      {/* occhi (guardano nella direzione di marcia) */}
      <circle cx={8} cy={-163} r={3.6} fill={INK} />
      <circle cx={20} cy={-163} r={3.6} fill={INK} />
      {worried ? (
        <>
          <line x1={3} y1={-174} x2={12} y2={-171} stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <line x1={25} y1={-174} x2={16} y2={-171} stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M 9 -150 Q 14 -154 19 -150" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <path d="M 9 -152 Q 14 -149 19 -152" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
      )}
      {arm(armF, true)}
      {wave !== null ? (
        (() => {
          const p = limb(-8, -132, 78, wave);
          return (
            <g>
              <line x1={-8} y1={-132} x2={p.x2} y2={p.y2} stroke={COAT} strokeWidth={13} strokeLinecap="round" />
              <line x1={-8} y1={-132} x2={p.x2} y2={p.y2} stroke={INK} strokeWidth={13} strokeLinecap="round" strokeOpacity={0.12} />
              <circle cx={p.x2} cy={p.y2} r={9} fill={SKIN} stroke={INK} strokeWidth={3} />
            </g>
          );
        })()
      ) : null}
    </g>
  );
};
