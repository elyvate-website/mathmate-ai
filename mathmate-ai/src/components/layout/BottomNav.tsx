'use client'
import Link        from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, BarChart2, MessageCircle } from 'lucide-react'
import Image       from 'next/image'
import { useState } from 'react'

const NAV_LEFT  = [
  { href:'/dashboard', icon: Home,          label:'হোম' },
  { href:'/practice',  icon: Dumbbell,      label:'অনুশীলন' },
]
const NAV_RIGHT = [
  { href:'/progress',  icon: BarChart2,     label:'অগ্রগতি' },
  { href:'/tutor',     icon: MessageCircle, label:'টিউটর' },
]

export function BottomNav() {
  const path = usePathname()
  const isActive = (href: string) => path === href || path.startsWith(href+'/')
  const [bouncing, setBouncing] = useState<string|null>(null)

  const handleTap = (href: string) => {
    setBouncing(href)
    setTimeout(() => setBouncing(null), 400)
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bottom-nav"
      style={{ background:'rgba(255,255,255,0.97)', backdropFilter:'blur(16px)', borderTop:'1px solid #F0F0F0', boxShadow:'0 -4px 24px rgba(0,0,0,0.07)' }}>
      <div className="flex items-center justify-around px-2 pt-2">

        {NAV_LEFT.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} onClick={() => handleTap(href)}
              className="flex flex-col items-center gap-0.5 px-4 pb-1 min-w-[60px] relative">
              {/* Active pill indicator */}
              {active && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ background:'linear-gradient(90deg,#2D7A3A,#3DAE4F)' }} />
              )}
              <div className={bouncing===href ? 'nav-icon-bounce' : ''}>
                <Icon size={22} strokeWidth={active?2.5:1.8} color={active?'#2D7A3A':'#BDBDBD'} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: active?'#2D7A3A':'#BDBDBD' }}>{label}</span>
            </Link>
          )
        })}

        {/* Center FAB */}
        <Link href="/subjects" onClick={() => handleTap('/subjects')}
          className="flex flex-col items-center -mt-7 mb-1">
          <div className={`w-14 h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden pulse-ring ${bouncing==='/subjects'?'nav-icon-bounce':''}`}
            style={{ background:'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
            <Image src="/chill ninja.png" alt="Ninja" width={48} height={48} className="object-cover scale-110" />
          </div>
          <span className="text-[10px] font-black mt-0.5" style={{ color:'#2D7A3A' }}>শেখো</span>
        </Link>

        {NAV_RIGHT.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} onClick={() => handleTap(href)}
              className="flex flex-col items-center gap-0.5 px-4 pb-1 min-w-[60px] relative">
              {active && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                  style={{ background:'linear-gradient(90deg,#2D7A3A,#3DAE4F)' }} />
              )}
              <div className={bouncing===href?'nav-icon-bounce':''}>
                <Icon size={22} strokeWidth={active?2.5:1.8} color={active?'#2D7A3A':'#BDBDBD'} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: active?'#2D7A3A':'#BDBDBD' }}>{label}</span>
            </Link>
          )
        })}

      </div>
    </nav>
  )
}
