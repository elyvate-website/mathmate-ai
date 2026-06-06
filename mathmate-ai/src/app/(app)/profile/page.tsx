import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { TopBar }       from '@/components/layout/TopBar'
import { BottomNav }    from '@/components/layout/BottomNav'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: stats }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
  ])

  if (!profile) redirect('/onboarding')

  return <ProfileClient profile={profile} stats={stats} userEmail={user.email ?? ''} />
}
