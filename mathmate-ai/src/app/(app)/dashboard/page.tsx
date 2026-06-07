import { createClient }       from '@/lib/supabase/server'
import { redirect }           from 'next/navigation'
import { Bell, Menu }         from 'lucide-react'
import { BottomNav }          from '@/components/layout/BottomNav'
import { ProgressCard }       from '@/components/dashboard/ProgressCard'
import { StatsRow }           from '@/components/dashboard/StatsRow'
import { ContinueLearning }   from '@/components/dashboard/ContinueLearning'
import { QuickPractice }      from '@/components/dashboard/QuickPractice'
import Link                   from 'next/link'
import { chapterEmoji }       from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: stats }, { data: chapters }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('chapters').select('*').eq('class_level', 9).order('chapter_num'),
  ])

  // Only redirect to onboarding if profile truly doesn't exist
  // (not if it just failed to load due to a transient error)
  if (!profile && !stats) {
    redirect('/onboarding')
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? 'বন্ধু'

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <div className="text-2xl mb-1">
              <Menu size={22} className="text-gray-600" />
            </div>
            <h1 className="text-xl font-black text-gray-900">হ্যালো, {firstName}! 👋</h1>
            <p className="text-gray-400 text-sm">আজ কি শিখবে?</p>
          </div>
          <button className="w-11 h-11 bg-brand-light rounded-2xl flex items-center justify-center">
            <Bell size={20} className="text-brand-primary" />
          </button>
        </div>

        <ProgressCard stats={stats} />
        <StatsRow stats={stats} />
      </div>

      {/* Continue Learning */}
      <div className="px-5 pt-5">
        <h2 className="font-black text-gray-900 text-base mb-3">পড়া চালিয়ে যাও</h2>
        <ContinueLearning
          chapterName="অধ্যায় ১"
          topicName="বাস্তব সংখ্যা"
          progress={0}
          lessonsTotal={4}
          lessonsDone={0}
          href="/chapters/9"
        />
      </div>

      {/* Quick Practice */}
      <div className="px-5 pt-5">
        <h2 className="font-black text-gray-900 text-base mb-3">দ্রুত অনুশীলন</h2>
        <QuickPractice />
      </div>

      {/* All Chapters */}
      <div className="px-5 pt-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-black text-gray-900 text-base">অধ্যায়সমূহ</h2>
          <Link href="/chapters/9" className="text-brand-primary text-sm font-bold">সব দেখো →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(chapters ?? []).slice(0, 6).map(ch => (
            <Link
              key={ch.id}
              href={`/chapters/${ch.class_level}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-95"
            >
              <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center text-xl mb-3">
                {chapterEmoji(ch.chapter_num)}
              </div>
              <p className="text-xs text-gray-400 mb-0.5">অধ্যায় {ch.chapter_num}</p>
              <p className="font-black text-gray-900 text-xs leading-tight">{ch.title_bn}</p>
            </Link>
          ))}

          {(!chapters || chapters.length === 0) && (
            <div className="col-span-2 text-center py-10">
              <div className="text-4xl mb-2">📚</div>
              <p className="text-gray-400 text-sm font-bold">অধ্যায় লোড হচ্ছে...</p>
              <p className="text-gray-300 text-xs mt-1">Supabase SQL চালালে অধ্যায় দেখা যাবে</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
