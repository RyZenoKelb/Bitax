// Solution radicale pour l'icône de thème: création d'un composant séparé
// src/components/ThemeToggleFixed.tsx

import React, { useState, useEffect } from 'react';

interface ThemeToggleFixedProps {
  onToggle: (theme: 'light' | 'dark') => void;
}

const ThemeToggleFixed: React.FC<ThemeToggleFixedProps> = ({ onToggle }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  
  // Initialiser le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setCurrentTheme('dark');
    } else {
      setCurrentTheme('light');
    }
  }, []);
  
  // Gérer le changement de thème
  const handleToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    onToggle(newTheme);
  };
  
  // Créer un élément HTML natif pour éviter les problèmes de style
  useEffect(() => {
    // Supprimer les boutons existants si présents
    const existingButtons = document.querySelectorAll('.theme-toggle-fixed');
    existingButtons.forEach(btn => btn.remove());
    
    // Créer un nouvel élément bouton
    const button = document.createElement('button');
    button.className = 'theme-toggle-fixed';
    button.setAttribute('aria-label', 'Toggle theme');
    button.style.position = 'fixed';
    button.style.top = '16px';
    button.style.right = '16px';
    button.style.width = '40px';
    button.style.height = '40px';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.zIndex = '9999';
    button.style.border = 'none';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    button.style.transition = 'background-color 0.3s ease';
    
    // Définir les styles en fonction du thème
    if (currentTheme === 'light') {
      button.style.backgroundColor = '#e2e8f0';
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #0f172a; stroke-width: 2;">
          <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    } else {
      button.style.backgroundColor = '#1e293b';
      button.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: white; stroke-width: 2;">
          <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
    
    // Ajouter un gestionnaire d'événement
    button.addEventListener('click', handleToggle);
    
    // Ajouter le bouton au corps du document
    document.body.appendChild(button);
    
    // Nettoyer
    return () => {
      button.removeEventListener('click', handleToggle);
      if (document.body.contains(button)) {
        document.body.removeChild(button);
      }
    };
  }, [currentTheme, handleToggle]);
  
  // Ce composant ne rend rien directement
  return null;
};

export default ThemeToggleFixed;