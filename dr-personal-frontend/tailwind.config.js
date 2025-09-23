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
        primary: '#30371fff',        // Ardósia escuro (texto principal)
        secondary: '#F59E0B',       // Âmbar (destaque principal)
        accent: '#6B7280',         // Ardósia médio (texto secundário)
        light: '#f0f8ffff',       // Fundo principal claro (cinza super claro)

        // Dark theme colors
        'dark-primary': '#E5E7EB',          // Texto principal claro
        'dark-secondary': '#F59E0B',       // Âmbar (destaque principal)
        'dark-accent': '#FBBF24',         // Âmbar claro (hover)
        'dark-bg-primary': '#111827',    // Fundo de página escuro (Ardósia)
        'dark-bg-secondary': '#1F2937', //Fundo de superfície escura (Cards)
      },
    },
  },
  plugins: [],
}