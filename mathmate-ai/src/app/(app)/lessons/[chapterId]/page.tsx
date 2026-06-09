import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, Circle } from 'lucide-react'

export default async function LessonsPage({ params }: { params: { chapterId: string } }) {
  const supabase  = createClient()
  const chapterId = parseInt(params.chapterId)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: chapter }, { data: topics }, { data: progress }] = await Promise.all([
    supabase.from('chapters').select('*').eq('id', chapterId).single(),
    supabase.from('topics').select('*').eq('chapter_id', chapterId).order('order_num'),
    supabase.from('user_progress').select('chapter_id, accuracy').eq('user_id', user.id),
  ])

  if (!chapter) redirect('/dashboard')

  const completedChapterRows = (progress ?? []).filter(p => p.chapter_id === chapterId)
  const avgAcc = completedChapterRows.length > 0
    ? Math.round(completedChapterRows.reduce((s: number, p: any) => s + p.accuracy, 0) / completedChapterRows.length)
    : 0

  const totalTopics    = topics?.length ?? 0
  const completedCount = Math.min(completedChapterRows.length, totalTopics)
  const progressPct    = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <Link href={`/chapters/${chapter.class_level}`} className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Mathematics</span>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-ninja-muted text-xs font-bold mb-0.5">অধ্যায় {chapter.chapter_num}</p>
            <h1 className="text-xl font-black text-ninja-text">{chapter.title_bn}</h1>
          </div>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: '#E8F5E9' }}
          >
            🎯
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ninja-muted text-xs font-semibold">Overall Progress</p>
            <span className="text-brand-primary font-black text-base">{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button className="px-5 py-2 rounded-full font-black text-sm text-white" style={{ background: '#2D7A3A' }}>
            Chapters
          </button>
          <button className="px-5 py-2 rounded-full font-bold text-sm text-ninja-muted bg-gray-100">
            Topics
          </button>
        </div>
      </div>

      {/* Topics list */}
      <div className="px-5 space-y-2">
        {(topics ?? []).map((topic, i) => {
          const isDone   = i < completedCount
          const isActive = i === completedCount
          const isLocked = topic.is_locked || (i > completedCount + 1)

          return (
            <Link
              key={topic.id}
              href={isLocked ? '#' : `/solve/${topic.id}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border transition-all ${
                isActive  ? 'border-brand-primary bg-brand-light shadow-sm'
                : isDone  ? 'border-ninja-border bg-white'
                : isLocked ? 'border-ninja-border bg-white opacity-50 pointer-events-none'
                : 'border-ninja-border bg-white'
              } ${!isLocked ? 'active:scale-95' : ''}`}
            >
              <span className="text-ninja-muted text-sm font-bold w-4 flex-shrink-0">{i + 1}.</span>
              <p className={`flex-1 font-bold text-sm ${
                isDone ? 'text-ninja-muted line-through' :
                isActive ? 'text-brand-primary' : 'text-ninja-text'
              }`}>
                {topic.title_bn}
              </p>
              {isDone ? (
                <CheckCircle2 size={18} className="text-brand-primary flex-shrink-0" />
              ) : isLocked ? (
                <Lock size={14} className="text-ninja-muted flex-shrink-0" />
              ) : isActive ? (
                <ChevronRight size={16} className="text-brand-primary flex-shrink-0" />
              ) : (
                <Circle size={16} className="text-ninja-muted flex-shrink-0" />
              )}
            </Link>
          )
        })}

        {(!topics || topics.length === 0) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-ninja-muted font-bold text-sm">কোনো টপিক পাওয়া যায়নি</p>
            <p className="text-ninja-muted text-xs mt-1">Content coming soon...</p>
          </div>
        )}
      </div>

      {/* Start button */}
      {topics && topics.length > 0 && (
        <div className="px-5 mt-6">
          <Link href={`/solve/${topics.find(t => !t.is_locked)?.id ?? topics[0].id}`}>
            <button
              className="w-full py-4 rounded-2xl font-black text-white text-base active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
            >
              শুরু করি 🚀
            </button>
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
