import type { Caption } from "@remotion/captions";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Captions } from "../Captions";
import ep2Captions from "../ep2/captions.json";
import { Hud } from "../Hud";
import { fontFamily, palette, textShadow } from "../theme";
import { BoatmanCloseUp } from "./Boatman";
import { ep2LightOn, ep2Scene } from "./ep2Scene";
import { GroundFloor } from "./GroundFloor";
import { Bubble, Choice } from "./Overlays";
import { World } from "./World";

// IL FARO · Ep.2 "Spenta" (48 s). La voce parte a 2 s: prima, un attimo di suspense.

const VOICE_START = 2;
const s = (sec: number, fps: number) => Math.round(sec * fps);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const WorldEp2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <World scene={ep2Scene} lightOn={ep2LightOn(frame / fps)} />;
};

// "Avete scelto: B · SPENTA"
const Recap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 13 } });
  const out = interpolate(frame, [2.2 * fps, 2.7 * fps], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", top: 560, fontFamily, opacity: out }}>
      <div style={{ fontSize: 46, fontWeight: 800, color: "white", textShadow, letterSpacing: 4 }}>AVETE SCELTO</div>
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "18px 40px",
          background: "#c22a3a",
          border: "6px solid #14161f",
          borderRadius: 24,
          boxShadow: "0 12px 0 rgba(0,0,0,0.45)",
          scale: pop,
        }}
      >
        <span style={{ fontSize: 60, fontWeight: 800, color: "#14161f", background: "white", borderRadius: "50%", width: 84, height: 84, display: "flex", justifyContent: "center", alignItems: "center" }}>B</span>
        <span style={{ fontSize: 76, fontWeight: 800, color: "white" }}>SPENTA</span>
      </div>
    </AbsoluteFill>
  );
};

// TOC. TOC. TOC. vicino alla porta
const Knocks = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily }}>
      {[0, 0.75, 1.5].map((d, i) => {
        const p = spring({ frame: frame - d * fps, fps, config: { damping: 8, stiffness: 300 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 200 + i * 230,
              top: 760 + (i % 2) * 70,
              fontSize: 96,
              fontWeight: 800,
              color: "white",
              textShadow,
              rotate: `${(i - 1) * 8}deg`,
              scale: p,
              opacity: interpolate(frame, [(d + 2.6) * fps, (d + 3.2) * fps], [1, 0], clamp),
            }}
          >
            TOC.
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Bed = ({
  name,
  file,
  from,
  to,
  peak,
  skip = 0,
  fadeIn = 1,
}: {
  readonly name: string;
  readonly file: string;
  readonly from: number;
  readonly to: number;
  readonly peak: number;
  readonly skip?: number; // secondi da saltare all'inizio del loop
  readonly fadeIn?: number;
}) => {
  const { fps } = useVideoConfig();
  const len = s(to - from, fps);
  return (
    <Sequence name={name} from={s(from, fps)} durationInFrames={len} layout="none">
      <Audio
        src={staticFile(`il-faro/sfx/${file}`)}
        loop
        trimBefore={s(skip, fps)}
        volume={(f) => interpolate(f, [0, fadeIn * fps, len - fps, len], [0, peak, peak, 0], clamp)}
      />
    </Sequence>
  );
};

const Hit = ({ name, file, at, volume = 1 }: { readonly name: string; readonly file: string; readonly at: number; readonly volume?: number }) => {
  const { fps } = useVideoConfig();
  return (
    <Sequence name={name} from={s(at, fps)} layout="none">
      <Audio src={staticFile(`il-faro/sfx/${file}`)} volume={volume} />
    </Sequence>
  );
};

export const IlFaroEp2 = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f" }}>
      <Track name="Inquadrature">
        <Sequence name="Esterno: la leva, il buio, la porta" from={0} durationInFrames={s(25.2, fps)}>
          <WorldEp2 />
        </Sequence>
        <Sequence name="Interno: scende le scale" from={s(25.2, fps)} durationInFrames={s(3.8, fps)}>
          <GroundFloor />
        </Sequence>
        <Sequence name="Il barcaiolo alla finestra" from={s(29, fps)} durationInFrames={s(7, fps)}>
          <BoatmanCloseUp />
        </Sequence>
        <Sequence name="Esterno: gli occhi si riaccendono" from={s(36, fps)} durationInFrames={s(12, fps)}>
          <Sequence from={-s(36, fps)} layout="none">
            <WorldEp2 />
          </Sequence>
        </Sequence>
      </Track>

      <Track name="Grafiche">
        <Sequence name="Avete scelto" from={0} durationInFrames={s(2.8, fps)}>
          <Recap />
        </Sequence>
        <Sequence name="Toc toc toc" from={s(19.85, fps)} durationInFrames={s(5.3, fps)}>
          <Knocks />
        </Sequence>
        <Sequence name="Il barcaiolo parla" from={s(29, fps)} durationInFrames={s(7, fps)}>
          <Bubble
            x={560}
            y={640}
            lines={[
              { text: "«Sei il primo che la spegne.", at: 3.4 },
              { text: "Aprimi… ti spiego tutto.»", at: 5.1 },
            ]}
          />
        </Sequence>
        <Sequence name="Scelta A/B" from={s(42, fps)} durationInFrames={s(6, fps)}>
          <Choice
            a={{ title: "APRI LA PORTA", sub: "Ascolti cosa sa il barcaiolo." }}
            b={{ title: "RIACCENDI LA LUCE", sub: "Gli occhi si fermano. Lui no." }}
            nextEp={3}
          />
        </Sequence>
      </Track>

      {/* suoni: terrore → silenzio → stanza inquieta → terrore */}
      <Bed name="Amb terrore (inizio)" file="amb-d-terrore.mp3" from={0} to={9.6} peak={0.85} skip={4} fadeIn={0.3} />
      <Bed name="Amb silenzio" file="amb-c-stanza.mp3" from={9} to={19.6} peak={0.35} />
      <Bed name="Amb dentro il faro" file="amb-c-stanza.mp3" from={19.4} to={36.4} peak={0.85} />
      <Bed name="Amb terrore (fine)" file="amb-d-terrore.mp3" from={35.8} to={48} peak={0.8} />
      <Hit name="Leva" file="sfx-leva.mp3" at={4.35} />
      <Hit name="Tre colpi" file="sfx-colpi-porta.mp3" at={19.85} />
      <Hit name="Boom barcaiolo" file="sfx-boom.mp3" at={29} volume={0.8} />
      <Hit name="Boom occhi" file="sfx-boom.mp3" at={38} />

      <Hud
        episode={2}
        nightAt={() => 39}
        moneyAt={(sec) => interpolate(sec, [16.6, 17.4], [975000, 0], clamp)}
      />
      <Sequence name="Voce e sottotitoli" from={s(VOICE_START, fps)} layout="none">
        <Audio name="Voce narrante" src={staticFile("il-faro/ep2-voce.mp3")} />
        <Captions captions={ep2Captions as Caption[]} top={300} />
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", boxShadow: `inset 0 0 220px ${palette.ink}` }} />
    </AbsoluteFill>
  );
};
