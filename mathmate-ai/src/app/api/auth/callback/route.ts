import { createClient }  from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Check if profile exists
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()
        return NextResponse.redirect(`${origin}${profile ? '/dashboard' : '/onboarding'}`)
      }
    }
  }
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
