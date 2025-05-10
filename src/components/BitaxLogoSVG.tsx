<svg viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
  <!-- Gradient pour le logo -->
  <defs>
    <linearGradient id="bitaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0FF4C6" />
      <stop offset="50%" stop-color="#5E77FF" />
      <stop offset="100%" stop-color="#8456F0" />
    </linearGradient>
    
    <!-- Filtres pour les effets de lueur -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  
  <!-- Texte "BITAX" avec effet néon -->
  <text x="50%" y="50%" fill="url(#bitaxGradient)" font-family="'Orbitron', sans-serif" font-weight="700" font-size="40" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">BITAX</text>
  
  <!-- Icône symbolique (coin/graphique) -->
  <g transform="translate(15, 30) scale(0.6)">
    <polygon points="0,0 20,-20 40,0 20,20" fill="url(#bitaxGradient)" opacity="0.9" />
    <!-- Ligne de graphique stylisée -->
    <polyline points="-5,15 5,5 15,10 25,0 35,5 45,15" fill="none" stroke="url(#bitaxGradient)" stroke-width="3" stroke-linecap="round" />
  </g>
  
  <!-- Point d'accent lumineux -->
  <circle cx="150" cy="15" r="3" fill="#0FF4C6" opacity="0.8">
    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
  </circle>
</svg>