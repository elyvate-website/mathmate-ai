'use client'
import { useState }     from 'react'
import Link              from 'next/link'
import Image             from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordClient() {
  const supabase = createClient()
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async () => {
    if (!email.trim()) { setError('ইমেইল লেখো।'); return }
    if (!email.includes('@')) { setError('সঠিক ইমেইল লেখো।'); return }
    setLoading(true); setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)
    if (err) { setError(`Error: ${err.message} (${err.status ?? 'no status'})`); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F9F7' }}>

      {/* Hero */}
      <div className="relative overflow-hidden px-6 pt-14 pb-8 flex flex-col items-center"
        style={{ background: 'linear-gradient(160deg,#1B5E20 0%,#2D7A3A 60%,#388E3C 100%)' }}>
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#FFC107,transparent)', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle,#4CAF50,transparent)', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-4" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <Image
              src={sent ? '/Ninja Celebrating.png' : '/chill ninja.png'}
              alt="ninja" width={96} height={96} className="object-contain drop-shadow-2xl"
            />
          </div>
          <h1 className="text-white text-2xl font-black text-center">
            {sent ? 'ইমেইল পাঠানো হয়েছে! 📬' : 'পাসওয়ার্ড রিসেট'}
          </h1>
          <p className="text-white/60 text-sm mt-1 text-center">
            {sent ? 'তোমার ইনবক্স চেক করো' : 'আমরা রিসেট লিংক পাঠাবো'}
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-5 -mt-5 relative z-10">
        <div className="card-hero p-6 rounded-[28px]">

          {!sent ? (
            <>
              {/* Instructions */}
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                style={{ background: '#E8F5E9', border: '1.5px solid #C8E6C9' }}>
                <span className="text-lg flex-shrink-0">💡</span>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: '#2D7A3A' }}>
                  তোমার অ্যাকাউন্টের ইমেইল লেখো। আমরা একটি রিসেট লিংক পাঠাবো।
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4">
                  <span className="text-red-500 text-base flex-shrink-0">⚠️</span>
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              {/* Email field */}
              <div className="mb-5">
                <label className="text-xs font-black uppercase tracking-wider mb-1.5 block" style={{ color: '#9E9E9E' }}>
                  ইমেইল ঠিকানা
                </label>
                <div className="flex items-center rounded-2xl px-4 gap-3 transition-all"
                  style={{ background: '#F7F9F7', border: '1.5px solid #EFEFEF' }}
                  onFocus={e => e.currentTarget.style.borderColor='#2D7A3A'}
                  onBlur={e  => e.currentTarget.style.borderColor='#EFEFEF'}>
                  <Mail size={16} style={{ color: '#BDBDBD' }} className="flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="তোমার ইমেইল"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    autoFocus
                    className="flex-1 py-4 text-sm font-semibold outline-none bg-transparent placeholder:text-[#BDBDBD]"
                    style={{ color: '#1A1A1A' }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)', boxShadow: '0 8px 24px rgba(45,122,58,0.30)' }}
              >
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />পাঠানো হচ্ছে...</>
                  : <>লিংক পাঠাও <ArrowRight size={16} /></>
                }
              </button>
            </>
          ) : (
            /* Success state */
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg,#E8F5E9,#DCFCE7)' }}>
                <CheckCircle2 size={32} style={{ color: '#2D7A3A' }} />
              </div>

              <h2 className="font-black text-lg mb-2" style={{ color: '#1A1A1A' }}>রিসেট লিংক পাঠানো হয়েছে</h2>
              <p className="text-sm font-semibold leading-relaxed mb-2" style={{ color: '#9E9E9E' }}>
                <span className="font-black" style={{ color: '#2D7A3A' }}>{email}</span> এ একটি রিসেট লিংক পাঠানো হয়েছে।
              </p>
              <p className="text-xs leading-relaxed mb-6" style={{ color: '#BDBDBD' }}>
                ইনবক্স চেক করো। স্প্যাম ফোল্ডারও দেখো। লিংকটি ১ ঘণ্টা সক্রিয় থাকবে।
              </p>

              {/* Steps */}
              <div className="w-full space-y-2.5 mb-6 text-left">
                {[
                  { n: '1', text: 'তোমার ইমেইল ইনবক্স খোলো' },
                  { n: '2', text: '"MathMate AI Password Reset" খোঁজো' },
                  { n: '3', text: 'ইমেইলের লিংকে ক্লিক করো' },
                  { n: '4', text: 'নতুন পাসওয়ার্ড সেট করো' },
                ].map(s => (
                  <div key={s.n} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F7F9F7' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}>
                      {s.n}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{s.text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setSent(false); setEmail('') }}
                className="w-full py-3.5 rounded-2xl font-black text-sm active:scale-95 transition-transform mb-3"
                style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                অন্য ইমেইল দিয়ে চেষ্টা করো
              </button>
            </div>
          )}

          {/* Back to login */}
          <Link href="/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform mt-2"
            style={{ border: '1.5px solid #EFEFEF', color: '#9E9E9E' }}>
            <ArrowLeft size={15} /> লগইন পেজে ফিরে যাও
          </Link>
        </div>

        <p className="text-center text-xs mt-5 pb-8" style={{ color: '#BDBDBD' }}>
          MathMate AI • Class 9–10 গণিত
        </p>
      </div>
    </div>
  )
}
