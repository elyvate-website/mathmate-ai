import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?:     'sm' | 'md' | 'lg'
  loading?:  boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-black rounded-2xl transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:   'text-white shadow-md',
      secondary: 'bg-brand-light text-brand-primary hover:bg-green-200',
      ghost:     'bg-white/10 text-white border-2 border-white/25 hover:bg-white/20',
      outline:   'bg-white text-ninja-text border-2 border-ninja-border hover:border-brand-primary hover:text-brand-primary',
      danger:    'bg-red-500 text-white hover:bg-red-600',
    }

    const sizes = {
      sm: 'text-sm px-4 py-2.5',
      md: 'text-sm px-5 py-3.5',
      lg: 'text-base px-6 py-4',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
        style={variant === 'primary' ? { background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' } : undefined}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            লোড হচ্ছে...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export { Button }
