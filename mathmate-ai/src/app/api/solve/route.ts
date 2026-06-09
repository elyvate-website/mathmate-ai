import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { generateSolution }          from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { topicId } = await req.json()
    const supabase    = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: topic } = await supabase
      .from('topics')
      .select('*, chapters(*)')
      .eq('id', topicId)
      .single()

    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

    // Check for cached solution in questions table
    const { data: existingQuestions } = await supabase
      .from('questions')
      .select('*')
      .eq('topic_id', topicId)
      .not('steps_json', 'is', null)
      .limit(1)

    if (existingQuestions && existingQuestions.length > 0 && existingQuestions[0].steps_json) {
      return NextResponse.json({ solution: existingQuestions[0].steps_json, cached: true })
    }

    // Generate via Groq
    const solution = await generateSolution(topic)
    return NextResponse.json({ solution, cached: false })

  } catch (err: any) {
    console.error('Solve API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
