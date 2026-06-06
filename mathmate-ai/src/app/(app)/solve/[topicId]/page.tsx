import { createClient } from '@/lib/supabase/server'
import { redirect }     from 'next/navigation'
import { SolvingClient } from './SolvingClient'

export default async function SolvePage({ params }: { params: { topicId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: topic } = await supabase
    .from('topics')
    .select('*, chapters(title_bn, title_en, chapter_num, class_level)')
    .eq('id', params.topicId)
    .single()

  if (!topic) redirect('/chapters/9')

  return <SolvingClient topic={topic} userId={user.id} />
}
