/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0f172a',    // Deep sidebar
          blue: '#3b82f6',    // Primary buttons
          light: '#f8fafc',   // Background
        },
        status: {
          low: '#10b981',     // Emerald
          med: '#f59e0b',     // Amber
          high: '#ef4444',    // Red
        }
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}