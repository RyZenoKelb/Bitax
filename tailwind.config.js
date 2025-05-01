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
        // Couleur principale - Style Crypto Néon
        primary: {
          50: '#f0e7ff',
          100: '#e0cfff',
          200: '#c4a3ff',
          300: '#a571ff',
          400: '#9340ff',
          500: '#7B3FE4', // Violet électrique - couleur de base
          600: '#6A2DD1',
          700: '#5822B0',
          800: '#3e1980',
          900: '#2b1259',
        },
        // Couleur secondaire - Cyan électrique
        secondary: {
          50: '#e0fcff',
          100: '#bef8ff',
          200: '#8df1ff',
          300: '#56e8ff',
          400: '#29dfff',
          500: '#0EEAFF',
          600: '#00bfd2',
          700: '#0093a0',
          800: '#007180',
          900: '#00525c',
        },
        // Accent - Rose électrique
        accent: {
          50: '#fff0f5',
          100: '#ffe1eb',
          200: '#ffc2d7',
          300: '#ff94b8',
          400: '#ff5d90',
          500: '#FF3D71',
          600: '#eb1958',
          700: '#cc0e48',
          800: '#a90e40',
          900: '#8f123a',
        },
        // Succès - Vert néon
        success: {
          500: '#00E6C3',
        },
        // Avertissement - Orange vif
        warning: {
          500: '#FFB545',
        },
        // Erreur - Rouge néon
        danger: {
          500: '#FF3D55',
        },
        // Tons de gris modifiés pour un look plus futuriste
        gray: {
          50: '#F5F4FE',
          100: '#E7E6F5',
          200: '#D0CDE9',
          300: '#B6B3D6',
          400: '#9997C0',
          500: '#7C7AA3',
          600: '#5B598F',
          700: '#443F77',
          800: '#2D2A54',
          900: '#1A1742',
        },
        // Arrière-plans
        dark: '#0D0B22', // Bleu très foncé
        'dark-secondary': '#151339', // Bleu-violet foncé
      },
      boxShadow: {
        'card': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 12px 40px rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 12px rgba(123, 63, 228, 0.25)',
      },
      opacity: {
        '15': '0.15',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};