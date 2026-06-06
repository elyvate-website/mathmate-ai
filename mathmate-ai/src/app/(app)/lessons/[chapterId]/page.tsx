import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { TopBar }       from '@/components/layout/TopBar'
import { Button }       from '@/components/ui/Button'
import { BottomNav }    from '@/components/layout/BottomNav'
import { CheckCircle2, Circle, Lock } from 'lucide-react'

export default async function LessonsPage({ params }: { params: { chapterId: string } }) {
  const supabase   = createClient()
  const chapterId  = parseInt(params.chapterId)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: chapter }, { data: topics }, { data: progress }] = await Promise.all([
    supabase.from('chapters').select('*').eq('id', chapterId).single(),
    supabase.from('topics').select('*').eq('chapter_id', chapterId).order('order_num'),
    supabase.from('user_progress').select('topic_id, accuracy').eq('user_id', user.id),
  ])

  if (!chapter) redirect('/chapters/9')

  const completedTopicIds = new Set(
    (progress ?? []).filter(p => p.accuracy >= 70).map(p => p.topic_id)
  )
  const totalTopics    = topics?.length ?? 0
  const completedCount = topics?.filter(t => completedTopicIds.has(t.id)).length ?? 0
  const progressPct    = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-12">
        <TopBar showBack />

        {/* Chapter header */}
        <div className="flex justify-between items-start mt-3 mb-3">
          <div>
            <p className="text-gray-400 text-xs font-bold mb-0.5">অধ্যায় {chapter.chapter_num}</p>
            <h1 className="text-xl font-black text-gray-900">{chapter.title_bn}</h1>
          </div>
          <span className="bg-brand-light text-brand-primary text-xs font-black px-3 py-1.5 rounded-full">
            {progressPct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden mb-6">
          <div className="bg-purple-gradient h-full rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Topics list */}
        {(topics ?? []).map((topic, i) => {
          const isDone   = completedTopicIds.has(topic.id)
          const isActive = !isDone && i === completedCount
          const isLocked = !isDone && !isActive && !topic.is_locked === false

          return (
            <Link
              key={topic.id}
              href={`/solve/${topic.id}`}
              className={`flex items-center gap-4 py-4 border-b border-gray-100 ${
                topic.is_locked ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:bg-gray-50 rounded-xl px-2 transition-colors'
              }`}
            >
              {/* Status icon */}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${
                isDone   ? 'bg-green-50  text-green-600' :
                isActive ? 'bg-brand-light text-brand-primary' :
                           'bg-gray-100 text-gray-400'
              }`}>
                {topic.topic_code}
              </div>

              <div className="flex-1">
                <p className={`font-bold text-sm ${isDone ? 'text-gray-700' : isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  {topic.title_bn}
                </p>
                {topic.title_en && <p className="text-gray-400 text-xs mt-0.5">{topic.title_en}</p>}
              </div>

              {isDone
                ? <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                : isActive
                  ? <div className="w-2.5 h-2.5 rounded-full bg-brand-primary flex-shrink-0" />
                  : topic.is_locked
                    ? <Lock size={16} className="text-gray-400 flex-shrink-0" />
                    : <Circle size={18} className="text-gray-300 flex-shrink-0" />
              }
            </Link>
          )
        })}

        {(!topics || topics.length === 0) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-gray-500 font-bold">কোনো টপিক পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {topics && topics.length > 0 && (
        <div className="px-5 mt-6">
          <Link href={`/solve/${topics.find(t => !completedTopicIds.has(t.id) && !t.is_locked)?.id ?? topics[0].id}`}>
            <Button fullWidth>শুরু করি 🚀</Button>
          </Link>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
