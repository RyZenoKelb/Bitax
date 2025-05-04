import React, { ReactNode, useEffect } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // Créer des particules flottantes
  useEffect(() => {
    const createParticles = () => {
      const container = document.getElementById('particles-container');
      if (!container) return;
      
      // Nettoyer les particules existantes
      const existingParticles = container.querySelectorAll('.particle');
      existingParticles.forEach(particle => particle.remove());
      
      // Créer de nouvelles particules
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Position aléatoire
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Taille aléatoire
        const size = Math.random() * 5 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Délai d'animation aléatoire
        particle.style.animationDelay = `${Math.random() * 20}s`;
        
        // Durée d'animation aléatoire
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        
        // Opacité aléatoire
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        container.appendChild(particle);
      }
    };
    
    createParticles();
    
    // Recréer des particules périodiquement
    const intervalId = setInterval(createParticles, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden dashboard-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 ml-64 relative overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div id="particles-container" className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Les particules seront ajoutées ici par JS */}
          
          {/* Formes décoratives */}
          <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl opacity-5"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-600 filter blur-3xl opacity-5"></div>
          <div className="absolute -bottom-48 right-1/3 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl opacity-5"></div>
          
          {/* Motif en grille */}
          <div className="absolute inset-0 bg-grid"></div>
          
          {/* Lignes horizontales subtiles */}
          <div className="absolute inset-x-0 top-40 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
          <div className="absolute inset-x-0 top-80 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-40 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
        </div>
        
        {/* Conteneur du contenu avec défilement */}
        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 