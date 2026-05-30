/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14213d',
        steel: '#475569',
        accent: '#f97316',
        panel: '#f8fafc',
        line: '#dbe4ee',
      },
      boxShadow: {
        sheet: '0 24px 60px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
