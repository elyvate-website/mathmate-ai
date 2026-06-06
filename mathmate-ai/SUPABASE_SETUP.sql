-- ================================================================
-- MathMate AI — Complete Supabase Setup
-- Run this ENTIRE file in Supabase SQL Editor
-- ================================================================

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name    TEXT,
  class_level  INT DEFAULT 9 CHECK (class_level BETWEEN 3 AND 10),
  role         TEXT DEFAULT 'student' CHECK (role IN ('student','parent')),
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER STATS TABLE
CREATE TABLE IF NOT EXISTS public.user_stats (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE,
  total_xp         INT DEFAULT 0,
  total_coins      INT DEFAULT 0,
  current_streak   INT DEFAULT 0,
  longest_streak   INT DEFAULT 0,
  last_active      DATE DEFAULT CURRENT_DATE,
  level            INT DEFAULT 1
);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
  id           SERIAL PRIMARY KEY,
  class_level  INT NOT NULL CHECK (class_level BETWEEN 3 AND 10),
  chapter_num  INT NOT NULL,
  title_bn     TEXT NOT NULL,
  title_en     TEXT,
  book_page    INT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TOPICS TABLE
CREATE TABLE IF NOT EXISTS public.topics (
  id           SERIAL PRIMARY KEY,
  chapter_id   INT REFERENCES public.chapters(id) ON DELETE CASCADE,
  topic_code   TEXT NOT NULL,
  title_bn     TEXT NOT NULL,
  title_en     TEXT,
  is_locked    BOOLEAN DEFAULT FALSE,
  order_num    INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.questions (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id        INT REFERENCES public.chapters(id),
  topic_id          INT REFERENCES public.topics(id),
  class_level       INT NOT NULL,
  chapter_num       INT NOT NULL,
  chapter_title_bn  TEXT,
  topic_code        TEXT,
  question_num      INT,
  sub_part          TEXT,
  question_type     TEXT DEFAULT 'mcq' CHECK (question_type IN ('mcq','short','descriptive','proof')),
  difficulty        TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy','medium','hard')),
  question_bn       TEXT NOT NULL,
  question_latex    TEXT,
  option_ka         TEXT,
  option_kha        TEXT,
  option_ga         TEXT,
  option_gha        TEXT,
  correct_option    TEXT,
  answer_bn         TEXT,
  answer_latex      TEXT,
  steps_json        JSONB,
  formula_used      TEXT,
  hints             TEXT,
  marks             INT DEFAULT 2,
  tags              TEXT[],
  source            TEXT DEFAULT 'textbook',
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SOLUTIONS CACHE TABLE (AI-generated)
CREATE TABLE IF NOT EXISTS public.solutions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id            INT REFERENCES public.topics(id),
  problem_bn          TEXT,
  problem_latex       TEXT,
  steps_json          JSONB,
  final_answer_bn     TEXT,
  final_answer_latex  TEXT,
  concept_summary     TEXT,
  is_verified         BOOLEAN DEFAULT TRUE,
  flag_count          INT DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 7. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID REFERENCES auth.users ON DELETE CASCADE,
  question_id      UUID REFERENCES public.questions(id),
  topic_id         INT REFERENCES public.topics(id),
  score            INT DEFAULT 0,
  total_steps      INT DEFAULT 0,
  accuracy         FLOAT DEFAULT 0,
  answers_json     JSONB,
  time_spent_sec   INT DEFAULT 0,
  completed_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES auth.users ON DELETE CASCADE,
  badge_type  TEXT NOT NULL,
  earned_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions       ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- User stats: own only
CREATE POLICY "stats_own" ON public.user_stats
  FOR ALL USING (auth.uid() = user_id);

-- User progress: own only
CREATE POLICY "progress_own" ON public.user_progress
  FOR ALL USING (auth.uid() = user_id);

-- Achievements: own only
CREATE POLICY "achievements_own" ON public.achievements
  FOR ALL USING (auth.uid() = user_id);

-- Content: readable by authenticated users
CREATE POLICY "chapters_read"   ON public.chapters   FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "topics_read"     ON public.topics     FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "questions_read"  ON public.questions  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "solutions_read"  ON public.solutions  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "solutions_write" ON public.solutions  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ================================================================
-- INDEXES (Performance)
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_chapters_class    ON public.chapters(class_level);
CREATE INDEX IF NOT EXISTS idx_topics_chapter    ON public.topics(chapter_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic   ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_solutions_topic   ON public.solutions(topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_user     ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_topic    ON public.user_progress(topic_id);

-- ================================================================
-- AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- SEED: Class 9-10 Chapters (from NCTB textbook)
-- ================================================================

INSERT INTO public.chapters (class_level, chapter_num, title_bn, title_en, book_page) VALUES
(9, 1,  'বাস্তব সংখ্যা',                            'Real Numbers',                     1),
(9, 2,  'সেট ও ফাংশন',                               'Set and Function',                21),
(9, 3,  'বীজগাণিতিক রাশি',                           'Algebraic Expressions',            43),
(9, 4,  'সূচক ও লগারিদম',                            'Indices and Logarithm',            75),
(9, 5,  'এক চলকবিশিষ্ট সমীকরণ',                     'Equations with One Variable',      93),
(9, 6,  'রেখা, কোণ ও ত্রিভুজ',                       'Line, Angle and Triangle',        111),
(9, 7,  'ব্যবহারিক জ্যামিতি',                        'Practical Geometry',              136),
(9, 8,  'বৃত্ত',                                     'Circle',                          152),
(9, 9,  'ত্রিকোণমিতিক অনুপাত',                       'Trigonometric Ratios',            174),
(9, 10, 'দূরত্ব ও উচ্চতা',                           'Distance and Height',             197),
(9, 11, 'বীজগাণিতিক অনুপাত ও সমানুপাত',              'Algebraic Ratio and Proportion',  205),
(9, 12, 'দুই চলকবিশিষ্ট সরল সহসমীকরণ',              'Simultaneous Linear Equations',   224),
(9, 13, 'সসীম ধারা',                                'Finite Series',                   249),
(9, 14, 'অনুপাত, সদৃশতা ও প্রতিসমতা',               'Ratio, Similarity and Symmetry',  266),
(9, 15, 'ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য',  'Theorems on Area',                285),
(9, 16, 'পরিমিতি',                                  'Mensuration',                     294),
(9, 17, 'পরিসংখ্যান',                               'Statistics',                      326)
ON CONFLICT DO NOTHING;

-- Same chapters for class 10
INSERT INTO public.chapters (class_level, chapter_num, title_bn, title_en, book_page)
SELECT 10, chapter_num, title_bn, title_en, book_page
FROM public.chapters WHERE class_level = 9
ON CONFLICT DO NOTHING;

-- ================================================================
-- SEED: Topics for Chapter 1 (sample)
-- ================================================================

INSERT INTO public.topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
(1, '1.1', 'মূলদ ও অমূলদ সংখ্যা',     'Rational & Irrational Numbers', 1, false),
(1, '1.2', 'আবৃত দশমিক ভগ্নাংশ',       'Recurring Decimals',            2, false),
(1, '1.3', 'বর্গমূল নির্ণয়',           'Finding Square Roots',          3, false),
(1, '1.4', 'অনুশীলনী ১',               'Exercise 1',                    4, false)
ON CONFLICT DO NOTHING;

-- ================================================================
-- DONE! Run this in Supabase SQL Editor.
-- Then go to Authentication > Providers > Enable Google OAuth
-- ================================================================
