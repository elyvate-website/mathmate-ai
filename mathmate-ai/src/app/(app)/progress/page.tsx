import { createClient }    from '@/lib/supabase/server'
import { redirect }        from 'next/navigation'
import { BottomNav }       from '@/components/layout/BottomNav'
import { ProgressClient }  from './ProgressClient'

export default async function ProgressPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [statsResult, progressResult] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
    supabase.from('user_progress')
      .select('*, chapters(title_bn, chapter_num)')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(50),
  ])

  return (
    <>
      <ProgressClient stats={statsResult.data} progressRows={progressResult.data ?? []} />
      <BottomNav />
    </>
  )
}
