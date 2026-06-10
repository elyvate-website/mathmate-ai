import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { SolvingClient } from './SolvingClient'

export default async function SolvePage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const topicId = parseInt(params.topicId)

  const [{ data: topic }, { data: questions }, { data: profile }, { data: stats }] = await Promise.all([
    supabase.from('topics').select('*, chapters(*)').eq('id', topicId).single(),
    supabase.from('questions').select('*').eq('topic_id', topicId).order('question_num'),
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('user_stats').select('total_coins, total_xp, current_streak').eq('user_id', user.id).single(),
  ])

  if (!topic) redirect('/dashboard')

  return (
    <SolvingClient
      topic={topic}
      questions={questions ?? []}
      userId={user.id}
      profile={profile}
      initialCoins={stats?.total_coins ?? 0}
      initialStreak={stats?.current_streak ?? 0}
    />
  )
}
