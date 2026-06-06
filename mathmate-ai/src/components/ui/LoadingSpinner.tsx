import { cn } from '@/lib/utils'

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-8 h-8 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin" />
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
      <div className="w-12 h-12 border-4 border-brand-light border-t-brand-primary rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium animate-pulse">লোড হচ্ছে...</p>
    </div>
  )
}
