import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'
import Link              from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/onboarding')

  const [statsResult, chaptersResult, lastProgressResult] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('chapters').select('*').eq('class_level', profile.class_level ?? 9).order('chapter_num'),
    supabase.from('user_progress').select('*, chapters(title_bn,chapter_num)').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(1).maybeSingle(),
  ])

  const stats      = statsResult.data
  const chapters   = chaptersResult.data
  const lastProgress = lastProgressResult.data

  const firstName = profile.full_name?.split(' ')[0] ?? 'Ninja'
  const xp        = stats?.total_xp    ?? 0
  const level     = getLevelFromXP(xp)
  const xpInfo    = getXPForNextLevel(xp)
  const streak    = stats?.current_streak ?? 0
  const coins     = stats?.total_coins   ?? 0
  const dailyGoal = 5
  const dailyDone = Math.min(stats?.lessons_completed ?? 0, dailyGoal)

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg,#f7fff8 0%,#edf7ef 45%,#f8fbf8 100%)' }}>
      {/* Hero card */}
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
        </div>
        <div className="relative z-10 rounded-[28px] border border-white/80 bg-white/85 p-4 shadow-lg backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-brand-primary font-bold">MathMate AI</p>
              <h2 className="mt-1 text-2xl font-black text-ninja-text">হ্যালো, {firstName} 👋</h2>
              <p className="text-xs text-ninja-muted mt-0.5">আজও শেখার দিন! চলো শুরু করি।</p>
            </div>
            <div className="rounded-2xl bg-brand-light px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-brand-primary font-bold">স্ট্রিক</p>
              <p className="text-xl font-black text-brand-primary">{streak} 🔥</p>
            </div>
          </div>

          {/* Level bar */}
          <div className="mt-4 rounded-[22px] p-4 text-white" style={{ background: 'linear-gradient(135deg,#1B5E20,#2D7A3A,#388E3C)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/70">Level {level}</p>
                <p className="text-lg font-black">Math Ninja</p>
              </div>
              <div className="rounded-xl bg-white/15 px-3 py-1.5 text-[11px] text-white/90 font-bold">{xp.toLocaleString()} XP</div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/20">
              <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${xpInfo.progress}%` }} />
            </div>
            <p className="mt-1.5 text-[11px] text-white/70">{xpInfo.next.toLocaleString()} XP → পরের লেভেল</p>
          </div>

          {/* Stats row */}
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-brand-light bg-gradient-to-br from-white to-brand-light/60 p-3">
              <p className="text-base">🎯</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ninja-muted font-semibold mt-1">দৈনিক লক্ষ্য</p>
              <p className="text-lg font-black text-ninja-text">{dailyDone}/{dailyGoal}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-3">
              <p className="text-base">🪙</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-ninja-muted font-semibold mt-1">কয়েন</p>
              <p className="text-lg font-black text-ninja-text">{coins.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue learning */}
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-black text-ninja-text">চালিয়ে যাও</p>
          <span className="rounded-full bg-brand-light px-3 py-1 text-[10px] font-black text-brand-primary">পার্সোনালাইজড</span>
        </div>
        {lastProgress ? (
          <Link href={`/chapters/${profile.class_level}`} className="flex items-center gap-3 rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-md transition hover:-translate-y-0.5 active:scale-95">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: '#E8F5E9' }}>📐</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-ninja-text text-sm truncate">{(lastProgress as any).chapters?.title_bn ?? 'গণিত'}</p>
              <p className="text-brand-primary text-xs font-semibold mt-0.5">অধ্যায় {(lastProgress as any).chapters?.chapter_num ?? '?'} • চলমান</p>
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${lastProgress.accuracy ?? 50}%` }} />
              </div>
            </div>
            <ChevronRight size={18} className="text-ninja-muted flex-shrink-0" />
          </Link>
        ) : (
          <Link href="/subjects" className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-ninja-border active:scale-95 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-xl flex-shrink-0">🥷</div>
            <div className="flex-1">
              <p className="font-black text-ninja-text text-sm">শেখা শুরু করো!</p>
              <p className="text-brand-primary text-xs font-semibold mt-0.5">একটি বিষয় বেছে নাও</p>
            </div>
            <ChevronRight size={18} className="text-ninja-muted" />
          </Link>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-5 mt-5">
        <p className="text-base font-black text-ninja-text mb-3">কুইক অ্যাকশন</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Practice', hint: 'দক্ষতা বাড়াও', href: '/practice', emoji: '⚡' },
            { label: 'AI Tutor', hint: 'সাহায্য নাও', href: '/tutor', emoji: '🤖' },
            { label: 'Progress', hint: 'অগ্রগতি দেখো', href: '/progress', emoji: '📊' },
            { label: 'Leaderboard', hint: 'প্রতিযোগিতা করো', href: '/leaderboard', emoji: '🏆' },
          ].map(item => (
            <Link key={item.label} href={item.href} className="rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-md transition hover:-translate-y-0.5 active:scale-95">
              <p className="text-xl">{item.emoji}</p>
              <p className="text-sm font-black text-ninja-text mt-2">{item.label}</p>
              <p className="text-xs text-ninja-muted mt-0.5">{item.hint}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Chapter list */}
      <div className="px-5 mt-5">
        <div className="flex justify-between items-center mb-3">
          <p className="font-black text-ninja-text text-base">অধ্যায়সমূহ</p>
          <Link href={`/chapters/${profile.class_level}`} className="text-brand-primary text-sm font-bold">সব দেখো →</Link>
        </div>
        <div className="space-y-2">
          {(chapters ?? []).slice(0, 6).map((ch, i) => {
            const locked = i > 2
            return (
              <Link
                key={ch.id}
                href={locked ? '#' : `/lessons/${ch.id}`}
                className={`bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-ninja-border shadow-sm ${locked ? 'opacity-50 pointer-events-none' : 'active:scale-95 transition-transform'}`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: locked ? '#F5F5F5' : '#E8F5E9', color: locked ? '#BDBDBD' : '#2D7A3A' }}>
                  {ch.chapter_num}
                </div>
                <p className="flex-1 font-bold text-ninja-text text-sm truncate">{ch.title_bn}</p>
                {locked ? <Lock size={14} className="text-ninja-muted flex-shrink-0" /> : <ChevronRight size={16} className="text-brand-primary flex-shrink-0" />}
              </Link>
            )
          })}
          {(!chapters || chapters.length === 0) && (
            <div className="text-center py-10">
              <p className="text-ninja-muted font-bold text-sm">কন্টেন্ট শীঘ্রই আসছে...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
