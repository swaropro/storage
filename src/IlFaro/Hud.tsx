import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EURO_PER_NIGHT, nightKeyframes } from "./script";
import { fontFamily, palette } from "./theme";

const euro = (n: number) => `€${Math.round(n).toLocaleString("it-IT")}`;

// Barra in alto: titolo della serie, notte e soldi accumulati.
export const Hud = ({
  episode,
  nightAt,
  moneyAt,
}: {
  readonly episode: number;
  // facoltativi: per gli episodi dopo il primo
  readonly nightAt?: (seconds: number) => number;
  readonly moneyAt?: (seconds: number) => number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seconds = frame / fps;
  const nightFloat = nightAt
    ? nightAt(seconds)
    : interpolate(
        seconds,
        nightKeyframes.map((k) => k[0]),
        nightKeyframes.map((k) => k[1]),
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      );
  const night = Math.round(nightFloat);
  const money = moneyAt ? moneyAt(seconds) : nightFloat * EURO_PER_NIGHT;
  const lost = moneyAt !== undefined && money < 1;
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "10px 22px",
          background: "rgba(0,0,0,0.65)",
          borderRadius: 12,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: 3,
          color: palette.white,
        }}
      >
        IL FARO
        <span
          style={{
            background: palette.red,
            borderRadius: 8,
            padding: "2px 12px",
            fontSize: 26,
          }}
        >
          EP.{episode}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 28,
          padding: "8px 24px",
          background: "rgba(0,0,0,0.5)",
          borderRadius: 10,
          fontSize: 30,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ color: palette.red }}>NOTTE {night}/40</span>
        <span style={{ color: lost ? palette.red : palette.green, textDecoration: lost ? "line-through" : undefined }}>{euro(money)}</span>
      </div>
    </div>
  );
};
