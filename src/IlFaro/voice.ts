import type { Caption } from "@remotion/captions";
import realCaptions from "./ep1-captions.json";

// Quando c'è la voce: metti il file in public/il-faro/ep1-voce.mp3,
// genera i sottotitoli con scripts/make-captions.ts e imposta qui il percorso.
export const EP1_VOICE: string | null = "il-faro/ep1-voce.mp3";

// Sottotitoli a tempo con la voce (vuoto finché non ci sono).
export const ep1VoiceCaptions = realCaptions as Caption[];
