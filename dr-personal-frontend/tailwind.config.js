/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: '#262C77',
        secondary: '#4A54C5',
        accent: '#393E46',
        light: '#F8FAFC',
        
        // Dark theme colors
        'dark-primary': '#B0B3C5', // Lighter gray for text
        'dark-secondary': '#2E368F', // Dark blue
        'dark-accent': '#4A54C5', // Lighter blue
        'dark-bg-primary': '#0D0D0F', // Almost black
        'dark-bg-secondary': '#1A1C2C', // Darker blue
      },
    },
  },
  plugins: [],
}