'use client'
import { UserStats } from '@/types'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'

export function ProgressCard({ stats }: { stats: UserStats | null }) {
  const xp       = stats?.total_xp ?? 0
  const level    = getLevelFromXP(xp)
  const { next, progress } = getXPForNextLevel(xp)

  return (
    <div className="bg-purple-gradient rounded-2xl p-5 shadow-lg shadow-purple-500/30">
      <div className="flex justify-between items-center mb-3">
        <p className="text-white/80 text-sm font-bold">তোমার অগ্রগতি</p>
        <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full">
          Level {level}
        </span>
      </div>
      <div className="bg-white/20 rounded-full h-2.5 overflow-hidden mb-2">
        <div
          className="bg-white h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white/60 text-xs">{xp} / {next} XP</p>
    </div>
  )
}
