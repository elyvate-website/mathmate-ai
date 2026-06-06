export const APP_NAME = 'MathMate AI'
export const APP_TAGLINE = 'Learn. Practice. Master.'
export const APP_DESCRIPTION = 'Your Personal AI Math Tutor for Class 3-10 NCTB Curriculum'

export const CLASSES = [3, 4, 5, 6, 7, 8, 9, 10] as const

export const NAV_ITEMS = [
  { id: 'home',     label: 'Home',     href: '/dashboard',  icon: 'Home'      },
  { id: 'practice', label: 'Practice', href: '/practice',   icon: 'PenLine'   },
  { id: 'learn',    label: 'Learn',    href: '/chapters/9', icon: 'BookOpen'  },
  { id: 'progress', label: 'Progress', href: '/progress',   icon: 'BarChart2' },
  { id: 'profile',  label: 'Profile',  href: '/profile',    icon: 'User'      },
] as const

export const XP_PER_CORRECT_STEP  = 10
export const XP_PER_COMPLETED_TOPIC = 50
export const COINS_PER_CORRECT_STEP = 5
export const COINS_PER_TOPIC        = 20

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 900, 1400, 2000, 2800, 3800, 5000,
]

export const DIFFICULTY_COLORS = {
  easy:   'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  hard:   'text-red-600 bg-red-50',
} as const

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  mcq:         'বহুনির্বাচনি',
  short:       'সংক্ষিপ্ত',
  descriptive: 'বর্ণনামূলক',
  proof:       'প্রমাণ',
}

export const GROQ_MODEL = 'llama-3.3-70b-versatile'
