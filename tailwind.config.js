/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d8eeff',
          200: '#b9e0ff',
          300: '#89cbff',
          400: '#52acff',
          500: '#2b8aff',
          600: '#1468f5',
          700: '#0d51e1',
          800: '#1142b6',
          900: '#143b8f',
          950: '#102456',
        },
        surface: {
          light: '#ffffff',
          lightMuted: '#f8fafc',
          dark: '#0f172a',
          darkMuted: '#1e293b',
          darkCard: '#182234',
        },
        financial: {
          income: '#10b981', // emerald-500
          expense: '#f43f5e', // rose-500
          investment: '#8b5cf6', // violet-500
          savings: '#06b6d4', // cyan-500
          warning: '#f59e0b', // amber-500
          goal: '#3b82f6', // blue-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'glow-primary': '0 0 20px -5px rgba(43, 138, 255, 0.3)',
      }
    },
  },
  plugins: [],
}
