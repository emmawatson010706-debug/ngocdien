/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        red:    { DEFAULT: '#B91C1C', dark: '#7F1D1D', light: '#FEE2E2' },
        gold:   { DEFAULT: '#C8942B', light: '#FEF3C7' },
        cream:  { DEFAULT: '#FEF9F2', dark: '#F3E8D8' },
        ink:    { DEFAULT: '#1C1C1C' },
      },
      fontFamily: {
        serif:   ['Merriweather', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans:    ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
