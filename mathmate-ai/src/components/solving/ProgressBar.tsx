interface ProgressBarProps {
  current: number
  total:   number
}

export function SolvingProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
      <div
        className="bg-purple-gradient h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
