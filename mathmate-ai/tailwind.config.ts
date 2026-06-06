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
        purple: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#4c1d95',
          950: '#2e1065',
        },
        deep: '#0E0628',
        brand: {
          primary:   '#7C3AED',
          secondary: '#9333EA',
          light:     '#EDE9FE',
          dark:      '#5B21B6',
          deep:      '#0E0628',
        },
      },
      animation: {
        'fade-up':    'fadeUp 0.45s ease forwards',
        'scale-in':   'scaleIn 0.3s ease forwards',
        'bounce-in':  'bounceIn 0.6s ease forwards',
        'float':      'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'xp-pop':     'xpPop 1.5s ease forwards',
        'confetti':   'confettiFall 1.4s ease-in forwards',
        'slide-up':   'slideUp 0.3s ease forwards',
      },
      keyframes: {
        fadeUp:      { from: { opacity: '0', transform: 'translateY(22px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.88)' },      to: { opacity: '1', transform: 'scale(1)' } },
        bounceIn:    { '0%': { transform: 'scale(.3)', opacity: '0' }, '60%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        float:       { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGlow:   { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(124,58,237,0.6)' } },
        xpPop:       { '0%': { opacity: '1', transform: 'translateY(0) scale(1)' }, '100%': { opacity: '0', transform: 'translateY(-55px) scale(1.5)' } },
        confettiFall:{ '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' }, '100%': { transform: 'translateY(220px) rotate(740deg)', opacity: '0' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      maxWidth: { 'phone': '430px' },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #7C3AED, #9333EA)',
        'deep-gradient':   'linear-gradient(165deg, #1a0547 0%, #0E0628 55%, #220b5e 100%)',
      },
    },
  },
  plugins: [],
}
export default config
