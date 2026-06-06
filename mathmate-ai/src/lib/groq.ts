import Groq from 'groq-sdk'
import { AISolution, SolutionStep } from '@/types'
import { GROQ_MODEL } from '@/constants'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `You are a mathematics tutor AI for Bangladesh NCTB curriculum students (Class 3-10).
Your task: solve a math problem step-by-step and create MCQ questions for each step.

STRICT RULES:
1. Return ONLY valid JSON — no extra text, no markdown, no backticks
2. Each step must have EXACTLY 4 MCQ options
3. Only ONE option is correct per step
4. Generate 4-6 meaningful steps (not more, not less)
5. All explanations must be in Bangla (simple language)
6. Use LaTeX format for math expressions
7. Steps must guide thinking — not just state answers

JSON STRUCTURE (follow exactly):
{
  "problem_bn": "problem in Bangla context",
  "problem_latex": "LaTeX format of problem",
  "steps": [
    {
      "step_number": 1,
      "instruction": "What to do at this step (Bangla)",
      "working": "the calculation/answer for this step",
      "working_latex": "LaTeX format",
      "explanation": "Why this is correct (Bangla, simple)",
      "mcq_options": ["option1", "option2", "option3", "option4"],
      "correct_index": 0
    }
  ],
  "final_answer": "final answer text",
  "final_answer_latex": "LaTeX final answer",
  "concept_summary": "key concept to remember (Bangla)"
}`

export async function generateSolution(
  topicTitle: string,
  classLevel: number,
  questionText: string,
  questionLatex?: string
): Promise<AISolution> {
  const userPrompt = `
Class: ${classLevel}
Topic: ${topicTitle}
Question (Bangla): ${questionText}
${questionLatex ? `Question (LaTeX): ${questionLatex}` : ''}

Generate a complete step-by-step interactive solution with MCQ questions for each step.
Make it appropriate for Class ${classLevel} NCTB level.
Return ONLY the JSON object.`

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system',  content: SYSTEM_PROMPT },
      { role: 'user',    content: userPrompt    },
    ],
    temperature: 0.3,
    max_tokens:  2000,
  })

  const raw = completion.choices[0]?.message?.content ?? '{}'
  const clean = raw.replace(/```json|```/g, '').trim()
  const parsed = JSON.parse(clean) as AISolution
  return parsed
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

Create a fresh problem (different from previous), solve it step-by-step with MCQ questions.
Return ONLY the JSON object following the exact structure defined.`

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user',   content: prompt         },
    ],
    temperature: 0.7,
    max_tokens:  2000,
  })

  const raw   = completion.choices[0]?.message?.content ?? '{}'
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as AISolution
}
