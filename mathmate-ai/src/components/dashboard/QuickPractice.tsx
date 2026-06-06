'use client'
import Link from 'next/link'

const ITEMS = [
  { icon: '✏️', label: 'Practice',   sub: 'Solve questions',  href: '/chapters/9', bg: 'bg-blue-50',   ib: 'bg-blue-500'    },
  { icon: '🤖', label: 'AI Tutor',   sub: 'Get AI help',      href: '/chapters/9', bg: 'bg-brand-light', ib: 'bg-brand-primary' },
  { icon: '📝', label: 'Mock Test',  sub: 'Test your skills', href: '/chapters/9', bg: 'bg-yellow-50', ib: 'bg-yellow-500'  },
]

export function QuickPractice() {
  return (
    <div className="flex gap-3">
      {ITEMS.map(({ icon, label, sub, href, bg, ib }) => (
        <Link key={label} href={href}
          className={`flex-1 ${bg} rounded-2xl p-3.5 text-center hover:opacity-90 transition-opacity`}>
          <div className={`w-10 h-10 ${ib} rounded-xl flex items-center justify-center text-lg mx-auto mb-2`}>
            {icon}
          </div>
          <p className="font-black text-gray-900 text-xs mb-0.5">{label}</p>
          <p className="text-gray-400 text-[10px]">{sub}</p>
        </Link>
      ))}
    </div>
  )
}
