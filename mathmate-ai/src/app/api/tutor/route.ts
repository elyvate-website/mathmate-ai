import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 800,
      messages: [
        {
          role: 'system',
          content: 'You are MathMate AI, a friendly math tutor for Bangladeshi students. Respond in the same language as the user (Bangla or English). For math problems, solve step by step. Be concise, clear, and encouraging.',
        },
        ...messages,
      ],
    })

    const text = completion.choices[0]?.message?.content ?? 'দুঃখিত, সমস্যা হয়েছে।'
    return NextResponse.json({ content: text })
  } catch (err: any) {
    console.error('Tutor API error:', err)
    return NextResponse.json({ content: 'Connection error. Please try again.' }, { status: 500 })
  }
}
