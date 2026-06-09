'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter }   from 'next/navigation'
import { cn }          from '@/lib/utils'

interface TopBarProps {
  title?:     string
  showBack?:  boolean
  onBack?:    () => void
  right?:     React.ReactNode
  className?: string
  dark?:      boolean
}

export function TopBar({ title, showBack = true, onBack, right, className, dark }: TopBarProps) {
  const router = useRouter()
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showBack ? (
        <button
          onClick={onBack ?? (() => router.back())}
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
            dark ? 'bg-white/15 text-white' : 'bg-gray-100 text-ninja-text'
          )}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>
      ) : <div className="w-9" />}
      {title && (
        <h1 className={cn('font-black text-base', dark ? 'text-white' : 'text-ninja-text')}>{title}</h1>
      )}
      <div>{right ?? <div className="w-9" />}</div>
    </div>
  )
}
