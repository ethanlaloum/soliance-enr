import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        desktop: '1440px',
      },
      fontFamily: {
        sans: ['var(--font-sans, "Bai Jamjuree")', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        night: { DEFAULT: 'rgb(var(--color-night, 11 17 32) / <alpha-value>)', soft: 'rgb(var(--color-night-soft, 22 33 58) / <alpha-value>)', line: 'rgb(var(--color-night-line, 58 74 99) / <alpha-value>)' },
        solar: { DEFAULT: 'rgb(var(--color-solar, 224 123 40) / <alpha-value>)', dark: 'rgb(var(--color-solar-dark, 184 95 23) / <alpha-value>)' },
        ivory: 'rgb(var(--color-ivory, 247 244 239) / <alpha-value>)',
        slate: { DEFAULT: 'rgb(var(--color-slate, 122 138 154) / <alpha-value>)', ink: 'rgb(var(--color-slate-ink, 85 98 112) / <alpha-value>)', text: 'rgb(var(--color-slate-text, 51 64 79) / <alpha-value>)', mist: 'rgb(var(--color-slate-mist, 143 154 166) / <alpha-value>)', light: 'rgb(var(--color-slate-light, 201 208 216) / <alpha-value>)' },
        sand: { line: 'rgb(var(--color-sand-line, 230 225 216) / <alpha-value>)', border: 'rgb(var(--color-sand-border, 213 207 196) / <alpha-value>)' },
        care: { DEFAULT: 'rgb(var(--color-care, 26 122 82) / <alpha-value>)', night: 'rgb(var(--color-care-night, 7 26 18) / <alpha-value>)', mint: 'rgb(var(--color-care-mint, 78 207 160) / <alpha-value>)' },
        heat: { DEFAULT: 'rgb(var(--color-heat, 10 77 162) / <alpha-value>)', surface: 'rgb(var(--color-heat-surface, 243 247 252) / <alpha-value>)', soft: 'rgb(var(--color-heat-soft, 230 238 248) / <alpha-value>)', sky: 'rgb(var(--color-heat-sky, 219 232 250) / <alpha-value>)', line: 'rgb(var(--color-heat-line, 215 228 244) / <alpha-value>)', mist: 'rgb(var(--color-heat-mist, 191 214 245) / <alpha-value>)' },
        charge: { DEFAULT: 'rgb(var(--color-charge, 18 140 79) / <alpha-value>)', dark: 'rgb(var(--color-charge-dark, 13 107 60) / <alpha-value>)', surface: 'rgb(var(--color-charge-surface, 233 247 239) / <alpha-value>)', soft: 'rgb(var(--color-charge-soft, 230 247 238) / <alpha-value>)', line: 'rgb(var(--color-charge-line, 207 233 219) / <alpha-value>)' },
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
