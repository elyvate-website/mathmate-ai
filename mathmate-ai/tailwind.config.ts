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
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        nunito:  ['Plus Jakarta Sans', 'sans-serif'], // alias so old refs still work
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
        gold: { DEFAULT: '#FFC107', light: '#FFD54F', dark: '#FF8F00' },
        ninja: {
          dark:   '#1A1A1A',
          card:   '#FFFFFF',
          gray:   '#F5F5F5',
          border: '#EFEFEF',
          muted:  '#9E9E9E',
          text:   '#1A1A1A',
        },
      },
      animation: {
        'fade-up':      'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards',
        'scale-in':     'scaleIn 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'bounce-in':    'bounceIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards',
        'float':        'float 3.2s ease-in-out infinite',
        'slide-up':     'fadeUp 0.3s ease forwards',
        'xp-pop':       'xpPop 1.5s ease forwards',
        'confetti':     'confettiFall 1.5s ease-in forwards',
        'pulse-ring':   'pulseRing 2s ease-in-out infinite',
        'shake':        'wrongShake 0.4s ease',
        'correct-flash':'correctFlash 0.45s ease forwards',
        'slide-right':  'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) forwards',
        'combo':        'comboToast 2s ease forwards',
        'stroke-draw':  'strokeDraw 1s ease forwards',
        'reward-pop':   'rewardPop 0.5s cubic-bezier(0.22,1,0.36,1) both',
        'page-enter':   'pageEnter 0.32s cubic-bezier(0.22,1,0.36,1) both',
        'nav-bounce':   'navBounce 0.35s ease',
      },
      maxWidth: { phone: '430px' },
      backgroundImage: {
        'ninja-green': 'linear-gradient(135deg,#2D7A3A,#3DAE4F)',
        'ninja-dark':  'linear-gradient(165deg,#1A1A1A,#2D2D2D)',
        'gold-grad':   'linear-gradient(135deg,#FFC107,#FF8F00)',
        'green-soft':  'linear-gradient(180deg,#E8F5E9 0%,#FFFFFF 60%)',
        'celebrate':   'linear-gradient(165deg,#1B5E20,#2D7A3A)',
      },
    },
  },
  plugins: [],
}
export default config
