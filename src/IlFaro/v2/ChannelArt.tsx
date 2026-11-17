import { random } from "remotion";
import { fontFamily } from "../theme";
import { Keeper } from "./Keeper";

// Immagini del canale YouTube: foto profilo (800×800) e banner (2560×1440).

const INK = "#14161f";

const Stars = ({ w, h, n }: { readonly w: number; readonly h: number; readonly n: number }) => (
  <>
    {new Array(n).fill(true).map((_, i) => (
      <circle key={i} cx={random(`cx${i}`) * w} cy={random(`cy${i}`) * h} r={1.5 + random(`cr${i}`) * 2.5} fill="white" opacity={0.3 + random(`co${i}`) * 0.5} />
    ))}
  </>
);

// Trattini del saluto vicino alla mano
const WaveLines = ({ x, y, s }: { readonly x: number; readonly y: number; readonly s: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#ffd23f" strokeWidth={9} strokeLinecap="round" fill="none">
    <path d="M -40 -10 Q -55 20 -40 50" />
    <path d="M -70 -25 Q -92 20 -70 65" />
  </g>
);

// Faro (origine alla base), con fascio di luce verso sinistra
const MiniLighthouse = ({ x, y, s }: { readonly x: number; readonly y: number; readonly s: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <polygon points="0,-690 -1400,-860 -1400,-520" fill="url(#beamArt)" opacity={0.55} />
    <circle cx={0} cy={-690} r={170} fill="url(#glowArt)" />
    <polygon points="-75,-620 75,-620 115,0 -115,0" fill="#e9e4da" stroke={INK} strokeWidth={6} />
    <clipPath id="towerArt">
      <polygon points="-75,-620 75,-620 115,0 -115,0" />
    </clipPath>
    <g clipPath="url(#towerArt)" fill="#b3263a">
      <rect x={-200} y={-520} width={400} height={90} />
      <rect x={-200} y={-330} width={400} height={90} />
      <rect x={-200} y={-140} width={400} height={90} />
    </g>
    <rect x={-125} y={-643} width={250} height={20} rx={4} fill="#2b2f3b" stroke={INK} strokeWidth={4} />
    <rect x={-55} y={-760} width={110} height={118} rx={8} fill="#fff1b8" stroke={INK} strokeWidth={6} />
    <path d="M -72 -757 L 0 -825 L 72 -757 Z" fill="#2b2f3b" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

const Defs = () => (
  <defs>
    <linearGradient id="skyArt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0a1230" />
      <stop offset="1" stopColor="#24406e" />
    </linearGradient>
    <linearGradient id="beamArt" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#fff2c2" stopOpacity="0.95" />
      <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="glowArt">
      <stop offset="0" stopColor="#fff2c2" stopOpacity="0.9" />
      <stop offset="1" stopColor="#fff2c2" stopOpacity="0" />
    </radialGradient>
  </defs>
);

const Sea = ({ w, y }: { readonly w: number; readonly y: number }) => (
  <>
    <rect x={0} y={y} width={w} height={2000} fill="#1c3550" />
    <path d={`M 0 ${y + 40} Q ${w / 4} ${y + 10} ${w / 2} ${y + 40} T ${w} ${y + 40} L ${w} ${y + 2000} L 0 ${y + 2000} Z`} fill="#13283f" />
  </>
);

// Foto profilo: l'omino che saluta davanti al faro (centrato per il ritaglio tondo)
export const ChannelAvatar = () => (
  <svg width={800} height={800} style={{ background: "#0a1230" }}>
    <Defs />
    <rect width={800} height={800} fill="url(#skyArt)" />
    <Stars w={800} h={500} n={40} />
    <MiniLighthouse x={590} y={640} s={0.62} />
    <Sea w={800} y={640} />
    <Keeper x={330} y={705} facing={1} scale={2.55} armFront={12} wave={-140} stance={10} />
    <WaveLines x={190} y={250} s={1.3} />
  </svg>
);

// Banner: titolo nella fascia sicura centrale (1546×423, al centro di 2560×1440)
export const ChannelBanner = () => (
  <div style={{ width: 2560, height: 1440, position: "relative", background: "#0a1230" }}>
    <svg width={2560} height={1440} style={{ position: "absolute", inset: 0 }}>
      <Defs />
      <rect width={2560} height={1440} fill="url(#skyArt)" />
      <Stars w={2560} h={900} n={140} />
      <circle cx={400} cy={360} r={90} fill="#f3eccf" opacity={0.9} />
      <MiniLighthouse x={1880} y={960} s={0.62} />
      <Sea w={2560} y={960} />
      <Keeper x={650} y={940} facing={1} scale={1.9} armFront={12} wave={-140} stance={10} />
      <WaveLines x={545} y={580} s={1} />
    </svg>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 520,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily,
        color: "white",
        textShadow: "0 8px 0 rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ fontSize: 180, fontWeight: 800, letterSpacing: 8, lineHeight: 1 }}>IL FARO</div>
      <div style={{ marginTop: 24, fontSize: 58, fontWeight: 800, color: "#ffd23f" }}>
        Una storia. Una scelta. <span style={{ color: "#ff3b4e" }}>Decidi tu.</span>
      </div>
    </div>
  </div>
);
