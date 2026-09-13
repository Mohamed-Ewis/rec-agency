import type { Config } from 'tailwindcss'

export default {
  content: [
    './app.vue',
    './components/**/*.{vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.ts',
    './plugins/**/*.ts'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          600: '#2563EB',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#172554'
        },
        cta: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          600: '#D97706',
          700: '#B45309'
        },
        ink: {
          DEFAULT: '#1E3A8A',
          muted: '#475569',
          faint: '#64748B'
        },
        canvas: '#F8FAFC'
      },
      fontFamily: {
        sans: ['Fira Sans', 'Segoe UI', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        sm: '0 1px 2px rgba(15, 23, 42, 0.05)',
        md: '0 4px 6px rgba(15, 23, 42, 0.08)',
        lg: '0 10px 15px rgba(15, 23, 42, 0.10)',
        xl: '0 20px 25px rgba(15, 23, 42, 0.12)'
      },
      maxWidth: {
        dashboard: '1400px'
      }
    }
  }
} satisfies Config
