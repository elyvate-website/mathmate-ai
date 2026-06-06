import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { TopBar }       from '@/components/layout/TopBar'
import { BottomNav }    from '@/components/layout/BottomNav'
import { Badge }        from '@/components/ui/Badge'
import { getLevelFromXP, getXPForNextLevel, getAccuracyColor } from '@/lib/utils'

export default async function ProgressPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: stats }, { data: progressRows }] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('user_progress')
      .select('*, topics(title_bn, chapters(title_bn))')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(20),
  ])

  const xp      = stats?.total_xp ?? 0
  const level   = getLevelFromXP(xp)
  const { next, progress } = getXPForNextLevel(xp)
  const totalSolved   = progressRows?.length ?? 0
  const avgAccuracy   = totalSolved > 0
    ? Math.round((progressRows!.reduce((s, r) => s + r.accuracy, 0)) / totalSolved)
    : 0

  const weakTopics   = progressRows?.filter(r => r.accuracy < 70)  ?? []
  const strongTopics = progressRows?.filter(r => r.accuracy >= 90) ?? []

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
        <TopBar title="অগ্রগতি" showBack={false} />
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Level card */}
        <div className="bg-purple-gradient rounded-2xl p-5 text-white">
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-white/70 text-xs font-bold mb-1">বর্তমান স্তর</p>
              <p className="text-3xl font-black">Level {level}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-bold mb-1">মোট XP</p>
              <p className="text-2xl font-black">{xp}</p>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-1.5">
            <div className="bg-white h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-white/60 text-xs">{xp} / {next} XP — পরবর্তী স্তরে যেতে {next - xp} XP দরকার</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'সমাধান',  value: totalSolved,                icon: '✅' },
            { label: 'সঠিকতা', value: `${avgAccuracy}%`,           icon: '🎯' },
            { label: 'Streak',  value: `${stats?.current_streak ?? 0}🔥`, icon: '' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <p className="text-xl mb-1">{icon}</p>
              <p className="font-black text-gray-900 text-base">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Weak topics */}
        {weakTopics.length > 0 && (
          <div>
            <h3 className="font-black text-gray-900 text-sm mb-2">দুর্বল টপিক 📌</h3>
            <div className="space-y-2">
              {weakTopics.slice(0, 5).map(row => (
                <div key={row.id} className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-red-50">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{(row.topics as any)?.title_bn}</p>
                    <p className="text-gray-400 text-xs">{(row.topics as any)?.chapters?.title_bn}</p>
                  </div>
                  <Badge variant="red">{Math.round(row.accuracy)}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strong topics */}
        {strongTopics.length > 0 && (
          <div>
            <h3 className="font-black text-gray-900 text-sm mb-2">শক্তিশালী টপিক 🌟</h3>
            <div className="space-y-2">
              {strongTopics.slice(0, 5).map(row => (
                <div key={row.id} className="bg-white rounded-xl p-3.5 flex items-center justify-between shadow-sm border border-green-50">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{(row.topics as any)?.title_bn}</p>
                    <p className="text-gray-400 text-xs">{(row.topics as any)?.chapters?.title_bn}</p>
                  </div>
                  <Badge variant="green">{Math.round(row.accuracy)}%</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalSolved === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📈</div>
            <p className="font-bold text-gray-600">এখনো কোনো সমস্যা সমাধান করোনি</p>
            <p className="text-gray-400 text-sm mt-1">অনুশীলন শুরু করো এবং এখানে তোমার অগ্রগতি দেখো!</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
