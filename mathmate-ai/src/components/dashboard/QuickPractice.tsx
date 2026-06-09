import Link from 'next/link'
const items = [
  { icon: '🤖', label: 'AI Tutor', href: '/tutor', bg: '#E8F5E9' },
  { icon: '🏆', label: 'Leaderboard', href: '/leaderboard', bg: '#FFF8E1' },
]
export function QuickPractice() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map(i => (
        <Link key={i.href} href={i.href}
          className="rounded-2xl p-4 flex items-center gap-3 border border-ninja-border shadow-sm active:scale-95 transition-transform bg-white">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: i.bg }}>{i.icon}</div>
          <p className="font-black text-ninja-text text-sm">{i.label}</p>
        </Link>
      ))}
    </div>
  )
}
