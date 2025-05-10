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
  // Meilleure gestion des tailles selon le contexte
  const width = isFooter 
    ? 100 
    : collapsed 
      ? 48  // Logo plus compact mais toujours lisible quand sidebar repliée
      : 140; // Taille normale quand sidebar déployée
      
  // Version simplifiée quand sidebar repliée pour meilleure lisibilité
  const simpleVersion = collapsed && !isFooter;
  
  // Classes de conteneur améliorées avec centrage optimal
  const containerClass = "flex items-center justify-center w-full py-2 focus:outline-none transition-all duration-300";
  
  return (
    <Link href="/" className={containerClass}>
      <div className="flex items-center justify-center w-full">
        <svg 
          width={width}
          height={width * 0.4} // Ratio hauteur/largeur maintenu
          viewBox={simpleVersion ? "0 0 70 60" : "0 0 200 60"} 
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300"
        >
          {/* Définition des gradients et filtres améliorés */}
          <defs>
            <linearGradient id="bitaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0FF4C6" />
              <stop offset="50%" stopColor="#5E77FF" />
              <stop offset="100%" stopColor="#8456F0" />
            </linearGradient>
            
            {/* Filtre pour effet de lueur amélioré */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {simpleVersion ? (
            // Version simplifiée pour sidebar repliée - juste "B" avec icône
            <>
              {/* Lettre "B" plus grande */}
              <text 
                x="35" 
                y="35" 
                fill="url(#bitaxGradient)" 
                fontFamily="'Orbitron', sans-serif" 
                fontWeight="700" 
                fontSize="40" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                filter="url(#glow)"
              >
                B
              </text>
              
              {/* Icône symbolique réduite */}
              <g transform="translate(26, 35) scale(0.3)">
                <polygon 
                  points="0,0 20,-20 40,0 20,20" 
                  fill="url(#bitaxGradient)" 
                  opacity="0.9"
                />
              </g>
            </>
          ) : (
            // Version complète
            <>
              {/* Texte "BITAX" avec effet néon amélioré */}
              <text 
                x="105" 
                y="35" 
                fill="url(#bitaxGradient)" 
                fontFamily="'Orbitron', sans-serif" 
                fontWeight="700" 
                fontSize="38" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                filter="url(#glow)"
                letterSpacing="2"
              >
                BITAX
              </text>
              
              {/* Icône symbolique (coin/graphique) - repositionnée pour centrage */}
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
              
              {/* Point d'accent lumineux animé amélioré */}
              <circle cx="165" cy="15" r="3" fill="#0FF4C6">
                <animate 
                  attributeName="opacity" 
                  values="0.3;0.7;0.3" 
                  dur="3s" 
                  repeatCount="indefinite"
                />
              </circle>
            </>
          )}
        </svg>
      </div>
    </Link>
  );
};

export default BitaxLogoSVG;