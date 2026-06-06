'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter }    from 'next/navigation'
import { TopBar }       from '@/components/layout/TopBar'
import { BottomNav }    from '@/components/layout/BottomNav'
import { Button }       from '@/components/ui/Button'
import { Badge }        from '@/components/ui/Badge'
import { getLevelFromXP } from '@/lib/utils'
import { LogOut, User, BookOpen, Bell, ChevronRight, Shield } from 'lucide-react'
import { Profile, UserStats } from '@/types'

interface Props { profile: Profile; stats: UserStats | null; userEmail: string }

export function ProfileClient({ profile, stats, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const level    = getLevelFromXP(stats?.total_xp ?? 0)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const MENU_ITEMS = [
    { icon: User,     label: 'ব্যক্তিগত তথ্য',     sub: profile.full_name ?? 'নাম যোগ করো' },
    { icon: BookOpen, label: 'ক্লাস পরিবর্তন করো', sub: `শ্রেণি ${profile.class_level}` },
    { icon: Bell,     label: 'নোটিফিকেশন',          sub: 'চালু আছে' },
    { icon: Shield,   label: 'গোপনীয়তা নীতি',       sub: '' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-5 pt-12 pb-5 shadow-sm">
        <TopBar title="প্রোফাইল" showBack={false} />
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Avatar card */}
        <div className="bg-purple-gradient rounded-2xl p-5 text-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black flex-shrink-0">
            {profile.full_name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-lg truncate">{profile.full_name ?? 'নাম নেই'}</p>
            <p className="text-white/70 text-sm truncate">{userEmail}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge className="bg-white/20 text-white border-0">Level {level}</Badge>
              <Badge className="bg-white/20 text-white border-0">শ্রেণি {profile.class_level}</Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'মোট XP',   value: stats?.total_xp ?? 0 },
            { label: 'কয়েন',    value: stats?.total_coins ?? 0 },
            { label: 'Streak',   value: `${stats?.current_streak ?? 0}🔥` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
              <p className="font-black text-gray-900 text-base">{value}</p>
              <p className="text-gray-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {MENU_ITEMS.map(({ icon: Icon, label, sub }, i) => (
            <button key={label}
              className={`w-full flex items-center gap-4 px-4 py-4 text-left hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}>
              <div className="w-9 h-9 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={17} className="text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">{label}</p>
                {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <Button fullWidth variant="danger" onClick={handleLogout}>
          <LogOut size={16} className="mr-2" /> লগ আউট
        </Button>
      </div>

      <BottomNav />
    </div>
  )
}
