// src/scripts/starBackground.js
// Ce script crée et anime un fond étoilé pour toutes les pages Bitax

export function initStarBackground() {
    // Trouve ou crée le conteneur d'étoiles
    let starsContainer = document.querySelector('.stars-container');
    
    if (!starsContainer) {
      console.warn('Stars container not found. Make sure to add a div with class "stars-container" to your layout.');
      return;
    }
    
    // Vide le conteneur pour éviter les doublons
    starsContainer.innerHTML = '';
    
    // Paramètres de génération des étoiles
    const starCount = window.innerWidth < 768 ? 75 : 150; // Moins d'étoiles sur mobile
    const containerWidth = starsContainer.offsetWidth;
    const containerHeight = starsContainer.offsetHeight;
    
    // Types d'étoiles avec leurs probabilités
    const starTypes = [
      { class: 'star--tiny', prob: 0.5 },
      { class: 'star--small', prob: 0.3 },
      { class: 'star--medium', prob: 0.15 },
      { class: 'star--large', prob: 0.05 }
    ];
    
    // Fonction pour sélectionner un type d'étoile en fonction de la probabilité
    const selectStarType = () => {
      const rand = Math.random();
      let cumulativeProb = 0;
      
      for (const type of starTypes) {
        cumulativeProb += type.prob;
        if (rand < cumulativeProb) {
          return type.class;
        }
      }
      
      return starTypes[0].class;
    };
    
    // Générer les étoiles
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      
      // Classe de base pour toutes les étoiles
      star.classList.add('star');
      
      // Ajouter une classe spécifique selon le type d'étoile
      star.classList.add(selectStarType());
      
      // Positionner aléatoirement l'étoile
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Paramétrer l'animation
      star.style.setProperty('--star-opacity', `${0.3 + Math.random() * 0.7}`);
      star.style.setProperty('--star-travel', `${-10 - Math.random() * 40}px`);
      star.style.animationDuration = `${3 + Math.random() * 7}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      // Ajouter l'étoile au conteneur
      starsContainer.appendChild(star);
    }
  }
  
  // Regénérer les étoiles lors du redimensionnement de la fenêtre
  export function setupStarResizing() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      // Utiliser un debounce pour éviter trop d'appels pendant le redimensionnement
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initStarBackground();
      }, 200);
    });
  }
  
  // Fonction principale pour initialiser et configurer le fond étoilé
  export function setupStarBackground() {
    // Initialiser les étoiles
    initStarBackground();
    
    // Configurer la réponse au redimensionnement
    setupStarResizing();
    
    // Régénérer les étoiles toutes les 30 secondes pour un effet dynamique
    setInterval(() => {
      initStarBackground();
    }, 30000);
  }
  
  // Exporter une fonction d'initialisation par défaut
  export default setupStarBackground;