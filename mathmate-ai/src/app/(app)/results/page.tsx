'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Button } from '@/components/ui/Button'
import { MathExpression } from '@/components/shared/MathExpression'

function TrophySVG() {
  return (
    <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="46" fill="#FEF3C7"/>
      <path d="M33 20h34v32a17 17 0 0 1-34 0Z" fill="url(#tg)"/>
      <path d="M23 22h12v2a12 22 0 0 1-12 0Z" fill="#F59E0B"/>
      <path d="M77 22H65v2a12 22 0 0 0 12 0Z" fill="#F59E0B"/>
      <rect x="44" y="52" width="12" height="16" fill="#D97706"/>
      <rect x="34" y="68" width="32" height="7" rx="3.5" fill="#D97706"/>
      <ellipse cx="50" cy="36" rx="9" ry="6" fill="white" opacity=".3"/>
      <defs>
        <linearGradient id="tg" x1="33" y1="20" x2="67" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE68A"/><stop offset="1" stopColor="#F59E0B"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function ResultsContent() {
  const params = useSearchParams()
  const router = useRouter()
  const score  = parseInt(params.get('score')  ?? '0')
  const total  = parseInt(params.get('total')  ?? '1')
  const topicId = params.get('topicId')
  const coins  = parseInt(params.get('coins')  ?? '0')
  const xp     = parseInt(params.get('xp')     ?? '0')
  const pct    = Math.round((score / total) * 100)
  const msg    = pct >= 90 ? 'অসাধারণ! 🎉' : pct >= 70 ? 'ভালো করেছো! 👍' : pct >= 50 ? 'ঠিক আছে! 😊' : 'আরও চেষ্টা করো! 💪'

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-6 py-14 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg,#1a0547 0%,#0E0628 55%,#220b5e 100%)' }}
    >
      {/* Confetti */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="absolute top-0 w-2 h-2 rounded-sm"
          style={{
            left: `${i * 8.5}%`,
            background: ['#F59E0B','#10B981','#EF4444','#3B82F6','#8B5CF6','#EC4899'][i % 6],
            animation: `confettiFall ${1.4 + i * 0.25}s ease-in ${i * 0.08}s forwards`,
          }} />
      ))}

      {/* Top content */}
      <div className="w-full text-center animate-bounce-in">
        <TrophySVG />
        <h2 className="text-white text-3xl font-black mt-4 mb-2">{msg}</h2>
        <p className="text-white/60 text-sm">তুমি সমস্যাটি সম্পন্ন করেছো।</p>

        {/* Score */}
        <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mt-6 mb-4">
          <p className="text-white/50 text-xs font-bold mb-2 uppercase tracking-wide">স্কোর</p>
          <p className="text-white text-4xl font-black">{score}<span className="text-white/40 text-2xl">/{total}</span></p>
          <p className="text-purple-300 font-bold text-sm mt-1">{pct}% সঠিক</p>
        </div>

        {/* XP & Coins */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 bg-white/8 border border-white/10 rounded-2xl p-4">
            <p className="text-white/50 text-xs mb-1">XP অর্জিত</p>
            <p className="text-purple-300 font-black text-xl">+{xp} XP</p>
          </div>
          <div className="flex-1 bg-white/8 border border-white/10 rounded-2xl p-4">
            <p className="text-white/50 text-xs mb-1">কয়েন অর্জিত</p>
            <p className="text-yellow-400 font-black text-xl">🪙 +{coins}</p>
          </div>
        </div>

        {/* Weak topic notice */}
        {pct < 70 && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-2xl p-4 mb-4 text-left">
            <p className="text-red-300 font-black text-sm mb-1">আরও অনুশীলন দরকার 📚</p>
            <p className="text-red-200/70 text-xs">এই টপিকে তোমার আরও অনুশীলন করা উচিত। নিচে "আবার চেষ্টা" বাটনে ক্লিক করো।</p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <Button fullWidth onClick={() => router.push('/chapters/9')}
          className="bg-white text-brand-primary hover:bg-purple-50">
          অধ্যায়ে ফিরে যাও
        </Button>
        <Button fullWidth variant="ghost" onClick={() => router.push(`/solve/${topicId}`)}>
          আবার চেষ্টা করো 🔄
        </Button>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-deep flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
    </div>}>
      <ResultsContent />
    </Suspense>
  )
}
