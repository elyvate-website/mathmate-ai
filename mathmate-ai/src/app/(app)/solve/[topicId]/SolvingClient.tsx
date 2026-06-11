'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter }    from 'next/navigation'
import Image            from 'next/image'
import { ChevronLeft, Lightbulb, CheckCircle2, XCircle, Zap } from 'lucide-react'
import { MathExpression } from '@/components/shared/MathExpression'
import type { Question }  from '@/types'

interface Props {
  topic: any; questions: Question[]; userId: string
  profile: any; initialCoins: number; initialStreak: number
}

const LABELS = ['A','B','C','D']

export function SolvingClient({ topic, questions, profile, initialCoins, initialStreak }: Props) {
  const router   = useRouter()
  const startRef = useRef(Date.now())

  const [qIdx,      setQIdx]      = useState(0)
  const [selected,  setSelected]  = useState<string|null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showHint,  setShowHint]  = useState(false)
  const [answers,   setAnswers]   = useState<any[]>([])
  const [xpPop,     setXpPop]     = useState(false)
  const [combo,     setCombo]     = useState(0)
  const [showCombo, setShowCombo] = useState(false)
  const [wrongAnim, setWrongAnim] = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [questionKey, setQuestionKey] = useState(0)

  const q       = questions[qIdx]
  const total   = questions.length
  const pct     = total > 0 ? Math.round((qIdx / total) * 100) : 0
  const options  = q ? [q.option_a, q.option_b, q.option_c, q.option_d].filter(Boolean) : []
  const correct  = q?.correct_option ?? 'A'

  const handleSelect = (label: string) => { if (!submitted) setSelected(label) }

  const handleSubmit = () => {
    if (!selected || !q) return
    const isCorrect = selected === correct
    setSubmitted(true)
    const newAnswers = [...answers, { question_id: q.id, selected, correct, is_correct: isCorrect }]
    setAnswers(newAnswers)

    if (isCorrect) {
      const newCombo = combo + 1
      setCombo(newCombo)
      setXpPop(true)
      setTimeout(() => setXpPop(false), 1500)
      if (newCombo >= 2) {
        setShowCombo(true)
        setTimeout(() => setShowCombo(false), 2000)
      }
    } else {
      setCombo(0)
      setWrongAnim(true)
      setTimeout(() => setWrongAnim(false), 500)
    }
  }

  const handleNext = async () => {
    if (qIdx + 1 < total) {
      setQIdx(i => i + 1)
      setSelected(null); setSubmitted(false); setShowHint(false)
      setQuestionKey(k => k + 1)
    } else {
      const correctCount = answers.filter(a => a.is_correct).length
      const timeSec      = Math.round((Date.now() - startRef.current) / 1000)
      setSaving(true)
      try {
        const res  = await fetch('/api/progress', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chapterId: topic.chapter_id, answers, score: correctCount, totalQuestions: total, timeTakenSec: timeSec }),
        })
        const data = await res.json()
        router.push(`/results?score=${correctCount}&total=${total}&topicId=${topic.id}&coins=${correctCount*5}&xp=${correctCount*10}&streak=${data.newStreak ?? initialStreak}`)
      } catch {
        router.push(`/results?score=${answers.filter(a=>a.is_correct).length}&total=${total}&topicId=${topic.id}&coins=0&xp=0&streak=${initialStreak}`)
      }
    }
  }

  if (!q) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 page-enter">
      <Image src="/chill ninja.png" alt="ninja" width={110} height={110} className="object-contain opacity-80" />
      <p className="font-black text-ninja-dark text-lg text-center">প্রশ্ন এখনো যোগ করা হয়নি</p>
      <p className="text-ninja-muted text-sm text-center">এই টপিকের প্রশ্নগুলো শীঘ্রই আসছে!</p>
      <button onClick={() => router.back()} className="mt-2 px-6 py-3 rounded-2xl font-black text-white text-sm"
        style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>ফিরে যাও</button>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F9F7' }}>

      {/* Header */}
      <div className="px-4 pt-12 pb-3 bg-white border-b border-ninja-border">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => router.back()} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F5F5F5' }}>
            <ChevronLeft size={20} className="text-ninja-dark" />
          </button>
          <p className="font-black text-ninja-dark text-sm max-w-[180px] truncate">
            {topic.chapters?.title_bn ?? 'প্রশ্ন'}
          </p>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: '#FFF8E1' }}>
            <span className="text-sm">🪙</span>
            <span className="text-xs font-black" style={{ color: '#E65100' }}>{initialCoins}</span>
          </div>
        </div>
        {/* Progress bar with glow */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#EFEFEF' }}>
            <div className="h-full rounded-full transition-all duration-700 progress-bar-glow"
              style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${pct}%` }} />
          </div>
          <span className="text-ninja-muted text-xs font-black w-10 text-right">{qIdx+1}/{total}</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 overflow-y-auto py-4">
        <div key={questionKey} className="slide-in-right">
          {/* Q card */}
          <div className="card-raised p-4 mb-4" style={{ background: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)' }}>
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: '#BBF7D0', color: '#2D7A3A' }}>প্রশ্ন {qIdx+1}</span>
                  <span className="text-[10px] text-ninja-muted font-semibold capitalize">{q.difficulty}</span>
                </div>
                {q.question_latex
                  ? <div className="text-ninja-dark text-base leading-relaxed"><MathExpression latex={q.question_latex} display /></div>
                  : <p className="text-ninja-dark text-base font-bold leading-relaxed">{q.question_bn}</p>
                }
              </div>
              <div className="flex-shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <Image src="/chill ninja.png" alt="ninja" width={52} height={52} className="object-contain" />
              </div>
            </div>
          </div>

          {/* Options */}
          <p className="text-ninja-muted text-xs font-bold mb-2.5 px-1">সঠিক উত্তর বেছে নাও</p>
          <div className="space-y-2.5 mb-4">
            {options.map((opt, i) => {
              const label      = LABELS[i]
              const isSel      = selected === label
              const isCorrect  = submitted && label === correct
              const isWrong    = submitted && isSel && label !== correct
              const extraClass = isCorrect ? 'option-correct' : isWrong ? (wrongAnim ? 'option-wrong' : '') : ''

              let border = '#EFEFEF', bg = '#FFFFFF', text = '#1A1A1A', cirBg = '#F5F5F5', cirTxt = '#9E9E9E'
              if (isCorrect) { border='#22C55E'; bg='#F0FDF4'; text='#15803D'; cirBg='#22C55E'; cirTxt='white' }
              else if (isWrong) { border='#EF4444'; bg='#FEF2F2'; text='#DC2626'; cirBg='#EF4444'; cirTxt='white' }
              else if (isSel)  { border='#2D7A3A'; bg='#E8F5E9'; text='#2D7A3A'; cirBg='#2D7A3A'; cirTxt='white' }

              return (
                <button key={label} onClick={() => handleSelect(label)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${!submitted?'active:scale-[0.98]':''} ${extraClass}`}
                  style={{ borderColor: border, background: bg }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-all"
                    style={{ background: cirBg, color: cirTxt }}>{label}</div>
                  <span className="font-semibold text-sm flex-1 leading-snug" style={{ color: text }}>{opt}</span>
                  {isCorrect && <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />}
                  {isWrong   && <XCircle      size={18} className="text-red-400 flex-shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {submitted && q.answer_bn && (
            <div className="rounded-2xl p-4 mb-3 animate-fade-up" style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A' }}>
              <p className="font-black text-xs mb-1" style={{ color: '#92400E' }}>💡 ব্যাখ্যা</p>
              <p className="text-sm font-semibold leading-relaxed" style={{ color: '#78350F' }}>{q.answer_bn}</p>
              {q.answer_latex && (
                <div className="mt-2 bg-white rounded-xl p-2"><MathExpression latex={q.answer_latex} /></div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* XP pop */}
      {xpPop && (
        <div className="fixed top-24 right-5 text-white px-3 py-1.5 rounded-full text-sm font-black z-50 flex items-center gap-1"
          style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', animation: 'xpPop 1.5s ease forwards' }}>
          <Zap size={13} /> +10 XP
        </div>
      )}

      {/* Combo toast */}
      {showCombo && (
        <div className="fixed top-36 right-5 text-white px-4 py-2 rounded-2xl text-sm font-black z-50 combo-toast"
          style={{ background: 'linear-gradient(135deg,#FF8F00,#FFC107)' }}>
          🔥 {combo}x Combo!
        </div>
      )}

      {/* Bottom bar */}
      <div className="px-4 pb-8 pt-3 flex gap-3 bg-white border-t border-ninja-border">
        {q.steps_json && (q.steps_json as any)?.steps?.length > 0 && (
          <button onClick={() => setShowHint(true)}
            className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border-2 font-black text-ninja-muted text-sm active:scale-95 transition-transform"
            style={{ borderColor: '#EFEFEF' }}>
            <Lightbulb size={16} /> সমাধান
          </button>
        )}
        {!submitted ? (
          <button onClick={handleSubmit} disabled={!selected}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
            উত্তর জমা দাও
          </button>
        ) : (
          <button onClick={handleNext} disabled={saving}
            className="flex-1 py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
            {saving ? 'সংরক্ষণ...' : qIdx+1 < total ? 'পরবর্তী →' : 'সম্পন্ন 🎉'}
          </button>
        )}
      </div>

      {/* Hint modal */}
      {showHint && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowHint(false)}>
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl pb-10 max-h-[80vh] flex flex-col animate-fade-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-ninja-border">
              <div className="flex items-center gap-2">
                <Image src="/chill ninja.png" alt="ninja" width={36} height={36} className="object-contain" />
                <div>
                  <p className="font-black text-ninja-dark text-sm">ধাপে ধাপে সমাধান</p>
                  <p className="text-ninja-muted text-xs">Step-by-step solution</p>
                </div>
              </div>
              <button onClick={() => setShowHint(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: '#F5F5F5', color: '#9E9E9E' }}>✕</button>
            </div>
            <div className="overflow-y-auto px-5 py-4 space-y-4">
              {(q.steps_json as any)?.steps?.map((step: any, i: number) => (
                <div key={i} className="flex gap-3 animate-fade-up" style={{ animationDelay: `${i*0.07}s` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 text-white mt-0.5"
                    style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>{i+1}</div>
                  <div className="flex-1">
                    <p className="font-black text-ninja-dark text-sm mb-1">{step.instruction}</p>
                    {step.working && <p className="text-ninja-muted text-xs mb-2">{step.working}</p>}
                    {step.working_latex && (
                      <div className="rounded-xl p-3" style={{ background: '#F5F5F5' }}>
                        <MathExpression latex={step.working_latex} />
                      </div>
                    )}
                    {step.explanation && <p className="text-xs font-semibold mt-2" style={{ color: '#2D7A3A' }}>{step.explanation}</p>}
                  </div>
                </div>
              ))}
              {(q.steps_json as any)?.final_answer && (
                <div className="rounded-2xl p-4 mt-2" style={{ background: 'linear-gradient(135deg,#E8F5E9,#DCFCE7)', border: '1.5px solid #86EFAC' }}>
                  <p className="font-black text-sm mb-1" style={{ color: '#2D7A3A' }}>✅ চূড়ান্ত উত্তর</p>
                  <p className="font-bold text-sm text-ninja-dark">{(q.steps_json as any).final_answer}</p>
                </div>
              )}
            </div>
            <div className="px-5 pt-2">
              <button onClick={() => setShowHint(false)} className="w-full py-3.5 rounded-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>বুঝেছি!</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
