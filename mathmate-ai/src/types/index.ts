// ─── Auth & User ─────────────────────────────────────────────
export interface Profile {
  id: string
  full_name: string | null
  class_level: number
  role: 'student' | 'parent'
  avatar_url: string | null
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_xp: number
  total_coins: number
  current_streak: number
  longest_streak: number
  last_active: string
  level: number
}

// ─── Content ─────────────────────────────────────────────────
export interface Chapter {
  id: number
  class_level: number
  chapter_num: number
  title_bn: string
  title_en: string | null
  book_page: number | null
}

export interface Topic {
  id: number
  chapter_id: number
  topic_code: string
  title_bn: string
  title_en: string | null
  is_locked: boolean
  order_num: number
}

export interface Question {
  id: string
  chapter_id: number
  topic_id: number
  class_level: number
  chapter_num: number
  chapter_title_bn: string
  topic_code: string
  question_num: number
  sub_part: string | null
  question_type: 'mcq' | 'short' | 'descriptive' | 'proof'
  difficulty: 'easy' | 'medium' | 'hard'
  question_bn: string
  question_latex: string | null
  option_ka: string | null
  option_kha: string | null
  option_ga: string | null
  option_gha: string | null
  correct_option: string | null
  answer_bn: string | null
  answer_latex: string | null
  steps_json: SolutionSteps | null
  formula_used: string | null
  hints: string | null
  marks: number
  tags: string[]
}

// ─── AI / Solving ─────────────────────────────────────────────
export interface SolutionStep {
  step_number: number
  instruction: string
  working: string
  working_latex: string
  explanation: string
  mcq_options: string[]
  correct_index: number
}

export interface SolutionSteps {
  steps: SolutionStep[]
  final_answer: string
  final_answer_latex: string
  concept_summary: string
}

export interface AISolution {
  problem_bn: string
  problem_latex: string
  steps: SolutionStep[]
  final_answer: string
  final_answer_latex: string
  concept_summary: string
}

// ─── Progress ─────────────────────────────────────────────────
export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  topic_id: number
  score: number
  total_steps: number
  accuracy: number
  answers_json: AnswerRecord[]
  time_spent_sec: number
  completed_at: string
}

export interface AnswerRecord {
  step: number
  selected_index: number
  correct_index: number
  is_correct: boolean
}

// ─── UI State ─────────────────────────────────────────────────
export type NavItem = 'home' | 'practice' | 'learn' | 'progress' | 'profile'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}
