export default function DimBar({ label, value = 0 }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-label-md font-inter text-on-surface">
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="grit-bar-track">
        <div className="grit-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
