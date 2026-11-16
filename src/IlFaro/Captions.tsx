import type { Caption } from "@remotion/captions";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Tone } from "./script";
import { fontFamily, textShadow, toneColor } from "./theme";

type Page = { startMs: number; endMs: number; words: Caption[] };

const toPages = (captions: Caption[]): Page[] => {
  const pages: Page[] = [];
  let current: Caption[] = [];
  for (const c of captions) {
    current.push(c);
    if (c.pageBreakAfter) {
      pages.push({
        startMs: current[0].startMs,
        endMs: c.endMs,
        words: current,
      });
      current = [];
    }
  }
  if (current.length > 0) {
    pages.push({
      startMs: current[0].startMs,
      endMs: current[current.length - 1].endMs,
      words: current,
    });
  }
  return pages;
};

const splitTone = (text: string): { tone: Tone; word: string } => {
  const [tone, ...rest] = text.split("|");
  return { tone: tone as Tone, word: rest.join("|") };
};

// Sottotitoli a pagine di max 4 parole; la parola detta in quel momento si ingrandisce.
export const Captions = ({
  captions,
  top,
}: {
  readonly captions: Caption[];
  readonly top: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const pages = toPages(captions);
  const page = pages.find((p) => ms >= p.startMs && ms < p.endMs + 200);
  if (!page) {
    return null;
  }
  const pageFrame = Math.round(((ms - page.startMs) / 1000) * fps);
  const enter = spring({ frame: pageFrame, fps, config: { damping: 14, stiffness: 220 } });
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        right: 200, // a destra ci sono i pulsanti di YouTube (e il faro)
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "4px 30px",
        fontFamily,
        fontWeight: 800,
        fontSize: 78,
        lineHeight: 1.1,
        textTransform: "uppercase",
        textShadow,
        scale: 0.85 + 0.15 * enter,
      }}
    >
      {page.words.map((w, i) => {
        const { tone, word } = splitTone(w.text);
        const active = ms >= w.startMs && ms < w.endMs;
        const spoken = ms >= w.startMs;
        return (
          <span
            key={i}
            style={{
              color: toneColor[tone],
              opacity: spoken ? 1 : 0.45,
              scale: active ? 1.05 : 1,
              display: "inline-block",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
