import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import { SUBJECTS }     from '@/constants'
import Link             from 'next/link'
import { ChevronLeft, Lock } from 'lucide-react'

export default async function SubjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('class_level').eq('id', user.id).single()
  const cls = profile?.class_level ?? 9

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <Link href="/dashboard" className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </Link>
        <h1 className="text-2xl font-black text-ninja-text">Choose a Subject</h1>
        <p className="text-ninja-muted text-sm mt-1">What do you want to learn today?</p>
      </div>

      {/* Subjects grid */}
      <div className="px-5 space-y-3">
        {SUBJECTS.map(subject => (
          subject.active ? (
            <Link
              key={subject.id}
              href={`/chapters/${cls}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border-2 border-ninja-border shadow-sm active:scale-95 transition-transform"
              style={{ borderColor: subject.bgColor }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: subject.bgColor }}
              >
                {subject.icon}
              </div>
              <div className="flex-1">
                <p className="font-black text-ninja-text text-base">{subject.title}</p>
                <p className="text-ninja-muted text-xs mt-0.5">{subject.progress}% Complete</p>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden w-32">
                  <div
                    className="h-full rounded-full"
                    style={{ background: subject.color, width: `${subject.progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={subject.id}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-ninja-border shadow-sm opacity-60"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: subject.bgColor }}
              >
                {subject.icon}
              </div>
              <div className="flex-1">
                <p className="font-black text-ninja-text text-base">{subject.title}</p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background: '#FFF3E0', color: '#E65100' }}
                >
                  Coming Soon
                </span>
              </div>
              <Lock size={18} className="text-ninja-muted flex-shrink-0" />
            </div>
          )
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
