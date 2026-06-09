import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'

export function ProgressCard({ stats }: { stats: any }) {
  const xp     = stats?.total_xp ?? 0
  const level  = getLevelFromXP(xp)
  const xpInfo = getXPForNextLevel(xp)
  return (
    <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg,#1B5E20,#2D7A3A)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-white text-lg">{level}</div>
          <div><p className="text-white font-black">Level {level}</p><p className="text-white/60 text-xs">Math Ninja</p></div>
        </div>
        <p className="text-white/60 text-xs">{xp.toLocaleString()} XP</p>
      </div>
      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-white" style={{ width: `${xpInfo.progress}%` }} />
      </div>
    </div>
  )
}
