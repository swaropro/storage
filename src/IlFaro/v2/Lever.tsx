// Leva del generatore sul ballatoio. angle: -35 = su (luce accesa), 40 = giù (spenta).
export const Lever = ({ x, y, angle }: { readonly x: number; readonly y: number; readonly angle: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-16} y={-40} width={32} height={40} rx={4} fill="#3a3f4c" stroke="#14161f" strokeWidth={4} />
    <g transform={`rotate(${angle} 0 -30)`}>
      <line x1={0} y1={-30} x2={0} y2={-90} stroke="#14161f" strokeWidth={8} strokeLinecap="round" />
      <circle cx={0} cy={-94} r={11} fill="#c22a3a" stroke="#14161f" strokeWidth={4} />
    </g>
  </g>
);
