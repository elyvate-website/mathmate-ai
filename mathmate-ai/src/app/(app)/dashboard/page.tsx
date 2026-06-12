import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'
import Link              from 'next/link'
import Image             from 'next/image'
import { BottomNav }     from '@/components/layout/BottomNav'
import { ChevronRight, Flame, Trophy, BookOpen } from 'lucide-react'

function XPRing({ pct }: { pct: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#E8F5E9" strokeWidth="8" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="url(#xpGrad)" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
      />
      <defs>
        <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2D7A3A" />
          <stop offset="100%" stopColor="#3DAE4F" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/onboarding')

  const [statsRes, chaptersRes, lastProgressRes] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('chapters').select('*').eq('class_level', profile.class_level ?? 9).order('chapter_num'),
    supabase.from('user_progress')
      .select('*, chapters(title_bn,chapter_num)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(1).maybeSingle(),
  ])

  const stats   = statsRes.data
  const chapters = chaptersRes.data ?? []
  const last    = lastProgressRes.data

  const firstName = profile.full_name?.split(' ')[0] ?? 'Ninja'
  const xp        = stats?.total_xp    ?? 0
  const level     = getLevelFromXP(xp)
  const xpInfo    = getXPForNextLevel(xp)
  const streak    = stats?.current_streak ?? 0
  const coins     = stats?.total_coins   ?? 0
  const lessons   = stats?.lessons_completed ?? 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'শুভ সকাল' : hour < 17 ? 'শুভ অপরাহ্ন' : 'শুভ সন্ধ্যা'

  const quickActions = [math
    { label: 'Practice', emoji: '⚡', href: '/practice', bg: '#FFF8E1', color: '#E65100' },
    { label: 'AI Tutor', emoji: '🤖', href: '/tutor',    bg: '#E3F2FD', color: '#1565C0' },
    { label: 'Progress', emoji: '📊', href: '/progress', bg: '#F3E5F5', color: '#6A1B9A' },
    { label: 'Ranks',    emoji: '🏆', href: '/leaderboard', bg: '#FFF3E0', color: '#E65100' },
  ]

  return (
    <div className="min-h-screen pb-28" style={{ background: '#F7F9F7' }}>

      {/* ── Top hero card ────────────────────────────────────── */}
      <div className="px-4 pt-12 pb-2 page-enter">
        <div className="card-hero p-5 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#1B5E20 0%,#2D7A3A 55%,#388E3C 100%)' }}>
          {/* ambient blobs */}
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="ambient ambient-three" />

          <div className="relative z-10 flex items-start justify-between mb-4">
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">{greeting} 👋</p>
              <h2 className="text-white text-2xl font-black mt-0.5">{firstName}</h2>
              <p className="text-white/50 text-xs mt-0.5">Class {profile.class_level} · Math Ninja</p>
            </div>
            {/* Streak badge */}
            <div className="flex flex-col items-center bg-white/15 rounded-2xl px-3 py-2 backdrop-blur-sm">
              <Flame size={20} className="text-orange-300 mb-0.5" />
              <span className="text-white font-black text-lg leading-none">{streak}</span>
              <span className="text-white/60 text-[9px] font-bold uppercase tracking-wide">Streak</span>
            </div>
          </div>

          {/* XP ring + level */}
          <div className="relative z-10 flex items-center gap-4 bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
            <div className="relative flex-shrink-0">
              <XPRing pct={xpInfo.progress} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-black text-lg leading-none">{level}</span>
                <span className="text-white/60 text-[9px] uppercase font-bold">Level</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-base">Math Ninja Lv.{level}</p>
              <p className="text-white/60 text-xs mt-0.5">{xp.toLocaleString()} XP earned</p>
              <div className="mt-2 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-white transition-all duration-1000"
                  style={{ width: `${xpInfo.progress}%` }} />
              </div>
              <p className="text-white/50 text-[10px] mt-1">{xpInfo.next.toLocaleString()} XP → next level</p>
            </div>
          </div>

          {/* Coins + lessons row */}
          <div className="relative z-10 flex gap-2 mt-3">
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">🪙</span>
              <div>
                <p className="text-white font-black text-sm">{coins.toLocaleString()}</p>
                <p className="text-white/50 text-[9px] uppercase font-bold">Coins</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">📚</span>
              <div>
                <p className="text-white font-black text-sm">{lessons}</p>
                <p className="text-white/50 text-[9px] uppercase font-bold">Lessons Done</p>
              </div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="text-base">🎯</span>
              <div>
                <p className="text-white font-black text-sm">{Math.min(lessons, 5)}/5</p>
                <p className="text-white/50 text-[9px] uppercase font-bold">Daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Continue learning ──────────────────────────────────── */}
      <div className="px-4 mt-4" style={{ animationDelay: '0.06s' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-black text-ninja-dark text-base">চালিয়ে যাও</p>
          <span className="text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: '#E8F5E9', color: '#2D7A3A' }}>পার্সোনালাইজড</span>
        </div>
        {last ? (
          <Link href={`/chapters/${profile.class_level}`}>
            <div className="card-raised p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#E8F5E9' }}>📐</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-ninja-dark text-sm truncate">{(last as any).chapters?.title_bn}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#2D7A3A' }}>অধ্যায় {(last as any).chapters?.chapter_num} · চলমান</p>
                <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: '#F0F0F0' }}>
                  <div className="h-full rounded-full progress-bar-glow" style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${last.accuracy ?? 40}%` }} />
                </div>
              </div>
              <ChevronRight size={18} style={{ color: '#2D7A3A' }} />
            </div>
          </Link>
        ) : (
          <Link href="/subjects">
            <div className="card-raised p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden" style={{ background: '#E8F5E9' }}>
                <Image src="/chill ninja.png" alt="ninja" width={48} height={48} className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-black text-ninja-dark text-sm">শেখা শুরু করো!</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#2D7A3A' }}>একটি বিষয় বেছে নাও →</p>
              </div>
              <ChevronRight size={18} style={{ color: '#2D7A3A' }} />
            </div>
          </Link>
        )}
      </div>

      {/* ── Quick actions horizontal scroll ───────────────────── */}
      <div className="mt-4 px-4">
        <p className="font-black text-ninja-dark text-base mb-3">কুইক অ্যাকশন</p>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {quickActions.map((a, i) => (
            <Link key={a.label} href={a.href}>
              <div
                className="flex-shrink-0 w-24 rounded-2xl p-3.5 flex flex-col items-center gap-2 active:scale-95 transition-transform card-raised"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: a.bg }}>
                  {a.emoji}
                </div>
                <p className="font-black text-xs text-center" style={{ color: a.color }}>{a.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Chapter list ──────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-ninja-dark text-base">অধ্যায়সমূহ</p>
          <Link href={`/chapters/${profile.class_level}`} className="text-sm font-black" style={{ color: '#2D7A3A' }}>সব দেখো →</Link>
        </div>
        <div className="space-y-2 stagger-children">
          {chapters.slice(0, 5).map((ch, i) => (
            <Link key={ch.id} href={`/lessons/${ch.id}`}>
              <div className="card-flat p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0"
                  style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                  {ch.chapter_num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ninja-dark text-sm truncate">{ch.title_bn}</p>
                  {ch.title_en && <p className="text-ninja-muted text-xs truncate">{ch.title_en}</p>}
                </div>
                <ChevronRight size={16} className="text-ninja-muted flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
