import React, { ReactNode, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  walletAddress?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, walletAddress }) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black">
      {/* Barre de navigation supérieure */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md border-b border-gray-800/60 flex items-center justify-between px-4 py-2">
        <div className="flex items-center ml-16">
          <Link href="/" className="mr-8">
            <span className="text-xl font-bold text-white tracking-tight">
              BITAX
              <span className="block text-xs text-gray-400 -mt-1 font-normal">FISCALITÉ CRYPTO</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-white flex items-center px-3 py-2 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Dashboard
            </Link>
            <Link href="/guide" className="text-gray-400 hover:text-white flex items-center px-3 py-2 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Guide
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white flex items-center px-3 py-2 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Tarifs
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white flex items-center px-3 py-2 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Support
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center">
          {walletAddress && (
            <div className="hidden md:flex mr-4 items-center bg-gray-800/70 backdrop-blur-sm p-1.5 px-3 rounded-full border border-gray-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-xs font-medium text-gray-300 mr-1.5">Wallet:</span>
              <span className="text-xs font-mono text-white bg-gray-700/70 py-0.5 px-2 rounded">
                {walletAddress && walletAddress.length > 10
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                  : walletAddress || '0x000...0000'}
              </span>
            </div>
          )}
          
          <div className="relative group">
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                BX
              </div>
            </button>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-3 border-b border-gray-700">
                <p className="font-medium text-white">Mon compte</p>
                <p className="text-xs text-gray-400">Premium</p>
              </div>
              <div className="p-2">
                <Link href="/settings" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
                  Paramètres
                </Link>
                <Link href="/logout" className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded">
                  Déconnexion
                </Link>
              </div>
            </div>
          </div>
          
          <button className="ml-3 p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </div>
      </header>
      
      <div className="flex h-screen pt-14">
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
    </div>
  );
};

export default DashboardLayout; 