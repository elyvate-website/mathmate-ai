'use client'
import { useState } from 'react'
import Link          from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button }    from '@/components/ui/Button'
import { Input }     from '@/components/ui/Input'
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
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options:  { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="h-36 flex items-center justify-center rounded-b-[32px]"
        style={{ background:'linear-gradient(148deg,#1a0547,#7C3AED)' }}>
        <div className="text-6xl drop-shadow-xl">🎓</div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-10">
        <h2 className="text-2xl font-black text-gray-900 mb-1">অ্যাকাউন্ট তৈরি করো</h2>
        <p className="text-gray-400 text-sm mb-6">শুরু করতে অ্যাকাউন্ট বানাও</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        <button onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 py-3.5 border-[1.5px] border-gray-200 rounded-2xl font-bold text-sm text-gray-700 hover:border-brand-primary transition-colors mb-5">
          <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google দিয়ে সাইন আপ করো
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" /><span className="text-gray-400 text-xs">অথবা</span><div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="flex flex-col gap-3 mb-4">
          <Input placeholder="পুরো নাম" type="text" leftIcon={<User size={16}/>}
            value={form.fullName} onChange={e => setForm(p => ({...p, fullName: e.target.value}))} />
          <Input placeholder="ইমেইল বা ফোন" type="email" leftIcon={<Mail size={16}/>}
            value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
          <div className="relative">
            <Input placeholder="পাসওয়ার্ড" type={showPw ? 'text' : 'password'} leftIcon={<Lock size={16}/>}
              value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} className="pr-12" />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
          <Input placeholder="পাসওয়ার্ড নিশ্চিত করো" type="password" leftIcon={<Lock size={16}/>}
            value={form.confirm} onChange={e => setForm(p => ({...p, confirm: e.target.value}))} />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setAgreed(!agreed)}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${agreed ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300'}`}>
            {agreed && <span className="text-white text-xs font-black">✓</span>}
          </button>
          <p className="text-sm text-gray-500">
            আমি <span className="text-brand-primary font-bold cursor-pointer">শর্তাবলী</span>তে সম্মত
          </p>
        </div>

        <Button fullWidth loading={loading} onClick={handleSignup}>সাইন আপ</Button>

        <p className="text-center mt-5 text-sm text-gray-400">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
          <Link href="/login" className="text-brand-primary font-black hover:underline">লগইন করো</Link>
        </p>
      </div>
    </div>
  )
}
