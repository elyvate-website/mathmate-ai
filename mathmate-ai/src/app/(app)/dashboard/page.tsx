import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import { BottomNav }     from '@/components/layout/BottomNav'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'
import Link              from 'next/link'
import Image             from 'next/image'
import { Flame, ChevronRight, Lock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: stats }, { data: chapters }, { data: lastProgress }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('chapters')
      .select('*')
      .eq('class_level', profile?.class_level ?? 9)
      .order('chapter_num'),
    supabase.from('user_progress')
      .select('*, chapters(title_bn, chapter_num)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  if (!profile) redirect('/onboarding')

  const firstName    = profile.full_name?.split(' ')[0] ?? 'Ninja'
  const xp           = stats?.total_xp ?? 0
  const level        = getLevelFromXP(xp)
  const xpInfo       = getXPForNextLevel(xp)
  const streak       = stats?.current_streak ?? 0
  const coins        = stats?.total_coins ?? 0
  const dailyGoal    = 5
  const dailyDone    = Math.min(stats?.lessons_completed ?? 0, dailyGoal)

  return (
    <div className="min-h-screen pb-24" style={{ background: '#F5F5F5' }}>

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-12 pb-5">
        <div className="flex justify-between items-center mb-5">
          <div>
            <p className="text-ninja-muted text-sm font-semibold">Hi, {firstName} 👋</p>
            <p className="text-ninja-muted text-xs">Keep going, Ninja!</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Streak */}
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
              <Flame size={14} className="text-orange-500" />
              <span className="text-orange-600 font-black text-sm">{streak}</span>
            </div>
            {/* Coins */}
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
              <span className="text-base">🪙</span>
              <span className="text-yellow-700 font-black text-sm">{coins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Level card */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{ background: 'linear-gradient(135deg, #1B5E20, #2D7A3A)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-white text-lg"
              >
                {level}
              </div>
              <div>
                <p className="text-white font-black text-base">Level {level}</p>
                <p className="text-white/70 text-xs font-semibold">Math Ninja</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">{xp.toLocaleString()} / {xpInfo.next.toLocaleString()} XP</p>
            </div>
          </div>
          {/* XP bar */}
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${xpInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Daily goal */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-ninja-text font-black text-sm">Daily Goal</p>
            <p className="text-ninja-muted text-xs">{dailyDone} / {dailyGoal} lessons</p>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: dailyGoal }).map((_, i) => (
              <div
                key={i}
                className="w-7 h-2.5 rounded-full transition-all"
                style={{ background: i < dailyDone ? '#2D7A3A' : '#E8E8E8' }}
              />
            ))}
            <span className="ml-1 text-base">🎁</span>
          </div>
        </div>
      </div>

      {/* ── Continue Learning ── */}
      <div className="px-5 mt-4">
        <p className="font-black text-ninja-text text-base mb-3">Continue Learning</p>
        {lastProgress ? (
          <Link
            href={`/chapters/${profile.class_level}`}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-ninja-border active:scale-95 transition-transform block"
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

      {/* ── Chapters ── */}
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
