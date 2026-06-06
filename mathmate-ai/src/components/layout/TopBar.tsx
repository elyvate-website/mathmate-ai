'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter }  from 'next/navigation'
import { cn }         from '@/lib/utils'

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
    <div className={cn('flex items-center justify-between px-5 py-3', className)}>
      {showBack ? (
        <button
          onClick={onBack ?? (() => router.back())}
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center transition-colors',
            dark ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
        </button>
      ) : (
        <div className="w-9" />
      )}

      {title && (
        <h1 className={cn('font-black text-base', dark ? 'text-white' : 'text-gray-900')}>{title}</h1>
      )}

      <div>{right ?? <div className="w-9" />}</div>
    </div>
  )
}
