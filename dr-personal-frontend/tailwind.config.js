/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#E38B29',
        secondary: '#F1A661',
        accent: '#FFD8A9',
        light: '#FFFFFF',
        header: '#65451F',
        background: '#FDEEDC',
      },
    },
  },
  plugins: [],
}