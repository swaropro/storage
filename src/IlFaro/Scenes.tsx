import type React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily, palette, textShadow } from "./theme";

const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Entrata "a molla" dopo `delay` secondi.
const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay * fps, fps, config: { damping } });
};

const Big = ({
  children,
  color,
  size,
  delay,
  style,
}: {
  readonly children: React.ReactNode;
  readonly color: string;
  readonly size: number;
  readonly delay: number;
  readonly style?: React.CSSProperties;
}) => {
  const pop = usePop(delay);
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        color,
        letterSpacing: -2,
        textShadow,
        scale: interpolate(pop, [0, 1], [0.3, 1]),
        opacity: interpolate(pop, [0, 0.25], [0, 1], clamp),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Column = ({ children, top = 380 }: { readonly children: React.ReactNode; readonly top?: number }) => (
  <AbsoluteFill
    style={{
      top,
      bottom: "auto",
      height: "auto",
      alignItems: "center",
      gap: 10,
    }}
  >
    {children}
  </AbsoluteFill>
);

// 1. GANCIO
export const Gancio = () => (
  <Column top={400}>
    <Big color={palette.green} size={170} delay={0.2}>
      €1.000.000
    </Big>
    <Big color={palette.gold} size={110} delay={1.4}>
      40 NOTTI
    </Big>
  </Column>
);

// 2. REGOLA: contratto con firma che si disegna e timbro "MAI"
export const Regola = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = usePop(0.1, 200);
  const stamp = usePop(7.6, 9);
  const sign = interpolate(frame, [4.5 * fps, 6.2 * fps], [1, 0], {
    ...clamp,
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const row = (text: string, delay: number, strong = false) => (
    <div
      style={{
        fontSize: strong ? 46 : 40,
        fontWeight: strong ? 800 : 400,
        color: strong ? "#8b1020" : "#2b2418",
        opacity: interpolate(frame, [delay * fps, (delay + 0.4) * fps], [0, 1], clamp),
      }}
    >
      {text}
    </div>
  );
  return (
    <Column top={360}>
      <div
        style={{
          position: "relative",
          width: 760,
          padding: "50px 60px",
          background: palette.paper,
          borderRadius: 10,
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          fontFamily,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          rotate: "-2deg",
          translate: `0px ${(1 - card) * 900}px`,
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 800, color: "#2b2418", letterSpacing: 6 }}>
          CONTRATTO
        </div>
        {row("Durata: 40 notti", 0.8)}
        {row("Compenso: € 1.000.000", 1.4)}
        {row("Regola n. 1:", 3.2, true)}
        {row("la luce non si spegne.", 3.6, true)}
        <svg width={360} height={110} style={{ marginTop: 10 }}>
          <path
            d="M 10 70 C 40 10, 70 110, 100 50 S 150 20, 170 70 S 230 90, 250 40 S 320 60, 350 55"
            fill="none"
            stroke="#1c2a6b"
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={sign}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 60,
            border: `10px solid ${palette.red}`,
            color: palette.red,
            borderRadius: 14,
            padding: "4px 30px",
            fontSize: 110,
            fontWeight: 800,
            rotate: "-14deg",
            opacity: stamp,
            scale: interpolate(stamp, [0, 1], [2.2, 1]),
          }}
        >
          MAI
        </div>
      </div>
    </Column>
  );
};

// 3. ARRIVO: la barca se ne va, compaiono gli oggetti
const Chip = ({
  label,
  delay,
  color,
  crossed = false,
}: {
  readonly label: string;
  readonly delay: number;
  readonly color: string;
  readonly crossed?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(delay, 14);
  const strike = interpolate(frame, [(delay + 0.5) * fps, (delay + 0.9) * fps], [0, 100], clamp);
  return (
    <div
      style={{
        position: "relative",
        fontFamily,
        fontWeight: 800,
        fontSize: 56,
        color,
        padding: "14px 34px",
        border: `5px solid ${color}`,
        borderRadius: 16,
        background: "rgba(0,0,0,0.55)",
        scale: pop,
      }}
    >
      {label}
      {crossed ? (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: "50%",
            height: 8,
            width: `calc(${strike}% - 40px)`,
            background: palette.red,
            rotate: "-6deg",
          }}
        />
      ) : null}
    </div>
  );
};

const Boat = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0, 9 * fps], [0, 1], clamp);
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0 }}
    >
      <g
        transform={`translate(${interpolate(t, [0, 1], [520, 60])} ${
          1395 + Math.sin(frame / (fps / 3)) * 6
        }) scale(${interpolate(t, [0, 1], [1.4, 0.5])})`}
      >
        <path d="M -70 0 L 70 0 L 50 26 L -50 26 Z" fill="#1b2233" />
        <rect x={-20} y={-34} width={44} height={34} rx={4} fill="#2c364d" />
        <circle cx={14} cy={-20} r={5} fill={palette.light} />
      </g>
    </svg>
  );
};

export const Arrivo = () => (
  <>
    <Boat />
    <Column top={420}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, justifyContent: "center", width: 820 }}>
        <Chip label="VIVERI" delay={2.4} color={palette.white} />
        <Chip label="RADIO" delay={2.9} color={palette.white} />
        <Chip label="REGISTRO" delay={3.4} color={palette.gold} />
        <Chip label="TELEFONO" delay={4.6} color={palette.red} crossed />
      </div>
    </Column>
  </>
);

// 4. ROUTINE: vento, notti che scorrono, compenso a notte
const Wind = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {new Array(18).fill(true).map((_, i) => {
        const y = 300 + random(`wy${i}`) * 1000;
        const speed = 14 + random(`ws${i}`) * 18;
        const x = ((frame * speed + random(`wx${i}`) * 1600) % 1600) - 300;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x + 160}
            y2={y - 12}
            stroke="white"
            strokeOpacity={0.18}
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export const Routine = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const second = frame >= 2.5 * fps;
  return (
    <>
      <Wind />
      <Column top={420}>
        {second ? (
          <Big key="11" color={palette.gold} size={150} delay={2.5}>
            NOTTE 11
          </Big>
        ) : (
          <Big key="3" color={palette.gold} size={150} delay={0.2}>
            NOTTE 3
          </Big>
        )}
        <Big color={palette.green} size={84} delay={4.2}>
          €25.000 / NOTTE
        </Big>
      </Column>
    </>
  );
};

// 5. REGISTRO: sei nomi, tutti fermi alla notte 39
const keepers = ["M. Ferri", "A. Costa", "G. Bellini", "L. Marchetti", "S. Rinaldi", "P. Greco"];

export const Registro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = usePop(0.6, 200);
  return (
    <Column top={330}>
      <div
        style={{
          width: 820,
          padding: "44px 56px",
          background: palette.paper,
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 66px, rgba(60,80,140,0.25) 66px 68px)",
          borderRadius: 8,
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          fontFamily,
          rotate: "1.5deg",
          translate: `0px ${(1 - page) * 1000}px`,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, color: "#2b2418", letterSpacing: 4 }}>
          REGISTRO DEL FARO
        </div>
        {keepers.map((name, i) => {
          const delay = 3.4 + i * 0.45;
          return (
            <div
              key={name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 44,
                color: "#2b2418",
                opacity: interpolate(frame, [delay * fps, (delay + 0.3) * fps], [0, 1], clamp),
              }}
            >
              <span>
                {i + 1}. {name}
              </span>
              <span style={{ color: "#a3101f", fontWeight: 800 }}>notte 39</span>
            </div>
          );
        })}
        <div
          style={{
            fontSize: 44,
            color: "#2b2418",
            opacity: interpolate(frame, [9 * fps, 9.6 * fps], [0, 0.6], clamp),
          }}
        >
          7. ____________
        </div>
      </div>
    </Column>
  );
};

// 6. RADIO: 2:14 nel buio, la radio parla, luci nella nebbia
const ShipLights = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const appear = (3 + i * 0.6) * fps;
        const progress = interpolate(frame, [appear, appear + 5 * fps], [0, 1], clamp);
        const x = 120 + i * 190 + Math.sin(i * 2.3) * 40;
        const y = interpolate(progress, [0, 1], [1360, 1460 + i * 30]);
        const s = interpolate(progress, [0, 1], [0.5, 1.4]);
        const o = interpolate(frame, [appear, appear + fps], [0, 0.9], clamp);
        return (
          <g key={i} opacity={o}>
            <circle cx={x - 14 * s} cy={y} r={7 * s} fill="#ffeeb0" />
            <circle cx={x + 14 * s} cy={y} r={7 * s} fill="#ffeeb0" />
            <circle cx={x} cy={y} r={46 * s} fill="#ffeeb0" opacity={0.12} />
          </g>
        );
      })}
    </svg>
  );
};

const Radio = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(2.6, 200);
  return (
    <div
      style={{
        width: 640,
        height: 300,
        borderRadius: 26,
        background: "linear-gradient(180deg, #3a3326, #1e1a13)",
        border: "6px solid #12100b",
        boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        gap: 30,
        padding: "0 40px",
        opacity: pop,
        scale: interpolate(pop, [0, 1], [0.8, 1]),
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "repeating-radial-gradient(circle, #111 0 6px, #2c271c 6px 12px)",
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily, color: palette.red, fontWeight: 800, fontSize: 30 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: palette.red,
              opacity: Math.floor(frame / (fps / 3)) % 2 === 0 ? 1 : 0.25,
            }}
          />
          CANALE 16
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 110 }}>
          {new Array(16).fill(true).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderRadius: 4,
                background: palette.green,
                height: 12 + Math.abs(Math.sin(frame / 3 + i * 1.7) * Math.cos(frame / 7 + i)) * 96,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const RadioScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blackout = interpolate(frame, [2 * fps, 2.6 * fps], [1, 0], clamp);
  return (
    <>
      <ShipLights />
      {/* nebbia */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, transparent 45%, rgba(170,185,210,0.28) 70%, rgba(170,185,210,0.12) 100%)",
          opacity: interpolate(frame, [2.5 * fps, 5 * fps], [0, 1], clamp),
        }}
      />
      <Column top={430}>
        <Radio />
      </Column>
      <AbsoluteFill
        style={{
          background: palette.ink,
          opacity: blackout,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ fontFamily, fontWeight: 800, fontSize: 220, color: palette.red, marginTop: -300 }}>
          2:14
        </div>
      </AbsoluteFill>
    </>
  );
};

// 7. SCELTA: ACCESA o SPENTA
const ChoiceButton = ({
  label,
  color,
  delay,
  pulseOffset,
}: {
  readonly label: string;
  readonly color: string;
  readonly delay: number;
  readonly pulseOffset: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = usePop(delay, 10);
  const pulse = 1 + 0.05 * Math.max(0, Math.sin((frame / fps) * Math.PI * 1.5 + pulseOffset));
  return (
    <div
      style={{
        fontFamily,
        fontWeight: 800,
        fontSize: 72,
        color,
        border: `7px solid ${color}`,
        borderRadius: 22,
        padding: "18px 40px",
        background: "rgba(0,0,0,0.7)",
        boxShadow: `0 0 40px ${color}55`,
        scale: pop * pulse,
      }}
    >
      {label}
    </div>
  );
};

export const Scelta = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <Column top={470}>
      <div style={{ display: "flex", gap: 36 }}>
        <ChoiceButton label="ACCESA" color={palette.gold} delay={4} pulseOffset={0} />
        <ChoiceButton label="SPENTA" color={palette.red} delay={4.4} pulseOffset={Math.PI} />
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily,
          fontWeight: 800,
          fontSize: 44,
          color: palette.gold,
          letterSpacing: 2,
          textShadow,
          opacity: interpolate(frame, [5 * fps, 5.5 * fps], [0, 1], clamp),
        }}
      >
        SCRIVILO NEI COMMENTI
      </div>
    </Column>
  );
};
