'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import AnimatedBackground from './AnimatedBackground';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Déterminer le variant de fond d'écran en fonction du chemin
  const getBackgroundVariant = () => {
    if (pathname?.includes('/dashboard')) {
      return 'dashboard';
    }
    if (pathname === '/' || pathname?.includes('/fonctionnalites') || pathname?.includes('/tarifs')) {
      return 'default';
    }
    return 'minimal';
  };
  
  // Détecter si on est sur une page de connexion/inscription
  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register');
  
  // Animation d'entrée
  useEffect(() => {
    setPageLoaded(true);
  }, []);
  
  return (
    <div className={`min-h-screen flex flex-col ${pageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Arrière-plan */}
      <AnimatedBackground variant={getBackgroundVariant()} />
      
      {/* Navbar (pas sur les pages d'authentification) */}
      <Navbar />
      
      {/* Contenu principal */}
      <main className={`flex-grow ${isAuthPage ? '' : 'main-content'}`}>
        <div className={`animate-fade-in ${isAuthPage ? '' : 'container mx-auto px-4 sm:px-6 lg:px-8'}`}>
          {children}
        </div>
      </main>
      
      {/* Footer (pas sur les pages d'authentification) */}
      <Footer />
    </div>
  );
};

export default Layout;