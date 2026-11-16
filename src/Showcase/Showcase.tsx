import { linearTiming, springTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { useVideoConfig } from "remotion";
import { DataChart } from "./DataChart";
import { Intro } from "./Intro";
import { Kinetic } from "./Kinetic";
import { LightLeakOverlay } from "./LightLeakOverlay";
import { Outro } from "./Outro";
import { Shapes } from "./Shapes";
import { colors } from "./theme";

// 140 + 130 + 140 + 130 + 120 - 3 transizioni da 20 = 600 frame (20s a 30fps)
export const Showcase = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence name="Intro" durationInFrames={140}>
        <Intro style={{ backgroundColor: colors.ink }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: 20,
        })}
      />
      <TransitionSeries.Sequence name="Tipografia" durationInFrames={130}>
        <Kinetic style={{ backgroundColor: colors.paper }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-bottom-left" })}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Dati" durationInFrames={140}>
        <DataChart style={{ backgroundColor: "#12122a" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Overlay durationInFrames={Math.round(1 * fps)}>
        <LightLeakOverlay name="Light leak" />
      </TransitionSeries.Overlay>
      <TransitionSeries.Sequence name="Forme" durationInFrames={130}>
        <Shapes style={{ backgroundColor: "#1b0f2e" }} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 20 })}
      />
      <TransitionSeries.Sequence name="Chiusura" durationInFrames={120}>
        <Outro style={{ backgroundColor: colors.ink }} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
