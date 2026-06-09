-- =============================================
-- MathMate AI v2 — Complete Supabase Schema
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────
create table if not exists profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  class_level  int  not null default 9,
  role         text not null default 'student' check (role in ('student','parent')),
  avatar_url   text,
  created_at   timestamptz default now()
);
alter table profiles enable row level security;
create policy "Users manage own profile" on profiles for all using (auth.uid() = id);

-- ─── User Stats ──────────────────────────────
create table if not exists user_stats (
  id                uuid primary key default uuid_generate_v4(),
  user_id           uuid unique references profiles(id) on delete cascade,
  total_xp          int  default 0,
  total_coins       int  default 0,
  total_gems        int  default 0,
  current_streak    int  default 0,
  longest_streak    int  default 0,
  last_active       date default current_date,
  level             int  default 1,
  lessons_completed int  default 0,
  quests_completed  int  default 0,
  updated_at        timestamptz default now()
);
alter table user_stats enable row level security;
create policy "Users manage own stats" on user_stats for all using (auth.uid() = user_id);

-- ─── Chapters ────────────────────────────────
create table if not exists chapters (
  id          serial  primary key,
  class_level int     not null,
  chapter_num int     not null,
  title_bn    text    not null,
  title_en    text,
  book_page   int,
  created_at  timestamptz default now(),
  unique(class_level, chapter_num)
);

-- ─── Exercises ───────────────────────────────
create table if not exists exercises (
  id           serial primary key,
  chapter_id   int    not null references chapters(id) on delete cascade,
  exercise_num text   not null,  -- e.g. "2.1", "3(a)"
  title_bn     text,
  created_at   timestamptz default now()
);

-- ─── Topics ──────────────────────────────────
create table if not exists topics (
  id          serial  primary key,
  chapter_id  int     not null references chapters(id) on delete cascade,
  topic_code  text    not null,
  title_bn    text    not null,
  title_en    text,
  is_locked   boolean default false,
  order_num   int     default 0
);

-- ─── Questions ───────────────────────────────
create table if not exists questions (
  id              uuid    primary key default uuid_generate_v4(),
  chapter_id      int     not null references chapters(id) on delete cascade,
  exercise_id     int     references exercises(id) on delete set null,
  topic_id        int     references topics(id) on delete set null,
  class_level     int     not null,
  chapter_num     int     not null,
  question_num    int     not null,
  sub_part        text,                    -- e.g. "a", "b", "i", "ii"
  question_type   text    not null default 'mcq' check (question_type in ('mcq','short','descriptive','proof')),
  difficulty      text    not null default 'medium' check (difficulty in ('easy','medium','hard')),
  question_bn     text    not null,
  question_latex  text,                    -- LaTeX version of the question
  option_a        text,
  option_b        text,
  option_c        text,
  option_d        text,
  correct_option  text    check (correct_option in ('A','B','C','D')),
  answer_bn       text,                    -- Short answer text
  answer_latex    text,                    -- Short answer in LaTeX
  steps_json      jsonb,                   -- Full step-by-step solution
  hints           text,
  marks           int     default 1,
  created_at      timestamptz default now()
);
create index on questions(chapter_id);
create index on questions(topic_id);
create index on questions(class_level, chapter_num);

-- ─── User Progress ───────────────────────────
create table if not exists user_progress (
  id              uuid    primary key default uuid_generate_v4(),
  user_id         uuid    not null references profiles(id) on delete cascade,
  question_id     uuid    references questions(id) on delete set null,
  chapter_id      int     references chapters(id) on delete set null,
  score           int     default 0,
  total_questions int     default 0,
  accuracy        numeric default 0,
  answers_json    jsonb   default '[]',
  time_spent_sec  int     default 0,
  completed_at    timestamptz default now()
);
alter table user_progress enable row level security;
create policy "Users manage own progress" on user_progress for all using (auth.uid() = user_id);
create index on user_progress(user_id);
create index on user_progress(chapter_id);

-- ─── Achievements ────────────────────────────
create table if not exists user_achievements (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null references profiles(id) on delete cascade,
  achievement  text not null,
  earned_at    timestamptz default now(),
  unique(user_id, achievement)
);
alter table user_achievements enable row level security;
create policy "Users manage own achievements" on user_achievements for all using (auth.uid() = user_id);

-- ─── Leaderboard RPC ─────────────────────────
create or replace function get_class_leaderboard(class_lvl int)
returns table(user_id uuid, full_name text, class_level int, total_xp int, level int)
language sql security definer as $$
  select
    p.id       as user_id,
    p.full_name,
    p.class_level,
    s.total_xp,
    s.level
  from profiles p
  join user_stats s on s.user_id = p.id
  where p.class_level = class_lvl
  order by s.total_xp desc
  limit 20;
$$;

-- ─── Sample Data: Class 9-10 Math Chapters ───
insert into chapters (class_level, chapter_num, title_bn, title_en) values
  (9,  1,  'বাস্তব সংখ্যা',         'Real Numbers'),
  (9,  2,  'সেট ও ফাংশন',           'Sets and Functions'),
  (9,  3,  'বীজগণিতীয় রাশি',       'Algebraic Expressions'),
  (9,  4,  'সূচক ও লগারিদম',        'Indices and Logarithm'),
  (9,  5,  'এক চলকবিশিষ্ট সমীকরণ', 'Linear Equations'),
  (9,  6,  'রেখা, কোণ ও ত্রিভুজ',    'Lines, Angles and Triangles'),
  (9,  7,  'ব্যবহারিক জ্যামিতি',    'Practical Geometry'),
  (9,  8,  'বৃত্ত',                  'Circle'),
  (9,  9,  'ত্রিকোণমিতি',           'Trigonometry'),
  (9,  10, 'পরিমিতি',               'Mensuration'),
  (9,  11, 'তথ্য ও উপাত্ত',         'Statistics'),
  (10, 1,  'বাস্তব সংখ্যা',         'Real Numbers'),
  (10, 2,  'সেট ও ফাংশন',           'Sets and Functions'),
  (10, 3,  'বীজগণিত',               'Algebra'),
  (10, 4,  'সূচক ও লগারিদম',        'Indices and Logarithm'),
  (10, 5,  'ত্রিকোণমিতি',           'Trigonometry'),
  (10, 6,  'জ্যামিতি',              'Geometry'),
  (10, 7,  'পরিমিতি',               'Mensuration'),
  (10, 8,  'তথ্য ও উপাত্ত',         'Statistics')
on conflict (class_level, chapter_num) do nothing;
