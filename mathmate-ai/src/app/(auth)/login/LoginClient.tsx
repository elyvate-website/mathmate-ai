'use client'
import { useState }     from 'react'
import Link              from 'next/link'
import Image             from 'next/image'
import { useRouter }    from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function LoginClient() {
  const router   = useRouter()
  const supabase = createClient()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError('সব তথ্য পূরণ করো।'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (err) { setError('ইমেইল বা পাসওয়ার্ড সঠিক নয়।'); setLoading(false); return }
    router.push('/dashboard')
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F9F7' }}>

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-14 pb-8 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg,#1B5E20 0%,#2D7A3A 60%,#388E3C 100%)' }}>
        {/* ambient */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#FFC107,transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#4CAF50,transparent)', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Image src="/Ninja Greetings.png" alt="Math Ninja" width={96} height={96} className="object-contain drop-shadow-2xl" />
          </div>
          <h1 className="text-white text-2xl font-black text-center">স্বাগতম ফিরে! 👋</h1>
          <p className="text-white/60 text-sm mt-1 text-center">তোমার শেখার যাত্রা চালিয়ে যাও</p>
        </div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-5 -mt-5 relative z-10">
        <div className="card-hero p-6 rounded-[28px]">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-5">
              <span className="text-red-500 text-base flex-shrink-0">⚠️</span>
              <p className="text-red-600 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform mb-5"
            style={{ background: '#F7F9F7', border: '1.5px solid #EFEFEF', color: '#1A1A1A' }}>
            <GoogleIcon />
            Google দিয়ে লগইন করো
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ background: '#EFEFEF' }} />
            <span className="text-xs font-bold" style={{ color: '#BDBDBD' }}>অথবা ইমেইল দিয়ে</span>
            <div className="flex-1 h-px" style={{ background: '#EFEFEF' }} />
          </div>

          {/* Fields */}
          <div className="space-y-3 mb-3">
            {/* Email */}
            <div>
              <label className="text-xs font-black uppercase tracking-wider mb-1.5 block" style={{ color: '#9E9E9E' }}>ইমেইল</label>
              <div className="flex items-center rounded-2xl px-4 gap-3 transition-all"
                style={{ background: '#F7F9F7', border: '1.5px solid #EFEFEF' }}
                onFocus={e => e.currentTarget.style.borderColor='#2D7A3A'}
                onBlur={e  => e.currentTarget.style.borderColor='#EFEFEF'}>
                <Mail size={16} style={{ color: '#BDBDBD' }} className="flex-shrink-0" />
                <input type="email" placeholder="তোমার ইমেইল লেখো" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="flex-1 py-4 text-sm font-semibold outline-none bg-transparent placeholder:text-[#BDBDBD]"
                  style={{ color: '#1A1A1A' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider" style={{ color: '#9E9E9E' }}>পাসওয়ার্ড</label>
                <Link href="/forgot-password" className="text-xs font-black" style={{ color: '#2D7A3A' }}>
                  ভুলে গেছো?
                </Link>
              </div>
              <div className="flex items-center rounded-2xl px-4 gap-3 transition-all"
                style={{ background: '#F7F9F7', border: '1.5px solid #EFEFEF' }}
                onFocus={e => e.currentTarget.style.borderColor='#2D7A3A'}
                onBlur={e  => e.currentTarget.style.borderColor='#EFEFEF'}>
                <Lock size={16} style={{ color: '#BDBDBD' }} className="flex-shrink-0" />
                <input type={showPw ? 'text' : 'password'} placeholder="তোমার পাসওয়ার্ড"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  className="flex-1 py-4 text-sm font-semibold outline-none bg-transparent placeholder:text-[#BDBDBD]"
                  style={{ color: '#1A1A1A' }} />
                <button onClick={() => setShowPw(!showPw)} style={{ color: '#BDBDBD' }} className="flex-shrink-0">
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleLogin} disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-5"
            style={{ background: loading ? '#3DAE4F' : 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', boxShadow: '0 8px 24px rgba(45,122,58,0.30)' }}>
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />লগইন হচ্ছে...</>
              : <> লগইন করো <ArrowRight size={16} /></>
            }
          </button>

          {/* Signup link */}
          <p className="text-center mt-5 text-sm" style={{ color: '#9E9E9E' }}>
            অ্যাকাউন্ট নেই?{' '}
            <Link href="/signup" className="font-black" style={{ color: '#2D7A3A' }}>সাইন আপ করো</Link>
          </p>
        </div>

        <p className="text-center text-xs mt-5 pb-8" style={{ color: '#BDBDBD' }}>
          MathMate AI • Class 9–10 গণিত
        </p>
      </div>
    </div>
  )
}
