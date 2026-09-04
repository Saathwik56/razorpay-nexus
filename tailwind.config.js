/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        razorpay: {
          blue: '#02042b',
          navy: '#0b192c',
          accent: '#0070f3',
          cyan: '#00d2ff',
          emerald: '#10b981',
          gold: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6',
          darkBg: '#050b14',
          cardBg: '#0d1527',
          borderColor: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
