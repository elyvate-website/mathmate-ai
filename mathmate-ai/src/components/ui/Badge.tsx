import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'purple' | 'green' | 'yellow' | 'red' | 'gray'
  className?: string
}

export function Badge({ children, variant = 'purple', className }: BadgeProps) {
  const variants = {
    purple: 'bg-brand-light text-brand-primary',
    green:  'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    red:    'bg-red-50 text-red-600',
    gray:   'bg-gray-100 text-gray-600',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold', variants[variant], className)}>
      {children}
    </span>
  )
}
