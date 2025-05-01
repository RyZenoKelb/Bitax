import React, { useEffect } from 'react';

/**
 * Composant qui injecte des styles CSS directement dans le DOM
 * Cette approche garantit que nos styles auront la priorité sur tous les autres
 */
const CustomStyles: React.FC = () => {
  useEffect(() => {
    // Créer un élément style
    const style = document.createElement('style');
    
    // Définir les styles avec une priorité maximale
    style.innerHTML = `
      /* STYLES POUR LE MODE CLAIR - CORRECTION DES PROBLÈMES DE VISIBILITÉ */
      
      /* 1. Forcer le contraste et la visibilité des titres */
      .light h1, 
      .light h1[class*="text-3xl"],
      .light h1[class*="font-bold"] {
        color: #0f172a !important;
        font-family: 'Orbitron', 'Plus Jakarta Sans', sans-serif !important;
        font-weight: 800 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
      }
      
      /* 2. Boutons de blockchain (ETH, Polygon, etc.) */
      .light button[class*="relative flex items-center justify-center px-3 py-2"],
      .light button[class*="bg-gray-100"] {
        background-color: #e2e8f0 !important;
        color: #1e293b !important;
        border: 1px solid #94a3b8 !important;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1) !important;
      }
      
      /* Bouton actif/sélectionné */
      .light button[class*="bg-bitax-primary-600"] {
        background-color: #4338ca !important;
        color: white !important;
        border: 1px solid #3730a3 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
      }
      
      /* 3. Bouton Scanner */
      .light button[class*="w-full mt-3 flex items-center justify-center"],
      .light button[class*="scanner"],
      .light button[class*="Scanner"] {
        background-color: #4f46e5 !important;
        color: white !important;
        border: 1px solid #4338ca !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
        opacity: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      /* 4. Scan automatique */
      .light button[class*="Scan automatique"] {
        background-color: #6366f1 !important;
        color: white !important;
        border: 1px solid #4f46e5 !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
      }
      
      /* 5. Icône de thème (soleil/lune) */
      .light button[aria-label="Toggle theme"],
      .light button[class*="p-2 rounded-full"] {
        background-color: #e2e8f0 !important;
        color: #0f172a !important;
        border: 1px solid #cbd5e1 !important;
      }
      
      .light button[aria-label="Toggle theme"] svg,
      .light button[class*="p-2 rounded-full"] svg,
      .light .relative.w-5.h-5 {
        color: #0f172a !important;
        stroke-width: 2.5px !important;
        opacity: 1 !important;
      }
      
      /* Forcer l'affichage de tous les éléments importants */
      .light .flex,
      .light .inline-flex,
      .light .grid,
      .light button,
      .light a,
      .light svg {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    
    // Ajouter l'élément style au head du document
    document.head.appendChild(style);
    
    // Nettoyer lors du démontage du composant
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return null; // Ce composant ne rend rien visuellement
};

export default CustomStyles;