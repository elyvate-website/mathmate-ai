import { createClient }  from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import SignupClient      from './SignupClient'

export default async function SignupPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return <SignupClient />
}
