'use client'
import { useMemo } from 'react'

interface Props { stats: any; progressRows: any[] }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ProgressClient({ stats, progressRows }: Props) {
  const totalXP       = stats?.total_xp ?? 0
  const totalCoins    = stats?.total_coins ?? 0
  const lessonsCount  = stats?.lessons_completed ?? 0
  const questsCount   = stats?.quests_completed ?? 0

  // Compute weekly accuracy per day
  const weeklyData = useMemo(() => {
    const today = new Date()
    return DAYS.map((d, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      const dayRows = progressRows.filter(r => r.completed_at?.startsWith(dateStr))
      const avg = dayRows.length > 0
        ? Math.round(dayRows.reduce((s: number, r: any) => s + r.accuracy, 0) / dayRows.length)
        : 0
      return { day: d, pct: avg }
    })
  }, [progressRows])

  const maxPct = Math.max(...weeklyData.map(d => d.pct), 10)

  // Study time (rough estimate)
  const totalSec  = progressRows.reduce((s, r) => s + (r.time_spent_sec ?? 0), 0)
  const studyHr   = Math.floor(totalSec / 3600)
  const studyMin  = Math.floor((totalSec % 3600) / 60)

  const overallAccuracy = progressRows.length > 0
    ? Math.round(progressRows.reduce((s, r) => s + r.accuracy, 0) / progressRows.length)
    : 0

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-ninja-text">Your Progress</h1>
          <button className="flex items-center gap-1 text-ninja-muted text-sm font-semibold border border-ninja-border rounded-full px-3 py-1">
            This Week ▾
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Study Time', value: `${studyHr}h ${studyMin}m`, icon: '⏱' },
            { label: 'Accuracy',   value: `${overallAccuracy}%`,       icon: '🎯' },
            { label: 'Questions',  value: progressRows.length,          icon: '📝' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-ninja-border rounded-2xl p-3 text-center shadow-sm">
              <p className="text-xl mb-0.5">{s.icon}</p>
              <p className="font-black text-ninja-text text-base">{s.value}</p>
              <p className="text-ninja-muted text-[10px] font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance chart */}
      <div className="px-5 mb-5">
        <p className="font-black text-ninja-text text-base mb-3">Performance</p>
        <div className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm">
          {/* Y axis labels */}
          <div className="flex gap-2 items-end h-32">
            <div className="flex flex-col justify-between h-full text-right w-8">
              {['100%','75%','50%','25%','0%'].map(l => (
                <span key={l} className="text-[9px] text-ninja-muted font-semibold">{l}</span>
              ))}
            </div>
            {/* Bars */}
            <div className="flex-1 flex items-end gap-1.5 h-full">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max((d.pct / 100) * 110, d.pct > 0 ? 8 : 2)}px`,
                      background: d.pct > 0
                        ? 'linear-gradient(180deg,#3DAE4F,#2D7A3A)'
                        : '#F0F0F0',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* X labels */}
          <div className="flex gap-1.5 mt-2 pl-10">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[10px] text-ninja-muted font-semibold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strong / Weak topics */}
      <div className="px-5 mb-5">
        <p className="font-black text-ninja-text text-base mb-2">Strong Topics</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {progressRows.filter(r => r.accuracy >= 80).slice(0, 3).length > 0
            ? progressRows.filter(r => r.accuracy >= 80).slice(0, 3).map((r, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                  Topic {r.chapter_id}
                </span>
              ))
            : <span className="text-ninja-muted text-sm">সম্পন্ন করলে দেখাবে</span>
          }
        </div>

        <p className="font-black text-ninja-text text-base mb-2">Needs Improvement</p>
        <div className="flex flex-wrap gap-2">
          {progressRows.filter(r => r.accuracy < 60).slice(0, 3).length > 0
            ? progressRows.filter(r => r.accuracy < 60).slice(0, 3).map((r, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  Topic {r.chapter_id}
                </span>
              ))
            : <span className="text-ninja-muted text-sm">দারুণ! সব টপিকে ভালো করছো</span>
          }
        </div>
      </div>
    </div>
  )
}
