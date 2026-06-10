import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import Link             from 'next/link'
import { ChevronRight }  from 'lucide-react'

export default async function PracticePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('class_level').eq('id', user.id).single()
  const cls = profile?.class_level ?? 9

  // Fetch recent questions for practice — ordered randomly via PostgreSQL random()
  const { data: questions } = await supabase
    .from('questions')
    .select('*, chapters(title_bn, chapter_num), topics(title_bn)')
    .eq('class_level', cls)
    .eq('question_type', 'mcq')
    .limit(12)

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-12 pb-5">
        <h1 className="text-2xl font-black text-ninja-text">অনুশীলন</h1>
        <p className="text-ninja-muted text-sm mt-1">প্রতিদিন অনুশীলন করো, এগিয়ে থাকো 💪</p>
      </div>

      {/* Mode cards */}
      <div className="px-5 mb-6">
        <p className="font-black text-ninja-text text-base mb-3">অনুশীলন মোড</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: '⚡', color: '#FFC107', bg: '#FFF8E1', title: 'দ্রুত কুইজ',      sub: '৫টি এলোমেলো প্রশ্ন',     href: `/chapters/${cls}` },
            { emoji: '🎯', color: '#2D7A3A', bg: '#E8F5E9', title: 'চ্যাপ্টার রিভিউ', sub: 'একটি অধ্যায় পুনরালোচনা', href: `/chapters/${cls}` },
            { emoji: '📈', color: '#9C27B0', bg: '#F3E5F5', title: 'দুর্বল টপিক',     sub: 'যেখানে দুর্বল সেখানে মনোযোগ', href: '/progress' },
            { emoji: '🏆', color: '#1976D2', bg: '#E3F2FD', title: 'লিডারবোর্ড',     sub: 'বন্ধুদের সাথে প্রতিযোগিতা', href: '/leaderboard' },
          ].map(m => (
            <Link key={m.title} href={m.href} className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm active:scale-95 transition-transform">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3" style={{ background: m.bg }}>
                {m.emoji}
              </div>
              <p className="font-black text-ninja-text text-sm">{m.title}</p>
              <p className="text-ninja-muted text-xs mt-0.5 leading-snug">{m.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Practice questions */}
      <div className="px-5">
        <p className="font-black text-ninja-text text-base mb-3">অনুশীলনের প্রশ্ন</p>
        {questions && questions.length > 0 ? (
          <div className="space-y-2">
            {questions.map(q => (
              <Link
                key={q.id}
                href={q.topic_id ? `/solve/${q.topic_id}` : '#'}
                className="bg-white border border-ninja-border rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm active:scale-95 transition-transform"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                  Q{q.question_num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ninja-text font-bold text-sm truncate leading-snug">{q.question_bn}</p>
                  <p className="text-ninja-muted text-xs mt-0.5 truncate">
                    {(q as any).chapters?.title_bn ?? 'গণিত'}
                    {(q as any).topics?.title_bn ? ` · ${(q as any).topics.title_bn}` : ''}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: q.difficulty === 'hard' ? '#FEF2F2' : q.difficulty === 'medium' ? '#FFF8E1' : '#E8F5E9', color: q.difficulty === 'hard' ? '#EF4444' : q.difficulty === 'medium' ? '#E65100' : '#2D7A3A' }}>
                    {q.difficulty === 'hard' ? 'কঠিন' : q.difficulty === 'medium' ? 'মাঝারি' : 'সহজ'}
                  </span>
                  <ChevronRight size={14} className="text-ninja-muted" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-ninja-muted font-bold text-sm">প্রশ্নগুলো শীঘ্রই আসছে</p>
            <p className="text-ninja-muted text-xs mt-1">প্রথমে অধ্যায়গুলো থেকে শেখা শুরু করো</p>
            <Link href={`/chapters/${cls}`}>
              <button className="mt-4 px-6 py-3 rounded-2xl font-black text-white text-sm" style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
                অধ্যায়ে যাও →
              </button>
            </Link>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
