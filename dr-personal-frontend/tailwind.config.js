/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#222831',
        secondary: '#00ADB5',
        accent: '#393E46',
        light: '#EEEEEE',
        header: '#222831',
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
}