# MathMate AI 🧮

> AI-powered interactive math tutor for Bangladesh NCTB Class 9-10

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase and Groq API keys.

### 3. Set up Supabase database
- Open your Supabase project → SQL Editor
- Copy and run the entire `SUPABASE_SETUP.sql` file
- Go to Authentication → Providers → Enable Google OAuth

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗂 Project Structure
```
src/
├── app/
│   ├── (auth)/          # Login, Signup
│   ├── (app)/           # Protected pages
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── chapters/[classId]/
│   │   ├── lessons/[chapterId]/
│   │   ├── solve/[topicId]/
│   │   ├── results/
│   │   ├── progress/
│   │   └── profile/
│   └── api/
│       ├── solve/       # Groq AI endpoint
│       └── progress/    # Save user progress
├── components/
│   ├── ui/              # Button, Input, Card, Badge
│   ├── layout/          # BottomNav, TopBar
│   ├── dashboard/       # Dashboard-specific
│   ├── solving/         # Solving screen components
│   └── shared/          # Robot, MathExpression (KaTeX)
├── lib/
│   ├── supabase/        # Client + Server
│   ├── groq.ts          # AI integration
│   └── utils.ts
├── hooks/               # useAuth, useProgress
├── types/               # TypeScript definitions
└── constants/           # App-wide constants
```

## 🔑 Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_APP_URL=
```

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Deploy ✅
