export default function GritMeter({ score = 0, size = 160, strokeWidth = 12, label = "Top 4%" }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#dee8ff" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#006a66" strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-hanken font-black text-primary leading-none"
          style={{ fontSize: size * 0.28 }}>
          {Math.round(pct)}
        </span>
        <span className="font-inter text-on-surface-variant font-medium"
          style={{ fontSize: size * 0.09 }}>
          {label}
        </span>
      </div>
    </div>
  );
}
