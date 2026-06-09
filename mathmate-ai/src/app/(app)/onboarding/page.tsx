'use client'
import { useState }     from 'react'
import { createClient } from '@/lib/supabase/client'
import Image             from 'next/image'
import { cn }           from '@/lib/utils'

const CLASSES = [3,4,5,6,7,8,9,10]
type Role = 'student' | 'parent'

export default function OnboardingPage() {
  const supabase = createClient()
  const [step,    setStep]    = useState<1|2>(1)
  const [cls,     setCls]     = useState(9)
  const [role,    setRole]    = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleContinue = async () => {
    if (step === 1) { setStep(2); return }
    setLoading(true); setError('')
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser()
      if (userErr || !user) { window.location.href = '/login'; return }

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Ninja',
        class_level: cls,
        role,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      }, { onConflict: 'id' })

      if (profileErr) { setError(profileErr.message); setLoading(false); return }

      await supabase.from('user_stats').upsert({
        user_id: user.id,
        total_xp: 0, total_coins: 0, total_gems: 0,
        current_streak: 0, longest_streak: 0,
        last_active: new Date().toISOString().split('T')[0],
        level: 1, lessons_completed: 0, quests_completed: 0,
      }, { onConflict: 'user_id' })

      window.location.href = '/dashboard'
    } catch (e: any) {
      setError('কিছু সমস্যা হয়েছে। আবার চেষ্টা করো।')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top green hero */}
      <div
        className="w-full flex flex-col items-center py-12 px-6 rounded-b-[40px]"
        style={{ background: 'linear-gradient(160deg, #1B5E20, #2D7A3A)' }}
      >
        <div className="animate-float" style={{ animationDuration: '3.5s' }}>
          <Image src="/Ninja Greetings 2.png" alt="ninja" width={160} height={160} className="object-contain drop-shadow-2xl" />
        </div>
        <h2 className="text-white text-2xl font-black mt-4 text-center">
          {step === 1 ? 'তোমার ক্লাস বেছে নাও' : 'তুমি কে?'}
        </h2>
        <p className="text-white/60 text-sm text-center mt-1">
          {step === 1 ? 'আমরা তোমার জন্য কাস্টমাইজ করব' : 'তোমার অভিজ্ঞতা ব্যক্তিগত হবে'}
        </p>
        {/* Step dots */}
        <div className="flex gap-2 mt-5">
          {[1,2].map(n => (
            <div key={n} className={`h-2 rounded-full transition-all ${step >= n ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-6 pb-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 font-bold">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-4 gap-2.5 mb-6">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCls(c)}
                className={cn(
                  'py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95',
                  cls === c
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-ninja-muted hover:bg-brand-light hover:text-brand-primary'
                )}
                style={cls === c ? { background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' } : {}}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 mb-6">
            {[
              { id: 'student' as Role, icon: '🧑‍🎓', title: 'আমি ছাত্র/ছাত্রী', desc: 'AI টিউটরের সাহায্যে গণিত শিখব' },
              { id: 'parent'  as Role, icon: '👨‍👩‍👦', title: 'আমি অভিভাবক',   desc: 'সন্তানের অগ্রগতি ট্র্যাক করব' },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-95',
                  role === p.id ? 'border-brand-primary bg-brand-light' : 'border-ninja-border bg-white'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0',
                  role === p.id ? '' : 'bg-gray-100'
                )}
                  style={role === p.id ? { background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' } : {}}
                >
                  {p.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-ninja-text text-sm">{p.title}</p>
                  <p className="text-ninja-muted text-xs mt-0.5">{p.desc}</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                  role === p.id ? 'border-brand-primary' : 'border-ninja-border'
                )}>
                  {role === p.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                </div>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-black text-white text-base active:scale-95 transition-transform disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' }}
        >
          {step === 1 ? 'পরবর্তী →' : loading ? 'সংরক্ষণ হচ্ছে...' : 'শুরু করি 🚀'}
        </button>

        {step === 2 && !loading && (
          <button onClick={() => { setStep(1); setError('') }}
            className="w-full text-center mt-4 text-ninja-muted text-sm font-bold">
            ← পিছনে যাও
          </button>
        )}
      </div>
    </div>
  )
}
