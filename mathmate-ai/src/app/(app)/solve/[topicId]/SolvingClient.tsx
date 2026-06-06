'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter }          from 'next/navigation'
import { TopBar }             from '@/components/layout/TopBar'
import { SolvingProgressBar } from '@/components/solving/ProgressBar'
import { StepCard }           from '@/components/solving/StepCard'
import { OptionButton }       from '@/components/solving/OptionButton'
import { FeedbackCard }       from '@/components/solving/FeedbackCard'
import { Button }             from '@/components/ui/Button'
import { PageLoader }         from '@/components/ui/LoadingSpinner'
import { SolutionStep }       from '@/types'
import { Lightbulb }          from 'lucide-react'

interface SolvingClientProps {
  topic:  any
  userId: string
}

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong'

export function SolvingClient({ topic, userId }: SolvingClientProps) {
  const router = useRouter()

  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [solution,  setSolution]  = useState<any>(null)
  const [steps,     setSteps]     = useState<SolutionStep[]>([])
  const [stepIdx,   setStepIdx]   = useState(0)
  const [selected,  setSelected]  = useState<number | null>(null)
  const [answered,  setAnswered]  = useState(false)
  const [correct,   setCorrect]   = useState<boolean | null>(null)
  const [score,     setScore]     = useState(0)
  const [coins,     setCoins]     = useState(0)
  const [showHint,  setShowHint]  = useState(false)
  const [xpAnim,    setXpAnim]    = useState(false)
  const startTime = useRef(Date.now())

  // Fetch AI solution
  const fetchSolution = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/solve', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ topicId: topic.id }),
      })
      if (!res.ok) throw new Error('AI সমাধান লোড করতে সমস্যা হয়েছে')
      const { solution: sol } = await res.json()
      setSolution(sol)
      setSteps(sol.steps_json?.steps ?? [])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [topic.id])

  useEffect(() => { fetchSolution() }, [fetchSolution])

  const currentStep = steps[stepIdx]
  const isLastStep  = stepIdx === steps.length - 1

  const handleSelect = (idx: number) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const isCorrect = idx === currentStep.correct_index
    setCorrect(isCorrect)
    if (isCorrect) {
      setScore(s => s + 1)
      setCoins(c => c + 5)
      setXpAnim(true)
      setTimeout(() => setXpAnim(false), 1500)
    }
  }

  const handleNext = async () => {
    if (!isLastStep) {
      setStepIdx(i => i + 1)
      setSelected(null); setAnswered(false); setCorrect(null); setShowHint(false)
    } else {
      // Save progress
      const timeSec = Math.round((Date.now() - startTime.current) / 1000)
      await fetch('/api/progress', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId:    topic.id,
          solutionId: solution?.id,
          score,
          totalSteps: steps.length,
          timeTakenSec: timeSec,
          answers: [],
        }),
      })
      router.push(`/results?score=${score}&total=${steps.length}&topicId=${topic.id}&coins=${coins}&xp=${score * 10}`)
    }
  }

  const getOptionState = (idx: number): OptionState => {
    if (!answered) return selected === idx ? 'selected' : 'idle'
    if (idx === currentStep.correct_index) return 'correct'
    if (idx === selected) return 'wrong'
    return 'idle'
  }

  // ── Loading ──────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-6">
      <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center text-3xl animate-pulse">🤖</div>
      <div className="text-center">
        <p className="font-black text-gray-900 text-lg mb-2">AI প্রস্তুত করছে...</p>
        <p className="text-gray-400 text-sm">তোমার জন্য সমস্যা তৈরি হচ্ছে</p>
      </div>
      <div className="flex gap-2">
        {[0,1,2].map(i => (
          <div key={i} className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
        ))}
      </div>
    </div>
  )

  // ── Error ──────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
      <div className="text-5xl">😔</div>
      <p className="font-black text-gray-900">কিছু একটা সমস্যা হয়েছে</p>
      <p className="text-gray-400 text-sm">{error}</p>
      <Button onClick={fetchSolution}>আবার চেষ্টা করো</Button>
    </div>
  )

  if (!currentStep) return <PageLoader />

  const chapter = topic.chapters as any

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* XP Animation */}
      {xpAnim && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          style={{ animation: 'xpPop 1.5s ease forwards' }}>
          <div className="bg-brand-primary text-white px-5 py-2 rounded-full font-black text-base shadow-lg">
            +10 XP 🌟
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <TopBar showBack onBack={() => router.back()} />
          <p className="text-gray-400 text-xs font-bold">
            ধাপ {stepIdx + 1} / {steps.length}
          </p>
          <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
            <span className="text-sm">🪙</span>
            <span className="font-black text-yellow-600 text-sm">{coins}</span>
          </div>
        </div>
        <SolvingProgressBar current={stepIdx + 1} total={steps.length} />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {/* Topic label */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-bold">{chapter?.title_bn} →</span>
          <span className="text-xs text-brand-primary font-bold">{topic.title_bn}</span>
        </div>

        {/* Step card */}
        <StepCard
          stepNum={stepIdx + 1}
          totalSteps={steps.length}
          question={currentStep.instruction}
          problemLatex={solution?.problem_latex ?? ''}
        />

        {/* Hint button */}
        <button onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
          <Lightbulb size={15} />
          {showHint ? 'হিন্ট লুকাও' : 'হিন্ট দেখো'}
        </button>

        {showHint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800 font-medium animate-slide-up">
            💡 {currentStep.explanation}
          </div>
        )}

        {/* Options */}
        <div className="space-y-2.5">
          {currentStep.mcq_options.map((opt, i) => (
            <OptionButton
              key={i}
              index={i}
              text={opt}
              state={getOptionState(i)}
              disabled={answered}
              onClick={() => handleSelect(i)}
            />
          ))}
        </div>

        {/* Feedback */}
        {answered && correct !== null && (
          <FeedbackCard correct={correct} explanation={currentStep.explanation} />
        )}

        {/* Next button */}
        {answered && (
          <Button fullWidth onClick={handleNext} className="mt-2">
            {isLastStep ? 'ফলাফল দেখো 🎉' : 'পরবর্তী ধাপ →'}
          </Button>
        )}

        <div className="h-4" />
      </div>
    </div>
  )
}
