import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'purple' | 'light' | 'glass'
}

export function Card({ className, variant = 'white', children, ...props }: CardProps) {
  const variants = {
    white:  'bg-white shadow-sm border border-gray-100',
    purple: 'bg-purple-gradient text-white shadow-lg shadow-purple-500/30',
    light:  'bg-brand-light border border-purple-100',
    glass:  'bg-white/8 border border-white/12 backdrop-blur-sm',
  }
  return (
    <div className={cn('rounded-2xl p-4', variants[variant], className)} {...props}>
      {children}
    </div>
  )
}
