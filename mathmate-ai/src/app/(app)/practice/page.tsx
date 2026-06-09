import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import Link             from 'next/link'
import { ChevronRight, Zap, Target, BookOpen, BarChart } from 'lucide-react'

export default async function PracticePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('class_level').eq('id', user.id).single()
  const cls = profile?.class_level ?? 9

  // Get a few questions for quick practice
  const { data: randomQuestions } = await supabase
    .from('questions')
    .select('*, topics(title_bn), chapters(title_bn)')
    .eq('class_level', cls)
    .eq('question_type', 'mcq')
    .limit(20)

  const modes = [
    { icon: Zap,      color: '#FFC107', bg: '#FFF8E1', title: 'Quick Quiz',       sub: '5 random questions',      href: '#' },
    { icon: Target,   color: '#2D7A3A', bg: '#E8F5E9', title: 'Challenge Mode',    sub: 'Beat your high score',    href: '#' },
    { icon: BookOpen, color: '#9C27B0', bg: '#F3E5F5', title: 'Chapter Review',   sub: 'Revise a chapter',        href: `/chapters/${cls}` },
    { icon: BarChart, color: '#1976D2', bg: '#E3F2FD', title: 'Weak Topic Drill', sub: 'Focus on what you miss',  href: '/progress' },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <h1 className="text-2xl font-black text-ninja-text">Practice</h1>
        <p className="text-ninja-muted text-sm mt-1">শক্তিশালী হও, প্রতিদিন অনুশীলন করো 💪</p>
      </div>

      {/* Practice modes */}
      <div className="px-5 mb-6">
        <p className="font-black text-ninja-text text-base mb-3">Practice Modes</p>
        <div className="grid grid-cols-2 gap-3">
          {modes.map(m => (
            <Link
              key={m.title}
              href={m.href}
              className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: m.bg }}
              >
                <m.icon size={20} color={m.color} />
              </div>
              <p className="font-black text-ninja-text text-sm">{m.title}</p>
              <p className="text-ninja-muted text-xs mt-0.5">{m.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent questions */}
      {randomQuestions && randomQuestions.length > 0 && (
        <div className="px-5">
          <p className="font-black text-ninja-text text-base mb-3">Questions to Practice</p>
          <div className="space-y-2">
            {randomQuestions.slice(0, 8).map(q => (
              <Link
                key={q.id}
                href={q.topic_id ? `/solve/${q.topic_id}` : '#'}
                className="bg-white border border-ninja-border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm active:scale-95 transition-transform"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: '#E8F5E9', color: '#2D7A3A' }}
                >
                  Q{q.question_num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ninja-text font-bold text-sm truncate">{q.question_bn}</p>
                  <p className="text-ninja-muted text-xs mt-0.5 truncate">
                    {(q as any).chapters?.title_bn ?? 'Mathematics'}
                  </p>
                </div>
                <ChevronRight size={16} className="text-ninja-muted flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
