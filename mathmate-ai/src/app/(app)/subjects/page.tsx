import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import { SUBJECTS }     from '@/constants'
import Link             from 'next/link'
import Image            from 'next/image'
import { ChevronLeft, Lock, ChevronRight } from 'lucide-react'

export default async function SubjectsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('class_level').eq('id', user.id).single()
  const cls = profile?.class_level ?? 9

  return (
    <div className="min-h-screen pb-28 page-enter" style={{ background:'#F7F9F7' }}>
      <div className="px-4 pt-12 pb-5">
        <Link href="/dashboard" className="flex items-center gap-1 text-ninja-muted mb-4">
          <ChevronLeft size={18} />
          <span className="text-sm font-semibold">Back</span>
        </Link>
        <h1 className="text-2xl font-black text-ninja-dark">বিষয় বেছে নাও</h1>
        <p className="text-ninja-muted text-sm mt-1">আজ কী শিখতে চাও?</p>
      </div>

      <div className="px-4 space-y-3 stagger-children">
        {SUBJECTS.map(subject => (
          subject.active ? (
            <Link key={subject.id} href={`/chapters/${cls}`}>
              <div className="card-raised p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
                style={{ borderLeft:`4px solid ${subject.color}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                  style={{ background: subject.bgColor }}>{subject.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-ninja-dark text-base">{subject.title}</p>
                  <p className="text-ninja-muted text-xs mt-0.5">{subject.progress}% Complete</p>
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden w-36" style={{ background:'#F0F0F0' }}>
                    <div className="h-full rounded-full" style={{ background: subject.color, width:`${subject.progress}%` }} />
                  </div>
                </div>
                <ChevronRight size={18} style={{ color: subject.color }} className="flex-shrink-0" />
              </div>
            </Link>
          ) : (
            <div key={subject.id} className="card-flat p-4 flex items-center gap-4 opacity-55">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                style={{ background: subject.bgColor }}>{subject.icon}</div>
              <div className="flex-1">
                <p className="font-black text-ninja-dark text-base">{subject.title}</p>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                  style={{ background:'#FFF3E0', color:'#E65100' }}>Coming Soon</span>
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
