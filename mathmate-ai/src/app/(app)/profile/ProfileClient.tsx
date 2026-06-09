'use client'
import { createClient }  from '@/lib/supabase/client'
import { useRouter }     from 'next/navigation'
import { getLevelFromXP, getXPForNextLevel } from '@/lib/utils'
import { ChevronRight, User, BookOpen, Bell, Shield, LogOut } from 'lucide-react'
import Image from 'next/image'
import { ACHIEVEMENT_DEFS } from '@/constants'

interface Props { profile: any; stats: any; userEmail: string }

export function ProfileClient({ profile, stats, userEmail }: Props) {
  const router   = useRouter()
  const supabase = createClient()

  const xp      = stats?.total_xp ?? 0
  const level   = getLevelFromXP(xp)
  const xpInfo  = getXPForNextLevel(xp)
  const coins   = stats?.total_coins ?? 0
  const gems    = stats?.total_gems ?? 0
  const lessons = stats?.lessons_completed ?? 0
  const quests  = stats?.quests_completed ?? 0

  const MENU_ITEMS = [
    { icon: User,     label: 'Personal Info',      sub: profile?.full_name ?? 'Add name' },
    { icon: BookOpen, label: 'Change Class',        sub: `Class ${profile?.class_level ?? 9}` },
    { icon: Bell,     label: 'Notifications',       sub: 'Enabled' },
    { icon: Shield,   label: 'Privacy Policy',      sub: '' },
  ]

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <h1 className="text-2xl font-black text-ninja-text">Profile</h1>
      </div>

      {/* Avatar + info card */}
      <div className="px-5 mb-4">
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1B5E20, #2D7A3A)' }}
        >
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Image src="/chill ninja.png" alt="avatar" width={64} height={64} className="object-cover" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-lg truncate">{profile?.full_name ?? 'Math Ninja'}</p>
            <p className="text-white/60 text-xs truncate">Math Ninja</p>

            {/* Level badge + XP */}
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                Level {level}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-white"
                  style={{ width: `${xpInfo.progress}%` }}
                />
              </div>
              <span className="text-white/60 text-[10px] font-semibold whitespace-nowrap">
                {xp.toLocaleString()} / {xpInfo.next.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="px-5 mb-4">
        <div className="flex justify-between items-center mb-3">
          <p className="font-black text-ninja-text text-base">Achievements</p>
          <button className="text-brand-primary text-sm font-bold">View all</button>
        </div>
        <div className="flex gap-3">
          {ACHIEVEMENT_DEFS.map((a, i) => (
            <div
              key={a.id}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: i < 2 ? `${a.color}20` : '#F5F5F5',
                opacity: i < 2 ? 1 : 0.5,
              }}
            >
              {a.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-5 mb-4">
        {[
          { icon: '🪙', label: 'Total Coins',        value: coins.toLocaleString() },
          { icon: '💎', label: 'Total Gems',          value: gems },
          { icon: '📚', label: 'Lessons Completed',  value: lessons },
          { icon: '🎯', label: 'Quests Completed',   value: quests },
        ].map(s => (
          <div
            key={s.label}
            className="flex items-center justify-between py-3.5 border-b border-ninja-border"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{s.icon}</span>
              <p className="font-bold text-ninja-text text-sm">{s.label}</p>
            </div>
            <p className="font-black text-ninja-text text-sm">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="px-5 mb-5">
        <div className="bg-white border border-ninja-border rounded-2xl overflow-hidden shadow-sm">
          {MENU_ITEMS.map(({ icon: Icon, label, sub }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-ninja-border' : ''}`}
            >
              <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-ninja-text text-sm">{label}</p>
                {sub && <p className="text-ninja-muted text-xs mt-0.5">{sub}</p>}
              </div>
              <ChevronRight size={16} className="text-ninja-muted" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5">
        <button
          onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
          className="w-full py-4 rounded-2xl border-2 border-red-200 text-red-500 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </div>
  )
}
