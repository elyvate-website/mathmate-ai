'use client'
import { useState, useRef } from 'react'
import { useRouter }  from 'next/navigation'
import Image           from 'next/image'
import { ChevronLeft, Lightbulb, CheckCircle2, XCircle } from 'lucide-react'
import { MathExpression } from '@/components/shared/MathExpression'
import type { Question } from '@/types'

interface Props {
  topic: any
  questions: Question[]
  userId: string
  profile: any
  initialCoins: number
  initialStreak: number
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export function SolvingClient({ topic, questions, userId, profile, initialCoins, initialStreak }: Props) {
  const router   = useRouter()
  const startRef = useRef(Date.now())

  const [qIdx,      setQIdx]      = useState(0)
  const [selected,  setSelected]  = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showHint,  setShowHint]  = useState(false)
  const [answers,   setAnswers]   = useState<any[]>([])
  const [xpPop,     setXpPop]     = useState(false)
  const [saving,    setSaving]    = useState(false)

  const q      = questions[qIdx]
  const total  = questions.length
  const pct    = total > 0 ? Math.round(((qIdx) / total) * 100) : 0

  const options      = q ? [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean) : []
  const correctLabel = q?.correct_option ?? 'A'

  const handleSelect = (label: string) => {
    if (submitted) return
    setSelected(label)
  }

  const handleSubmit = () => {
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
      setQIdx(i => i + 1)
      setSelected(null)
      setSubmitted(false)
      setShowHint(false)
    } else {
      // answers array already has the last answer from handleSubmit
      const finalAnswers  = answers
      const correctCount  = finalAnswers.filter(a => a.is_correct).length
      const accuracy      = Math.round((correctCount / total) * 100)
      const timeSec       = Math.round((Date.now() - startRef.current) / 1000)
      const coinsEarned   = correctCount * 5
      const xpEarned      = correctCount * 10

      setSaving(true)
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chapterId:      topic.chapter_id,
            answers:        finalAnswers,
            score:          correctCount,
            totalQuestions: total,
            timeTakenSec:   timeSec,
          }),
        })
        const data = await res.json()
        const streak = data.newStreak ?? initialStreak
        router.push(`/results?score=${correctCount}&total=${total}&topicId=${topic.id}&coins=${coinsEarned}&xp=${xpEarned}&streak=${streak}`)
      } catch {
        router.push(`/results?score=${correctCount}&total=${total}&topicId=${topic.id}&coins=${coinsEarned}&xp=${xpEarned}&streak=${initialStreak}`)
      }
    }
  }

  if (!q) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
      <div className="text-6xl">📭</div>
      <p className="text-ninja-text font-black text-lg text-center">প্রশ্ন এখনো যোগ করা হয়নি</p>
      <p className="text-ninja-muted text-sm text-center">এই টপিকের প্রশ্নগুলো শীঘ্রই আসছে!</p>
      <button
        onClick={() => router.back()}
        className="mt-2 px-6 py-3 rounded-2xl font-black text-white text-sm"
        style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
      >
        ফিরে যাও
      </button>
    </div>
  )

  const hasSteps = q.steps_json && (q.steps_json as any)?.steps?.length > 0

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <ChevronLeft size={20} className="text-ninja-text" />
          </button>
          <p className="font-black text-ninja-text text-sm max-w-[180px] truncate text-center">
            {topic.chapters?.title_bn ?? 'প্রশ্ন'}
          </p>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: '#FFF8E1' }}>
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black text-amber-700">{initialCoins}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${pct}%` }}
            />
          </div>
          <span className="text-ninja-muted text-xs font-bold w-10 text-right">{qIdx + 1}/{total}</span>
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 px-5 overflow-y-auto">
        {/* Question */}
        <div className="rounded-3xl p-5 mb-5 mt-2" style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' }}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-brand-primary" style={{ background: '#BBF7D0' }}>
                  প্রশ্ন {qIdx + 1}
                </span>
                <span className="text-[10px] text-ninja-muted font-semibold capitalize">{q.difficulty}</span>
              </div>
              {q.question_latex ? (
                <div className="text-ninja-text text-base leading-relaxed">
                  <MathExpression latex={q.question_latex} display />
                </div>
              ) : (
                <p className="text-ninja-text text-base font-bold leading-relaxed">{q.question_bn}</p>
              )}
            </div>
            <div className="flex-shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <Image src="/chill ninja.png" alt="ninja" width={52} height={52} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Answer options */}
        <p className="text-ninja-muted text-xs font-semibold mb-3 px-1">সঠিক উত্তর বেছে নাও</p>
        <div className="space-y-2.5 mb-5">
          {options.map((opt, i) => {
            const label         = OPTION_LABELS[i]
            const isSel         = selected === label
            const isCorrectOpt  = submitted && label === correctLabel
            const isWrongSel    = submitted && isSel && label !== correctLabel

            let borderColor = '#E8E8E8'
            let bgColor     = '#FFFFFF'
            let textColor   = '#212121'
            let circleColor = '#F5F5F5'
            let circleText  = '#757575'

            if (isCorrectOpt)      { borderColor = '#22C55E'; bgColor = '#F0FDF4'; textColor = '#15803D'; circleColor = '#22C55E'; circleText = 'white' }
            else if (isWrongSel)   { borderColor = '#EF4444'; bgColor = '#FEF2F2'; textColor = '#DC2626'; circleColor = '#EF4444'; circleText = 'white' }
            else if (isSel)        { borderColor = '#2D7A3A'; bgColor = '#E8F5E9'; textColor = '#2D7A3A'; circleColor = '#2D7A3A'; circleText = 'white' }

            return (
              <button
                key={label}
                onClick={() => handleSelect(label)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${!submitted ? 'active:scale-[0.98]' : ''}`}
                style={{ borderColor, background: bgColor }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-all"
                  style={{ background: circleColor, color: circleText }}
                >
                  {label}
                </div>
                <span className="font-semibold text-sm flex-1 leading-snug" style={{ color: textColor }}>
                  {opt}
                </span>
                {isCorrectOpt && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
                {isWrongSel   && <XCircle      size={18} className="text-red-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Explanation shown after submit */}
        {submitted && q.answer_bn && (
          <div className="rounded-2xl p-4 mb-4" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
            <p className="text-amber-800 font-black text-xs mb-1">💡 ব্যাখ্যা</p>
            <p className="text-amber-900 text-sm font-semibold leading-relaxed">{q.answer_bn}</p>
            {q.answer_latex && (
              <div className="mt-2 bg-white rounded-xl p-2">
                <MathExpression latex={q.answer_latex} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* XP pop */}
      {xpPop && (
        <div className="fixed top-24 right-5 bg-brand-primary text-white px-3 py-1.5 rounded-full text-sm font-black z-50" style={{ animation: 'xpPop 1.5s ease forwards' }}>
          +10 XP 🌟
        </div>
      )}

      {/* Bottom actions */}
      <div className="px-5 pb-8 pt-3 flex gap-3 border-t border-gray-100">
        {hasSteps && (
          <button
            onClick={() => setShowHint(true)}
            className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border-2 border-ninja-border font-black text-ninja-muted text-sm active:scale-95 transition-transform"
          >
            <Lightbulb size={16} />
            সমাধান
          </button>
        )}
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
          >
            উত্তর জমা দাও
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={saving}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
          >
            {saving ? 'সংরক্ষণ হচ্ছে...' : qIdx + 1 < total ? 'পরবর্তী প্রশ্ন →' : 'সম্পন্ন 🎉'}
          </button>
        )}
      </div>

      {/* Step-by-step hint modal */}
      {showHint && hasSteps && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-phone mx-auto bg-white rounded-t-3xl pb-10 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="/chill ninja.png" alt="ninja" width={36} height={36} className="object-contain" />
                <div>
                  <p className="font-black text-ninja-text text-sm">ধাপে ধাপে সমাধান</p>
                  <p className="text-ninja-muted text-xs">Step-by-step solution</p>
                </div>
              </div>
              <button onClick={() => setShowHint(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-ninja-muted font-black text-sm">✕</button>
            </div>
            <div className="overflow-y-auto px-6 py-4 space-y-4">
              {(q.steps_json as any)?.steps?.map((step: any, i: number) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 text-white mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-ninja-text text-sm mb-1">{step.instruction}</p>
                    {step.working && <p className="text-ninja-muted text-xs mb-2">{step.working}</p>}
                    {step.working_latex && (
                      <div className="bg-gray-50 rounded-xl p-3">
                        <MathExpression latex={step.working_latex} />
                      </div>
                    )}
                    {step.explanation && (
                      <p className="text-brand-primary text-xs font-semibold mt-2">{step.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
              {(q.steps_json as any)?.final_answer && (
                <div className="rounded-2xl p-4 mt-2" style={{ background: 'linear-gradient(135deg,#E8F5E9,#DCFCE7)', border: '1.5px solid #86EFAC' }}>
                  <p className="text-brand-primary font-black text-sm mb-1">✅ চূড়ান্ত উত্তর</p>
                  <p className="text-ninja-text font-bold text-sm">{(q.steps_json as any).final_answer}</p>
                  {(q.steps_json as any)?.final_answer_latex && (
                    <div className="mt-2">
                      <MathExpression latex={(q.steps_json as any).final_answer_latex} display />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-6 pt-2">
              <button
                onClick={() => setShowHint(false)}
                className="w-full py-3.5 rounded-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
              >
                বুঝেছি!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
