// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomStyles from '@/components/CustomStyles';
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

// Logo SVG amélioré avec style futuriste
const BitaxLogo = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {
  const textColor = isDarkMode ? 'white' : 'black';

  return (
    <div className="flex items-center">
      <div className="flex flex-col">
        <span className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight">BITAX</span>
        <span className="text-xs text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark'); // Toujours en dark mode pour le style cyberpunk
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  
  // Vérifier si on est sur la page dashboard
  const isDashboardPage = router.pathname === '/dashboard' || router.pathname.startsWith('/dashboard/');

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

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    // Fermer la sidebar sur mobile lors d'un changement de route
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [router.pathname]);

  // Ouvrir la sidebar par défaut sur desktop pour les pages dashboard
  useEffect(() => {
    if (isDashboardPage && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, [isDashboardPage]);

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { name: 'Guide', href: '/guide', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { name: 'Tarifs', href: '/pricing', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { name: 'Support', href: '/support', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )}
  ];

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
      
      {/* Inclusion du composant CustomStyles qui injectera nos styles prioritaires */}
      <CustomStyles />
      
      <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Effets de fond améliorés */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary-900/20 to-transparent opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-30 blur-3xl"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        </div>
        
        <div className="flex flex-col min-h-screen">
          {/* Si c'est la page dashboard, afficher la sidebar */}
          {isDashboardPage ? (
            <div className="flex flex-1">
              {/* Sidebar pour le dashboard */}
              <Sidebar 
                theme={theme} 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
              />
              
              {/* Contenu principal avec la navbar modifiée */}
              <div className="flex flex-col flex-1 md:ml-0">
                {/* Header simplifié pour le dashboard */}
                <header className={`backdrop-blur-xl ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} border-b ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} sticky top-0 z-40 transition-colors duration-300`}>
                  <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                      {/* Bouton menu sidebar sur mobile */}
                      <div className="flex items-center">
                        <button 
                          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                          className="p-2 mr-3 rounded-lg md:hidden"
                        >
                          <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                          </svg>
                        </button>
                        
                        {/* Logo version mobile */}
                        <Link href="/" className="md:hidden">
                          <BitaxLogo isDarkMode={theme === 'dark'} />
                        </Link>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {/* Menu utilisateur amélioré */}
                        <div className="relative">
                          <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
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
                            <span className="font-medium hidden sm:inline">Mon compte</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          <Transition
                            show={isUserMenuOpen}
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <div className={`absolute right-0 mt-2 w-56 rounded-xl overflow-hidden shadow-lg py-1 ${
                              theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                            }`}>
                              <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} pb-2 pt-2 px-4 mb-1`}>
                                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Mon compte Bitax</p>
                                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>john.doe@example.com</p>
                              </div>
                              <Link 
                                href="/profile" 
                                className={`block px-4 py-2 text-sm ${
                                  theme === 'dark' 
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                } flex items-center`}
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Mon profil
                              </Link>
                              <Link 
                                href="/profile" 
                                className={`block px-4 py-2 text-sm ${
                                  theme === 'dark' 
                                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                } flex items-center`}
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Paramètres
                              </Link>
                              <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} my-1`}></div>
                              <Link 
                                href="/logout" 
                                className={`block px-4 py-2 text-sm ${
                                  theme === 'dark' 
                                    ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                                    : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                                } flex items-center`}
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Déconnexion
                              </Link>
                            </div>
                          </Transition>
                        </div>
                        
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
                          <div className="relative w-5 h-5">
                            <Transition
                              show={theme === 'dark'}
                              enter="transition-opacity duration-300"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition-opacity duration-300"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                            >
                              <div className="absolute inset-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                            </Transition>
                            <Transition
                              show={theme === 'light'}
                {/* Menu hamburger mobile amélioré */}
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`md:hidden p-2.5 rounded-lg ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  } transition-all duration-200`}
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Menu mobile amélioré avec transition */}
          <Transition
            show={isMenuOpen}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <div className={`px-4 pt-2 pb-4 space-y-1 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-lg border-b ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} md:hidden`}>
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/') 
                      ? theme === 'dark'
                        ? 'bg-gray-800 text-primary-400 border-l-2 border-primary-500'
                        : 'bg-gray-100 text-primary-700 border-l-2 border-primary-600'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
                <Link 
                  href="/profile" 
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Mon profil
                </Link>
                <Link 
                  href="/profile" 
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </Link>
                <Link 
                  href="/logout" 
                  className={`flex items-center px-3 py-2.5 rounded-lg ${
                    theme === 'dark'
                      ? 'text-red-400 hover:bg-gray-800 hover:text-red-300'
                      : 'text-red-600 hover:bg-gray-100 hover:text-red-700'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Déconnexion
                </Link>
              </div>
            </div>
          </Transition>
        </header>
        
        {/* Contenu principal avec animation d'entrée */}
        <main className="flex-grow py-6 px-4 sm:px-6 transition-all duration-300 relative">
          <div className="container mx-auto relative z-10">
            {isLoaded ? (
              <div className="transition-all duration-700 ease-out transform translate-y-0 opacity-100">
                <Component {...pageProps} />
              </div>
            ) : (
              <div className="opacity-0 translate-y-10">
                <Component {...pageProps} />
              </div>
            )}
          </div>
        </main>
        
        {/* Footer futuriste amélioré */}
        <footer className={`backdrop-blur-lg ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} border-t ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} py-8 transition-colors duration-300 relative z-10`}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <BitaxLogo isDarkMode={theme === 'dark'} />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  Révolutionnez votre fiscalité crypto avec notre plateforme dopée à l'IA. Analysez, visualisez, déclarez.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-primary-400' : 'bg-gray-100 text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-primary-400' : 'bg-gray-100 text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                    <span className="sr-only">GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-primary-400' : 'bg-gray-100 text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                    <span className="sr-only">Discord</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className={`text-lg font-display font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Navigation</h3>
                <ul className="space-y-2.5">
                  {navLinks.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className={`flex items-center text-sm ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-primary-400' 
                          : 'text-gray-600 hover:text-primary-600'
                      } transition-colors duration-300`}>
                        <span className="mr-2">{link.icon}</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className={`text-lg font-display font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Légal</h3>
                <ul className="space-y-2.5">
                  {[
                    { name: "Conditions d'utilisation", href: "#" },
                    { name: "Politique de confidentialité", href: "#" },
                    { name: "Mentions légales", href: "#" },
                    { name: "Cookies", href: "#" }
                  ].map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className={`text-sm ${
                        theme === 'dark' 
                          ? 'text-gray-400 hover:text-primary-400' 
                          : 'text-gray-600 hover:text-primary-600'
                      } transition-colors duration-300`}>
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className={`pt-6 border-t ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
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
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}