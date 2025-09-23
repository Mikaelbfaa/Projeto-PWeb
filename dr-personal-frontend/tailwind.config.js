/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NOMES ORIGINAIS com VALORES DA NOVA PALETA "SLATE & AMBER"

        // Light theme colors
        primary: '#30371fff',        // Era: cinza escuro -> Agora: Ardósia escuro (texto principal)
        secondary: '#F59E0B',      // Era: turquesa -> Agora: Âmbar (destaque principal)
        accent: '#6B7280',         // Era: cinza médio -> Agora: Ardósia médio (texto secundário)
        light: '#F9FAFB',         // Era: cinza claro -> Agora: Fundo de página claro

        // Dark theme colors
        'dark-primary': '#E5E7EB',      // Era: cinza claro -> Agora: Texto principal claro
        'dark-secondary': '#F59E0B',    // Era: roxo -> Agora: Âmbar (destaque principal)
        'dark-accent': '#FBBF24',       // Era: roxo claro -> Agora: Âmbar claro (hover)
        'dark-bg-primary': '#111827',   // Era: quase preto -> Agora: Fundo de página escuro (Ardósia)
        'dark-bg-secondary': '#1F2937', // Era: cinza escuro -> Agora: Fundo de superfície escura (Cards)
      },
    },
  },
  plugins: [],
}