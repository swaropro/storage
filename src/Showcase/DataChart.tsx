import {
  Interactive,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, fontFamily } from "./theme";

const data = [
  { label: "Gen", value: 28 },
  { label: "Feb", value: 41 },
  { label: "Mar", value: 37 },
  { label: "Apr", value: 58 },
  { label: "Mag", value: 74 },
  { label: "Giu", value: 97 },
];

const Bars = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 40,
        height: 560,
        width: "100%",
      }}
    >
      {data.map((d, i) => {
        const grow = spring({
          frame: frame - 0.4 * fps - i * 5,
          fps,
          config: { damping: 18 },
        });
        const isLast = i === data.length - 1;
        return (
          <div
            key={d.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              flex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                height: d.value * 5 * grow,
                borderRadius: 18,
                background: isLast
                  ? `linear-gradient(180deg, ${colors.yellow}, ${colors.pink})`
                  : `linear-gradient(180deg, ${colors.cyan}, ${colors.violet})`,
              }}
            />
            <div style={{ fontSize: 40, color: "#b9b6d3" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};

const Counter = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const value = interpolate(frame, [0.4 * fps, 2.6 * fps], [0, 248], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ textAlign: "right" }}>
      <div
        style={{
          fontSize: 150,
          fontWeight: 800,
          color: colors.yellow,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        +{Math.round(value)}%
      </div>
      <div style={{ fontSize: 44, color: "#b9b6d3" }}>crescita in 6 mesi</div>
    </div>
  );
};

const DataChartInner = () => (
  <>
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "110px 140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily,
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Interactive.Div
          name="Titolo grafico"
          style={{ fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}
        >
          Dati che
          <br />
          prendono vita
        </Interactive.Div>
        <Counter />
      </div>
      <Bars />
    </div>
  </>
);

export const DataChart = Interactive.create({
  Component: DataChartInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
