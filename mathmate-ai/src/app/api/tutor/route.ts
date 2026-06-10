import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@/lib/supabase/server'
import Groq from 'groq-sdk'

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured')
  return new Groq({ apiKey })
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Get user context for personalization
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    let classLevel = 9
    let userName   = 'Ninja'
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('class_level, full_name').eq('id', user.id).single()
      classLevel = profile?.class_level ?? 9
      userName   = profile?.full_name?.split(' ')[0] ?? 'Ninja'
    }

    const groq = getGroqClient()
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content: `তুমি MathMate AI — বাংলাদেশের শিক্ষার্থীদের জন্য একজন বন্ধুত্বপূর্ণ গণিত শিক্ষক।
শিক্ষার্থীর নাম: ${userName}
শ্রেণি: ${classLevel}
পাঠ্যক্রম: NCTB (জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড)

নিয়মাবলী:
- শিক্ষার্থী বাংলায় লিখলে বাংলায়, ইংরেজিতে লিখলে ইংরেজিতে উত্তর দাও
- গণিতের সমস্যা ধাপে ধাপে সমাধান করো
- সহজ ভাষায় উৎসাহজনকভাবে বোঝাও
- উত্তর সংক্ষিপ্ত ও স্পষ্ট রাখো`,
        },
        ...messages,
      ],
    })

    const text = completion.choices[0]?.message?.content ?? 'দুঃখিত, সমস্যা হয়েছে।'
    return NextResponse.json({ content: text })
  } catch (err: any) {
    console.error('Tutor API error:', err)
    return NextResponse.json({ content: 'সংযোগে সমস্যা হয়েছে। আবার চেষ্টা করো।' }, { status: 500 })
  }
}
