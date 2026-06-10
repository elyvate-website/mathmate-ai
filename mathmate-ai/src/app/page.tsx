import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import LandingClient    from './LandingClient'

export default async function LandingPage() {
  // Auto-redirect logged-in users straight to dashboard
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return <LandingClient />
}
