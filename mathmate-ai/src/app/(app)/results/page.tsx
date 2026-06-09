'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

function ResultsContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const score   = parseInt(params.get('score')  ?? '0')
  const total   = parseInt(params.get('total')  ?? '1')
  const topicId = params.get('topicId')
  const coins   = parseInt(params.get('coins')  ?? '0')
  const xp      = parseInt(params.get('xp')     ?? '0')
  const streak  = parseInt(params.get('streak') ?? '1')
  const pct     = Math.round((score / total) * 100)

  const msg = pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good try!' : 'Keep going!'
  const sub = pct >= 90 ? 'You got it right! 🎉' : pct >= 70 ? 'Almost perfect!' : 'Practice makes perfect!'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #1B5E20 0%, #2D7A3A 60%, #388E3C 100%)' }}
    >
      {/* Confetti */}
      {[...Array(16)].map((_, i) => (
        <div key={i}
          className="absolute top-0 w-2 h-2 rounded-sm"
          style={{
            left: `${i * 6.5}%`,
            background: ['#FFC107','#FFFFFF','#4CAF50','#FF5722','#2196F3','#E91E63','#9C27B0','#FF9800'][i % 8],
            animation: `confettiFall ${1.3 + i * 0.2}s ease-in ${i * 0.06}s forwards`,
          }}
        />
      ))}

      {/* Top: ninja badge + text */}
      <div className="w-full text-center animate-bounce-in">
        <h2 className="text-white text-4xl font-black mb-1">{msg}</h2>
        <p className="text-white/70 text-base font-semibold mb-8">{sub}</p>

        {/* Ninja celebrating badge */}
        <div className="relative mx-auto w-44 h-44 mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }}
          />
          <Image
            src="/Ninja Celebrating.png"
            alt="Celebrating ninja"
            width={176}
            height={176}
            className="object-contain relative z-10"
          />
          {/* Stars */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl"
              style={{
                bottom: i === 1 ? '-8px' : '10px',
                left:   i === 0 ? '-4px' : i === 1 ? '50%' : 'auto',
                right:  i === 2 ? '-4px' : 'auto',
                transform: i === 1 ? 'translateX(-50%)' : 'none',
                animation: `bounceIn 0.5s ease ${i * 0.2}s both`,
              }}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Rewards row */}
        <div className="flex justify-center gap-4">
          <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/60 text-xs font-semibold mb-0.5">Coins</p>
            <p className="text-white font-black text-xl">+{coins}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/60 text-xs font-semibold mb-0.5">XP</p>
            <p className="text-white font-black text-xl">+{xp}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-5 py-3 text-center">
            <p className="text-white/60 text-xs font-semibold mb-0.5">Streak</p>
            <p className="text-white font-black text-xl">🔥+{streak}</p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-white py-4 rounded-2xl font-black text-base active:scale-95 transition-transform"
          style={{ color: '#2D7A3A' }}
        >
          Continue
        </button>
        <button
          onClick={async () => {
            if (navigator.share) {
              await navigator.share({ title: 'MathMate AI', text: `I scored ${pct}% on MathMate AI! 🥷` })
            }
          }}
          className="w-full border-2 border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span>↗</span> Share
        </button>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#2D7A3A' }}>
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
