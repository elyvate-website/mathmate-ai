import { MathExpression } from '@/components/shared/MathExpression'

interface StepCardProps {
  stepNum:      number
  totalSteps:   number
  question:     string
  problemLatex: string
}

// Render mixed text + LaTeX inline
function SmartQuestion({ text }: { text: string }) {
  const hasLatex = text.includes('$') || text.includes('\\')
  if (!hasLatex) return <p className="text-gray-800 font-bold text-sm leading-relaxed">{text}</p>

  const parts = text.split(/(\$[^$]+\$)/)
  return (
    <p className="text-gray-800 font-bold text-sm leading-relaxed flex flex-wrap items-center gap-1">
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1)
          return <MathExpression key={i} latex={latex} />
        }
        return part ? <span key={i}>{part}</span> : null
      })}
    </p>
  )
}

export function StepCard({ stepNum, totalSteps, question, problemLatex }: StepCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5 text-center">
      <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">প্রশ্ন</p>

      {/* Main problem expression */}
      <div className="text-2xl font-black text-gray-900 mb-4 overflow-x-auto min-h-[40px] flex items-center justify-center">
        {problemLatex ? (
          <MathExpression latex={problemLatex} display />
        ) : (
          <span className="text-gray-300 text-base">লোড হচ্ছে...</span>
        )}
      </div>

      <div className="w-full h-px bg-gray-200 mb-4" />

      {/* Step instruction */}
      <SmartQuestion text={question} />
    </div>
  )
}
