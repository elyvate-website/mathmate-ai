import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import { getLevelFromXP } from '@/lib/utils'
import { ChevronLeft }  from 'lucide-react'
import Link             from 'next/link'
import Image            from 'next/image'

export default async function LeaderboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('class_level').eq('id', user.id).single()
  const cls = profile?.class_level ?? 9

  // Get class leaderboard
  const { data: leaders } = await supabase
    .rpc('get_class_leaderboard', { class_lvl: cls })
    .limit(20)

  // Fallback: manual join
  const { data: fallback } = leaders
    ? { data: null }
    : await supabase
        .from('user_stats')
        .select('user_id, total_xp, level, profiles!inner(full_name, class_level)')
        .eq('profiles.class_level', cls)
        .order('total_xp', { ascending: false })
        .limit(20)

  const rows: any[] = (leaders ?? fallback ?? []).map((r: any, i: number) => ({
    ...r,
    rank: i + 1,
    name: r.full_name ?? r.profiles?.full_name ?? 'Ninja',
    xp:   r.total_xp ?? 0,
    level: r.level ?? getLevelFromXP(r.total_xp ?? 0),
    isMe:  r.user_id === user.id,
  }))

  const top3    = rows.slice(0, 3)
  const rest    = rows.slice(3)
  const myRank  = rows.find(r => r.isMe)

  const MEDAL_COLORS = ['#FFC107', '#9E9E9E', '#CD7F32']
  const MEDAL_SIZES  = [72, 60, 60]
  const MEDAL_ORDER  = [1, 0, 2] // 2nd, 1st, 3rd order for podium

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <Link href="/dashboard" className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
        </Link>
        <h1 className="text-2xl font-black text-ninja-text">Leaderboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {['Global', 'Friends', 'Class'].map((t, i) => (
            <button
              key={t}
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
              style={
                i === 2
                  ? { background: '#E8F5E9', color: '#2D7A3A' }
                  : { background: '#F5F5F5', color: '#9E9E9E' }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {top3.length > 0 && (
        <div className="px-5 mb-6">
          <div className="flex items-end justify-center gap-3">
            {MEDAL_ORDER.map(pos => {
              const entry = top3[pos]
              if (!entry) return <div key={pos} className="flex-1" />
              const isFirst = pos === 0
              return (
                <div key={pos} className={`flex flex-col items-center ${isFirst ? 'mb-0' : 'mb-3'}`}>
                  <div
                    className="rounded-full border-4 overflow-hidden flex items-center justify-center font-black text-white mb-1"
                    style={{
                      width: MEDAL_SIZES[pos],
                      height: MEDAL_SIZES[pos],
                      background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)',
                      borderColor: MEDAL_COLORS[pos],
                    }}
                  >
                    {entry.isMe
                      ? <Image src="/chill ninja.png" alt="me" width={MEDAL_SIZES[pos] - 8} height={MEDAL_SIZES[pos] - 8} className="object-cover" />
                      : <span className="text-xl">{entry.name?.[0]?.toUpperCase() ?? 'N'}</span>
                    }
                  </div>
                  {isFirst && (
                    <div className="text-xl mb-0.5">👑</div>
                  )}
                  <p className="text-ninja-text font-black text-xs text-center max-w-[70px] truncate">{entry.name}</p>
                  <p className="text-ninja-muted text-[10px] font-semibold">{entry.xp.toLocaleString()} XP</p>
                  <div
                    className="mt-1 text-xs font-black text-white px-2 py-0.5 rounded-full"
                    style={{ background: MEDAL_COLORS[pos] }}
                  >
                    #{pos + 1}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rest of list */}
      <div className="px-5 space-y-2">
        {rest.map((entry) => (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${
              entry.isMe ? 'border-brand-primary bg-brand-light' : 'border-ninja-border bg-white'
            }`}
          >
            <span className="text-ninja-muted font-black text-sm w-5">{entry.rank}</span>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2D7A3A, #3DAE4F)' }}
            >
              {entry.isMe
                ? <Image src="/chill ninja.png" alt="me" width={36} height={36} className="object-cover rounded-full" />
                : entry.name?.[0]?.toUpperCase() ?? 'N'
              }
            </div>
            <p className={`flex-1 font-bold text-sm ${entry.isMe ? 'text-brand-primary' : 'text-ninja-text'}`}>
              {entry.isMe ? 'You' : entry.name}
            </p>
            <p className="text-ninja-muted font-black text-sm">{entry.xp.toLocaleString()} XP</p>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🥷</div>
            <p className="text-ninja-muted font-bold">কেউ এখনো র‍্যাংকিংয়ে নেই</p>
          </div>
        )}
      </div>
    </div>
  )
}
