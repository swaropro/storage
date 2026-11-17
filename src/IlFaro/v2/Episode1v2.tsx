import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, Track, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../Captions";
import ep1Captions from "../ep1/captions.json";
import { Hud } from "../Hud";
import { Bubble, Choice, Clock, Contract, FadeIn, NoPhone } from "./Overlays";
import { Room } from "./Room";
import { Soundtrack } from "./Soundtrack";
import { Storm } from "./Storm";
import { EP1_END, lanternOn, N39 } from "./timeline";
import { World } from "./World";

// IL FARO · Ep.1 "La regola" (v3): arrivo → NOTTE 12 (tempesta, la luce si spegne,
// il guardiano la riaccende) → NOTTE 39 (2:14, la radio, la scelta). Tempi = voce narrante.

const s = (sec: number, fps: number) => Math.round(sec * fps);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// frame = tempo globale (vedi le Sequence con from negativo più sotto)
const WorldEp1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const tail = s(EP1_END, fps) - frame;
  const endFlicker = tail < 2 * fps && [2, 5, 6, 11, 17, 18, 24, 30, 31].includes(tail % 34);
  return <World lightOn={lanternOn(t) && !endFlicker && tail > 4} />;
};

// notti nell'HUD: 0 → 1 (arrivo) → 12 (tempesta) → 39
const nightAt = (t: number) => interpolate(t, [16.2, 16.8, 25.4, 26.4, N39 + 0.1, N39 + 0.9], [0, 1, 1, 12, 12, 39], clamp);

export const IlFaroEp1v2 = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <Track name="Inquadrature">
        <Sequence name="Esterno: arrivo e notte 12" from={0} durationInFrames={s(N39, fps)}>
          <WorldEp1 />
          <Storm />
        </Sequence>
        <Sequence name="2:14" from={s(N39, fps)} durationInFrames={s(2.9, fps)}>
          <Clock />
        </Sequence>
        <Sequence name="Interno: la radio" from={s(46.5, fps)} durationInFrames={s(4.3, fps)}>
          <FadeIn>
            <Room mode="radio" />
          </FadeIn>
        </Sequence>
        <Sequence name="Esterno: nebbia e scelta" from={s(50.8, fps)} durationInFrames={s(EP1_END - 50.8, fps)}>
          <Sequence from={-s(50.8, fps)} layout="none">
            <WorldEp1 />
          </Sequence>
        </Sequence>
      </Track>

      <Track name="Grafiche">
        <Sequence name="Contratto" from={s(7.2, fps)} durationInFrames={s(8.5, fps)}>
          <Contract />
        </Sequence>
        <Sequence name="Niente telefono" from={s(21.1, fps)} durationInFrames={s(1.4, fps)}>
          <NoPhone />
        </Sequence>
        <Sequence name="Radio parla" from={s(46.5, fps)} durationInFrames={s(4.3, fps)}>
          <Bubble
            x={760}
            y={720}
            red
            lines={[
              { text: "«SPEGNI LA LUCE.", at: 2.1 },
              { text: "ADESSO.»", at: 3.3 },
            ]}
          />
        </Sequence>
        <Sequence name="Non sono navi" from={s(50.8, fps)} durationInFrames={s(2.7, fps)}>
          <Bubble
            x={720}
            y={760}
            red
            lines={[
              { text: "«QUELLE CHE STAI GUIDANDO…", at: 0 },
              { text: "NON SONO NAVI.»", at: 1.4 },
            ]}
          />
        </Sequence>
        <Sequence name="Scelta A/B" from={s(59.5, fps)} durationInFrames={s(EP1_END - 59.5, fps)}>
          <Choice />
        </Sequence>
      </Track>

      <Audio name="Voce narrante" src={staticFile("il-faro/ep1-voce-v3.mp3")} />
      <Soundtrack />
      <Hud episode={1} nightAt={nightAt} />
      <Captions captions={ep1Captions as Caption[]} top={300} />
    </AbsoluteFill>
  );
};
