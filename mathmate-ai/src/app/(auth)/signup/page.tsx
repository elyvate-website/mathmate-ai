'use client'
import { useState }     from 'react'
import Link              from 'next/link'
import Image             from 'next/image'
import { useRouter }    from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'

export default function SignupPage() {
  const router   = useRouter()
  const supabase = createClient()
  const [form,    setForm]    = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [agreed,  setAgreed]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSignup = async () => {
    if (!agreed) { setError('শর্তাবলীতে সম্মত হতে হবে।'); return }
    if (form.password !== form.confirm) { setError('পাসওয়ার্ড মিলছে না।'); return }
    if (form.password.length < 6) { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { full_name: form.fullName } },
    })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/onboarding')
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div
        className="w-full flex flex-col items-center py-8 rounded-b-[40px]"
        style={{ background: 'linear-gradient(160deg,#1B5E20,#2D7A3A)' }}
      >
        <Image src="/Ninja Greetings 2.png" alt="ninja" width={110} height={110} className="object-contain drop-shadow-xl" />
        <h2 className="text-white text-2xl font-black mt-3">অ্যাকাউন্ট তৈরি করো</h2>
        <p className="text-white/60 text-sm">তোমার গণিত যাত্রা শুরু করো</p>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-bold">{error}</div>
        )}

        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-ninja-border rounded-2xl font-bold text-sm text-ninja-text mb-5 active:scale-95 transition-transform">
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google দিয়ে সাইন আপ করো
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-ninja-border" />
          <span className="text-ninja-muted text-xs font-semibold">অথবা</span>
          <div className="flex-1 h-px bg-ninja-border" />
        </div>

        <div className="space-y-3 mb-4">
          {[
            { icon: User,  type: 'text',     key: 'fullName',  ph: 'পুরো নাম' },
            { icon: Mail,  type: 'email',    key: 'email',     ph: 'ইমেইল' },
            { icon: Lock,  type: 'password', key: 'password',  ph: 'পাসওয়ার্ড' },
            { icon: Lock,  type: 'password', key: 'confirm',   ph: 'পাসওয়ার্ড নিশ্চিত করো' },
          ].map(f => (
            <div key={f.key} className="flex items-center border-2 border-ninja-border rounded-2xl px-4 gap-3 focus-within:border-brand-primary transition-colors">
              <f.icon size={16} className="text-ninja-muted flex-shrink-0" />
              <input
                type={f.type === 'password' ? (showPw ? 'text' : 'password') : f.type}
                placeholder={f.ph}
                value={(form as any)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="flex-1 py-4 text-sm font-semibold text-ninja-text outline-none placeholder:text-ninja-muted bg-transparent"
              />
              {f.key === 'password' && (
                <button onClick={() => setShowPw(!showPw)} className="text-ninja-muted">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setAgreed(!agreed)}
            className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: agreed ? '#2D7A3A' : 'white', borderColor: agreed ? '#2D7A3A' : '#E0E0E0' }}>
            {agreed && <span className="text-white text-xs font-black">✓</span>}
          </button>
          <p className="text-sm text-ninja-muted">
            আমি <span className="text-brand-primary font-bold cursor-pointer">শর্তাবলী</span>তে সম্মত
          </p>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-white text-base active:scale-95 transition-transform disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
        >
          {loading ? 'তৈরি হচ্ছে...' : 'সাইন আপ'}
        </button>

        <p className="text-center mt-5 text-sm text-ninja-muted">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="text-brand-primary font-black">লগইন করো</Link>
        </p>
      </div>
    </div>
  )
}
