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
  total_gems: number
  current_streak: number
  longest_streak: number
  last_active: string
  level: number
  lessons_completed: number
  quests_completed: number
}

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

export interface Exercise {
  id: number
  chapter_id: number
  exercise_num: string
  title_bn: string | null
}

export interface Question {
  id: string
  chapter_id: number
  exercise_id: number | null
  topic_id: number | null
  class_level: number
  chapter_num: number
  question_num: number
  sub_part: string | null
  question_type: 'mcq' | 'short' | 'descriptive' | 'proof'
  difficulty: 'easy' | 'medium' | 'hard'
  question_bn: string
  question_latex: string | null
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  correct_option: 'A' | 'B' | 'C' | 'D' | null
  answer_bn: string | null
  answer_latex: string | null
  steps_json: SolutionSteps | null
  hints: string | null
  marks: number
}

export interface SolutionStep {
  step_number: number
  instruction: string
  working: string
  working_latex: string
  explanation: string
}

export interface SolutionSteps {
  steps: SolutionStep[]
  final_answer: string
  final_answer_latex: string
  concept_summary: string
}

export interface UserProgress {
  id: string
  user_id: string
  question_id: string
  chapter_id: number
  score: number
  total_questions: number
  accuracy: number
  answers_json: AnswerRecord[]
  time_spent_sec: number
  completed_at: string
}

export interface AnswerRecord {
  question_id: string
  selected: string
  correct: string
  is_correct: boolean
}

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  class_level: number
  total_xp: number
  level: number
  rank: number
}

export interface Achievement {
  id: string
  title: string
  icon: string
  color: string
  earned: boolean
}
