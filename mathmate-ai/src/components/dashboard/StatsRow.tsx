import { UserStats } from '@/types'

export function StatsRow({ stats }: { stats: UserStats | null }) {
  const items = [
    { icon: '🔥', value: `${stats?.current_streak ?? 0}`, label: 'Day Streak' },
    { icon: '🎯', value: '85%',                           label: 'Accuracy'   },
    { icon: '🏆', value: '12',                            label: 'Badges'     },
  ]

  return (
    <div className="flex gap-3 mt-4">
      {items.map(({ icon, value, label }) => (
        <div key={label} className="flex-1 bg-brand-light rounded-2xl p-3 text-center">
          <div className="text-xl mb-1">{icon}</div>
          <p className="font-black text-brand-primary text-base">{value}</p>
          <p className="text-gray-400 text-[10px] font-bold">{label}</p>
        </div>
      ))}
    </div>
  )
}
