import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import { BottomNav }     from '@/components/layout/BottomNav'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, statsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
  ])

  return (
    <>
      <ProfileClient profile={profileResult.data} stats={statsResult.data} userEmail={user.email ?? ''} />
      <BottomNav />
    </>
  )
}
