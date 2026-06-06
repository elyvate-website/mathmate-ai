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

  const handleContinue = async () => {
    if (step === 1) { setStep(2); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('profiles').upsert({
      id: user.id, class_level: cls, role,
      full_name: user.user_metadata?.full_name ?? null,
    })
    await supabase.from('user_stats').upsert({ user_id: user.id })
    router.push('/dashboard')
  }

  const PROFILES = [
    { id: 'student' as Role, icon: '🧑‍🎓', title: 'আমি ছাত্র/ছাত্রী',   desc: 'AI টিউটরের সাহায্যে গণিত শিখব ও অনুশীলন করব' },
    { id: 'parent'  as Role, icon: '👨‍👩‍👦', title: 'আমি অভিভাবক',       desc: 'সন্তানের অগ্রগতি ট্র্যাক করব' },
  ]

  return (
    <div className="min-h-screen bg-white px-5 py-8">
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map(n => (
          <div key={n} className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors',
              step >= n ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-400')}>
              {n}
            </div>
            {n < 2 && <div className={cn('h-0.5 w-12 rounded-full transition-colors', step > n ? 'bg-brand-primary' : 'bg-gray-100')} />}
          </div>
        ))}
      </div>

      {step === 1 ? (
        <>
          <h2 className="text-2xl font-black text-gray-900 mb-1">ক্লাস নির্বাচন করো</h2>
          <p className="text-gray-400 text-sm mb-7">তোমার ক্লাস বেছে নাও</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {CLASSES.map(c => (
              <button key={c} onClick={() => setCls(c)}
                className={cn('py-3 rounded-xl font-black text-sm transition-all active:scale-95',
                  cls === c ? 'bg-brand-primary text-white shadow-lg shadow-purple-500/30' : 'bg-gray-100 text-gray-700 hover:bg-brand-light hover:text-brand-primary')}>
                Class {c}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-black text-gray-900 mb-1">প্রোফাইল নির্বাচন করো</h2>
          <p className="text-gray-400 text-sm mb-7">তোমার অভিজ্ঞতা ব্যক্তিগত করতে প্রোফাইল বেছে নাও</p>
          <div className="flex flex-col gap-4 mb-6">
            {PROFILES.map(p => (
              <button key={p.id} onClick={() => setRole(p.id)}
                className={cn('flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                  role === p.id ? 'border-brand-primary bg-brand-light' : 'border-gray-200 bg-white hover:border-brand-primary')}>
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
                  role === p.id ? 'bg-purple-gradient' : 'bg-gray-100')}>
                  {p.icon}
                </div>
                <div className="flex-1">
                  <p className="font-black text-gray-900 text-sm mb-1">{p.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                </div>
                <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  role === p.id ? 'border-brand-primary' : 'border-gray-300')}>
                  {role === p.id && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <Button fullWidth loading={loading} onClick={handleContinue}>
        {step === 1 ? 'পরবর্তী →' : 'শুরু করি 🚀'}
      </Button>
    </div>
  )
}
