import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        desktop: '1440px',
      },
      fontFamily: {
        sans: ['"Bai Jamjuree"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        night: { DEFAULT: '#0B1120', soft: '#16213a', line: '#3a4a63' },
        solar: { DEFAULT: '#E07B28', dark: '#b85f17' },
        ivory: '#F7F4EF',
        slate: { DEFAULT: '#7A8A9A', ink: '#556270', text: '#33404f', mist: '#8f9aa6', light: '#c9d0d8' },
        sand: { line: '#e6e1d8', border: '#d5cfc4' },
        care: { DEFAULT: '#1A7A52', night: '#071A12', mint: '#4ECFA0' },
        heat: { DEFAULT: '#0A4DA2', surface: '#F3F7FC', soft: '#e6eef8', sky: '#dbe8fa', line: '#d7e4f4', mist: '#bfd6f5' },
        charge: { DEFAULT: '#128C4F', dark: '#0d6b3c', surface: '#E9F7EF', soft: '#e6f7ee', line: '#cfe9db' },
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'none' },
        },
        'zoom-in': {
          from: { opacity: '0', transform: 'scale(1.03)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'zoom-in': 'zoom-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        lift: '0 2px 4px rgba(11,17,32,0.06), 0 24px 48px rgba(11,17,32,0.14)',
        card: '0 1px 2px rgba(11,17,32,0.05), 0 12px 32px rgba(11,17,32,0.08)',
        hero: '0 30px 70px rgba(0,0,0,0.4)',
        float: '0 20px 50px rgba(0,0,0,0.35)',
        soft: '0 10px 30px rgba(11,17,32,0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
