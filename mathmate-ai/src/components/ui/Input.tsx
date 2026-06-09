import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> { label?: string; error?: string }
const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold text-ninja-text mb-1.5">{label}</label>}
    <input ref={ref}
      className={cn('w-full py-3.5 px-4 rounded-2xl border-2 text-sm font-semibold text-ninja-text outline-none transition-colors placeholder:text-ninja-muted',
        error ? 'border-red-400 bg-red-50' : 'border-ninja-border bg-white focus:border-brand-primary', className)}
      {...props} />
    {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}
  </div>
))
Input.displayName = 'Input'
export { Input }
