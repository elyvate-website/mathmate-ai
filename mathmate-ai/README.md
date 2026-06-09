# 🥷 MathMate AI — v2.0

**তোমার ব্যক্তিগত গণিত নিনজা** — NCTB ৯ম-১০ম শ্রেণির গণিত শিক্ষার AI অ্যাপ।

---

## ✨ Features

- 📚 **Chapter-based learning** — NCTB curriculum class 9-10 math
- 🤖 **AI Tutor** — Groq-powered chat assistant (Bangla + English)
- 🎯 **Step-by-step solutions** — Pre-loaded from Supabase
- 🏆 **Gamification** — XP, Coins, Gems, Streaks, Levels, Achievements
- 📊 **Progress tracking** — Weekly charts, strong/weak topics
- 🥇 **Leaderboard** — Class-based rankings
- 🎨 **Ninja theme** — Green design with animated mascots

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GROQ_API_KEY=your_groq_api_key
```

### 3. Set up Supabase
Run `supabase/schema.sql` in your Supabase SQL editor.
This creates all tables, RLS policies, and seeds chapter data.

### 4. Run
```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (app)/              # Protected app pages
│   │   ├── dashboard/      # Home screen
│   │   ├── subjects/       # Subject selection
│   │   ├── chapters/       # Chapter list
│   │   ├── lessons/        # Topics per chapter
│   │   ├── solve/          # Question solving screen
│   │   ├── results/        # Celebration screen
│   │   ├── practice/       # Practice modes
│   │   ├── progress/       # Progress & charts
│   │   ├── leaderboard/    # Class leaderboard
│   │   ├── tutor/          # AI chat tutor
│   │   ├── profile/        # User profile
│   │   └── onboarding/     # Class & role selection
│   ├── (auth)/             # Login / Signup
│   └── api/                # API routes
│       ├── solve/          # Groq solution generation
│       ├── tutor/          # AI tutor chat
│       └── progress/       # Save progress + XP
├── components/
│   ├── layout/             # BottomNav, TopBar
│   ├── shared/             # MathExpression (KaTeX)
│   └── ui/                 # Button
├── lib/
│   ├── groq.ts             # Groq AI with retry logic
│   ├── utils.ts            # XP/level helpers
│   └── supabase/           # Server + client
├── types/index.ts          # All TypeScript types
└── constants/index.ts      # Levels, subjects, achievements
```

---

## 🗄️ Supabase Schema

Tables:
- `profiles` — User profiles (name, class, role)
- `user_stats` — XP, coins, gems, streaks, level
- `chapters` — NCTB chapters (pre-seeded)
- `exercises` — Exercise sets per chapter
- `topics` — Topics per chapter
- `questions` — Questions with solutions (JSON)
- `user_progress` — Per-question progress
- `user_achievements` — Earned badges

---

## 📝 Adding Content

To add questions and solutions, insert into the `questions` table:

```sql
INSERT INTO questions (
  chapter_id, class_level, chapter_num, question_num,
  question_type, difficulty, question_bn, question_latex,
  option_a, option_b, option_c, option_d, correct_option,
  answer_bn, answer_latex, steps_json
) VALUES (
  5, 9, 5, 1,
  'mcq', 'medium',
  '2x + 7 = 23 হলে x = কত?',
  '2x + 7 = 23',
  'x = 6', 'x = 8', 'x = 9', 'x = 10',
  'B',
  'x = 8', 'x = 8',
  '{
    "steps": [
      {"step_number":1,"instruction":"উভয় দিক থেকে 7 বিয়োগ করো","working":"2x = 23 - 7 = 16","working_latex":"2x = 23 - 7 = 16","explanation":"সমীকরণ সরল করতে 7 সরিয়ে নিই"},
      {"step_number":2,"instruction":"উভয় দিক 2 দিয়ে ভাগ করো","working":"x = 16 ÷ 2 = 8","working_latex":"x = \\frac{16}{2} = 8","explanation":"x এর মান বের করতে 2 দিয়ে ভাগ করি"}
    ],
    "final_answer": "x = 8",
    "final_answer_latex": "x = 8",
    "concept_summary": "রৈখিক সমীকরণ: একটি অজানাকে বিচ্ছিন্ন করতে বিপরীত গাণিতিক ক্রিয়া ব্যবহার করো।"
  }'
);
```

---

## 🥷 Ninja Assets

All assets in `/public/`:
- `Ninja Standing With Sword.png` — Splash/landing
- `Ninja Greetings.png` — Login / AI Tutor
- `Ninja Greetings 2.png` — Signup / Onboarding  
- `Ninja Celebrating.png` — Results screen
- `chill ninja.png` — Navigation / Chat avatar
- `Badge without Ninja.png` — Achievements
- `Target without Ninja.png` — Progress goals
