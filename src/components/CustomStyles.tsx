// src/components/CustomStyles.tsx
import React, { useEffect, useState } from 'react';

/**
 * Composant permettant d'injecter des styles CSS personnalisés
 * dynamiquement et de gérer les thèmes de l'application.
 */
const CustomStyles: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Détecter le thème actuel
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Observer les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Styles CSS spécifiques injectés dans le DOM
  return (
    <style jsx global>{`
      /* Variables globales dynamiques basées sur le thème */
      :root {
        --header-bg: ${theme === 'dark' ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
        --header-border: ${theme === 'dark' ? 'rgba(31, 41, 55, 0.3)' : 'rgba(229, 231, 235, 0.3)'};
        --sidebar-bg: ${theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(255, 255, 255)'};
        --sidebar-border: ${theme === 'dark' ? 'rgba(31, 41, 55, 0.5)' : 'rgba(229, 231, 235, 0.5)'};
        --card-bg: ${theme === 'dark' ? 'rgb(31, 41, 55)' : 'rgb(255, 255, 255)'};
        --card-border: ${theme === 'dark' ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'};
        --card-hover-shadow: ${theme === 'dark' 
          ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' 
          : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'};
      }
      
      /* Styles spécifiques pour le theme sombre */
      .dark .dashboard-header {
        background-color: var(--header-bg);
        border-color: var(--header-border);
        backdrop-filter: blur(16px);
      }
      
      /* Animations globales */
      .animate-slide-in-left {
        animation: slideInLeft 0.3s ease-out forwards;
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-slide-in-right {
        animation: slideInRight 0.3s ease-out forwards;
      }
      
      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      .animate-slide-in-top {
        animation: slideInTop 0.3s ease-out forwards;
      }
      
      @keyframes slideInTop {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-slide-in-bottom {
        animation: slideInBottom 0.3s ease-out forwards;
      }
      
      @keyframes slideInBottom {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Effets avancés pour l'UI */
      .glassmorphism {
        background: ${theme === 'dark' 
          ? 'rgba(31, 41, 55, 0.7)' 
          : 'rgba(255, 255, 255, 0.7)'};
        backdrop-filter: blur(8px);
        border: 1px solid ${theme === 'dark' 
          ? 'rgba(55, 65, 81, 0.3)' 
          : 'rgba(229, 231, 235, 0.5)'};
      }
      
      /* Effets de hover améliorés */
      .hover-lift {
        transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
      }
      
      .hover-lift:hover {
        transform: translateY(-4px);
        box-shadow: var(--card-hover-shadow);
      }
      
      /* Effet glow pour les éléments importants */
      .glow-on-hover:hover {
        box-shadow: 0 0 15px rgba(79, 70, 229, 0.4);
      }
      
      /* Gradients spécifiques */
      .gradient-primary {
        background: linear-gradient(135deg, #4663f5, #1672ff);
      }
      
      .gradient-secondary {
        background: linear-gradient(135deg, #1672ff, #9361fc);
      }
      
      .gradient-premium {
        background: linear-gradient(135deg, #9361fc, #4663f5);
      }
      
      /* Éléments spécifiques */
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: ${theme === 'dark' ? 'rgba(31, 41, 55, 0.2)' : 'rgba(229, 231, 235, 0.2)'};
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: ${theme === 'dark' ? 'rgba(55, 65, 81, 0.6)' : 'rgba(156, 163, 175, 0.6)'};
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${theme === 'dark' ? 'rgba(75, 85, 99, 0.8)' : 'rgba(107, 114, 128, 0.8)'};
      }
      
      /* Ajustements de focus pour meilleure accessibilité */
      *:focus-visible {
        outline: 2px solid rgb(79, 70, 229);
        outline-offset: 2px;
      }
      
      /* Animation d'arrière-plan subtile */
      .animated-bg {
        position: relative;
        overflow: hidden;
      }
      
      .animated-bg::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 60%);
        opacity: 0.4;
        animation: rotateBackground 20s linear infinite;
      }
      
      @keyframes rotateBackground {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  );
};

export default CustomStyles;