import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { XP_PER_CORRECT_STEP, COINS_PER_CORRECT_STEP } from '@/constants'

export async function POST(req: NextRequest) {
  try {
    const { topicId, solutionId, answers, score, totalSteps, timeTakenSec } = await req.json()

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const accuracy  = totalSteps > 0 ? (score / totalSteps) * 100 : 0
    const xpEarned  = score * XP_PER_CORRECT_STEP
    const coinsEarned = score * COINS_PER_CORRECT_STEP

    // Save progress
    await supabase.from('user_progress').insert({
      user_id:        user.id,
      topic_id:       topicId,
      score,
      total_steps:    totalSteps,
      accuracy,
      answers_json:   answers,
      time_spent_sec: timeTakenSec,
    })

    // Update stats (XP, coins, streak)
    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const today       = new Date().toISOString().split('T')[0]
    const lastActive  = stats?.last_active
    const isNewDay    = lastActive !== today
    const isConsecutive = lastActive === new Date(Date.now() - 86400000).toISOString().split('T')[0]

    const newStreak = isNewDay
      ? isConsecutive ? (stats?.current_streak ?? 0) + 1 : 1
      : stats?.current_streak ?? 1

    await supabase.from('user_stats').upsert({
      user_id:        user.id,
      total_xp:       (stats?.total_xp ?? 0) + xpEarned,
      total_coins:    (stats?.total_coins ?? 0) + coinsEarned,
      current_streak: newStreak,
      longest_streak: Math.max(stats?.longest_streak ?? 0, newStreak),
      last_active:    today,
    })

    return NextResponse.json({ xpEarned, coinsEarned, accuracy, newStreak })
  } catch (err: any) {
    console.error('Progress API error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
