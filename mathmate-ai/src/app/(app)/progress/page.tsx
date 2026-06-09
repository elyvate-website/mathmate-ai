import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ProgressClient } from './ProgressClient'

export default async function ProgressPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: stats }, { data: progress }] = await Promise.all([
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    supabase.from('user_progress').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(50),
  ])

  return (
    <>
      <ProgressClient stats={stats} progressRows={progress ?? []} />
      <BottomNav />
    </>
  )
}
