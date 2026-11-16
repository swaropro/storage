import { Audio } from "@remotion/media";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";

// Ambienti in loop che cambiano con la tensione + effetti nei momenti chiave.
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
    {/* ambienti: calma → vento → silenzio inquieto → terrore */}
    <Bed name="Amb mare calmo" file="amb-a-mare-calmo.mp3" from={0} to={26} peak={0.8} />
    <Bed name="Amb vento" file="amb-b-vento.mp3" from={25} to={35.3} peak={0.85} />
    <Bed name="Amb stanza" file="amb-c-stanza.mp3" from={34.3} to={46.2} peak={0.9} />
    <Bed name="Amb terrore" file="amb-d-terrore.mp3" from={45.4} to={67.5} peak={0.75} />
    {/* effetti */}
    <Hit name="Timbro MAI" file="sfx-timbro.mp3" at={14.5} volume={0.9} />
    <Hit name="Barca riparte" file="sfx-barca.mp3" at={17.0} volume={0.7} />
    <Hit name="Boom 2:14" file="sfx-boom.mp3" at={45.75} volume={0.8} />
    <Hit name="Radio si accende" file="sfx-radio.mp3" at={48.7} volume={0.8} />
    <Hit name="Boom non sono navi" file="sfx-boom.mp3" at={54.3} volume={1} />
  </>
);
