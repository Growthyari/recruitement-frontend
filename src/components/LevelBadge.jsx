const LEVELS = {
  1: { label: "Seed",    color: "bg-surface-container text-on-surface-variant border-outline-variant" },
  2: { label: "Sprout",  color: "bg-surface-container-high text-primary border-outline-variant" },
  3: { label: "Rising",  color: "bg-secondary-container/40 text-on-secondary-container border-secondary/30" },
  4: { label: "Sharp",   color: "bg-secondary-container text-on-secondary-container border-secondary/50" },
  5: { label: "Elite",   color: "bg-secondary text-on-secondary border-secondary" },
};

export default function LevelBadge({ level = 1 }) {
  const l = LEVELS[Math.min(5, Math.max(1, level))] || LEVELS[1];
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full border text-label-sm font-inter font-semibold ${l.color}`}>
      Level {level} · {l.label}
    </span>
  );
}
