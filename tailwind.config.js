/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitax: {
          // Couleurs principales
          primary: {
            50: '#EEF6FF',
            100: '#D8EAFF', 
            200: '#BFDAFF',
            300: '#94C2FF',
            400: '#6AA6FF',
            500: '#4285F4',  // Bleu Google-like
            600: '#2B68D9',
            700: '#1D4EBF',
            800: '#173894',
            900: '#102A6A',
          },
          // Couleur secondaire/accent
          accent: {
            50: '#EDFBFA',
            100: '#D2F6F3',
            200: '#A8EDE7',
            300: '#75E0D7',
            400: '#3BCBC0',
            500: '#12B5A8',  // Turquoise vif
            600: '#0C9188',
            700: '#086F69',
            800: '#065751',
            900: '#043F3A',
          },
          // Couleur pour actions positives (gains, validations)
          success: {
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',  // Vert émeraude
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          // Couleur pour actions négatives (pertes, erreurs)
          danger: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',  // Rouge
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          // Couleur pour actions d'avertissement
          warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',  // Ambre
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          // Nuances de gris personnalisées
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            400: '#9CA3AF',
            500: '#6B7280',
            600: '#4B5563',
            700: '#374151',
            800: '#1F2937',
            900: '#111827',
          },
          // Couleur pour les éléments premium
          premium: {
            50: '#FFF6E5',
            100: '#FFEAC3',
            200: '#FFD88A',
            300: '#FFC651',
            400: '#FFB320',
            500: '#FF9900',  // Orange vif
            600: '#E67E00',
            700: '#CC6500',
            800: '#A34F00',
            900: '#7A3C00',
          },
          // Couleurs pour les graphiques
          chart: {
            blue: '#4285F4',
            red: '#EA4335',
            green: '#34A853',
            yellow: '#FBBC05',
            purple: '#9C27B0',
            cyan: '#00BCD4',
            pink: '#E91E63',
            orange: '#FF9900',
            lightBlue: '#03A9F4',
            teal: '#009688'
          }
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        dashboard: '0 0 20px rgba(0, 0, 0, 0.05)',
        modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'bitax-gradient': 'linear-gradient(135deg, #4285F4 0%, #12B5A8 100%)',
        'bitax-card': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        'premium-gradient': 'linear-gradient(135deg, #FF9900 0%, #E67E00 100%)',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Activez le mode sombre basé sur la classe
}