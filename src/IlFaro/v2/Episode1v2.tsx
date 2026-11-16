import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, staticFile, Track, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "../Captions";
import { Hud } from "../Hud";
import { ep1VoiceCaptions, EP1_VOICE } from "../voice";
import { Bubble, Choice, Clock, Contract, FadeIn, Logbook, NoPhone } from "./Overlays";
import { Room } from "./Room";
import { Soundtrack } from "./Soundtrack";
import { World } from "./World";

// IL FARO · Ep.1 "La regola" — versione con personaggio, camera e ambienti sonori.
// I tempi (in secondi) seguono la voce narrante.

const s = (sec: number, fps: number) => Math.round(sec * fps);

// Il faro tremola negli ultimi secondi: lascia il dubbio.
const WorldWithFlicker = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tail = Math.round(67.5 * fps) - frame; // frame = tempo globale (vedi sotto)
  const flicker = tail < 2 * fps && [2, 5, 6, 11, 17, 18, 24, 30, 31].includes(tail % 34);
  return <World lightOn={!flicker && tail > 4} />;
};

export const IlFaroEp1v2 = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <Track name="Inquadrature">
        <Sequence name="Esterno: arrivo e notti" from={0} durationInFrames={s(34.3, fps)}>
          <WorldWithFlicker />
        </Sequence>
        <Sequence name="Interno: registro" from={s(34.3, fps)} durationInFrames={s(11.4, fps)}>
          <Room mode="registro" />
        </Sequence>
        <Sequence name="2:14" from={s(45.7, fps)} durationInFrames={s(2.9, fps)}>
          <Clock />
        </Sequence>
        <Sequence name="Interno: la radio" from={s(48.6, fps)} durationInFrames={s(4.3, fps)}>
          <FadeIn>
            <Room mode="radio" />
          </FadeIn>
        </Sequence>
        <Sequence name="Esterno: nebbia e scelta" from={s(52.9, fps)} durationInFrames={s(14.6, fps)}>
          {/* stesso mondo, tempo globale: lo "ri-montiamo" spostato all'indietro */}
          <Sequence from={-s(52.9, fps)} layout="none">
            <WorldWithFlicker />
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
        <Sequence name="Registro" from={s(36, fps)} durationInFrames={s(8.4, fps)}>
          <Logbook />
        </Sequence>
        <Sequence name="Radio parla" from={s(48.6, fps)} durationInFrames={s(4.3, fps)}>
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
        <Sequence name="Non sono navi" from={s(52.9, fps)} durationInFrames={s(2.7, fps)}>
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
        <Sequence name="Scelta A/B" from={s(61.6, fps)} durationInFrames={s(5.9, fps)}>
          <Choice />
        </Sequence>
      </Track>

      {EP1_VOICE ? <Audio name="Voce narrante" src={staticFile(EP1_VOICE)} /> : null}
      <Soundtrack />
      <Hud episode={1} />
      <Captions captions={ep1VoiceCaptions} top={300} />
    </AbsoluteFill>
  );
};
