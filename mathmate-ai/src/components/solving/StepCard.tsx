import { MathExpression } from '@/components/shared/MathExpression'

interface StepCardProps {
  stepNum:    number
  totalSteps: number
  question:   string
  latex?:     string
  problemLatex: string
}

export function StepCard({ stepNum, totalSteps, question, latex, problemLatex }: StepCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 text-center">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">প্রশ্ন</p>
      <div className="text-2xl font-black text-gray-900 mb-4 overflow-x-auto">
        <MathExpression latex={problemLatex} display />
      </div>
      <div className="w-full h-px bg-gray-200 mb-4" />
      <p className="text-gray-800 font-bold text-sm leading-relaxed">{question}</p>
      {latex && (
        <div className="mt-2 overflow-x-auto">
          <MathExpression latex={latex} display className="text-brand-primary" />
        </div>
      )}
    </div>
  )
}
