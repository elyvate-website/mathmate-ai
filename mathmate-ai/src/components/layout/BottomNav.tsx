'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Dumbbell, BarChart2, User } from 'lucide-react'
import Image from 'next/image'

const NAV = [
  { href: '/dashboard', icon: Home,     label: 'Home' },
  { href: '/practice',  icon: Dumbbell, label: 'Practice' },
]
const NAV_RIGHT = [
  { href: '/progress',  icon: BarChart2, label: 'Progress' },
  { href: '/profile',   icon: User,      label: 'Profile' },
]

export function BottomNav() {
  const path = usePathname()

  const isActive = (href: string) => path === href || path.startsWith(href + '/')

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-phone bottom-nav z-50"
      style={{
        background: 'white',
        borderTop: '1px solid #F0F0F0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2">
        {/* Left 2 items */}
        {NAV.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-4 pb-2 min-w-[60px]">
            <Icon
              size={22}
              strokeWidth={isActive(href) ? 2.5 : 1.8}
              color={isActive(href) ? '#2D7A3A' : '#BDBDBD'}
            />
            <span
              className="text-[10px] font-bold"
              style={{ color: isActive(href) ? '#2D7A3A' : '#BDBDBD' }}
            >
              {label}
            </span>
          </Link>
        ))}

        {/* Center ninja avatar */}
        <Link href="/dashboard" className="flex flex-col items-center -mt-6 mb-1">
          <div
            className="w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)' }}
          >
            <Image
              src="/chill ninja.png"
              alt="Ninja"
              width={48}
              height={48}
              className="object-cover scale-110"
            />
          </div>
        </Link>

        {/* Right 2 items */}
        {NAV_RIGHT.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-0.5 px-4 pb-2 min-w-[60px]">
            <Icon
              size={22}
              strokeWidth={isActive(href) ? 2.5 : 1.8}
              color={isActive(href) ? '#2D7A3A' : '#BDBDBD'}
            />
            <span
              className="text-[10px] font-bold"
              style={{ color: isActive(href) ? '#2D7A3A' : '#BDBDBD' }}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
