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
        primary: '#222831',
        secondary: '#00ADB5',
        accent: '#393E46',
        light: '#EEEEEE',
        
        // Dark theme colors
        'dark-primary': '#F5F5F5', // Light gray for text
        'dark-secondary': '#6D28D9', // Purple
        'dark-accent': '#8B5CF6', // Lighter purple
        'dark-bg-primary': '#1E1E1E', // Almost black
        'dark-bg-secondary': '#2D2D2D', // Dark gray
      },
    },
  },
  plugins: [],
}