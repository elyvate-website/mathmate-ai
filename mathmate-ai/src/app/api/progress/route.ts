import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'

const XP_PER_CORRECT    = 10
const COINS_PER_CORRECT = 5

export async function POST(req: NextRequest) {
  try {
    const { chapterId, answers, score, totalQuestions, timeTakenSec } = await req.json()

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const accuracy    = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
    const xpEarned    = score * XP_PER_CORRECT
    const coinsEarned = score * COINS_PER_CORRECT
    const gemsEarned  = accuracy >= 80 ? 1 : 0

    await supabase.from('user_progress').insert({
      user_id:         user.id,
      chapter_id:      chapterId,
      score,
      total_questions: totalQuestions,
      accuracy,
      answers_json:    answers ?? [],
      time_spent_sec:  timeTakenSec ?? 0,
    })

    const { data: stats } = await supabase
      .from('user_stats').select('*').eq('user_id', user.id).single()

    const today         = new Date().toISOString().split('T')[0]
    const lastActive    = stats?.last_active
    const isNewDay      = lastActive !== today
    const yesterday     = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    const isConsecutive = lastActive === yesterday

    const newStreak = isNewDay
      ? (isConsecutive ? (stats?.current_streak ?? 0) + 1 : 1)
      : (stats?.current_streak ?? 1)

    const newXP      = (stats?.total_xp    ?? 0) + xpEarned
    const newCoins   = (stats?.total_coins  ?? 0) + coinsEarned
    const newGems    = (stats?.total_gems   ?? 0) + gemsEarned
    const newLessons = (stats?.lessons_completed ?? 0) + 1

    await supabase.from('user_stats').upsert({
      user_id:           user.id,
      total_xp:          newXP,
      total_coins:       newCoins,
      total_gems:        newGems,
      current_streak:    newStreak,
      longest_streak:    Math.max(stats?.longest_streak ?? 0, newStreak),
      last_active:       today,
      lessons_completed: newLessons,
    }, { onConflict: 'user_id' })

    return NextResponse.json({ xpEarned, coinsEarned, gemsEarned, accuracy, newStreak })
  } catch (err: any) {
    console.error('Progress API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
