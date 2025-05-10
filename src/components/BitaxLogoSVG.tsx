// src/components/BitaxLogoSVG.tsx
import React from 'react';
import Link from 'next/link';

interface BitaxLogoSVGProps {
  collapsed?: boolean;
  isFooter?: boolean;
}

const BitaxLogoSVG: React.FC<BitaxLogoSVGProps> = ({ 
  collapsed = false, 
  isFooter = false 
}) => {
  // Ajustement de la taille en fonction du contexte
  const sizeClass = isFooter
    ? "h-8 w-auto" // Plus petit pour le footer
    : collapsed 
      ? "h-9 w-auto" // Taille quand la sidebar est repliée
      : "h-10 w-auto"; // Taille quand la sidebar est déployée
      
  // Conteneur avec meilleur centrage
  const containerClass = "flex justify-center items-center focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-all duration-300";

  return (
    <Link href="/" className={containerClass}>
      <svg 
        className={`${sizeClass} transition-all duration-300`}
        viewBox="0 0 200 60" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Définition des gradients et filtres */}
        <defs>
          <linearGradient id="bitaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0FF4C6" />
            <stop offset="50%" stopColor="#5E77FF" />
            <stop offset="100%" stopColor="#8456F0" />
          </linearGradient>
          
          {/* Filtre pour effet de lueur */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Texte "BITAX" avec effet néon */}
        <text 
          x="50%" 
          y="50%" 
          fill="url(#bitaxGradient)" 
          fontFamily="'Orbitron', sans-serif" 
          fontWeight="700" 
          fontSize="40" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          filter="url(#glow)"
        >
          BITAX
        </text>
        
        {/* Icône symbolique (coin/graphique) */}
        <g transform="translate(15, 30) scale(0.6)">
          <polygon 
            points="0,0 20,-20 40,0 20,20" 
            fill="url(#bitaxGradient)" 
            opacity="0.9"
          />
          {/* Ligne de graphique stylisée */}
          <polyline 
            points="-5,15 5,5 15,10 25,0 35,5 45,15" 
            fill="none" 
            stroke="url(#bitaxGradient)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
        </g>
        
        {/* Point d'accent lumineux animé */}
        <circle cx="150" cy="15" r="3" fill="#0FF4C6">
          <animate 
            attributeName="opacity" 
            values="0.3;0.8;0.3" 
            dur="3s" 
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </Link>
  );
};

export default BitaxLogoSVG;