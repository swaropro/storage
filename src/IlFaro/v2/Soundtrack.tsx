import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { EP1_END, LEVER_UP_AT, N39, THUNDER } from "./timeline";

// Ep.1 v3: ambienti in loop che cambiano con la tensione + effetti nei momenti chiave.
// Tutti i suoni sono generati con ElevenLabs (vedi docs/serie-il-faro.md).

const fade = (from: number, to: number, fps: number, peak: number) => (f: number) => {
  const len = (to - from) * fps;
  return interpolate(f, [0, fps, len - fps, len], [0, peak, peak, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

const Bed = ({ name, file, from, to, peak }: { readonly name: string; readonly file: string; readonly from: number; readonly to: number; readonly peak: number }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={name} from={Math.round(from * fps)} durationInFrames={Math.round((to - from) * fps)} layout="none">
      <Audio src={staticFile(`il-faro/sfx/${file}`)} loop volume={fade(from, to, fps, peak)} />
    </Sequence>
  );
};

const Hit = ({ name, file, at, volume = 1 }: { readonly name: string; readonly file: string; readonly at: number; readonly volume?: number }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={name} from={Math.round(at * fps)} layout="none">
      <Audio src={staticFile(`il-faro/sfx/${file}`)} volume={volume} />
    </Sequence>
  );
};

export const Soundtrack = () => (
  <>
    {/* ambienti: mare calmo → tempesta → silenzio sospeso → terrore */}
    <Bed name="Amb mare calmo" file="amb-a-mare-calmo.mp3" from={0} to={26} peak={0.8} />
    <Bed name="Amb tempesta" file="amb-b-vento.mp3" from={25.2} to={41.4} peak={0.95} />
    <Bed name="Amb sospeso" file="amb-c-stanza.mp3" from={40} to={N39 + 0.4} peak={0.6} />
    <Bed name="Amb terrore" file="amb-d-terrore.mp3" from={N39 - 0.3} to={EP1_END} peak={0.75} />
    {/* effetti */}
    <Hit name="Timbro MAI" file="sfx-timbro.mp3" at={14.5} volume={0.9} />
    <Hit name="Barca riparte" file="sfx-barca.mp3" at={17.0} volume={0.7} />
    <Hit name="Tuono" file="sfx-tuono.mp3" at={THUNDER[0]} volume={0.8} />
    <Hit name="Fulmine: la luce muore" file="sfx-tuono.mp3" at={THUNDER[1]} volume={1} />
    <Hit name="Leva e generatore" file="sfx-generatore.mp3" at={LEVER_UP_AT - 0.1} volume={0.9} />
    <Hit name="Boom 2:14" file="sfx-boom.mp3" at={N39 + 0.05} volume={0.8} />
    <Hit name="Radio si accende" file="sfx-radio.mp3" at={46.6} volume={0.8} />
    <Hit name="Boom non sono navi" file="sfx-boom.mp3" at={52.2} volume={1} />
  </>
);
