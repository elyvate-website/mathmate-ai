'use client'
import { useMemo } from 'react'

interface Props { stats: any; progressRows: any[] }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function ProgressClient({ stats, progressRows }: Props) {
  const totalXP      = stats?.total_xp      ?? 0
  const totalCoins   = stats?.total_coins   ?? 0
  const lessonsCount = stats?.lessons_completed ?? 0
  const streak       = stats?.current_streak ?? 0

  const weeklyData = useMemo(() => {
    const today = new Date()
    return DAYS.map((d, i) => {
      const date    = new Date(today)
      date.setDate(today.getDate() - (6 - i))
      const dateStr = date.toISOString().split('T')[0]
      const dayRows = progressRows.filter(r => r.completed_at?.startsWith(dateStr))
      const avg     = dayRows.length > 0
        ? Math.round(dayRows.reduce((s: number, r: any) => s + Number(r.accuracy), 0) / dayRows.length)
        : 0
      return { day: d, pct: avg }
    })
  }, [progressRows])

  const totalSec = progressRows.reduce((s, r) => s + (r.time_spent_sec ?? 0), 0)
  const studyHr  = Math.floor(totalSec / 3600)
  const studyMin = Math.floor((totalSec % 3600) / 60)

  const overallAccuracy = progressRows.length > 0
    ? Math.round(progressRows.reduce((s, r) => s + Number(r.accuracy), 0) / progressRows.length)
    : 0

  // Strong and weak topics — now using chapter names
  const strongRows = progressRows.filter(r => Number(r.accuracy) >= 80)
  const weakRows   = progressRows.filter(r => Number(r.accuracy) < 60)

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-black text-ninja-text">তোমার অগ্রগতি</h1>
        <p className="text-ninja-muted text-sm mt-1">তোমার শেখার পরিসংখ্যান</p>
      </div>

      {/* Stats grid */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'পড়ার সময়', value: `${studyHr}ঘ ${studyMin}মি`, emoji: '⏱' },
            { label: 'নির্ভুলতা',  value: `${overallAccuracy}%`,        emoji: '🎯' },
            { label: 'প্রশ্নোত্তর', value: progressRows.length,           emoji: '📝' },
            { label: 'স্ট্রিক',     value: `${streak} 🔥`,               emoji: '⚡' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm">
              <p className="text-2xl">{s.emoji}</p>
              <p className="font-black text-ninja-text text-xl mt-1">{s.value}</p>
              <p className="text-ninja-muted text-xs font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="px-5 mb-5">
        <p className="font-black text-ninja-text text-base mb-3">সাপ্তাহিক পারফরম্যান্স</p>
        <div className="bg-white border border-ninja-border rounded-2xl p-4 shadow-sm">
          <div className="flex gap-2 items-end h-28">
            <div className="flex flex-col justify-between h-full text-right w-7">
              {['100', '75', '50', '25', '0'].map(l => (
                <span key={l} className="text-[9px] text-ninja-muted font-semibold">{l}%</span>
              ))}
            </div>
            <div className="flex-1 flex items-end gap-1.5 h-full">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-lg transition-all duration-700"
                    style={{
                      height: `${Math.max((d.pct / 100) * 100, d.pct > 0 ? 6 : 2)}px`,
                      background: d.pct > 0 ? 'linear-gradient(180deg,#3DAE4F,#2D7A3A)' : '#F0F0F0',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 mt-2 pl-9">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] text-ninja-muted font-semibold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strong / Weak topics */}
      <div className="px-5 mb-5">
        <p className="font-black text-ninja-text text-base mb-2">শক্তিশালী অধ্যায়</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {strongRows.slice(0, 4).length > 0
            ? strongRows.slice(0, 4).map((r, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                  {(r as any).chapters?.title_bn ?? `অধ্যায় ${r.chapter_id}`}
                </span>
              ))
            : <span className="text-ninja-muted text-sm">সম্পন্ন করলে দেখাবে</span>
          }
        </div>

        <p className="font-black text-ninja-text text-base mb-2">উন্নতি দরকার</p>
        <div className="flex flex-wrap gap-2">
          {weakRows.slice(0, 4).length > 0
            ? weakRows.slice(0, 4).map((r, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#FEF2F2', color: '#EF4444' }}>
                  {(r as any).chapters?.title_bn ?? `অধ্যায় ${r.chapter_id}`}
                </span>
              ))
            : <span className="text-ninja-muted text-sm">দারুণ! সব অধ্যায়ে ভালো করছো 🎉</span>
          }
        </div>
      </div>

      {/* Recent activity */}
      {progressRows.length > 0 && (
        <div className="px-5">
          <p className="font-black text-ninja-text text-base mb-3">সাম্প্রতিক কার্যকলাপ</p>
          <div className="space-y-2">
            {progressRows.slice(0, 5).map((r, i) => (
              <div key={i} className="bg-white border border-ninja-border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: '#E8F5E9', color: '#2D7A3A' }}>
                  {Number(r.accuracy) >= 80 ? '⭐' : Number(r.accuracy) >= 60 ? '👍' : '📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ninja-text text-sm truncate">{(r as any).chapters?.title_bn ?? 'অধ্যায়'}</p>
                  <p className="text-ninja-muted text-xs mt-0.5">{r.score}/{r.total_questions} সঠিক · {Math.round(Number(r.accuracy))}%</p>
                </div>
                <span className="text-xs font-black px-2 py-1 rounded-full" style={{ background: Number(r.accuracy) >= 80 ? '#E8F5E9' : Number(r.accuracy) >= 60 ? '#FFF8E1' : '#FEF2F2', color: Number(r.accuracy) >= 80 ? '#2D7A3A' : Number(r.accuracy) >= 60 ? '#E65100' : '#EF4444' }}>
                  {Math.round(Number(r.accuracy))}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
