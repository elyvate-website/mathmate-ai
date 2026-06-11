'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image'

function AccuracyRing({ pct }: { pct: number }) {
  const r = 52, circ = 2 * Math.PI * r
  const [offset, setOffset] = useState(circ)
  useEffect(() => {
    const t = setTimeout(() => setOffset(circ - (pct / 100) * circ), 300)
    return () => clearTimeout(t)
  }, [pct, circ])
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" className="absolute inset-0 m-auto">
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
      <circle cx="65" cy="65" r={r} fill="none" stroke="white" strokeWidth="7"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        transform="rotate(-90 65 65)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
    </svg>
  )
}

function ResultsContent() {
  const params = useSearchParams(), router = useRouter()
  const score  = parseInt(params.get('score')  ?? '0')
  const total  = parseInt(params.get('total')  ?? '1')
  const coins  = parseInt(params.get('coins')  ?? '0')
  const xp     = parseInt(params.get('xp')     ?? '0')
  const streak = parseInt(params.get('streak') ?? '0')
  const pct    = total > 0 ? Math.round((score / total) * 100) : 0
  const stars  = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0
  const isPerfect = pct >= 90

  const [rewardsVisible, setRewardsVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setRewardsVisible(true), 700); return () => clearTimeout(t) }, [])

  const { msg, sub } =
    pct >= 90 ? { msg: 'অসাধারণ! 🎉',     sub: 'তুমি পারফেক্ট!' } :
    pct >= 70 ? { msg: 'দারুণ কাজ! 👏',   sub: 'প্রায় পরিপূর্ণ!'  } :
    pct >= 50 ? { msg: 'ভালো চেষ্টা! 💪', sub: 'আরও অনুশীলন করো' } :
                { msg: 'চালিয়ে যাও! 📚',  sub: 'হাল ছেড়ো না!'     }

  return (
    <div className="min-h-screen flex flex-col px-5 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg,#1B5E20 0%,#2D7A3A 55%,#388E3C 100%)' }}>

      {/* Confetti */}
      {isPerfect && [...Array(22)].map((_, i) => (
        <div key={i} className="absolute top-0 w-2 h-2 rounded-sm pointer-events-none"
          style={{
            left: `${i * 4.5}%`,
            background: ['#FFC107','#FFFFFF','#4CAF50','#FF5722','#2196F3','#E91E63','#9C27B0','#FF9800','#00BCD4'][i%9],
            animation: `confettiFall ${1.2 + i*0.12}s ease-in ${i*0.04}s forwards`,
          }} />
      ))}

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-6">
        <h2 className="text-white text-3xl font-black mb-1">{msg}</h2>
        <p className="text-white/60 font-semibold text-sm mb-7">{sub}</p>

        {/* Ninja + accuracy ring */}
        <div className="relative w-32 h-32 mb-5">
          <AccuracyRing pct={pct} />
          {/* Perfect shimmer */}
          {isPerfect && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg,rgba(255,215,0,0.18),rgba(255,255,255,0.08),rgba(255,215,0,0.18))' }} />
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <Image src="/Ninja Celebrating.png" alt="ninja" width={96} height={96} className="object-contain drop-shadow-2xl" />
            </div>
          </div>
          {/* Accuracy % */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full px-2.5 py-0.5 shadow-lg">
            <span className="font-black text-xs" style={{ color: '#2D7A3A' }}>{pct}%</span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex gap-3 mb-2">
          {[0,1,2].map(i => (
            <span key={i} className="text-3xl" style={{
              opacity: i < stars ? 1 : 0.25,
              animation: i < stars ? `bounceIn 0.5s ease ${0.8 + i*0.15}s both` : 'none',
              display: 'inline-block',
            }}>⭐</span>
          ))}
        </div>

        <div className="bg-white/15 rounded-2xl px-6 py-3 backdrop-blur-sm">
          <p className="text-white/60 text-xs font-semibold mb-0.5">স্কোর</p>
          <p className="text-white font-black text-3xl">
            {score}<span className="text-xl text-white/50">/{total}</span>
          </p>
        </div>
      </div>

      {/* Reward cards — staggered reveal */}
      <div className={`grid grid-cols-3 gap-2.5 mb-6 transition-all duration-500 ${rewardsVisible ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
        {[
          { icon: '🪙', label: 'Coins',  val: `+${coins}`,  delay: '0s' },
          { icon: '⚡', label: 'XP',     val: `+${xp}`,    delay: '0.15s' },
          { icon: '🔥', label: 'Streak', val: streak,       delay: '0.3s' },
        ].map(r => (
          <div key={r.label} className="bg-white/15 rounded-2xl px-3 py-3.5 text-center backdrop-blur-sm reward-pop"
            style={{ animationDelay: r.delay }}>
            <p className="text-2xl mb-0.5">{r.icon}</p>
            <p className="text-white font-black text-lg">{r.val}</p>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wide">{r.label}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="space-y-3 mt-auto">
        <button onClick={() => router.push('/dashboard')}
          className="w-full bg-white py-4 rounded-2xl font-black text-base active:scale-95 transition-transform shadow-lg"
          style={{ color: '#2D7A3A' }}>
          ড্যাশবোর্ডে যাও
        </button>
        <button onClick={() => router.back()}
          className="w-full border-2 border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform">
          আবার চেষ্টা করো
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
