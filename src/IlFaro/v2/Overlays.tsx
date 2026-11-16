import type React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily, palette, textShadow } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay * fps, fps, config: { damping } });
};

// Fumetto (bianco con codina). Tempi relativi alla Sequence.
export const Bubble = ({
  lines,
  x,
  y,
  tail = "down",
  red = false,
}: {
  readonly lines: readonly { text: string; at: number }[];
  readonly x: number;
  readonly y: number;
  readonly tail?: "down" | "left" | "right";
  readonly red?: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pop = usePop(lines[0].at, 11);
  const shake = red ? Math.sin(t * 60) * 2 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        translate: `-50% -100%`,
        scale: pop,
        rotate: `${shake * 0.3}deg`,
        background: "white",
        border: "6px solid #14161f",
        borderRadius: 26,
        padding: "18px 30px",
        fontFamily,
        fontWeight: 800,
        fontSize: 52,
        lineHeight: 1.1,
        textAlign: "center",
        color: "#14161f",
        boxShadow: "0 12px 0 rgba(0,0,0,0.35)",
      }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ color: red && i === lines.length - 1 ? palette.red : undefined, opacity: t >= l.at ? 1 : 0, height: t >= l.at ? "auto" : 0 }}>
          {l.text}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          ...(tail === "down"
            ? { left: "50%", bottom: -34, translate: "-50% 0", borderLeft: "20px solid transparent", borderRight: "20px solid transparent", borderTop: "30px solid #14161f" }
            : tail === "left"
              ? { left: -34, top: "60%", borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: "30px solid #14161f" }
              : { right: -34, top: "60%", borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "30px solid #14161f" }),
        }}
      />
    </div>
  );
};

// Fumetto con il telefono barrato ("Niente telefono")
export const NoPhone = () => {
  const pop = usePop(0, 11);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: 980,
        translate: "-50% -100%",
        scale: pop,
        background: "white",
        border: "6px solid #14161f",
        borderRadius: 26,
        padding: 18,
      }}
    >
      <svg width={110} height={110}>
        <rect x={32} y={10} width={46} height={90} rx={9} fill="#2c3240" stroke="#14161f" strokeWidth={5} />
        <rect x={39} y={20} width={32} height={60} rx={3} fill="#6d7fa6" />
        <line x1={14} y1={14} x2={96} y2={96} stroke={palette.red} strokeWidth={12} strokeLinecap="round" />
      </svg>
    </div>
  );
};

// Contratto con firma e timbro (tempi relativi alla scena, che parte a 7.2 s)
export const Contract = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = usePop(0.1, 200);
  const stamp = usePop(7.35, 9);
  const sign = interpolate(frame, [1.9 * fps, 3.3 * fps], [1, 0], clamp);
  const out = interpolate(frame, [8.1 * fps, 8.5 * fps], [0, 1], clamp);
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
    <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * card * (1 - out)})` }}>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 560,
          width: 760,
          padding: "50px 60px",
          background: "#efe6d0",
          borderRadius: 10,
          boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
          fontFamily,
          display: "flex",
          flexDirection: "column",
          gap: 22,
          rotate: "-2deg",
          translate: `0px ${(1 - card) * 1200 + out * 1400}px`,
        }}
      >
        <div style={{ fontSize: 54, fontWeight: 800, color: "#2b2418", letterSpacing: 6 }}>CONTRATTO</div>
        {row("Durata: 40 notti", 0.8)}
        {row("Compenso: € 1.000.000", 1.4)}
        {row("Regola n. 1:", 4.0, true)}
        {row("la luce non si spegne.", 5.1, true)}
        <svg width={360} height={110}>
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
    </AbsoluteFill>
  );
};

// Pagina del registro (Sequence da 36.0 s)
const keepers = ["M. Ferri", "A. Costa", "G. Bellini", "L. Marchetti", "S. Rinaldi", "P. Greco"];
export const Logbook = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const page = usePop(0.1, 200);
  const out = interpolate(frame, [7.9 * fps, 8.3 * fps], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 560,
        width: 860,
        padding: "44px 56px",
        background: "#efe6d0",
        backgroundImage: "repeating-linear-gradient(180deg, transparent 0 66px, rgba(60,80,140,0.25) 66px 68px)",
        borderRadius: 8,
        boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
        fontFamily,
        rotate: "1.5deg",
        translate: `0px ${(1 - page) * 1300 + out * 1500}px`,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ fontSize: 46, fontWeight: 800, color: "#2b2418", letterSpacing: 4 }}>REGISTRO DEL FARO</div>
      {keepers.map((name, i) => {
        const d = 1.5 + i * 0.4; // "Ci sono i nomi..." → "Sei guardiani"
        return (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 44,
              color: "#2b2418",
              opacity: interpolate(frame, [d * fps, (d + 0.3) * fps], [0, 1], clamp),
            }}
          >
            <span>
              {i + 1}. {name}
            </span>
            <span
              style={{
                color: "#a3101f",
                fontWeight: 800,
                opacity: interpolate(frame, [5.4 * fps, 5.7 * fps], [0, 1], clamp), // "...fino alla notte trentanove"
              }}
            >
              notte 39
            </span>
          </div>
        );
      })}
      <div style={{ fontSize: 44, color: "#2b2418", opacity: interpolate(frame, [6.5 * fps, 7 * fps], [0, 0.6], clamp) }}>
        7. ____________
      </div>
    </div>
  );
};

// Orologio 2:14 nel buio
export const Clock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blink = Math.floor(frame / (fps / 2)) % 2 === 0;
  return (
    <AbsoluteFill style={{ background: "#030304", justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 230,
          color: palette.red,
          textShadow: `0 0 60px ${palette.red}88`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        2<span style={{ opacity: blink ? 1 : 0.2 }}>:</span>14
      </div>
    </AbsoluteFill>
  );
};

// Scelta A/B con conto alla rovescia (Sequence da 61.6 s)
const ChoiceCard = ({
  letter,
  title,
  sub,
  color,
  delay,
}: {
  readonly letter: string;
  readonly title: string;
  readonly sub: string;
  readonly color: string;
  readonly delay: number;
}) => {
  const pop = usePop(delay, 13);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        width: 860,
        padding: "22px 30px",
        background: color,
        border: "6px solid #14161f",
        borderRadius: 26,
        boxShadow: "0 12px 0 rgba(0,0,0,0.45)",
        scale: pop,
        opacity: pop,
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: "white",
          border: "6px solid #14161f",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 60,
          fontWeight: 800,
          color: "#14161f",
          flexShrink: 0,
        }}
      >
        {letter}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: "white", textShadow: "0 4px 0 rgba(0,0,0,0.35)" }}>{title}</div>
        <div style={{ fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>{sub}</div>
      </div>
    </div>
  );
};

export const Choice = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const countStart = 2.2;
  const countLen = 3.6;
  const left = Math.max(0, countLen - (t - countStart));
  const n = Math.min(5, Math.ceil((left / countLen) * 5));
  const dim = interpolate(t, [0, 0.4], [0, 0.45], clamp);
  return (
    <AbsoluteFill style={{ background: `rgba(0,0,0,${dim})`, fontFamily, alignItems: "center" }}>
      <div style={{ position: "absolute", top: 860, display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
        <ChoiceCard letter="A" title="ACCESA" sub="Tieni il milione. Guardi cosa arriva." color="#d99a12" delay={0.5} />
        <ChoiceCard letter="B" title="SPENTA" sub="Perdi tutto. Ma forse resti vivo." color="#c22a3a" delay={1.4} />
        {t > countStart ? (
          <>
            <div style={{ width: 760, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.2)", marginTop: 16, overflow: "hidden" }}>
              <div style={{ width: `${(left / countLen) * 100}%`, height: "100%", background: n <= 2 ? palette.red : palette.gold }} />
            </div>
            <div style={{ fontSize: 90, fontWeight: 800, color: "white", textShadow, lineHeight: 1 }}>{n}</div>
            <div style={{ fontSize: 46, fontWeight: 800, color: palette.gold, textShadow }}>COMMENTA A O B</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: "white", textShadow, opacity: 0.9 }}>
              Il tuo voto decide l'Ep.2 · SEGUI PER L'EP.2
            </div>
          </>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const FadeIn = ({ children, duration = 0.3 }: { readonly children: React.ReactNode; readonly duration?: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <AbsoluteFill style={{ opacity: interpolate(frame, [0, duration * fps], [0, 1], clamp) }}>{children}</AbsoluteFill>;
};
