export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${pct}%` }} />
      </div>
      <span className="text-ninja-muted text-xs font-bold">{current}/{total}</span>
    </div>
  )
}
