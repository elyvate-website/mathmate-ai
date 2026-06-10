import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'

export default async function ChaptersPage({ params }: { params: { classId: string } }) {
  const supabase   = createClient()
  const classLevel = parseInt(params.classId) || 9
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: chapters }, { data: progressRows }] = await Promise.all([
    supabase.from('chapters').select('*').eq('class_level', classLevel).order('chapter_num'),
    supabase.from('user_progress').select('chapter_id, accuracy').eq('user_id', user.id),
  ])

  const chapterAccMap: Record<number, number[]> = {}
  for (const p of (progressRows ?? [])) {
    if (!chapterAccMap[p.chapter_id]) chapterAccMap[p.chapter_id] = []
    chapterAccMap[p.chapter_id].push(Number(p.accuracy))
  }
  const chapterProgress = (id: number) => {
    const accs = chapterAccMap[id]
    if (!accs || accs.length === 0) return 0
    return Math.round(accs.reduce((a, b) => a + b, 0) / accs.length)
  }

  const totalProgress = chapters && chapters.length > 0
    ? Math.round(chapters.reduce((sum, ch) => sum + chapterProgress(ch.id), 0) / chapters.length)
    : 0

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-12 pb-5">
        <Link href="/subjects" className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">বিষয়</span>
        </Link>
        <h1 className="text-2xl font-black text-ninja-text">গণিত</h1>
        <p className="text-ninja-muted text-xs mt-0.5">শ্রেণি {classLevel}</p>

        <div className="mt-4 bg-white border border-ninja-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ninja-muted text-sm font-semibold">সামগ্রিক অগ্রগতি</p>
            <span className="text-brand-primary font-black text-lg">{totalProgress}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${totalProgress}%` }} />
          </div>
          <p className="text-ninja-muted text-xs mt-1.5">{chapters?.length ?? 0}টি অধ্যায়</p>
        </div>
      </div>

      <div className="px-5 space-y-2">
        {(chapters ?? []).map((ch, i) => {
          const pct    = chapterProgress(ch.id)
          const done   = pct >= 90
          const active = !done && i === (chapters ?? []).findIndex(c => chapterProgress(c.id) < 90)

          return (
            <Link
              key={ch.id}
              href={`/lessons/${ch.id}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border-2 transition-all active:scale-95 ${
                active ? 'border-brand-primary bg-brand-light shadow-sm' :
                done   ? 'border-green-200 bg-green-50' :
                         'border-ninja-border bg-white'
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{ background: done ? '#DCFCE7' : active ? '#2D7A3A' : '#F5F5F5', color: done ? '#15803D' : active ? 'white' : '#757575' }}
              >
                {done ? '✓' : ch.chapter_num}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${active ? 'text-brand-primary' : done ? 'text-ninja-muted' : 'text-ninja-text'}`}>
                  {ch.title_bn}
                </p>
                {ch.title_en && <p className="text-ninja-muted text-xs mt-0.5">{ch.title_en}</p>}
              </div>
              {done ? (
                <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
              ) : (
                <div className="flex items-center gap-1.5">
                  {pct > 0 && <span className="text-brand-primary text-xs font-black">{pct}%</span>}
                  <ChevronRight size={16} className={active ? 'text-brand-primary' : 'text-ninja-muted'} />
                </div>
              )}
            </Link>
          )
        })}
        {(!chapters || chapters.length === 0) && (
          <div className="text-center py-16">
            <p className="text-ninja-muted font-bold">Content coming soon...</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
