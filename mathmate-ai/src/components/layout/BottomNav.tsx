'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PenLine, BookOpen, BarChart2, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     href: '/dashboard',  Icon: Home      },
  { id: 'practice', label: 'Practice', href: '/chapters/9', Icon: PenLine   },
  { id: 'learn',    label: 'Learn',    href: '/chapters/9', Icon: BookOpen  },
  { id: 'progress', label: 'Progress', href: '/progress',   Icon: BarChart2 },
  { id: 'profile',  label: 'Profile',  href: '/profile',    Icon: User      },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-phone bg-white border-t border-gray-100 flex pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.07)]">
      {NAV_ITEMS.map(({ id, label, href, Icon }) => {
        const active = pathname === href || (id === 'home' && pathname === '/dashboard')
        return (
          <Link
            key={id}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 cursor-pointer"
          >
            <Icon
              size={22}
              className={cn('transition-colors', active ? 'text-brand-primary' : 'text-gray-400')}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span className={cn('text-[10px] font-bold transition-colors', active ? 'text-brand-primary' : 'text-gray-400')}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
