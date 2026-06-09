import { cn } from '@/lib/utils'
type BadgeVariant = 'green' | 'gold' | 'red' | 'gray'
interface BadgeProps { children: React.ReactNode; variant?: BadgeVariant; className?: string }
const colors: Record<BadgeVariant,string> = {
  green: 'bg-brand-light text-brand-primary',
  gold:  'bg-yellow-100 text-yellow-700',
  red:   'bg-red-100 text-red-600',
  gray:  'bg-gray-100 text-ninja-muted',
}
export function Badge({ children, variant = 'green', className }: BadgeProps) {
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold', colors[variant], className)}>{children}</span>
}
