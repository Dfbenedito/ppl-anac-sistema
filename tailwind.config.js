/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aviation-blue': '#1E40AF',
        'aviation-light': '#3B82F6',
        'success': '#10B981',
        'danger': '#EF4444',
      },
    },
  },
  plugins: [],
}
