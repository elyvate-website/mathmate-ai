import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
      },
      colors: {
        brand: {
          primary:   '#2D7A3A',
          secondary: '#3DAE4F',
          light:     '#E8F5E9',
          mid:       '#C8E6C9',
          dark:      '#1B5E20',
          bright:    '#4CAF50',
        },
        gold: {
          DEFAULT: '#FFC107',
          light:   '#FFD54F',
          dark:    '#FF8F00',
        },
        ninja: {
          dark:    '#1A1A1A',
          card:    '#FFFFFF',
          gray:    '#F5F5F5',
          border:  '#E8E8E8',
          muted:   '#9E9E9E',
          text:    '#212121',
        },
      },
      animation: {
        'fade-up':     'fadeUp 0.4s ease forwards',
        'scale-in':    'scaleIn 0.3s ease forwards',
        'bounce-in':   'bounceIn 0.5s ease forwards',
        'float':       'float 3s ease-in-out infinite',
        'slide-up':    'slideUp 0.3s ease forwards',
        'xp-pop':      'xpPop 1.5s ease forwards',
        'confetti':    'confettiFall 1.4s ease-in forwards',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'shake':       'shake 0.4s ease',
        'correct-flash': 'correctFlash 0.5s ease forwards',
      },
      keyframes: {
        fadeUp:      { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        bounceIn:    { '0%': { transform: 'scale(.3)', opacity: '0' }, '60%': { transform: 'scale(1.08)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        xpPop:       { '0%': { opacity: '1', transform: 'translateY(0) scale(1)' }, '100%': { opacity: '0', transform: 'translateY(-50px) scale(1.4)' } },
        confettiFall:{ '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(240px) rotate(720deg)', opacity: '0' } },
        pulseGreen:  { '0%,100%': { boxShadow: '0 0 0 0 rgba(45,122,58,0.3)' }, '50%': { boxShadow: '0 0 0 8px rgba(45,122,58,0)' } },
        shake:       { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-6px)' }, '75%': { transform: 'translateX(6px)' } },
        correctFlash:{ '0%': { background: '#fff' }, '50%': { background: '#DCFCE7' }, '100%': { background: '#F0FDF4' } },
      },
      maxWidth: { 'phone': '430px' },
      backgroundImage: {
        'ninja-green': 'linear-gradient(135deg, #2D7A3A, #3DAE4F)',
        'ninja-dark':  'linear-gradient(165deg, #1A1A1A, #2D2D2D)',
        'gold-grad':   'linear-gradient(135deg, #FFC107, #FF8F00)',
        'green-soft':  'linear-gradient(180deg, #E8F5E9 0%, #FFFFFF 60%)',
        'celebrate':   'linear-gradient(165deg, #1B5E20, #2D7A3A)',
      },
    },
  },
  plugins: [],
}
export default config
