import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:   string
  error?:   string
  leftIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-bold text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3.5 border-[1.5px] border-gray-200 rounded-xl text-sm font-medium',
            'outline-none transition-colors placeholder:text-gray-400 bg-white',
            'focus:border-brand-primary focus:ring-2 focus:ring-purple-100',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-50',
            leftIcon && 'pl-11',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
export { Input }
