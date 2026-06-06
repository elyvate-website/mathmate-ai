import Link from 'next/link'
import { RobotMascot } from '@/components/shared/RobotMascot'

export default function LandingPage() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-between px-6 py-12 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg,#1a0547 0%,#0E0628 55%,#220b5e 100%)' }}
    >
      {/* Floating stars */}
      {['✦','✦','✦','✦','✦','✦','✦','✦','✦','✦','✦','✦'].map((s, i) => (
        <span key={i} className="absolute text-white pointer-events-none animate-float"
          style={{ fontSize:`${6+(i%4)*3}px`, opacity:0.08+(i%3)*0.06, top:`${7+i*6.5}%`, left:`${(i*7.3)%94}%`, animationDelay:`${i*0.22}s`, animationDuration:`${2.5+i*0.4}s` }}>
          {s}
        </span>
      ))}

      {/* Logo */}
      <div className="text-center animate-fade-up">
        <div className="w-20 h-20 rounded-[22px] mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white shadow-2xl"
          style={{ background:'linear-gradient(135deg,#9B6DFF,#6D28D9)', boxShadow:'0 8px 30px rgba(139,92,246,0.5)' }}>
          √x
        </div>
        <h1 className="text-white text-2xl font-black tracking-tight">
          MathMate <span className="text-purple-300">AI</span>
        </h1>
        <p className="text-white/60 text-sm mt-1.5">তোমার ব্যক্তিগত গণিত শিক্ষক</p>
        <p className="text-white/35 text-xs mt-1">Learn. Practice. Master.</p>
      </div>

      {/* Robot */}
      <div className="animate-float drop-shadow-2xl" style={{ filter:'drop-shadow(0 18px 42px rgba(139,92,246,0.4))' }}>
        <RobotMascot size={165} />
      </div>

      {/* CTA */}
      <div className="w-full space-y-4 animate-fade-up" style={{ animationDelay:'0.2s' }}>
        <div className="text-center mb-2">
          <p className="text-white/50 text-xs">AI দিয়ে গণিত শেখার স্মার্ট উপায়</p>
        </div>
        <Link href="/signup"
          className="block w-full bg-white text-brand-primary text-center py-4 rounded-2xl font-black text-base shadow-lg hover:bg-purple-50 transition-colors active:scale-95">
          শুরু করো →
        </Link>
        <Link href="/login"
          className="block w-full bg-white/10 border-2 border-white/25 text-white text-center py-3.5 rounded-2xl font-bold text-sm hover:bg-white/15 transition-colors active:scale-95">
          ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করো
        </Link>
      </div>
    </main>
  )
}
