import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import { generateSolution }          from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { topicId } = await req.json()
    if (!topicId) return NextResponse.json({ error: 'topicId required' }, { status: 400 })

    const supabase = createClient()

    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // 2. Get topic + chapter info
    const { data: topic } = await supabase
      .from('topics')
      .select('*, chapters(title_bn, class_level)')
      .eq('id', topicId)
      .single()

    if (!topic) return NextResponse.json({ error: 'Topic not found' }, { status: 404 })

    // 3. Check cache
    const { data: cached } = await supabase
      .from('solutions')
      .select('*')
      .eq('topic_id', topicId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (cached) {
      return NextResponse.json({ solution: cached, cached: true })
    }

    // 4. Generate with Groq
    const chapterTitle = (topic.chapters as any)?.title_bn ?? topic.title_bn
    const classLevel   = (topic.chapters as any)?.class_level ?? 9

    const aiSolution = await generateSolution(
      topic.title_bn,
      classLevel,
      `${chapterTitle} — ${topic.title_bn}`,
    )

    // 5. Save to cache
    const { data: saved } = await supabase
      .from('solutions')
      .insert({
        topic_id:          topicId,
        problem_bn:        aiSolution.problem_bn,
        problem_latex:     aiSolution.problem_latex,
        steps_json:        { steps: aiSolution.steps, final_answer: aiSolution.final_answer, final_answer_latex: aiSolution.final_answer_latex, concept_summary: aiSolution.concept_summary },
        final_answer_bn:   aiSolution.final_answer,
        final_answer_latex: aiSolution.final_answer_latex,
        concept_summary:   aiSolution.concept_summary,
        is_verified:       true,
      })
      .select()
      .single()

    return NextResponse.json({ solution: saved, cached: false })
  } catch (err: any) {
    console.error('Solve API error:', err)
    return NextResponse.json({ error: err.message ?? 'Internal error' }, { status: 500 })
  }
}
