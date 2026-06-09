'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter }  from 'next/navigation'
import Image           from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { MathExpression } from '@/components/shared/MathExpression'
import type { Question } from '@/types'

interface Props {
  topic: any
  questions: Question[]
  userId: string
  profile: any
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export function SolvingClient({ topic, questions, userId, profile }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const startRef = useRef(Date.now())

  const [qIdx,       setQIdx]       = useState(0)
  const [selected,   setSelected]   = useState<string | null>(null)
  const [submitted,  setSubmitted]  = useState(false)
  const [showHint,   setShowHint]   = useState(false)
  const [answers,    setAnswers]    = useState<any[]>([])
  const [xpPop,      setXpPop]      = useState(false)

  const q      = questions[qIdx]
  const total  = questions.length
  const pct    = total > 0 ? Math.round(((qIdx) / total) * 100) : 0

  const options = q ? [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean) : []
  const correctLabel = q?.correct_option ?? 'A'

  const handleSelect = (label: string) => {
    if (submitted) return
    setSelected(label)
  }

  const handleSubmit = async () => {
    if (!selected || !q) return
    const isCorrect = selected === correctLabel
    setSubmitted(true)
    if (isCorrect) {
      setXpPop(true)
      setTimeout(() => setXpPop(false), 1600)
    }
    setAnswers(prev => [...prev, {
      question_id: q.id,
      selected,
      correct: correctLabel,
      is_correct: isCorrect,
    }])
  }

  const handleNext = async () => {
    if (qIdx + 1 < total) {
      setQIdx(q => q + 1)
      setSelected(null)
      setSubmitted(false)
      setShowHint(false)
    } else {
      // Save progress
      const correctCount = answers.filter(a => a.is_correct).length + (selected === correctLabel ? 1 : 0)
      const accuracy     = Math.round((correctCount / total) * 100)
      const timeSec      = Math.round((Date.now() - startRef.current) / 1000)
      const coinsEarned  = correctCount * 5
      const xpEarned     = correctCount * 10

      await supabase.from('user_progress').insert({
        user_id:        userId,
        chapter_id:     topic.chapter_id,
        question_id:    q?.id ?? '',
        score:          correctCount,
        total_questions: total,
        accuracy,
        answers_json:   answers,
        time_spent_sec: timeSec,
      })

      // Update stats
      const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', userId).single()
      if (stats) {
        await supabase.from('user_stats').update({
          total_xp:           (stats.total_xp ?? 0) + xpEarned,
          total_coins:        (stats.total_coins ?? 0) + coinsEarned,
          lessons_completed:  (stats.lessons_completed ?? 0) + 1,
          current_streak:     accuracy >= 70 ? (stats.current_streak ?? 0) + 1 : stats.current_streak,
        }).eq('user_id', userId)
      }

      router.push(`/results?score=${correctCount}&total=${total}&topicId=${topic.id}&coins=${coinsEarned}&xp=${xpEarned}`)
    }
  }

  if (!q) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-ninja-muted font-bold">কোনো প্রশ্ন পাওয়া যায়নি</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-ninja-muted">
            <ChevronLeft size={24} />
          </button>
          <p className="font-black text-ninja-text text-sm">
            {topic.chapters?.title_bn ?? 'প্রশ্ন'}
          </p>
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ background: '#FFF3E0' }}
          >
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-orange-700">120</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-1">
          <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${pct}%` }}
            />
          </div>
          <span className="text-ninja-muted text-xs font-bold">{qIdx + 1}/{total}</span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 px-5">
        <div className="flex items-start gap-3 mb-6">
          <div className="flex-1">
            <p className="text-ninja-muted text-xs font-semibold mb-2">Solve for x:</p>
            <div className="text-ninja-text text-2xl font-black leading-tight">
              {q.question_latex ? (
                <MathExpression latex={q.question_latex} display />
              ) : (
                <span>{q.question_bn}</span>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 animate-float" style={{ animationDuration: '3s' }}>
            <Image src="/chill ninja.png" alt="ninja" width={60} height={60} className="object-contain" />
          </div>
        </div>

        {/* Answer options */}
        <p className="text-ninja-muted text-sm font-semibold mb-3">Choose your answer</p>
        <div className="space-y-3">
          {options.map((opt, i) => {
            const label = OPTION_LABELS[i]
            const isSel = selected === label
            const isCorrectOpt = submitted && label === correctLabel
            const isWrongSel   = submitted && isSel && label !== correctLabel

            return (
              <button
                key={label}
                onClick={() => handleSelect(label)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                  isCorrectOpt ? 'option-correct border-green-500 bg-green-50' :
                  isWrongSel   ? 'option-wrong border-red-400 bg-red-50' :
                  isSel        ? 'border-brand-primary bg-brand-light' :
                                 'border-ninja-border bg-white'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{
                    background: isCorrectOpt ? '#22C55E' : isSel && !submitted ? '#2D7A3A' : '#F5F5F5',
                    color:      isCorrectOpt ? 'white'   : isSel && !submitted ? 'white'   : '#757575',
                  }}
                >
                  {label}
                </div>
                <span className={`font-bold text-sm flex-1 ${
                  isCorrectOpt ? 'text-green-700' :
                  isWrongSel   ? 'text-red-600' :
                  isSel        ? 'text-brand-primary' :
                                 'text-ninja-text'
                }`}>
                  {opt}
                </span>
                {isCorrectOpt && <span className="text-green-500 text-lg">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* XP pop */}
      {xpPop && (
        <div className="fixed top-24 right-6 bg-brand-primary text-white px-3 py-1.5 rounded-full text-sm font-black animate-xp-pop z-50">
          +10 XP 🌟
        </div>
      )}

      {/* Bottom actions */}
      <div className="px-5 pb-8 pt-4 flex gap-3">
        <button
          onClick={() => setShowHint(true)}
          className="flex-1 py-3.5 rounded-2xl border-2 border-ninja-border font-black text-ninja-text text-sm active:scale-95 transition-transform"
        >
          Hint
        </button>
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex-2 flex-grow-[2] py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)' }}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-2 flex-grow-[2] py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)' }}
          >
            {qIdx + 1 < total ? 'Next →' : 'Finish 🎉'}
          </button>
        )}
      </div>

      {/* Hint modal */}
      {showHint && q.steps_json && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-phone mx-auto bg-white rounded-t-3xl p-6 pb-10 max-h-[75vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/chill ninja.png" alt="ninja" width={48} height={48} className="object-contain" />
              <div>
                <p className="font-black text-ninja-text">AI Hint</p>
                <p className="text-ninja-muted text-xs">Let&apos;s solve this step by step!</p>
              </div>
            </div>
            <div className="space-y-4">
              {(q.steps_json as any)?.steps?.map((step: any, i: number) => (
                <div key={i} className="border-l-3 border-brand-primary pl-4" style={{ borderLeftWidth: 3, borderLeftColor: '#2D7A3A' }}>
                  <p className="font-black text-ninja-text text-sm mb-1">Step {i + 1}</p>
                  <p className="text-ninja-muted text-sm mb-2">{step.instruction}</p>
                  {step.working_latex && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <MathExpression latex={step.working_latex} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHint(false)}
              className="mt-5 w-full py-3.5 rounded-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
