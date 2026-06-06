import { cn } from '@/lib/utils'

interface FeedbackCardProps {
  correct:     boolean
  explanation: string
}

export function FeedbackCard({ correct, explanation }: FeedbackCardProps) {
  return (
    <div className={cn(
      'rounded-2xl p-4 animate-slide-up',
      'border-l-4',
      correct
        ? 'bg-green-50 border-green-500'
        : 'bg-red-50 border-red-400'
    )}>
      <p className={cn('font-black text-sm mb-1', correct ? 'text-green-800' : 'text-red-800')}>
        {correct ? '✅ দারুণ! সঠিক উত্তর' : '❌ সঠিক নয়! মনে রাখো'}
      </p>
      <p className={cn('text-sm leading-relaxed', correct ? 'text-green-700' : 'text-red-700')}>
        {explanation}
      </p>
    </div>
  )
}
