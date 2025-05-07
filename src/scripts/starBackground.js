// Fichier généré automatiquement
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
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    // Paramètres d'animation
    star.style.setProperty('--star-opacity', `${0.3 + Math.random() * 0.7}`);
    star.style.setProperty('--star-travel', `${-10 - Math.random() * 40}px`);
    star.style.animationDuration = `${3 + Math.random() * 7}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    
    // Ajouter au DOM
    starsContainer.appendChild(star);
  }
}

export default setupStarBackground;
