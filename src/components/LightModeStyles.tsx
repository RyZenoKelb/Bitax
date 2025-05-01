// Créez un nouveau fichier appelé src/components/LightModeStyles.tsx
// Cette solution applique des styles directement dans les composants React

import React, { useEffect } from 'react';

/**
 * Composant qui applique des styles directement aux éléments clés en mode clair
 * Cette approche court-circuite complètement Tailwind pour les éléments problématiques
 */
const LightModeStyles: React.FC = () => {
  useEffect(() => {
    // Cette fonction s'exécutera côté client uniquement
    const applyStylesForLightMode = () => {
      // Observer les changements de classe sur html pour détecter le changement de thème
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            const htmlElement = document.documentElement;
            const isLightMode = !htmlElement.classList.contains('dark');
            
            if (isLightMode) {
              applyLightModeStyles();
            }
          }
        });
      });
      
      // Commencer l'observation
      observer.observe(document.documentElement, { attributes: true });
      
      // Appliquer les styles immédiatement aussi
      const isLightMode = !document.documentElement.classList.contains('dark');
      if (isLightMode) {
        applyLightModeStyles();
      }
      
      // Fonction pour appliquer les styles en mode clair
      function applyLightModeStyles() {
        // 1. Corriger les boutons de blockchain (ETH, Polygon, etc.)
        document.querySelectorAll('button').forEach(btn => {
          const text = btn.textContent?.trim().toLowerCase();
          if (['eth', 'polygon', 'arbitrum', 'optimism', 'base'].includes(text || '')) {
            Object.assign(btn.style, {
              backgroundColor: '#e2e8f0',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              fontWeight: '500',
              opacity: '1',
              visibility: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            });
          }
        });
        
        // 2. Corriger le bouton "Scanner ETH"
        document.querySelectorAll('button').forEach(btn => {
          if (btn.textContent?.includes('Scanner ETH') || 
              btn.textContent?.includes('Scan automatique')) {
            Object.assign(btn.style, {
              backgroundColor: '#4f46e5',
              color: 'white',
              border: '1px solid #4338ca',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
              fontWeight: '600',
              opacity: '1',
              visibility: 'visible',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            });
          }
        });
        
        // 3. Corriger le titre "Tableau de bord fiscal"
        document.querySelectorAll('h1').forEach(heading => {
          if (heading.textContent?.includes('Tableau de bord fiscal')) {
            Object.assign(heading.style, {
              color: '#0f172a',
              fontFamily: 'Orbitron, "Plus Jakarta Sans", sans-serif',
              fontWeight: '800',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              opacity: '1',
              visibility: 'visible'
            });
          }
        });
        
        // 4. Corriger l'icône de thème (lune)
        document.querySelectorAll('button[aria-label="Toggle theme"]').forEach(btn => {
          Object.assign(btn.style, {
            backgroundColor: '#e2e8f0',
            border: '1px solid #cbd5e1',
            opacity: '1',
            visibility: 'visible'
          });
          
          // Trouver l'icône SVG à l'intérieur
          const svg = btn.querySelector('svg');
          if (svg) {
            Object.assign(svg.style, {
              color: '#0f172a',
              strokeWidth: '2.5px',
              opacity: '1',
              visibility: 'visible'
            });
          }
        });
      }
    };

    // Exécuter uniquement côté client
    if (typeof window !== 'undefined') {
      applyStylesForLightMode();
    }

    // Nettoyer
    return () => {
      // Rien à nettoyer
    };
  }, []);

  return null; // Ce composant ne rend rien visuellement
};

export default LightModeStyles;