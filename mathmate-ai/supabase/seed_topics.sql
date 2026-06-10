-- =============================================
-- MathMate AI — Seed Topics for All Chapters
-- Run this AFTER schema.sql in Supabase SQL editor
-- =============================================

-- Chapter 1: বাস্তব সংখ্যা (Real Numbers) - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=1), 'CH1-T1', 'বাস্তব সংখ্যার ধারণা', 'Concept of Real Numbers', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=1), 'CH1-T2', 'মূলদ ও অমূলদ সংখ্যা', 'Rational and Irrational Numbers', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=1), 'CH1-T3', 'বর্গমূল ও ঘনমূল', 'Square Root and Cube Root', 3, false)
ON CONFLICT DO NOTHING;

-- Chapter 2: সেট ও ফাংশন (Sets and Functions) - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=2), 'CH2-T1', 'সেটের ধারণা', 'Concept of Sets', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=2), 'CH2-T2', 'সেটের প্রকারভেদ', 'Types of Sets', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=2), 'CH2-T3', 'সেটের অপারেশন', 'Set Operations', 3, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=2), 'CH2-T4', 'ফাংশনের ধারণা', 'Concept of Functions', 4, false)
ON CONFLICT DO NOTHING;

-- Chapter 3: বীজগণিতীয় রাশি (Algebraic Expressions) - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=3), 'CH3-T1', 'বীজগণিতীয় সূত্রাবলী', 'Algebraic Formulas', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=3), 'CH3-T2', 'উৎপাদকে বিশ্লেষণ', 'Factorization', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=3), 'CH3-T3', 'ভগ্নাংশের সরলীকরণ', 'Simplification of Fractions', 3, false)
ON CONFLICT DO NOTHING;

-- Chapter 4: সূচক ও লগারিদম - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=4), 'CH4-T1', 'সূচকের নিয়মাবলী', 'Laws of Indices', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=4), 'CH4-T2', 'লগারিদমের ধারণা', 'Concept of Logarithm', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=4), 'CH4-T3', 'লগারিদমের সূত্রাবলী', 'Laws of Logarithm', 3, false)
ON CONFLICT DO NOTHING;

-- Chapter 5: এক চলকবিশিষ্ট সমীকরণ (Linear Equations) - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=5), 'CH5-T1', 'সরল সমীকরণ গঠন', 'Forming Simple Equations', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=5), 'CH5-T2', 'সমীকরণ সমাধান', 'Solving Equations', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=5), 'CH5-T3', 'শব্দ সমস্যা', 'Word Problems', 3, false)
ON CONFLICT DO NOTHING;

-- Chapter 9: ত্রিকোণমিতি (Trigonometry) - Class 9
INSERT INTO topics (chapter_id, topic_code, title_bn, title_en, order_num, is_locked) VALUES
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=9), 'CH9-T1', 'ত্রিকোণমিতিক অনুপাত', 'Trigonometric Ratios', 1, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=9), 'CH9-T2', 'পূরক কোণের সম্পর্ক', 'Complementary Angle Relations', 2, false),
((SELECT id FROM chapters WHERE class_level=9 AND chapter_num=9), 'CH9-T3', 'সমীকরণ ও প্রমাণ', 'Equations and Proofs', 3, false)
ON CONFLICT DO NOTHING;

-- Sample questions for Chapter 3, Topic 1 (Algebraic Formulas) - Class 9
-- These demonstrate the full data structure; add more via your admin process

DO $$
DECLARE
  v_topic_id int;
  v_chapter_id int;
BEGIN
  SELECT id INTO v_chapter_id FROM chapters WHERE class_level=9 AND chapter_num=3;
  SELECT id INTO v_topic_id   FROM topics   WHERE topic_code='CH3-T1';

  IF v_topic_id IS NOT NULL AND v_chapter_id IS NOT NULL THEN
    INSERT INTO questions (
      chapter_id, topic_id, class_level, chapter_num, question_num,
      question_type, difficulty, question_bn, question_latex,
      option_a, option_b, option_c, option_d, correct_option,
      answer_bn, steps_json
    ) VALUES
    (
      v_chapter_id, v_topic_id, 9, 3, 1,
      'mcq', 'easy',
      '(a + b)² = কত?',
      '(a + b)^2 = ?',
      'a² + b²', 'a² + 2ab + b²', 'a² - 2ab + b²', '2a² + 2b²',
      'B',
      '(a + b)² = a² + 2ab + b² — এটি বর্গের সূত্র।',
      '{
        "steps": [
          {
            "step_number": 1,
            "instruction": "(a + b)² মানে (a + b) কে (a + b) দিয়ে গুণ করা",
            "working": "(a + b) × (a + b)",
            "working_latex": "(a + b) \\\\times (a + b)",
            "explanation": "বর্গ মানে নিজেকে নিজে দিয়ে গুণ করা"
          },
          {
            "step_number": 2,
            "instruction": "বিতরণ নিয়ম (FOIL) প্রয়োগ করো",
            "working": "a×a + a×b + b×a + b×b",
            "working_latex": "a \\\\cdot a + a \\\\cdot b + b \\\\cdot a + b \\\\cdot b",
            "explanation": "প্রতিটি পদকে অপর বন্ধনীর প্রতিটি পদ দিয়ে গুণ করতে হবে"
          },
          {
            "step_number": 3,
            "instruction": "সদৃশ পদ একসাথে করো",
            "working": "a² + 2ab + b²",
            "working_latex": "a^2 + 2ab + b^2",
            "explanation": "ab + ba = 2ab"
          }
        ],
        "final_answer": "a² + 2ab + b²",
        "final_answer_latex": "a^2 + 2ab + b^2",
        "concept_summary": "এটি বর্গের সূত্র — মনে রেখো: (a+b)² = a² + 2ab + b²"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 3, 2,
      'mcq', 'easy',
      '(a - b)² = কত?',
      '(a - b)^2 = ?',
      'a² + 2ab + b²', 'a² + b²', 'a² - 2ab + b²', '(a+b)(a-b)',
      'C',
      '(a - b)² = a² - 2ab + b² — এটি বিয়োগের বর্গ সূত্র।',
      '{
        "steps": [
          {
            "step_number": 1,
            "instruction": "(a - b)² মানে (a - b) × (a - b)",
            "working": "(a - b)(a - b)",
            "working_latex": "(a - b)(a - b)",
            "explanation": "বর্গ মানে নিজেকে নিজে দিয়ে গুণ"
          },
          {
            "step_number": 2,
            "instruction": "FOIL পদ্ধতিতে গুণ করো",
            "working": "a² - ab - ab + b²",
            "working_latex": "a^2 - ab - ab + b^2",
            "explanation": "প্রতিটি পদ গুণ করো, চিহ্নের দিকে মনোযোগ দাও"
          },
          {
            "step_number": 3,
            "instruction": "সদৃশ পদ একসাথে করো",
            "working": "a² - 2ab + b²",
            "working_latex": "a^2 - 2ab + b^2",
            "explanation": "-ab - ab = -2ab"
          }
        ],
        "final_answer": "a² - 2ab + b²",
        "final_answer_latex": "a^2 - 2ab + b^2",
        "concept_summary": "(a-b)² = a² - 2ab + b² — মনোযোগ দাও মাঝখানে বিয়োগ!"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 3, 3,
      'mcq', 'medium',
      'a² - b² = কত?',
      'a^2 - b^2 = ?',
      '(a-b)²', '(a+b)(a+b)', '(a+b)(a-b)', 'a(a-b)',
      'C',
      'a² - b² = (a+b)(a-b) — এটি দুটি বর্গের বিয়োগের সূত্র।',
      '{
        "steps": [
          {
            "step_number": 1,
            "instruction": "ডান পাশের (a+b)(a-b) গুণ করে দেখি",
            "working": "(a+b)(a-b)",
            "working_latex": "(a+b)(a-b)",
            "explanation": "ডান পাশ থেকে বাম পাশ যাচাই করবো"
          },
          {
            "step_number": 2,
            "instruction": "FOIL প্রয়োগ",
            "working": "a² - ab + ab - b²",
            "working_latex": "a^2 - ab + ab - b^2",
            "explanation": "মাঝখানের পদ দুটি পরস্পরকে বাতিল করে"
          },
          {
            "step_number": 3,
            "instruction": "চূড়ান্ত ফলাফল",
            "working": "a² - b²",
            "working_latex": "a^2 - b^2",
            "explanation": "-ab + ab = 0, তাই বাকি থাকে a² - b²"
          }
        ],
        "final_answer": "(a+b)(a-b)",
        "final_answer_latex": "(a+b)(a-b)",
        "concept_summary": "দুই বর্গের বিয়োগ সূত্র: a²-b² = (a+b)(a-b)"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 3, 4,
      'mcq', 'medium',
      'যদি a + b = 5 এবং ab = 6 হয়, তাহলে a² + b² = কত?',
      'If a + b = 5 and ab = 6, then a^2 + b^2 = ?',
      '25', '13', '12', '19',
      'B',
      'a² + b² = (a+b)² - 2ab = 25 - 12 = 13',
      '{
        "steps": [
          {
            "step_number": 1,
            "instruction": "সূত্র প্রয়োগ: a² + b² = (a+b)² - 2ab",
            "working": "a² + b² = (a+b)² - 2ab",
            "working_latex": "a^2 + b^2 = (a+b)^2 - 2ab",
            "explanation": "এটি একটি গুরুত্বপূর্ণ সম্পর্ক সূত্র"
          },
          {
            "step_number": 2,
            "instruction": "দেওয়া মান বসাও: a+b=5, ab=6",
            "working": "= 5² - 2×6",
            "working_latex": "= 5^2 - 2 \\\\times 6",
            "explanation": "মান বসিয়ে হিসাব করো"
          },
          {
            "step_number": 3,
            "instruction": "হিসাব করো",
            "working": "= 25 - 12 = 13",
            "working_latex": "= 25 - 12 = 13",
            "explanation": "চূড়ান্ত উত্তর ১৩"
          }
        ],
        "final_answer": "13",
        "final_answer_latex": "13",
        "concept_summary": "a²+b² = (a+b)² - 2ab — এই সূত্রটি মনে রাখা অত্যন্ত জরুরি"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 3, 5,
      'mcq', 'hard',
      'যদি x + 1/x = 3 হয়, তাহলে x² + 1/x² = কত?',
      'If x + 1/x = 3, then x^2 + 1/x^2 = ?',
      '7', '9', '11', '6',
      'A',
      'x² + 1/x² = (x + 1/x)² - 2 = 9 - 2 = 7',
      '{
        "steps": [
          {
            "step_number": 1,
            "instruction": "উভয় পাশে বর্গ করো",
            "working": "(x + 1/x)² = 3²",
            "working_latex": "\\\\left(x + \\\\frac{1}{x}\\\\right)^2 = 3^2",
            "explanation": "উভয় পক্ষে বর্গ করলে সম্পর্ক পাওয়া যাবে"
          },
          {
            "step_number": 2,
            "instruction": "বাম পাশ বিস্তার করো",
            "working": "x² + 2 + 1/x² = 9",
            "working_latex": "x^2 + 2 + \\\\frac{1}{x^2} = 9",
            "explanation": "(a+b)² = a² + 2ab + b² ব্যবহার করে"
          },
          {
            "step_number": 3,
            "instruction": "x² + 1/x² একা করো",
            "working": "x² + 1/x² = 9 - 2 = 7",
            "working_latex": "x^2 + \\\\frac{1}{x^2} = 9 - 2 = 7",
            "explanation": "উভয় পাশ থেকে 2 বিয়োগ করো"
          }
        ],
        "final_answer": "7",
        "final_answer_latex": "7",
        "concept_summary": "বর্গ করার কৌশল: (x + 1/x)² = x² + 2 + 1/x²"
      }'::jsonb
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sample questions for Chapter 5, Topic 2 (Solving Linear Equations) - Class 9
DO $$
DECLARE
  v_topic_id int;
  v_chapter_id int;
BEGIN
  SELECT id INTO v_chapter_id FROM chapters WHERE class_level=9 AND chapter_num=5;
  SELECT id INTO v_topic_id   FROM topics   WHERE topic_code='CH5-T2';

  IF v_topic_id IS NOT NULL AND v_chapter_id IS NOT NULL THEN
    INSERT INTO questions (
      chapter_id, topic_id, class_level, chapter_num, question_num,
      question_type, difficulty, question_bn, question_latex,
      option_a, option_b, option_c, option_d, correct_option,
      answer_bn, steps_json
    ) VALUES
    (
      v_chapter_id, v_topic_id, 9, 5, 1,
      'mcq', 'easy',
      '2x + 5 = 11 হলে x = কত?',
      '2x + 5 = 11, x = ?',
      '2', '3', '4', '5',
      'B',
      '2x = 6, সুতরাং x = 3',
      '{
        "steps": [
          {"step_number":1,"instruction":"উভয় পাশ থেকে 5 বিয়োগ করো","working":"2x = 11 - 5 = 6","working_latex":"2x = 11 - 5 = 6","explanation":"সমীকরণের একপক্ষে x রাখতে হবে"},
          {"step_number":2,"instruction":"উভয় পাশকে 2 দিয়ে ভাগ করো","working":"x = 6 ÷ 2 = 3","working_latex":"x = \\\\frac{6}{2} = 3","explanation":"x এর মান বের করতে 2 দিয়ে ভাগ করো"}
        ],
        "final_answer": "x = 3",
        "final_answer_latex": "x = 3",
        "concept_summary": "সমীকরণ সমাধানে x কে একপক্ষে আনতে হয়"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 5, 2,
      'mcq', 'easy',
      '3x - 7 = 8 হলে x = কত?',
      '3x - 7 = 8, x = ?',
      '4', '5', '6', '3',
      'B',
      '3x = 15, সুতরাং x = 5',
      '{
        "steps": [
          {"step_number":1,"instruction":"উভয় পাশে 7 যোগ করো","working":"3x = 8 + 7 = 15","working_latex":"3x = 8 + 7 = 15","explanation":"বিয়োগ বাতিল করতে যোগ করো"},
          {"step_number":2,"instruction":"3 দিয়ে ভাগ করো","working":"x = 15 ÷ 3 = 5","working_latex":"x = \\\\frac{15}{3} = 5","explanation":"x এর মান পাওয়া গেল"}
        ],
        "final_answer": "x = 5",
        "final_answer_latex": "x = 5",
        "concept_summary": "যোগ বাতিল করতে বিয়োগ, বিয়োগ বাতিল করতে যোগ"
      }'::jsonb
    ),
    (
      v_chapter_id, v_topic_id, 9, 5, 3,
      'mcq', 'medium',
      '5(x - 2) = 3(x + 4) হলে x = কত?',
      '5(x-2) = 3(x+4), x = ?',
      '10', '11', '12', '13',
      'B',
      'x = 11',
      '{
        "steps": [
          {"step_number":1,"instruction":"উভয় পাশের বন্ধনী খোলো","working":"5x - 10 = 3x + 12","working_latex":"5x - 10 = 3x + 12","explanation":"বিতরণ নিয়ম প্রয়োগ করো"},
          {"step_number":2,"instruction":"x পদ একপাশে আনো","working":"5x - 3x = 12 + 10","working_latex":"5x - 3x = 12 + 10","explanation":"x পদ বামে, সংখ্যা ডানে"},
          {"step_number":3,"instruction":"হিসাব করো","working":"2x = 22 → x = 11","working_latex":"2x = 22 \\\\Rightarrow x = 11","explanation":"উভয় পক্ষকে 2 দিয়ে ভাগ"}
        ],
        "final_answer": "x = 11",
        "final_answer_latex": "x = 11",
        "concept_summary": "বন্ধনী খুলে সদৃশ পদ একসাথে করো"
      }'::jsonb
    )
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
