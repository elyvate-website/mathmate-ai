import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import ForgotPasswordClient from './ForgotPasswordClient'

export default async function ForgotPasswordPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')
  return <ForgotPasswordClient />
}
