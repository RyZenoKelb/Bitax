// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Couleur principale - Style Bitax
        primary: {
          50: '#f0f4ff',
          100: '#dbe3fe',
          200: '#baccfd',
          300: '#8eabfc',
          400: '#6284f9',
          500: '#4663f5', // Violet-Bleu électrique - couleur de base
          600: '#3c4adc',
          700: '#3038bf',
          800: '#2c329a',
          900: '#1e234f',
        },
        // Couleur secondaire - Bleu électrique
        secondary: {
          50: '#edf8ff',
          100: '#d6efff',
          200: '#b3dfff',
          300: '#83c9ff',
          400: '#459fff',
          500: '#1672ff', // Bleu électrique
          600: '#0059ff',
          700: '#0049da',
          800: '#0840ad',
          900: '#0d3a85',
        },
        // Accent - Violet
        accent: {
          50: '#f3f1ff',
          100: '#ece5ff',
          200: '#dcd2ff',
          300: '#c6b2ff',
          400: '#ac8aff',
          500: '#9361fc', // Violet électrique
          600: '#813df7',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Fond sombre
        bitax: {
          'dark': '#09091b',       // Fond principal
          'dark-light': '#14152d', // Fond de carte
          'dark-lighter': '#1e1f47',// Éléments interactifs
          'card': '#14152a',       // Fond de carte
          'border': 'rgba(255, 255, 255, 0.06)',
          'button': '#2a2c57'
        },
      },
      backgroundImage: {
        'hero-pattern': "url('/grid.svg')",
        'dot-pattern': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232a50c6' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(70, 99, 245, 0.3), 0 0 30px rgba(70, 99, 245, 0.15)',
        'glow-secondary': '0 0 15px rgba(22, 114, 255, 0.3), 0 0 30px rgba(22, 114, 255, 0.15)',
        'glow-accent': '0 0 15px rgba(147, 97, 252, 0.3), 0 0 30px rgba(147, 97, 252, 0.15)',
      },
      keyframes: {
        floatingParticles: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(5px) translateX(-5px)' },
          '75%': { transform: 'translateY(10px) translateX(10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        floatingParticles: 'floatingParticles 15s infinite ease-in-out',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};