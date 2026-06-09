export const LEVEL_THRESHOLDS = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
  4000, 5000, 6200, 7600, 9200, 11000, 13200, 15700, 18500, 21600,
  25000, 29000, 33500, 38500, 44000, 50000, 56500, 63500, 71000, 79000,
]

export const CLASSES = [3, 4, 5, 6, 7, 8, 9, 10]

export const SUBJECTS = [
  { id: 'math',        title: 'Mathematics', titleBn: 'গণিত',           icon: '🧮', color: '#2D7A3A', bgColor: '#E8F5E9', active: true  },
  { id: 'physics',     title: 'Physics',     titleBn: 'পদার্থবিজ্ঞান', icon: '⚛️', color: '#1976D2', bgColor: '#E3F2FD', active: false },
  { id: 'chemistry',   title: 'Chemistry',   titleBn: 'রসায়ন',         icon: '🧪', color: '#7B1FA2', bgColor: '#F3E5F5', active: false },
  { id: 'higher-math', title: 'Higher Math', titleBn: 'উচ্চতর গণিত',  icon: '📈', color: '#E64A19', bgColor: '#FBE9E7', active: false },
]

export const ACHIEVEMENT_DEFS = [
  { id: 'first_correct', title: 'প্রথম সঠিক',    icon: '⭐', color: '#FFC107' },
  { id: 'streak_3',      title: '৩ দিন স্ট্রিক',  icon: '🔥', color: '#FF5722' },
  { id: 'chapter_done',  title: 'অধ্যায় সম্পন্ন', icon: '🏆', color: '#2D7A3A' },
  { id: 'speed_solver',  title: 'দ্রুত সমাধান',   icon: '⚡', color: '#9C27B0' },
]
