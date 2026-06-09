import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Brain, Flame, Sparkles, Trophy } from 'lucide-react'

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f4fff7_45%,_#edf7ef_100%)] text-ninja-text">
      <div className="relative mx-auto flex min-h-screen w-full max-w-phone flex-col px-5 pb-8 pt-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="ambient ambient-three" />
        </div>

        <header className="relative z-10 flex items-center justify-between rounded-3xl border border-white/70 bg-white/80 px-4 py-3 shadow-[0_18px_40px_rgba(45,122,58,0.12)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary text-lg font-black text-white shadow-lg shadow-green-200">M</div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-primary">MathMate AI</p>
              <p className="text-[11px] text-ninja-muted">Smart math journey</p>
            </div>
          </div>
          <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-black text-brand-primary">New ✨</span>
        </header>

        <section className="relative z-10 mt-5 flex flex-1 flex-col justify-center">
          <div className="animate-fade-up rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-[0_20px_45px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-brand-primary">
              <Sparkles size={13} />
              AI tutor • practice • progress
            </div>

            <h1 className="max-w-xs text-4xl font-black leading-tight text-ninja-text">Learn math like a real game, not a chore.</h1>
            <p className="mt-3 text-sm leading-6 text-ninja-muted">Beautiful step-by-step explanations, instant practice, and progress tracking designed for Bangladeshi students in Class 9–10.</p>

            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-bold text-brand-primary">
              {['Interactive lessons', 'AI explanations', 'Daily streaks'].map((item) => (
                <span key={item} className="rounded-full bg-brand-light px-3 py-1.5">{item}</span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { label: 'Step-by-step', value: '3x faster', icon: Brain },
                { label: 'Streak', value: '7 days+', icon: Flame },
                { label: 'Accuracy', value: 'Boosted', icon: Trophy },
                { label: 'Style', value: 'Modern UI', icon: Sparkles },
              ].map((item, i) => (
                <article key={item.label} className="rounded-3xl border border-brand-light bg-gradient-to-br from-white to-brand-light/70 p-3 shadow-sm animate-fade-up" style={{ animationDelay: `${0.1 + i * 0.08}s` }}>
                  <item.icon size={16} className="mb-2 text-brand-primary" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-ninja-muted">{item.label}</p>
                  <p className="text-base font-black text-ninja-text">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[30px] border border-white/80 bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary p-5 text-white shadow-[0_22px_45px_rgba(27,94,32,0.35)] animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/80">
              <span>Today’s mission</span>
              <span>Level 4</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/12 ring-1 ring-white/20">
                <Image src="/Ninja Standing With Sword.png" alt="Math Ninja" width={78} height={78} className="object-contain drop-shadow-xl" priority />
              </div>
              <div>
                <p className="text-xl font-black">You’re ready to win.</p>
                <p className="mt-1 text-sm text-white/80">Solve, practice, and unlock your math mastery path.</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link href="/signup" className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-brand-primary shadow-lg shadow-green-950/20 transition hover:-translate-y-0.5">Start now <ArrowRight size={16} /></Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Login</Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
