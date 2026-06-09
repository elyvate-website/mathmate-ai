import Groq        from 'groq-sdk'
import { AISolution } from '@/types'

const GROQ_MODEL = 'llama-3.3-70b-versatile'

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set')
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

const SYSTEM_PROMPT = `You are a mathematics tutor AI for Bangladesh NCTB curriculum students (Class 9-10).
Your task: solve a math problem step-by-step.

STRICT RULES:
1. Return ONLY valid JSON — no extra text, no markdown, no backticks
2. Generate 3-6 meaningful solution steps
3. All text must be in Bangla (simple language for students)
4. Use LaTeX format for all math expressions

JSON STRUCTURE (follow exactly):
{
  "problem_bn": "problem in Bangla",
  "problem_latex": "LaTeX format",
  "steps": [
    {
      "step_number": 1,
      "instruction": "What to do (Bangla)",
      "working": "the calculation text",
      "working_latex": "LaTeX format",
      "explanation": "Why this works (Bangla)"
    }
  ],
  "final_answer": "final answer text",
  "final_answer_latex": "LaTeX final answer",
  "concept_summary": "key concept (Bangla)"
}`

async function callGroqWithRetry(prompt: string, retries = 2): Promise<string> {
  const groq = getGroqClient()
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: prompt },
        ],
        temperature: 0.3,
        max_tokens:  2000,
      })
      const raw   = completion.choices[0]?.message?.content ?? '{}'
      const clean = raw.replace(/```json|```/g, '').trim()
      // Validate JSON before returning
      JSON.parse(clean)
      return clean
    } catch (err) {
      if (attempt === retries) throw err
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)))
    }
  }
  throw new Error('All retries exhausted')
}

export async function generateSolution(topic: any): Promise<AISolution> {
  const prompt = `
Class: ${topic.chapters?.class_level ?? 9}
Topic: ${topic.title_bn}
${topic.title_en ? `Topic (English): ${topic.title_en}` : ''}

Generate a complete step-by-step solution for this topic.
Return ONLY the JSON object.`

  const json = await callGroqWithRetry(prompt)
  return JSON.parse(json) as AISolution
}

export async function generatePracticeVariant(
  topicTitle: string,
  classLevel: number,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<AISolution> {
  const prompt = `
Generate a NEW ${difficulty}-level practice problem for:
Class: ${classLevel}
Topic: ${topicTitle}
Return ONLY the JSON object.`

  const json = await callGroqWithRetry(prompt, 1)
  return JSON.parse(json) as AISolution
}
