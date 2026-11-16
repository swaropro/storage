import type { Caption } from "@remotion/captions";

// Testo dell'episodio 1. Markup: *parola* = giallo, !parola! = rosso.
// I tempi sono stimati: quando ci sarà la voce vera, si sostituiscono
// le captions generate qui con quelle di Whisper (stesso tipo Caption).

export type SceneId =
  | "gancio"
  | "regola"
  | "arrivo"
  | "routine"
  | "registro"
  | "radio"
  | "scelta";

export type SceneDef = {
  readonly id: SceneId;
  readonly start: number; // secondi
  readonly end: number; // secondi
  readonly night: number; // notte mostrata nell'HUD a fine scena
  readonly lines: readonly string[];
};

export const EURO_PER_NIGHT = 25000;

export const scenes: readonly SceneDef[] = [
  {
    id: "gancio",
    start: 0,
    end: 7.2,
    night: 0,
    lines: [
      "Un *milione* di euro.",
      "*Quaranta* notti su un'isola.",
      "Nessuno è mai arrivato !in fondo.!",
    ],
  },
  {
    id: "regola",
    start: 7.2,
    end: 15.7,
    night: 0,
    lines: [
      "Il lavoro è semplice:",
      "tenere acceso il *faro.*",
      "C'è una sola regola.",
      "La luce non si spegne.",
      "!Mai.!",
    ],
  },
  {
    id: "arrivo",
    start: 15.7,
    end: 25.2,
    night: 1,
    lines: [
      "Una barca ti lascia sullo scoglio.",
      "Viveri. Una radio. Un *registro.*",
      "!Niente! telefono.",
      "La barca torna tra *quaranta* notti.",
    ],
  },
  {
    id: "routine",
    start: 25.2,
    end: 34.3,
    night: 11,
    lines: [
      "*Notte tre.* Il vento non si ferma mai.",
      "*Notte undici.*",
      "*Venticinquemila* euro a notte,",
      "solo per guardare il buio.",
    ],
  },
  {
    id: "registro",
    start: 34.3,
    end: 45.7,
    night: 37,
    lines: [
      "*Notte trentasette.*",
      "Sfogli il *registro.*",
      "Ci sono i nomi di chi c'era prima di te.",
      "*Sei* guardiani.",
      "Tutti hanno scritto fino alla notte !trentanove.!",
      "Poi, !più niente.!",
    ],
  },
  {
    id: "radio",
    start: 45.7,
    end: 55.5,
    night: 39,
    lines: [
      "*Notte trentanove.* Le !due e quattordici.!",
      "La radio si accende !da sola.!",
      "«Spegni la luce. !Adesso.!»",
      "«Quelle che stai guidando !non sono navi.!»",
    ],
  },
  {
    id: "scelta",
    start: 55.5,
    end: 67.5,
    night: 39,
    lines: [
      "Il contratto è chiaro:",
      "se la luce si spegne, perdi !tutto.!",
      "Allora, cosa fai?",
      "Scrivi *ACCESA* o !SPENTA.!",
      "Decidi tu la notte *quaranta.*",
    ],
  },
];

export const EPISODE_SECONDS = scenes[scenes.length - 1].end;

export type Tone = "normal" | "gold" | "red";

// Ogni parola porta il proprio colore nel testo: "gold|parola" o "red|parola".
const parseLine = (line: string): { word: string; tone: Tone }[] => {
  const out: { word: string; tone: Tone }[] = [];
  let tone: Tone = "normal";
  for (const raw of line.split(/\s+/).filter(Boolean)) {
    let w = raw;
    let wordTone = tone;
    if (w.startsWith("*")) {
      tone = "gold";
      wordTone = "gold";
      w = w.slice(1);
    } else if (w.startsWith("!")) {
      tone = "red";
      wordTone = "red";
      w = w.slice(1);
    }
    // marcatore di chiusura, anche seguito da punteggiatura: "faro.*", "Adesso.!»"
    const close = w.match(/[*!]([.,:;?»]*)$/);
    if (close) {
      w = w.slice(0, close.index) + close[1];
      tone = "normal";
    }
    out.push({ word: w, tone: wordTone });
  }
  return out;
};

const MAX_WORDS_PER_PAGE = 4;

// Distribuisce le parole nel tempo della scena, in proporzione alla lunghezza.
export const buildCaptions = (): Caption[] => {
  const captions: Caption[] = [];
  for (const scene of scenes) {
    const startMs = scene.start * 1000 + 250;
    const endMs = scene.end * 1000 - 350;
    const lines = scene.lines.map(parseLine);
    const pauseWeight = 6; // pausa tra una frase e l'altra
    const total = lines.reduce(
      (acc, l) => acc + l.reduce((a, w) => a + w.word.length + 3, 0) + pauseWeight,
      0,
    );
    const msPerUnit = (endMs - startMs) / total;
    let t = startMs;
    for (const line of lines) {
      line.forEach((w, i) => {
        const d = (w.word.length + 3) * msPerUnit;
        const isLastOfLine = i === line.length - 1;
        captions.push({
          text: `${w.tone}|${w.word}`,
          startMs: Math.round(t),
          endMs: Math.round(t + d),
          timestampMs: Math.round(t + d / 2),
          confidence: null,
          pageBreakAfter: isLastOfLine || (i + 1) % MAX_WORDS_PER_PAGE === 0,
        });
        t += d;
      });
      t += pauseWeight * msPerUnit;
    }
  }
  return captions;
};

// [secondo, notte]: l'HUD conta le notti (e i soldi) tra un punto e l'altro.
export const nightKeyframes: readonly (readonly [number, number])[] = [
  [15.9, 0],
  [16.5, 1],
  [25.4, 1],
  [26, 3],
  [28.8, 3],
  [29.8, 11],
  [34.5, 11],
  [35.6, 37],
  [45.9, 37],
  [46.5, 39],
];
