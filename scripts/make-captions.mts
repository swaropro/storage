// Converte i tempi reali della voce in sottotitoli Remotion (tipo Caption).
//
// Uso:
//   node scripts/make-captions.mts <input> <output.json>
//
// <input> può essere:
//   - un file .srt (sottotitoli a frasi: le parole vengono distribuite nella frase)
//   - un JSON di ElevenLabs Speech-to-Text  { words: [{ text, start, end, type }] }  (secondi)
//   - un JSON di Caption[] di Remotion/Whisper  [{ text, startMs, endMs }]
//   - un JSON di parole generico  [{ text|word, start, end }]  (secondi)
//
// I colori (giallo/rosso) vengono ripresi dal copione in src/IlFaro/script.ts,
// abbinando le parole trascritte a quelle del copione.

import { readFileSync, writeFileSync } from "node:fs";

type Caption = {
  text: string;
  startMs: number;
  endMs: number;
  timestampMs: number | null;
  confidence: number | null;
  pageBreakAfter?: boolean;
};

type Word = { word: string; startMs: number; endMs: number };
type Tone = "normal" | "gold" | "red";

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Uso: node scripts/make-captions.mts <input> <output.json>");
  process.exit(1);
}

const srtTime = (t: string) => {
  const [h, m, rest] = t.trim().split(":");
  const [s, ms] = rest.split(/[,.]/);
  return ((+h * 60 + +m) * 60 + +s) * 1000 + +ms;
};

const readWords = (path: string): Word[] => {
  const raw = readFileSync(path, "utf8");
  if (path.toLowerCase().endsWith(".srt")) {
    const words: Word[] = [];
    for (const block of raw.replace(/\r/g, "").split(/\n\n+/)) {
      const lines = block.trim().split("\n");
      const timeLine = lines.find((l) => l.includes("-->"));
      if (!timeLine) continue;
      const [a, b] = timeLine.split("-->").map(srtTime);
      const text = lines.slice(lines.indexOf(timeLine) + 1).join(" ");
      const tokens = text.split(/\s+/).filter(Boolean);
      const total = tokens.reduce((n, w) => n + w.length + 2, 0);
      let t = a;
      for (const w of tokens) {
        const d = ((w.length + 2) / total) * (b - a);
        words.push({ word: w, startMs: Math.round(t), endMs: Math.round(t + d) });
        t += d;
      }
    }
    return words;
  }
  const json = JSON.parse(raw);
  const list: any[] = Array.isArray(json) ? json : json.words;
  return list
    .filter((w) => (w.type ?? "word") === "word")
    .map((w) => {
      const inMs = "startMs" in w;
      return {
        word: String(w.text ?? w.word).trim(),
        startMs: Math.round(inMs ? w.startMs : w.start * 1000),
        endMs: Math.round(inMs ? w.endMs : w.end * 1000),
      };
    })
    .filter((w) => w.word.length > 0);
};

// Parole del copione con il loro colore (stesso markup di script.ts).
const readScriptTones = (): { norm: string; tone: Tone }[] => {
  const src = readFileSync(new URL("../src/IlFaro/script.ts", import.meta.url), "utf8");
  const lines = [...src.matchAll(/^\s+"(.*)",$/gm)].map((m) => m[1]);
  const out: { norm: string; tone: Tone }[] = [];
  for (const line of lines) {
    let tone: Tone = "normal";
    for (const raw of line.split(/\s+/).filter(Boolean)) {
      let w = raw;
      let wordTone = tone;
      if (w.startsWith("*")) { tone = "gold"; wordTone = "gold"; w = w.slice(1); }
      else if (w.startsWith("!")) { tone = "red"; wordTone = "red"; w = w.slice(1); }
      if (/[*!][.,:;?»]*$/.test(w)) tone = "normal";
      out.push({ norm: norm(w), tone: wordTone });
    }
  }
  return out;
};

function norm(w: string) {
  return w
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9']/g, "");
}

const words = readWords(inputPath);
const script = readScriptTones();

// Abbinamento sequenziale con piccola finestra di ricerca (tollera parole saltate).
let cursor = 0;
const tones: Tone[] = words.map((w) => {
  const n = norm(w.word);
  // parole lunghe: cerca più avanti (riallinea se l'audio salta un pezzo)
  const reach = n.length >= 4 ? 60 : 6;
  for (let k = cursor; k < Math.min(script.length, cursor + reach); k++) {
    if (script[k].norm === n) {
      cursor = k + 1;
      return script[k].tone;
    }
  }
  return "normal";
});

const MAX_WORDS_PER_PAGE = 4;
let inPage = 0;
const captions: Caption[] = words.map((w, i) => {
  inPage++;
  const next = words[i + 1];
  const sentenceEnd = /[.?!:»]$/.test(w.word);
  const longPause = next ? next.startMs - w.endMs > 350 : true;
  const pageBreakAfter = sentenceEnd || longPause || inPage >= MAX_WORDS_PER_PAGE;
  if (pageBreakAfter) inPage = 0;
  return {
    text: `${tones[i]}|${w.word}`,
    startMs: w.startMs,
    endMs: w.endMs,
    timestampMs: Math.round((w.startMs + w.endMs) / 2),
    confidence: null,
    pageBreakAfter,
  };
});

writeFileSync(outputPath, JSON.stringify(captions, null, 2) + "\n");
const matched = tones.filter((t) => t !== "normal").length;
console.log(`${captions.length} parole -> ${outputPath} (${matched} colorate dal copione)`);
