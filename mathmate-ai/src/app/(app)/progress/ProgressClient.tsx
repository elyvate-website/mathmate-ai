'use client'
import { useMemo, useState } from 'react'

interface Props { stats: any; progressRows: any[] }
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export function ProgressClient({ stats, progressRows }: Props) {
  const xp        = stats?.total_xp          ?? 0
  const coins     = stats?.total_coins       ?? 0
  const lessons   = stats?.lessons_completed ?? 0
  const streak    = stats?.current_streak    ?? 0
  const [tooltip, setTooltip] = useState<{i:number,pct:number,day:string}|null>(null)

  const weeklyData = useMemo(() => {
    const today = new Date()
    return DAYS.map((d, i) => {
      const date    = new Date(today); date.setDate(today.getDate() - (6 - i))
      const ds      = date.toISOString().split('T')[0]
      const rows    = progressRows.filter(r => r.completed_at?.startsWith(ds))
      const avg     = rows.length > 0 ? Math.round(rows.reduce((s:number,r:any)=>s+Number(r.accuracy),0)/rows.length) : 0
      return { day: d, pct: avg, date: ds, count: rows.length }
    })
  }, [progressRows])

  const bestIdx    = weeklyData.reduce((b, d, i) => d.pct > weeklyData[b].pct ? i : b, 0)
  const overallAcc = progressRows.length > 0
    ? Math.round(progressRows.reduce((s,r)=>s+Number(r.accuracy),0)/progressRows.length) : 0
  const totalSec   = progressRows.reduce((s,r)=>s+(r.time_spent_sec??0),0)
  const studyHr    = Math.floor(totalSec/3600), studyMin = Math.floor((totalSec%3600)/60)

  // Streak calendar (last 7 days)
  const streakDays = useMemo(() => {
    const today = new Date()
    return Array.from({ length: 7 }, (_, i) => {
      const d   = new Date(today); d.setDate(today.getDate() - (6 - i))
      const ds  = d.toISOString().split('T')[0]
      const has = progressRows.some(r => r.completed_at?.startsWith(ds))
      return { label: DAYS[i], filled: has }
    })
  }, [progressRows])

  const strongRows = progressRows.filter(r => Number(r.accuracy) >= 80)
  const weakRows   = progressRows.filter(r => Number(r.accuracy) < 60)

  return (
    <div className="min-h-screen pb-28 page-enter" style={{ background: '#F7F9F7' }}>
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-black text-ninja-dark">তোমার অগ্রগতি</h1>
        <p className="text-ninja-muted text-sm mt-0.5">তোমার শেখার পরিসংখ্যান</p>
      </div>

      {/* Stats grid */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3 stagger-children">
          {[
            { label:'পড়ার সময়', value:`${studyHr}ঘ ${studyMin}মি`, emoji:'⏱', bg:'#E3F2FD', color:'#1565C0' },
            { label:'নির্ভুলতা',  value:`${overallAcc}%`,            emoji:'🎯', bg:'#E8F5E9', color:'#2D7A3A' },
            { label:'প্রশ্নোত্তর', value:progressRows.length,         emoji:'📝', bg:'#F3E5F5', color:'#6A1B9A' },
            { label:'স্ট্রিক',    value:`${streak} 🔥`,              emoji:'⚡', bg:'#FFF3E0', color:'#E65100' },
          ].map(s => (
            <div key={s.label} className="card-raised p-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 flex-shrink-0"
                style={{ background: s.bg }}>{s.emoji}</div>
              <p className="font-black text-ninja-dark text-xl">{s.value}</p>
              <p className="text-ninja-muted text-xs font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Streak calendar */}
      <div className="px-4 mb-4">
        <p className="font-black text-ninja-dark text-base mb-2.5">সাপ্তাহিক স্ট্রিক</p>
        <div className="card-raised p-4 flex justify-between">
          {streakDays.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all"
                style={{ background: d.filled ? 'linear-gradient(135deg,#2D7A3A,#3DAE4F)' : '#F0F0F0' }}>
                {d.filled
                  ? <span className="text-white text-xs font-black">✓</span>
                  : <span className="text-ninja-muted text-xs font-bold">{d.label[0]}</span>
                }
              </div>
              <span className="text-[9px] font-bold" style={{ color: d.filled ? '#2D7A3A' : '#BDBDBD' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div className="px-4 mb-4">
        <p className="font-black text-ninja-dark text-base mb-2.5">সাপ্তাহিক পারফরম্যান্স</p>
        <div className="card-raised p-4">
          <div className="flex gap-2 items-end h-28">
            <div className="flex flex-col justify-between h-full w-7 text-right">
              {['100','75','50','25','0'].map(l=>(
                <span key={l} className="text-[9px] text-ninja-muted font-semibold">{l}%</span>
              ))}
            </div>
            <div className="flex-1 flex items-end gap-1.5 h-full">
              {weeklyData.map((d, i) => {
                const isBest = i === bestIdx && d.pct > 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() => setTooltip(tooltip?.i === i ? null : { i, pct: d.pct, day: d.day })}>
                    <div className="w-full rounded-t-lg transition-all duration-700 relative"
                      style={{
                        height: `${Math.max(d.pct > 0 ? (d.pct/100)*96 : 2, d.pct > 0 ? 6 : 2)}px`,
                        background: isBest ? 'linear-gradient(180deg,#FFC107,#FF8F00)' : d.pct > 0 ? 'linear-gradient(180deg,#3DAE4F,#2D7A3A)' : '#F0F0F0',
                        boxShadow: isBest ? '0 2px 8px rgba(255,193,7,0.4)' : d.pct > 0 ? '0 2px 6px rgba(45,122,58,0.2)' : 'none',
                      }}>
                      {/* Tooltip */}
                      {tooltip?.i === i && d.pct > 0 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-ninja-dark text-white text-[9px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap">
                          {d.pct}%
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex gap-1.5 mt-2 pl-9">
            {weeklyData.map((d,i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[9px] font-semibold" style={{ color: i===bestIdx&&d.pct>0 ? '#E65100' : '#9E9E9E' }}>{d.day}</span>
              </div>
            ))}
          </div>
          {weeklyData.some(d=>d.pct===weeklyData[bestIdx].pct&&d.pct>0) && (
            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-ninja-border">
              <span className="text-amber-400 text-sm">⭐</span>
              <p className="text-ninja-muted text-xs font-semibold">সেরা দিন: <span className="text-ninja-dark font-black">{weeklyData[bestIdx].day}</span> ({weeklyData[bestIdx].pct}%)</p>
            </div>
          )}
        </div>
      </div>

      {/* Strong / Weak */}
      <div className="px-4 mb-4">
        <p className="font-black text-ninja-dark text-base mb-2">শক্তিশালী অধ্যায়</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {strongRows.slice(0,4).length > 0
            ? strongRows.slice(0,4).map((r,i)=>(
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background:'#E8F5E9', color:'#2D7A3A' }}>
                  {(r as any).chapters?.title_bn ?? `অধ্যায় ${r.chapter_id}`}
                </span>
              ))
            : <span className="text-ninja-muted text-sm">সম্পন্ন করলে দেখাবে</span>
          }
        </div>
        <p className="font-black text-ninja-dark text-base mb-2">উন্নতি দরকার</p>
        <div className="flex flex-wrap gap-2">
          {weakRows.slice(0,4).length > 0
            ? weakRows.slice(0,4).map((r,i)=>(
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background:'#FEF2F2', color:'#EF4444' }}>
                  {(r as any).chapters?.title_bn ?? `অধ্যায় ${r.chapter_id}`}
                </span>
              ))
            : <p className="text-ninja-muted text-sm">দারুণ! সব অধ্যায়ে ভালো করছো 🎉</p>
          }
        </div>
      </div>

      {/* Recent activity */}
      {progressRows.length > 0 && (
        <div className="px-4">
          <p className="font-black text-ninja-dark text-base mb-3">সাম্প্রতিক কার্যকলাপ</p>
          <div className="space-y-2 stagger-children">
            {progressRows.slice(0,5).map((r,i)=>(
              <div key={i} className="card-flat p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: Number(r.accuracy)>=80?'#E8F5E9':Number(r.accuracy)>=60?'#FFF8E1':'#FEF2F2' }}>
                  {Number(r.accuracy)>=80?'⭐':Number(r.accuracy)>=60?'👍':'📖'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ninja-dark text-sm truncate">{(r as any).chapters?.title_bn ?? 'অধ্যায়'}</p>
                  <p className="text-ninja-muted text-xs mt-0.5">{r.score}/{r.total_questions} সঠিক</p>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full"
                  style={{ background: Number(r.accuracy)>=80?'#E8F5E9':Number(r.accuracy)>=60?'#FFF8E1':'#FEF2F2', color: Number(r.accuracy)>=80?'#2D7A3A':Number(r.accuracy)>=60?'#E65100':'#EF4444' }}>
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
