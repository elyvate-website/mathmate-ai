'use client'
import { useState }   from 'react'
import { useRouter }  from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button }     from '@/components/ui/Button'
import { CLASSES }    from '@/constants'
import { cn }         from '@/lib/utils'

type Role = 'student' | 'parent'

export default function OnboardingPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [step,    setStep]    = useState<1 | 2>(1)
  const [cls,     setCls]     = useState<number>(9)
  const [role,    setRole]    = useState<Role>('student')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleContinue = async () => {
    if (step === 1) {
      setStep(2)
      return
    }

    setLoading(true)
    setError('')

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        router.replace('/login')
        return
      }

      // Save profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id:          user.id,
          full_name:   user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Student',
          class_level: cls,
          role:        role,
          avatar_url:  user.user_metadata?.avatar_url ?? null,
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        setError(`প্রোফাইল সংরক্ষণ করতে সমস্যা হয়েছে: ${profileError.message}`)
        setLoading(false)
        return
      }

      // Save initial stats
      const { error: statsError } = await supabase
        .from('user_stats')
        .upsert({
          user_id:        user.id,
          total_xp:       0,
          total_coins:    0,
          current_streak: 0,
          longest_streak: 0,
          last_active:    new Date().toISOString().split('T')[0],
          level:          1,
        })

      if (statsError) {
        console.error('Stats error:', statsError)
        // Non-critical error, continue anyway
      }

      // Success — go to dashboard
      router.replace('/dashboard')

    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করো।')
      setLoading(false)
    }
  }

  const PROFILES = [
    {
      id:   'student' as Role,
      icon: '🧑‍🎓',
      title: 'আমি ছাত্র/ছাত্রী',
      desc:  'AI টিউটরের সাহায্যে গণিত শিখব ও অনুশীলন করব',
    },
    {
      id:   'parent' as Role,
      icon: '👨‍👩‍👦',
      title: 'আমি অভিভাবক',
      desc:  'সন্তানের অগ্রগতি ট্র্যাক করব',
    },
  ]

  return (
    <div className="min-h-screen bg-white px-5 py-10">

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors',
              step >= n
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-400'
            )}>
              {n}
            </div>
            {n < 2 && (
              <div className={cn(
                'h-0.5 w-12 rounded-full transition-colors',
                step > n ? 'bg-brand-primary' : 'bg-gray-100'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5 font-medium">
          {error}
        </div>
      )}

      {/* Step 1 — Class selection */}
      {step === 1 && (
        <>
          <h2 className="text-2xl font-black text-gray-900 mb-1">ক্লাস নির্বাচন করো</h2>
          <p className="text-gray-400 text-sm mb-7">তোমার ক্লাস বেছে নাও</p>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setCls(c)}
                className={cn(
                  'py-3.5 rounded-xl font-black text-sm transition-all active:scale-95',
                  cls === c
                    ? 'bg-brand-primary text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-brand-light hover:text-brand-primary'
                )}
              >
                Class {c}
              </button>
            ))}
          </div>

          <div className="bg-brand-light rounded-2xl p-4 mb-6">
            <p className="text-brand-primary text-sm font-bold">
              ✓ Class {cls} নির্বাচিত হয়েছে
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              পরে প্রোফাইল থেকে পরিবর্তন করা যাবে
            </p>
          </div>
        </>
      )}

      {/* Step 2 — Role selection */}
      {step === 2 && (
        <>
          <h2 className="text-2xl font-black text-gray-900 mb-1">প্রোফাইল নির্বাচন করো</h2>
          <p className="text-gray-400 text-sm mb-7">
            তোমার অভিজ্ঞতা ব্যক্তিগত করতে প্রোফাইল বেছে নাও
          </p>

          <div className="flex flex-col gap-4 mb-6">
            {PROFILES.map(p => (
              <button
                key={p.id}
                onClick={() => setRole(p.id)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                  role === p.id
                    ? 'border-brand-primary bg-brand-light'
                    : 'border-gray-200 bg-white hover:border-brand-primary'
                )}
              >
                <div className={cn(
                  'w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
                  role === p.id ? 'bg-purple-gradient' : 'bg-gray-100'
                )}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-sm mb-1">{p.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  role === p.id ? 'border-brand-primary' : 'border-gray-300'
                )}>
                  {role === p.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Continue button */}
      <Button
        fullWidth
        loading={loading}
        onClick={handleContinue}
      >
        {step === 1 ? 'পরবর্তী →' : 'শুরু করি 🚀'}
      </Button>

      {/* Back button for step 2 */}
      {step === 2 && !loading && (
        <button
          onClick={() => { setStep(1); setError('') }}
          className="w-full text-center mt-4 text-gray-400 text-sm font-bold hover:text-gray-600"
        >
          ← আগে ফিরে যাও
        </button>
      )}
    </div>
  )
}
