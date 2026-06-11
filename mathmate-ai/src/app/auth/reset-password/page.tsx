'use client'
import { useState, useEffect } from 'react'
import { useRouter }            from 'next/navigation'
import Image                    from 'next/image'
import Link                     from 'next/link'
import { createClient }         from '@/lib/supabase/client'
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'

const strengthInfo = (pw: string) => {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6)  score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'দুর্বল',    color: '#EF4444' }
  if (score <= 3) return { score, label: 'মাঝারি',   color: '#F59E0B' }
  return              { score, label: 'শক্তিশালী', color: '#22C55E' }
}

export default function ResetPasswordPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPw,    setShowPw]    = useState(false)
  const [showCf,    setShowCf]    = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [error,     setError]     = useState('')
  const [validLink, setValidLink] = useState<boolean | null>(null)

  const strength = strengthInfo(password)
  const match    = confirm.length > 0 && password === confirm

  useEffect(() => {
    // Supabase puts the session in the URL hash when the user clicks the reset link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setValidLink(true)
      if (event === 'SIGNED_IN' && validLink === null) setValidLink(false)
    })
    // Also check immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setValidLink(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    if (password.length < 6)       { setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।'); return }
    if (password !== confirm)      { setError('পাসওয়ার্ড দুটি মিলছে না।'); return }
    setLoading(true); setError('')

    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (err) { setError('পাসওয়ার্ড আপডেট করা যায়নি। আবার চেষ্টা করো।'); return }
    setDone(true)
    setTimeout(() => router.push('/dashboard'), 2500)
  }

  return (
    <div className="min-h-screen flex flex-col page-enter" style={{ background: '#F7F9F7' }}>

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-14 pb-8 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg,#1B5E20 0%,#2D7A3A 60%,#388E3C 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#FFC107,transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#4CAF50,transparent)', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-4" style={{ animation: done ? 'bounceIn 0.6s ease both' : 'float 3s ease-in-out infinite' }}>
            <Image
              src={done ? '/Ninja Celebrating.png' : '/chill ninja.png'}
              alt="ninja" width={96} height={96} className="object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-white text-2xl font-black text-center">
            {done ? 'সফল হয়েছে! 🎉' : 'নতুন পাসওয়ার্ড'}
          </h1>
          <p className="text-white/60 text-sm mt-1 text-center">
            {done ? 'ড্যাশবোর্ডে নিয়ে যাচ্ছি...' : 'একটি শক্তিশালী পাসওয়ার্ড তৈরি করো'}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-5 -mt-5 relative z-10">
        <div className="card-hero p-6 rounded-[28px]">

          {done ? (
            /* Success */
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg,#E8F5E9,#DCFCE7)' }}>
                <CheckCircle2 size={38} style={{ color: '#2D7A3A' }} />
              </div>
              <h2 className="font-black text-xl mb-2" style={{ color: '#1A1A1A' }}>পাসওয়ার্ড পরিবর্তিত!</h2>
              <p className="text-sm font-semibold mb-6" style={{ color: '#9E9E9E' }}>
                তোমার পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।
              </p>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-4"
                style={{ background: '#E8F5E9' }}>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-black" style={{ color: '#2D7A3A' }}>ড্যাশবোর্ডে নিয়ে যাচ্ছি...</span>
              </div>
              <Link href="/dashboard"
                className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', boxShadow: '0 8px 24px rgba(45,122,58,0.30)' }}>
                ড্যাশবোর্ডে যাও <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              {/* Security badge */}
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl mb-5"
                style={{ background: '#E8F5E9', border: '1.5px solid #C8E6C9' }}>
                <ShieldCheck size={18} style={{ color: '#2D7A3A' }} className="flex-shrink-0" />
                <p className="text-xs font-bold" style={{ color: '#2D7A3A' }}>
                  সুরক্ষিত কানেকশন • পাসওয়ার্ড এনক্রিপ্টেড
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
                  <span className="text-base flex-shrink-0">⚠️</span>
                  <p className="text-sm font-semibold" style={{ color: '#DC2626' }}>{error}</p>
                </div>
              )}

              {/* New password */}
              <div className="mb-3">
                <label className="text-xs font-black uppercase tracking-wider mb-1.5 block" style={{ color: '#9E9E9E' }}>
                  নতুন পাসওয়ার্ড
                </label>
                <div className="flex items-center rounded-2xl px-4 gap-3 transition-all"
                  style={{ background: '#F7F9F7', border: `1.5px solid ${password ? strength.color + '60' : '#EFEFEF'}` }}>
                  <Lock size={16} style={{ color: '#BDBDBD' }} className="flex-shrink-0" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="নতুন পাসওয়ার্ড লেখো"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    className="flex-1 py-4 text-sm font-semibold outline-none bg-transparent placeholder:text-[#BDBDBD]"
                    style={{ color: '#1A1A1A' }}
                  />
                  <button onClick={() => setShowPw(!showPw)} style={{ color: '#BDBDBD' }} className="flex-shrink-0">
                    {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : '#EFEFEF' }} />
                      ))}
                    </div>
                    <p className="text-xs font-bold" style={{ color: strength.color }}>{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="mb-5">
                <label className="text-xs font-black uppercase tracking-wider mb-1.5 block" style={{ color: '#9E9E9E' }}>
                  পাসওয়ার্ড নিশ্চিত করো
                </label>
                <div className="flex items-center rounded-2xl px-4 gap-3 transition-all"
                  style={{ background: '#F7F9F7', border: `1.5px solid ${confirm.length > 0 ? (match ? '#22C55E60' : '#EF444460') : '#EFEFEF'}` }}>
                  <Lock size={16} style={{ color: '#BDBDBD' }} className="flex-shrink-0" />
                  <input
                    type={showCf ? 'text' : 'password'}
                    placeholder="পাসওয়ার্ড আবার লেখো"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleReset()}
                    className="flex-1 py-4 text-sm font-semibold outline-none bg-transparent placeholder:text-[#BDBDBD]"
                    style={{ color: '#1A1A1A' }}
                  />
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {confirm.length > 0 && (
                      match
                        ? <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
                        : <span className="text-red-400 text-xs font-bold">✕</span>
                    )}
                    <button onClick={() => setShowCf(!showCf)} style={{ color: '#BDBDBD' }}>
                      {showCf ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                {confirm.length > 0 && !match && (
                  <p className="text-xs font-bold mt-1.5" style={{ color: '#EF4444' }}>পাসওয়ার্ড দুটি মিলছে না</p>
                )}
              </div>

              {/* Password rules */}
              <div className="rounded-2xl p-3.5 mb-5" style={{ background: '#F7F9F7' }}>
                <p className="text-xs font-black mb-2" style={{ color: '#9E9E9E' }}>পাসওয়ার্ডের নিয়ম</p>
                <div className="space-y-1.5">
                  {[
                    { rule: 'কমপক্ষে ৬ অক্ষর',         ok: password.length >= 6 },
                    { rule: 'কমপক্ষে একটি সংখ্যা',    ok: /[0-9]/.test(password) },
                    { rule: 'কমপক্ষে একটি বড় হাতের অক্ষর', ok: /[A-Z]/.test(password) },
                  ].map(r => (
                    <div key={r.rule} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: r.ok ? '#22C55E' : '#EFEFEF' }}>
                        {r.ok && <span className="text-white text-[8px] font-black">✓</span>}
                      </div>
                      <span className="text-xs font-semibold transition-colors"
                        style={{ color: r.ok ? '#2D7A3A' : '#BDBDBD' }}>{r.rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleReset}
                disabled={loading || !match || password.length < 6}
                className="w-full py-4 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', boxShadow: '0 8px 24px rgba(45,122,58,0.30)' }}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />আপডেট হচ্ছে...</>
                  : <>পাসওয়ার্ড আপডেট করো <ArrowRight size={16} /></>
                }
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs mt-5 pb-8" style={{ color: '#BDBDBD' }}>
          MathMate AI • Class 9–10 গণিত
        </p>
      </div>
    </div>
  )
}
