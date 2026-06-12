import { createClient }  from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get('code')
  const tokenHash  = searchParams.get('token_hash')
  const type       = searchParams.get('type')          // 'recovery' | 'signup' | etc.
  const next       = searchParams.get('next') ?? '/onboarding'

  const supabase = createClient()

  // ── Password-reset link (token_hash flow) ──────────────────────────────────
  if (tokenHash && type === 'recovery') {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
    if (!error) {
      // Session is now set in cookies → let the reset page call updateUser()
      return NextResponse.redirect(`${origin}/auth/reset-password`)
    }
    return NextResponse.redirect(`${origin}/forgot-password?error=link_expired`)
  }

  // ── Email confirmation / magic-link (token_hash, other types) ─────────────
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as any })
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('id').eq('id', user.id).single()
        return NextResponse.redirect(`${origin}${profile ? '/dashboard' : '/onboarding'}`)
      }
    }
    return NextResponse.redirect(`${origin}/login?error=link_invalid`)
  }

  // ── OAuth PKCE code exchange ───────────────────────────────────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('id').eq('id', user.id).single()
        return NextResponse.redirect(`${origin}${profile ? '/dashboard' : '/onboarding'}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`)
}
