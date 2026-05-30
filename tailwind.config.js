/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      padding: {
        'safe': 'max(env(safe-area-inset-bottom), 0px)',
      },
      paddingTop: {
        'safe': 'max(env(safe-area-inset-top), 0px)',
      },
      paddingBottom: {
        'safe': 'max(env(safe-area-inset-bottom), 0px)',
      },
    },
  },
  plugins: [],
}
