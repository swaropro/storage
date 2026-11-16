import { AbsoluteFill, Sequence, Track, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "./Background";
import { Captions } from "./Captions";
import { Hud } from "./Hud";
import { Arrivo, Gancio, RadioScene, Regola, Routine, Registro, Scelta } from "./Scenes";
import { buildCaptions } from "./script";

const captions = buildCaptions();

// Negli ultimi 1,5 secondi la luce del faro tremola: lascia il dubbio.
const FlickeringBackground = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const tail = durationInFrames - frame;
  const flicker = tail < 1.5 * fps && [2, 5, 6, 11, 17, 18, 30].includes(tail % 32);
  return <Background lightOn={!flicker && tail > 4} />;
};

// Oscura il fondo dove stanno i sottotitoli, per leggerli meglio.
const BottomShade = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, transparent 54%, rgba(0,0,0,0.6) 61%, rgba(0,0,0,0.6) 76%, transparent 86%)",
    }}
  />
);

export const IlFaroEp1 = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <FlickeringBackground />
      <BottomShade />
      <Track name="Scene">
        <Sequence name="1 Gancio" from={0} durationInFrames={6 * fps}>
          <Gancio />
        </Sequence>
        <Sequence name="2 Regola" from={6 * fps} durationInFrames={9 * fps}>
          <Regola />
        </Sequence>
        <Sequence name="3 Arrivo" from={15 * fps} durationInFrames={9 * fps}>
          <Arrivo />
        </Sequence>
        <Sequence name="4 Routine" from={24 * fps} durationInFrames={9 * fps}>
          <Routine />
        </Sequence>
        <Sequence name="5 Registro" from={33 * fps} durationInFrames={12 * fps}>
          <Registro />
        </Sequence>
        <Sequence name="6 Radio" from={45 * fps} durationInFrames={9 * fps}>
          <RadioScene />
        </Sequence>
        <Sequence name="7 Scelta" from={54 * fps} durationInFrames={8 * fps}>
          <Scelta />
        </Sequence>
      </Track>
      <Hud episode={1} />
      <Captions captions={captions} top={1200} />
    </AbsoluteFill>
  );
};
