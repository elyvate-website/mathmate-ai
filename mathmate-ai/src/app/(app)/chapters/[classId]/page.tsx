import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react'

export default async function ChaptersPage({ params }: { params: { classId: string } }) {
  const supabase   = createClient()
  const classLevel = parseInt(params.classId) || 9
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: chapters }, { data: progressRows }] = await Promise.all([
    supabase.from('chapters').select('*').eq('class_level', classLevel).order('chapter_num'),
    supabase.from('user_progress').select('chapter_id, accuracy').eq('user_id', user.id),
  ])

  // Compute per-chapter progress
  const chapterAccMap: Record<number, number[]> = {}
  for (const p of (progressRows ?? [])) {
    if (!chapterAccMap[p.chapter_id]) chapterAccMap[p.chapter_id] = []
    chapterAccMap[p.chapter_id].push(p.accuracy)
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
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <Link href="/subjects" className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </Link>
        <h1 className="text-2xl font-black text-ninja-text">Mathematics</h1>

        {/* Overall progress */}
        <div className="mt-4 bg-white border border-ninja-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ninja-muted text-sm font-semibold">Overall Progress</p>
            <span className="text-brand-primary font-black text-lg">{totalProgress}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ background: 'linear-gradient(90deg, #2D7A3A, #3DAE4F)', width: `${totalProgress}%` }}
            />
          </div>
          <div
            className="mt-3 w-10 h-10 rounded-full flex items-center justify-center ml-auto"
            style={{ background: '#E8F5E9' }}
          >
            🎯
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          <button className="px-5 py-2 rounded-full font-black text-sm text-white" style={{ background: '#2D7A3A' }}>
            Chapters
          </button>
          <button className="px-5 py-2 rounded-full font-bold text-sm text-ninja-muted bg-gray-100">
            Topics
          </button>
        </div>
      </div>

      {/* Chapter list */}
      <div className="px-5 space-y-2">
        {(chapters ?? []).map((ch, i) => {
          const pct    = chapterProgress(ch.id)
          const done   = pct >= 90
          const active = !done && i === (chapters ?? []).findIndex(c => chapterProgress(c.id) < 90)
          const locked = i > 5 && pct === 0

          return (
            <Link
              key={ch.id}
              href={locked ? '#' : `/lessons/${ch.id}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all ${
                active
                  ? 'border-brand-primary bg-brand-light shadow-sm'
                  : 'border-ninja-border bg-white'
              } ${locked ? 'opacity-50 pointer-events-none' : 'active:scale-95'}`}
            >
              <span className="text-ninja-muted text-sm font-bold w-4 flex-shrink-0">{i + 1}.</span>
              <p className={`flex-1 font-bold text-sm ${active ? 'text-brand-primary' : 'text-ninja-text'}`}>
                {ch.title_bn}
              </p>
              {done ? (
                <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
              ) : locked ? (
                <Lock size={14} className="text-ninja-muted flex-shrink-0" />
              ) : active ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-brand-primary text-xs font-black">{pct}%</span>
                  <ChevronRight size={16} className="text-brand-primary" />
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  {pct > 0 && <span className="text-ninja-muted text-xs font-bold">{pct}%</span>}
                  <div className="w-2.5 h-2.5 rounded-full bg-ninja-border" />
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
