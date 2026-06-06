import { cn } from '@/lib/utils'

export function PhoneWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-screen max-w-phone mx-auto bg-white relative overflow-x-hidden', className)}>
      {children}
    </div>
  )
}
