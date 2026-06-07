'use client'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  index:    number
  text:     string
  state:    'idle' | 'selected' | 'correct' | 'wrong'
  disabled: boolean
  onClick:  () => void
}

const LABELS = ['A', 'B', 'C', 'D']

const STATE_STYLES = {
  idle:     'border-gray-200 bg-white hover:border-brand-primary hover:bg-brand-light text-gray-800',
  selected: 'border-brand-primary bg-brand-light text-brand-primary',
  correct:  'border-green-500 bg-green-50 text-green-800',
  wrong:    'border-red-400 bg-red-50 text-red-800',
}

const BADGE_STYLES = {
  idle:     'bg-gray-100 text-gray-600',
  selected: 'bg-brand-primary text-white',
  correct:  'bg-green-500 text-white',
  wrong:    'bg-red-400 text-white',
}

// Render text that may contain LaTeX like $\sqrt{2}$ or \frac{1}{2}
function SmartText({ text }: { text: string }) {
  // Check if text contains LaTeX markers
  const hasLatex = text.includes('$') || text.includes('\\')

  if (!hasLatex) {
    return <span>{text}</span>
  }

  // Split by $...$ patterns and render each part
  const parts = text.split(/(\$[^$]+\$)/)

  return (
    <span className="flex flex-wrap items-center gap-1">
      {parts.map((part, i) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // This is a LaTeX expression — strip the $ signs
          const latex = part.slice(1, -1)
          return (
            <LatexPart key={i} latex={latex} />
          )
        }
        return part ? <span key={i}>{part}</span> : null
      })}
    </span>
  )
}

// Client-side KaTeX renderer
function LatexPart({ latex }: { latex: string }) {
  if (typeof window === 'undefined') return <span>{latex}</span>

  try {
    const katex = require('katex')
    const html = katex.renderToString(latex, {
      throwOnError: false,
      displayMode:  false,
      trust:        true,
    })
    return (
      <span
        dangerouslySetInnerHTML={{ __html: html }}
        className="inline-block align-middle"
      />
    )
  } catch {
    return <span>{latex}</span>
  }
}

export function OptionButton({ index, text, state, disabled, onClick }: OptionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-3.5 border-2 rounded-2xl flex items-center gap-3',
        'text-sm font-bold text-left transition-all duration-200',
        'disabled:cursor-default',
        STATE_STYLES[state]
      )}
    >
      <span className={cn(
        'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors',
        BADGE_STYLES[state]
      )}>
        {LABELS[index]}
      </span>

      <span className="flex-1">
        <SmartText text={text} />
      </span>

      {state === 'correct' && <span className="text-green-600 font-black ml-auto">✓</span>}
      {state === 'wrong'   && <span className="text-red-500  font-black ml-auto">✗</span>}
    </button>
  )
}
