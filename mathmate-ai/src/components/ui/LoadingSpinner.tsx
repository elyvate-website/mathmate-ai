export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10'
  return (
    <div className={`${s} border-4 border-brand-light rounded-full animate-spin`}
      style={{ borderTopColor: '#2D7A3A' }} />
  )
}
