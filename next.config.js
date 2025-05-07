/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

// Fonction pour copier le script de fond étoilé dans le dossier public
const copyStarBackgroundScript = () => {
  const sourceDir = path.join(__dirname, 'src', 'scripts');
  const destDir = path.join(__dirname, 'public', 'scripts');
  
  // Créer le dossier de destination s'il n'existe pas
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // S'assurer que le dossier source existe
  if (!fs.existsSync(sourceDir)) {
    fs.mkdirSync(sourceDir, { recursive: true });
  }
  
  // Chemin complet vers le fichier source
  const sourceFile = path.join(sourceDir, 'starBackground.js');
  
  // Si le fichier source n'existe pas, le créer avec le contenu de base
  if (!fs.existsSync(sourceFile)) {
    const basicScript = `// Fichier généré automatiquement
export function setupStarBackground() {
  const starsContainer = document.querySelector('.stars-container');
  if (!starsContainer) return;
  
  // Vider le conteneur
  starsContainer.innerHTML = '';
  
  // Générer 150 étoiles
  for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    
    // Déterminer la taille de l'étoile
    const size = Math.random();
    if (size < 0.5) star.classList.add('star--tiny');
    else if (size < 0.8) star.classList.add('star--small');
    else if (size < 0.95) star.classList.add('star--medium');
    else star.classList.add('star--large');
    
    // Positionner aléatoirement
    star.style.left = \`\${Math.random() * 100}%\`;
    star.style.top = \`\${Math.random() * 100}%\`;
    
    // Paramètres d'animation
    star.style.setProperty('--star-opacity', \`\${0.3 + Math.random() * 0.7}\`);
    star.style.setProperty('--star-travel', \`\${-10 - Math.random() * 40}px\`);
    star.style.animationDuration = \`\${3 + Math.random() * 7}s\`;
    star.style.animationDelay = \`\${Math.random() * 5}s\`;
    
    // Ajouter au DOM
    starsContainer.appendChild(star);
  }
}

export default setupStarBackground;
`;
    fs.writeFileSync(sourceFile, basicScript);
  }
  
  // Copier le fichier vers la destination
  const destFile = path.join(destDir, 'starBackground.js');
  fs.copyFileSync(sourceFile, destFile);
  
  console.log('✅ Script starBackground.js copié dans le dossier public/scripts');
};

// Exécuter la copie au démarrage
copyStarBackgroundScript();

const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure le webpack loader pour le CSS
      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      });
    }
    return config;
  },
};

module.exports = nextConfig;