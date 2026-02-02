/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        bg: {
          main: '#0f172a',
          surface: '#1e293b',
          lighter: '#334155',
        },
        text: {
          main: '#f8fafc',
          muted: '#94a3b8',
          dim: '#64748b',
        },
        accent: {
          success: '#10b981',
          error: '#f43f5e',
          warning: '#f59e0b',
        }
      },
      borderRadius: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'premium': '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
