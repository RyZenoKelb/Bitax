// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '@/components/Sidebar';
import AuthProvider from '@/components/AuthProvider';

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Pages qui ne doivent pas avoir la sidebar
const publicPages = ['/', '/login', '/register', '/guide', '/pricing', '/tarifs', '/fonctionnalites', '/support'];

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Toujours en dark mode pour le style cyberpunk
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  
  // Vérifier si on est sur une page publique
  const isPublicPage = publicPages.some(page => router.pathname === page);

  // Toggle du thème (light/dark)
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
    // Initialiser avec un délai pour éviter le flash lors du chargement
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthProvider>
      <Head>
        <title>Bitax | Fiscalité crypto redéfinie</title>
        <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0D0B22" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta name="twitter:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta property="og:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:type" content="website" />
        
        {/* Ajout des polices explicitement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      
      <div className={`min-h-screen ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Effets de fond améliorés */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary-900/20 to-transparent opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-30 blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        </div>
        
        {/* Structure de l'application avec/sans sidebar selon la page */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar pour pages d'application (pas pour les pages publiques) */}
          {!isPublicPage && <Sidebar />}
          
          {/* Contenu principal */}
          <div className="flex flex-col flex-1 w-full overflow-hidden">
            {/* Header avec bouton de thème et profil uniquement pour les pages publiques */}
            {isPublicPage && (
              <header className={`backdrop-blur-xl ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} border-b ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} sticky top-0 z-50 transition-colors duration-300`}>
                <div className="container mx-auto px-4 py-3">
                  <div className="flex items-center justify-end">
                    {/* Bouton toggle thème */}
                    <button 
                      onClick={toggleTheme}
                      className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                      }`}
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </header>
            )}
            
            {/* Barre supérieure pour les pages de dashboard avec toggle de thème et profil */}
            {!isPublicPage && (
              <div className={`h-16 px-6 flex items-center justify-between border-b ${
                theme === 'dark' ? 'bg-gray-900/80 border-gray-800/30' : 'bg-white/90 border-gray-200/30'
              } backdrop-blur-xl transition-colors duration-300`}>
                {/* Titre de la page actuelle */}
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {router.pathname === '/dashboard' && 'Tableau de bord'}
                  {router.pathname === '/wallet' && 'Portefeuille'}
                  {router.pathname === '/transactions' && 'Transactions'}
                  {router.pathname === '/reports' && 'Rapports Fiscaux'}
                  {router.pathname === '/history' && 'Historique'}
                  {router.pathname === '/settings' && 'Paramètres'}
                  {router.pathname === '/support' && 'Support'}
                </h1>
                
                <div className="flex items-center space-x-3">
                  {/* Bouton toggle thème amélioré */}
                  <button 
                    onClick={toggleTheme}
                    className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Menu utilisateur */}
                  <div className="relative">
                    <button 
                      className={`flex items-center space-x-2 py-1.5 px-3 rounded-lg transition-all duration-200 ${
                        theme === 'dark'
                          ? 'hover:bg-gray-800 text-gray-300 border border-gray-800/40'
                          : 'hover:bg-gray-100 text-gray-700 border border-gray-200/80'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span className="font-medium hidden sm:inline">John Doe</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Notifications */}
                  <button 
                    className={`p-2.5 rounded-lg flex items-center justify-center transition-all duration-200 relative ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Contenu principal */}
            <main className="flex-grow overflow-auto p-6 transition-all duration-300">
              {isLoaded ? (
                <div className="transition-all duration-700 ease-out transform translate-y-0 opacity-100 max-w-7xl mx-auto">
                  <Component {...pageProps} />
                </div>
              ) : (
                <div className="opacity-0 translate-y-10 max-w-7xl mx-auto">
                  <Component {...pageProps} />
                </div>
              )}
            </main>
            
            {/* Footer pour les pages publiques uniquement */}
            {isPublicPage && (
              <footer className={`backdrop-blur-lg ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} border-t ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} py-8 transition-colors duration-300 relative z-10`}>
                <div className="container mx-auto px-6">
                  <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} mb-4 md:mb-0`}>
                      &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                    </p>
                    <div className="flex items-center space-x-6">
                      <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                        Mentions légales
                      </a>
                      <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                        Politique de confidentialité
                      </a>
                      <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                        Contact
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </div>
      </div>
    </AuthProvider>
  );
}