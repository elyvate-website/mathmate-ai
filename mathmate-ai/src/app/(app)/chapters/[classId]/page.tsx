import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import Link             from 'next/link'
import { BottomNav }    from '@/components/layout/BottomNav'
import { TopBar }       from '@/components/layout/TopBar'
import { Badge }        from '@/components/ui/Badge'
import { ChevronRight, Lock } from 'lucide-react'
import { chapterEmoji } from '@/lib/utils'

export default async function ChaptersPage({ params }: { params: { classId: string } }) {
  const supabase   = createClient()
  const classLevel = parseInt(params.classId) || 9
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: chapters } = await supabase
    .from('chapters')
    .select('*, topics(*)')
    .eq('class_level', classLevel)
    .order('chapter_num')

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
        <TopBar showBack />
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-xl font-black text-gray-900">অধ্যায়সমূহ</h1>
            <p className="text-gray-400 text-sm">শ্রেণি {classLevel} — গণিত</p>
          </div>
          {/* Class switcher */}
          <div className="flex gap-1.5">
            {[9, 10].map(c => (
              <Link key={c} href={`/chapters/${c}`}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-colors ${
                  classLevel === c ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-brand-light hover:text-brand-primary'
                }`}>
                {c}ম
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Chapters list */}
      <div className="px-5 pt-4">
        {(chapters ?? []).map((chapter, i) => {
          const topicsCount = (chapter.topics as any[])?.length ?? 0
          const isLocked    = i > 3 // First 4 unlocked for demo

          return (
            <Link
              key={chapter.id}
              href={isLocked ? '#' : `/lessons/${chapter.id}`}
              className={`flex items-center gap-4 bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 ${
                isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md active:scale-95 transition-all'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                isLocked ? 'bg-gray-100' : 'bg-brand-light'
              }`}>
                {isLocked ? '🔒' : chapterEmoji(chapter.chapter_num)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-gray-400 text-xs">অধ্যায় {chapter.chapter_num}</p>
                  {i === 0 && <Badge variant="green">✓ সম্পন্ন</Badge>}
                  {i === 2 && <Badge variant="purple">চলমান</Badge>}
                </div>
                <p className="font-black text-gray-900 text-sm leading-snug truncate">
                  {chapter.title_bn}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{topicsCount} টপিক</p>
              </div>

              {isLocked
                ? <Lock size={16} className="text-gray-400 flex-shrink-0" />
                : <ChevronRight size={18} className="text-brand-primary flex-shrink-0" />
              }
            </Link>
          )
        })}

        {(!chapters || chapters.length === 0) && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500 font-bold">কন্টেন্ট শীঘ্রই আসছে...</p>
            <p className="text-gray-400 text-sm mt-1">ডেটাবেজে অধ্যায় যোগ করো</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
