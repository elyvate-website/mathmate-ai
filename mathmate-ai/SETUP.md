# MathMate AI — Setup Guide

## 1. Environment Variables
Create `.env.local` in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

## 2. Supabase Setup
Run these SQL files in order in the Supabase SQL Editor:
1. `supabase/schema.sql` — Creates all tables, RLS policies, and seeds chapters
2. `supabase/seed_topics.sql` — Adds topics + sample MCQ questions with step-by-step solutions

## 3. Install & Run
```bash
npm install
npm run dev
```

## 4. How to Add More Questions
Insert directly into the `questions` table with this structure:
- `chapter_id` — from chapters table
- `topic_id` — from topics table  
- `class_level`, `chapter_num`, `question_num` — numbers
- `question_bn` — question in Bangla
- `question_latex` — (optional) LaTeX version
- `option_a` through `option_d` — 4 answer choices
- `correct_option` — 'A', 'B', 'C', or 'D'
- `answer_bn` — explanation text
- `steps_json` — JSON with step-by-step solution (see seed_topics.sql for format)

## 5. What Was Fixed
- ✅ Double-counting bug in score calculation
- ✅ Progress now saves via /api/progress (streak, gems, longest streak all tracked)
- ✅ Leaderboard fallback logic fixed (empty array check)
- ✅ Dashboard no longer crashes when user_stats row is missing (maybeSingle)
- ✅ Results page shows real streak from API
- ✅ Coins display reads from database, not hardcoded
- ✅ Progress page shows chapter names (not just IDs)
- ✅ Chapters page — removed arbitrary i>5 lock
- ✅ AI Tutor knows user's class level and name
- ✅ Profile page crash fixed

## 6. App Flow
Login/Signup → Onboarding (pick class) → Dashboard → Subjects → Chapters → Topics → Solve (MCQ with step-by-step hints) → Results
