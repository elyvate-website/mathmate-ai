import { Flame } from 'lucide-react'

export function StatsRow({ stats }: { stats: any }) {
  const streak = stats?.current_streak ?? 0
  const coins  = stats?.total_coins ?? 0
  return (
    <div className="flex gap-3 mt-3">
      <div className="flex-1 bg-orange-50 rounded-xl px-3 py-2 flex items-center gap-2">
        <Flame size={16} className="text-orange-500" />
        <div><p className="font-black text-orange-700 text-sm">{streak}</p><p className="text-orange-400 text-[10px]">Day Streak</p></div>
      </div>
      <div className="flex-1 bg-yellow-50 rounded-xl px-3 py-2 flex items-center gap-2">
        <span className="text-base">🪙</span>
        <div><p className="font-black text-yellow-700 text-sm">{coins.toLocaleString()}</p><p className="text-yellow-400 text-[10px]">Coins</p></div>
      </div>
    </div>
  )
}
