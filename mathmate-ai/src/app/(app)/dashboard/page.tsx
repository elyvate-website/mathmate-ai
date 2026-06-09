import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'
import Link              from 'next/link'
import { Flame, ChevronRight, Lock, Sparkles, Target, Trophy } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Fetch profile first because the chapters query depends on its values
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. Redirect immediately if no profile exists (saves DB performance)
  if (!profile) redirect('/onboarding')

  // 3. Fetch the remaining independent queries in parallel
  const [{ data: stats }, { data: chapters }, { data: lastProgress }] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('chapters')
      .select('*')
      .eq('class_level', profile.class_level ?? 9)
      .order('chapter_num'),
    supabase.from('user_progress')
      .select('*, chapters(title_bn, chapter_num)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  const firstName    = profile.full_name?.split(' ')[0] ?? 'Ninja'
  const xp           = stats?.total_xp ?? 0
  const level        = getLevelFromXP(xp)
  const xpInfo       = getXPForNextLevel(xp)
  const streak       = stats?.current_streak ?? 0
  const coins        = stats?.total_coins ?? 0
  const dailyGoal    = 5
  const dailyDone    = Math.min(stats?.lessons_completed ?? 0, dailyGoal)

  return (
    <div className="min-h-screen pb-24 bg-[linear-gradient(180deg,#f7fff8_0%,#edf7ef_45%,#f8fbf8_100%)]">
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
        </div>

        <div className="relative z-10 rounded-[30px] border border-white/80 bg-white/85 p-4 shadow-[0_18px_45px_rgba(45,122,58,0.12)] backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-brand-primary">MathMate AI</p>
              <h2 className="mt-1 text-2xl font-black text-ninja-text">Hi, {firstName} 👋</h2>
              <p className="text-sm text-ninja-muted">Your learning journey looks amazing today.</p>
            </div>
            <div className="rounded-2xl bg-brand-light px-3 py-2 text-right shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.25em] text-brand-primary">Streak</p>
              <p className="text-lg font-black text-brand-primary">{streak} 🔥</p>
            </div>
          </div>

          <div className="mt-4 rounded-[28px] bg-gradient-to-br from-brand-dark via-brand-primary to-brand-secondary p-4 text-white shadow-[0_18px_35px_rgba(27,94,32,0.28)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/80">Level {level}</p>
                <p className="text-xl font-black">Math Ninja</p>
              </div>
              <div className="rounded-2xl bg-white/12 px-3 py-2 text-right text-[11px] text-white/85">{xp.toLocaleString()} XP</div>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-white/15">
              <div className="h-full rounded-full bg-white transition-all duration-700" style={{ width: `${xpInfo.progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-white/80">{xpInfo.next.toLocaleString()} XP to next level</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <article className="rounded-3xl border border-brand-light bg-gradient-to-br from-white to-brand-light/70 p-3">
              <Sparkles size={16} className="text-brand-primary" />
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-ninja-muted">Daily Goal</p>
              <p className="text-lg font-black text-ninja-text">{dailyDone}/{dailyGoal}</p>
            </article>
            <article className="rounded-3xl border border-yellow-100 bg-gradient-to-br from-yellow-50 to-white p-3">
              <Trophy size={16} className="text-amber-500" />
              <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-ninja-muted">Coins</p>
              <p className="text-lg font-black text-ninja-text">{coins.toLocaleString()}</p>
            </article>
          </div>
        </div>
      </div>

      <div className="px-5 mt-2">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-black text-ninja-text">Continue Learning</p>
          <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-black text-brand-primary">Personalized</span>
        </div>
        {lastProgress ? (
          <Link
            href={`/chapters/${profile.class_level}`}
            className="block rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_35px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 active:scale-95"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: '#E8F5E9' }}
            >
              📐
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-ninja-text text-sm truncate">
                {(lastProgress as any).chapters?.title_bn ?? 'Linear Equations'}
              </p>
              <p className="text-brand-primary text-xs font-semibold mt-0.5">
                Chapter {(lastProgress as any).chapters?.chapter_num ?? '3'} • In Progress
              </p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${lastProgress.accuracy ?? 65}%` }}
                />
              </div>
            </div>
            <ChevronRight size={18} className="text-ninja-muted flex-shrink-0" />
          </Link>
        ) : (
          <Link
            href={`/subjects`}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-ninja-border active:scale-95 transition-transform block"
          >
            <div className="w-14 h-14 rounded-xl bg-brand-light flex items-center justify-center text-2xl flex-shrink-0">🥷</div>
            <div className="flex-1">
              <p className="font-black text-ninja-text text-sm">শেখা শুরু করো!</p>
              <p className="text-brand-primary text-xs font-semibold mt-0.5">একটি বিষয় বেছে নাও</p>
            </div>
            <ChevronRight size={18} className="text-ninja-muted" />
          </Link>
        )}
      </div>

      <div className="px-5 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-base font-black text-ninja-text">Quick Actions</p>
          <Target size={16} className="text-brand-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Practice now', hint: 'Sharpen your skills', href: '/practice' },
            { label: 'AI tutor', hint: 'Ask for help', href: '/tutor' },
            { label: 'Progress', hint: 'Track your streak', href: '/progress' },
            { label: 'Leaderboard', hint: 'Compete with friends', href: '/leaderboard' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="rounded-[26px] border border-white/80 bg-white/90 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 active:scale-95">
              <p className="text-sm font-black text-ninja-text">{item.label}</p>
              <p className="mt-1 text-xs text-ninja-muted">{item.hint}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-5 mt-5">
        <div className="flex justify-between items-center mb-3">
          <p className="font-black text-ninja-text text-base">Mathematics</p>
          <Link href={`/chapters/${profile.class_level}`} className="text-brand-primary text-sm font-bold">
            See all →
          </Link>
        </div>

        <div className="space-y-2">
          {(chapters ?? []).slice(0, 6).map((ch, i) => {
            const locked = i > 2
            return (
              <Link
                key={ch.id}
                href={locked ? '#' : `/chapters/${profile.class_level}`}
                className={`bg-white rounded-2xl px-4 py-3 flex items-center gap-3 border border-ninja-border shadow-sm ${locked ? 'opacity-60' : 'active:scale-95 transition-transform'}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    background: locked ? '#F5F5F5' : '#E8F5E9',
                    color: locked ? '#BDBDBD' : '#2D7A3A',
                  }}
                >
                  {ch.chapter_num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ninja-text text-sm truncate">{ch.title_bn}</p>
                </div>
                {locked
                  ? <Lock size={14} className="text-ninja-muted flex-shrink-0" />
                  : <ChevronRight size={16} className="text-brand-primary flex-shrink-0" />
                }
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
