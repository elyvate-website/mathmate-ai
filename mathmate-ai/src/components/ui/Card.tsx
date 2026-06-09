import { cn } from '@/lib/utils'
interface CardProps { children: React.ReactNode; variant?: 'default' | 'green'; className?: string }
export function Card({ children, variant = 'default', className }: CardProps) {
  return (
    <div className={cn('rounded-2xl shadow-sm', variant === 'green' ? 'text-white' : 'bg-white border border-ninja-border', className)}
      style={variant === 'green' ? { background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' } : {}}>
      {children}
    </div>
  )
}
