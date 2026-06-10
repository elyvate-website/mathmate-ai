'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

function ResultsContent() {
  const params  = useSearchParams()
  const router  = useRouter()
  const score   = parseInt(params.get('score')  ?? '0')
  const total   = parseInt(params.get('total')  ?? '1')
  const coins   = parseInt(params.get('coins')  ?? '0')
  const xp      = parseInt(params.get('xp')     ?? '0')
  const streak  = parseInt(params.get('streak') ?? '0')
  const pct     = total > 0 ? Math.round((score / total) * 100) : 0

  const { msg, sub, stars } =
    pct >= 90 ? { msg: 'অসাধারণ! 🎉',     sub: 'তুমি পারফেক্ট স্কোর পেয়েছো!', stars: 3 } :
    pct >= 70 ? { msg: 'দারুণ কাজ! 👏',   sub: 'প্রায় পরিপূর্ণ!',              stars: 2 } :
    pct >= 50 ? { msg: 'ভালো চেষ্টা! 💪', sub: 'আরও অনুশীলন করো।',            stars: 1 } :
                { msg: 'চালিয়ে যাও! 📚',  sub: 'অনুশীলনেই দক্ষতা আসে।',       stars: 0 }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg,#1B5E20 0%,#2D7A3A 60%,#388E3C 100%)' }}
    >
      {/* Confetti */}
      {pct >= 70 && [...Array(18)].map((_, i) => (
        <div key={i} className="absolute top-0 w-2 h-2 rounded-sm pointer-events-none"
          style={{
            left: `${i * 5.5}%`,
            background: ['#FFC107','#FFFFFF','#4CAF50','#FF5722','#2196F3','#E91E63','#9C27B0','#FF9800','#00BCD4'][i % 9],
            animation: `confettiFall ${1.3 + i * 0.15}s ease-in ${i * 0.05}s forwards`,
          }}
        />
      ))}

      {/* Content */}
      <div className="w-full text-center">
        <h2 className="text-white text-4xl font-black mb-1">{msg}</h2>
        <p className="text-white/70 text-base font-semibold mb-8">{sub}</p>

        {/* Ninja */}
        <div className="relative mx-auto w-40 h-40 mb-6">
          <div className="absolute inset-0 rounded-full opacity-25" style={{ background: 'radial-gradient(circle,#FFD700,transparent)' }} />
          <Image src="/Ninja Celebrating.png" alt="Celebrating ninja" width={160} height={160} className="object-contain relative z-10" />
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
                opacity: i < stars ? 1 : 0.25,
                animation: i < stars ? `bounceIn 0.5s ease ${i * 0.2}s both` : 'none',
              }}
            >⭐</div>
          ))}
        </div>

        {/* Score */}
        <div className="bg-white/15 rounded-3xl px-8 py-4 inline-block mb-6">
          <p className="text-white/60 text-xs font-semibold mb-0.5">স্কোর</p>
          <p className="text-white font-black text-4xl">{score}<span className="text-2xl text-white/60">/{total}</span></p>
          <p className="text-white/70 text-sm font-bold mt-0.5">{pct}% নির্ভুল</p>
        </div>

        {/* Rewards */}
        <div className="flex justify-center gap-3">
          <div className="bg-white/15 rounded-2xl px-4 py-3 text-center flex-1">
            <p className="text-white/60 text-xs font-semibold mb-0.5">🪙 কয়েন</p>
            <p className="text-white font-black text-xl">+{coins}</p>
          </div>
          <div className="bg-white/15 rounded-2xl px-4 py-3 text-center flex-1">
            <p className="text-white/60 text-xs font-semibold mb-0.5">⚡ XP</p>
            <p className="text-white font-black text-xl">+{xp}</p>
          </div>
          {streak > 0 && (
            <div className="bg-white/15 rounded-2xl px-4 py-3 text-center flex-1">
              <p className="text-white/60 text-xs font-semibold mb-0.5">🔥 স্ট্রিক</p>
              <p className="text-white font-black text-xl">{streak}</p>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="w-full bg-white py-4 rounded-2xl font-black text-base active:scale-95 transition-transform"
          style={{ color: '#2D7A3A' }}
        >
          ড্যাশবোর্ডে যাও
        </button>
        <button
          onClick={() => router.back()}
          className="w-full border-2 border-white/30 text-white py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
        >
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
