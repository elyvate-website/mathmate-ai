import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, PlayCircle } from 'lucide-react'

export default async function LessonsPage({ params }: { params: { chapterId: string } }) {
  const supabase  = createClient()
  const chapterId = parseInt(params.chapterId)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: chapter }, { data: topics }, { data: progress }] = await Promise.all([
    supabase.from('chapters').select('*').eq('id', chapterId).single(),
    supabase.from('topics').select('*, questions(id)').eq('chapter_id', chapterId).order('order_num'),
    supabase.from('user_progress').select('chapter_id, accuracy').eq('user_id', user.id),
  ])

  if (!chapter) redirect('/dashboard')

  const completedChapterRows = (progress ?? []).filter(p => p.chapter_id === chapterId)
  const completedCount       = completedChapterRows.length
  const totalTopics          = topics?.length ?? 0
  const progressPct          = totalTopics > 0 ? Math.round((Math.min(completedCount, totalTopics) / totalTopics) * 100) : 0

  return (
    <div className="min-h-screen pb-28 page-enter" style={{ background:"#F7F9F7" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <Link href={`/chapters/${chapter.class_level}`} className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">গণিত</span>
        </Link>

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-3">
            <p className="text-ninja-muted text-xs font-bold mb-0.5">অধ্যায় {chapter.chapter_num}</p>
            <h1 className="text-xl font-black text-ninja-text">{chapter.title_bn}</h1>
            {chapter.title_en && <p className="text-ninja-muted text-xs mt-0.5">{chapter.title_en}</p>}
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#E8F5E9' }}>
            📐
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-ninja-muted text-xs font-semibold">সামগ্রিক অগ্রগতি</p>
            <span className="text-brand-primary font-black text-base">{progressPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700" style={{ background: 'linear-gradient(90deg,#2D7A3A,#3DAE4F)', width: `${progressPct}%` }} />
          </div>
          <p className="text-ninja-muted text-xs mt-1.5">{Math.min(completedCount, totalTopics)}/{totalTopics} টপিক সম্পন্ন</p>
        </div>
      </div>

      {/* Topics list */}
      <div className="px-5 space-y-2">
        <p className="font-black text-ninja-text text-sm mb-2">টপিকসমূহ</p>
        {(topics ?? []).map((topic, i) => {
          const isDone   = i < completedCount
          const isActive = i === completedCount
          const isLocked = topic.is_locked || (i > completedCount + 1)
          const qCount   = (topic as any).questions?.length ?? 0

          return (
            <Link
              key={topic.id}
              href={isLocked ? '#' : `/solve/${topic.id}`}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border-2 transition-all ${
                isActive   ? 'border-brand-primary bg-brand-light shadow-sm' :
                isDone     ? 'border-green-200 bg-green-50' :
                isLocked   ? 'border-ninja-border bg-white opacity-50 pointer-events-none' :
                             'border-ninja-border bg-white'
              } ${!isLocked ? 'active:scale-95' : ''}`}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                style={{
                  background: isDone ? '#DCFCE7' : isActive ? '#2D7A3A' : '#F5F5F5',
                  color:      isDone ? '#15803D' : isActive ? 'white'   : '#9E9E9E',
                }}
              >
                {isDone ? '✓' : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${isActive ? 'text-brand-primary' : isDone ? 'text-ninja-muted' : 'text-ninja-text'}`}>
                  {topic.title_bn}
                </p>
                {qCount > 0 && (
                  <p className="text-ninja-muted text-[11px] mt-0.5">{qCount}টি প্রশ্ন</p>
                )}
              </div>
              {isDone   ? <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" /> :
               isLocked ? <Lock size={14} className="text-ninja-muted flex-shrink-0" /> :
               isActive ? <PlayCircle  size={18} className="text-brand-primary flex-shrink-0" /> :
                          <ChevronRight size={16} className="text-ninja-muted flex-shrink-0" />}
            </Link>
          )
        })}

        {(!topics || topics.length === 0) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-ninja-muted font-bold text-sm">প্রশ্নগুলো শীঘ্রই আসছে</p>
            <p className="text-ninja-muted text-xs mt-1">Content coming soon...</p>
          </div>
        )}
      </div>

      {/* Start button */}
      {topics && topics.length > 0 && (
        <div className="px-5 mt-6">
          <Link href={`/solve/${topics.find((t: any) => !t.is_locked)?.id ?? topics[0].id}`}>
            <button className="w-full py-4 rounded-2xl font-black text-white text-base active:scale-95 transition-transform" style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
              শুরু করি 🚀
            </button>
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
