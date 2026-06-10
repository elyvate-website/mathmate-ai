'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, BarChart2, MessageCircle } from 'lucide-react'
import Image from 'next/image'

const NAV_LEFT = [
  { href: '/dashboard', icon: Home,          label: 'হোম' },
  { href: '/practice',  icon: Dumbbell,      label: 'অনুশীলন' },
]
const NAV_RIGHT = [
  { href: '/progress',  icon: BarChart2,     label: 'অগ্রগতি' },
  { href: '/tutor',     icon: MessageCircle, label: 'টিউটর' },
]

export function BottomNav() {
  const path = usePathname()
  const isActive = (href: string) => path === href || path.startsWith(href + '/')

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-phone z-50"
      style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #F0F0F0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {NAV_LEFT.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-4 pb-1 min-w-[60px]">
            <Icon size={22} strokeWidth={isActive(href) ? 2.5 : 1.8} color={isActive(href) ? '#2D7A3A' : '#BDBDBD'} />
            <span className="text-[10px] font-bold" style={{ color: isActive(href) ? '#2D7A3A' : '#BDBDBD' }}>{label}</span>
          </Link>
        ))}

        {/* Center ninja FAB */}
        <Link href="/subjects" className="flex flex-col items-center -mt-7 mb-1">
          <div
            className="w-14 h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
          >
            <Image src="/chill ninja.png" alt="Ninja" width={48} height={48} className="object-cover scale-110" />
          </div>
          <span className="text-[10px] font-bold mt-0.5" style={{ color: '#2D7A3A' }}>শেখো</span>
        </Link>

        {NAV_RIGHT.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-4 pb-1 min-w-[60px]">
            <Icon size={22} strokeWidth={isActive(href) ? 2.5 : 1.8} color={isActive(href) ? '#2D7A3A' : '#BDBDBD'} />
            <span className="text-[10px] font-bold" style={{ color: isActive(href) ? '#2D7A3A' : '#BDBDBD' }}>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
