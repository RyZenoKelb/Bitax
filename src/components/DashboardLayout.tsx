// src/components/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  walletConnected?: boolean;
  walletAddress?: string;
  isPremiumUser?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  walletConnected = false,
  walletAddress = '',
  isPremiumUser = false
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Pour éviter les problèmes d'hydratation SSR/CSR
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Effet pour le fond
  useEffect(() => {
    // Ajouter les éléments visuels (glow effect)
    const createGlowEffect = () => {
      const container = document.createElement('div');
      container.className = 'fixed inset-0 overflow-hidden -z-10 pointer-events-none';
      
      // Premier élément glow (bleu-violet)
      const glow1 = document.createElement('div');
      glow1.className = 'absolute top-0 right-0 w-1/3 h-2/3 bg-gradient-to-b from-primary-900/30 to-transparent opacity-30 blur-3xl';
      
      // Deuxième élément glow (cyan)
      const glow2 = document.createElement('div');
      glow2.className = 'absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-t from-secondary-900/30 to-transparent opacity-30 blur-3xl';
      
      // Troisième élément glow (accent)
      const glow3 = document.createElement('div');
      glow3.className = 'absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-gradient-to-r from-accent-900/20 to-transparent opacity-20 blur-3xl';
      
      // Grille en arrière-plan
      const grid = document.createElement('div');
      grid.className = 'absolute inset-0 bg-[url("/grid.svg")] bg-repeat opacity-5';
      
      container.appendChild(glow1);
      container.appendChild(glow2);
      container.appendChild(glow3);
      container.appendChild(grid);
      
      // Ajouter au body ou à l'élément parent approprié
      const body = document.querySelector('body');
      if (body) {
        body.appendChild(container);
      }
      
      return () => {
        if (body && container) {
          body.removeChild(container);
        }
      };
    };
    
    const cleanup = createGlowEffect();
    
    return () => {
      cleanup();
    };
  }, [mounted]);
  
  if (!mounted) {
    // Afficher un squelette de chargement ou rien jusqu'à ce que le composant soit monté
    return null;
  }
  
  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Sidebar mobile */}
      <div 
        className={`fixed inset-0 z-40 md:hidden ${isMobileSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsMobileSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        <div 
          className="fixed inset-y-0 left-0 flex flex-col z-40 w-full max-w-xs transform transition ease-in-out duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <DashboardSidebar 
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            isPremiumUser={isPremiumUser}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />
        </div>
      </div>
      
      {/* Sidebar desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <DashboardSidebar 
            walletConnected={walletConnected}
            walletAddress={walletAddress}
            isPremiumUser={isPremiumUser}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header pour mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-4 py-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <h1 className="ml-2 text-lg font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight">BITAX</h1>
              </div>
            </div>
            
            {/* Wallet status pour mobile */}
            {walletConnected ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 px-2 py-1 bg-gray-800 rounded-md border border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300 truncate">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                </div>
              </div>
            ) : (
              <button className="py-1.5 px-3 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors">
                Connecter
              </button>
            )}
          </div>
        </div>
        
        {/* Main container */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </main>
      </div>
      
      {/* Effet visuel de particules / étoiles en arrière-plan */}
      <div className="stars-container fixed inset-0 pointer-events-none -z-10"></div>
    </div>
  );
};

export default DashboardLayout;