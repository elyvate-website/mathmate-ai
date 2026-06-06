'use client'
import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { cn } from '@/lib/utils'

interface MathExpressionProps {
  latex: string
  display?: boolean
  className?: string
}

export function MathExpression({ latex, display = false, className }: MathExpressionProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, {
        throwOnError: false,
        displayMode:  display,
        trust:        true,
        strict:       false,
      })
    } catch (e) {
      if (ref.current) ref.current.textContent = latex
    }
  }, [latex, display])

  return <span ref={ref} className={cn('katex-wrap', className)} />
}
