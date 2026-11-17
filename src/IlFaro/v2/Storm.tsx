import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { flashAmount, rainAmount } from "./timeline";

// Pioggia obliqua e lampi (coordinate schermo, tempo globale).
export const Storm = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rain = rainAmount(t);
  const flash = flashAmount(t);
  if (rain <= 0 && flash <= 0) return null;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }} opacity={rain}>
        {new Array(120).fill(true).map((_, i) => {
          const speed = 2200 + random(`rs${i}`) * 900;
          const y = ((t * speed + random(`ry${i}`) * 2200) % 2200) - 200;
          const x = random(`rx${i}`) * 1300 - y * 0.25;
          return <line key={i} x1={x} y1={y} x2={x - 18} y2={y + 70} stroke="#c9d6ea" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "#e8f0ff", opacity: flash }} />
    </AbsoluteFill>
  );
};
