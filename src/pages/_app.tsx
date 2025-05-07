// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomStyles from '@/components/CustomStyles';
import AuthProvider from '@/components/AuthProvider';

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo SVG moderne
const BitaxLogo = ({ collapsed = false }) => {
  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'}`}>
      <div className="flex items-center">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-lg transform rotate-3 opacity-70"></div>
          <div className="absolute inset-0 bg-dark dark:bg-gray-900 rounded-lg flex items-center justify-center transform -rotate-3 border border-gray-700 dark:border-gray-800">
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">B</span>
          </div>
        </div>
        
        {!collapsed && (
          <div className="ml-3">
            <span className="text-xl font-semibold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400">BITAX</span>
            <span className="block text-xs text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // Navigation links avec icônes modern
  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    }
  ];

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
    
    // Vérifier si la sidebar était réduite précédemment
    const collapsedState = localStorage.getItem('bitax-sidebar-collapsed');
    if (collapsedState) {
      setSidebarCollapsed(collapsedState === 'true');
    }
    
    // Vérifier si on est sur mobile pour adapter l'interface
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => window.removeEventListener('resize', handleResize);
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
  
  // Fonction pour gérer le collapse de la sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('bitax-sidebar-collapsed', String(newState));
      return newState;
    });
  };

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  return (
    <AuthProvider>
      <Head>
        <title>Bitax | Fiscalité crypto redéfinie</title>
        <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0F172A" />
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
      
      <div className={`min-h-screen flex ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* SIDEBAR - Nouvelle version moderne */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'w-16' : 'w-64'} 
            bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/30
            dark:bg-gray-900/95 dark:border-gray-800/30
            light:bg-white/95 light:border-gray-200/30`}
        >
          {/* Logo et toggle sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800/30 dark:border-gray-800/30 light:border-gray-200/30">
            <BitaxLogo collapsed={sidebarCollapsed} />
            
            {!sidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {sidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="absolute -right-3 top-9 bg-primary-600 text-white rounded-full p-1 shadow-lg border border-primary-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="px-2 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-start'} px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                    ${router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/') 
                      ? 'bg-primary-900/50 text-white border-l-2 border-primary-500' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'}`}
                >
                  <div className={`${router.pathname === link.href ? 'text-primary-400' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                    {link.icon}
                  </div>
                  
                  {!sidebarCollapsed && (
                    <span className="ml-3 transition-opacity">{link.name}</span>
                  )}
                  
                  {sidebarCollapsed && (
                    <span className="absolute left-full ml-6 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap">
                      {link.name}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* User profile section */}
          <div className={`p-4 border-t border-gray-800/30 dark:border-gray-800/30 light:border-gray-200/30 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative group flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
              )}
              
              {sidebarCollapsed && (
                <span className="absolute left-full ml-6 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap min:w-max">
                  John Doe<br/>john@example.com
                </span>
              )}
            </button>
            
            {!sidebarCollapsed && (
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </aside>
        
        {/* Menu user dropdown */}
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
          <div className={`fixed bottom-4 ${sidebarCollapsed ? 'left-16' : 'left-64'} z-50 mt-2 w-56 rounded-xl overflow-hidden shadow-lg py-1
            bg-gray-800 border border-gray-700
            dark:bg-gray-800 dark:border-gray-700
            light:bg-white light:border-gray-200`}
          >
            <div className="border-b border-gray-700 dark:border-gray-700 light:border-gray-200 pb-2 pt-2 px-4 mb-1">
              <p className="text-sm font-medium text-white dark:text-white light:text-gray-900">Mon compte Bitax</p>
              <p className="text-xs text-gray-400">john.doe@example.com</p>
            </div>
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres
            </Link>
            <div className="border-t border-gray-700 dark:border-gray-700 light:border-gray-200 my-1"></div>
            <Link 
              href="/logout" 
              className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300 light:text-red-600 light:hover:bg-gray-100 light:hover:text-red-700 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Link>
          </div>
        </Transition>
        
        {/* Mobile menu button */}
        <div className="fixed top-4 right-4 md:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-900/90 text-gray-400 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu overlay */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </Transition>
        
        {/* Mobile sidebar */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition duration-300 ease-out transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-200 ease-in transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 overflow-hidden md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <BitaxLogo collapsed={false} />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="px-2 pt-5 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/') 
                      ? 'bg-primary-900/50 text-white border-l-2 border-primary-500' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`${router.pathname === link.href ? 'text-primary-400' : 'text-gray-400'}`}>
                    {link.icon}
                  </div>
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="ml-auto p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </Transition>
        
        {/* Main content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          {/* Background effects améliorés */}
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Gradient orbs animés */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-t from-secondary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            
            {/* Grille stylisée */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.02]"></div>
            
            {/* Particules/étoiles */}
            <div className="stars-container absolute inset-0"></div>
            
            {/* Vagues subtiles animées en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  className="fill-primary-800/10 dark:fill-primary-400/5 light:fill-primary-900/5"
                ></path>
                <path 
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  className="fill-secondary-800/10 dark:fill-secondary-400/5 light:fill-secondary-900/5" 
                  style={{ animationDelay: '-2s' }}
                ></path>
              </svg>
            </div>
          </div>
          
          {/* Contenu principal avec animation d'entrée */}
          <main className="flex-grow py-6 px-4 sm:px-6 md:px-8 transition-all duration-300 relative">
            <div className="max-w-7xl mx-auto relative z-10">
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
          
          {/* Footer modernisé */}
          <footer className="relative z-10 border-t border-gray-800/30 dark:border-gray-800/30 light:border-gray-200/30 py-6 backdrop-blur-md bg-gray-900/40 dark:bg-gray-900/40 light:bg-white/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <BitaxLogo collapsed={false} />
                  <p className="mt-4 text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 max-w-md">
                    Simplifiez votre fiscalité crypto avec notre plateforme spécialisée. Calculs automatisés, conformité légale et rapports détaillés.
                  </p>
                  <div className="flex space-x-4 mt-6">
                    {[
                      { name: 'Twitter', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg> },
                      { name: 'GitHub', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg> },
                      { name: 'Discord', icon: <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg> },
                    ].map((item, index) => (
                      <a 
                        key={index}
                        href="#" 
                        className="p-2 rounded-full text-gray-400 hover:text-primary-400 hover:bg-gray-800/40 transition-colors dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800/40 light:text-gray-500 light:hover:text-primary-600 light:hover:bg-gray-200/50"
                        aria-label={item.name}
                      >
                        {item.icon}
                      </a>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-white dark:text-white light:text-gray-900 tracking-wider uppercase mb-4">Navigation</h3>
                  <ul className="space-y-3">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors dark:text-gray-400 dark:hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-white dark:text-white light:text-gray-900 tracking-wider uppercase mb-4">Légal</h3>
                  <ul className="space-y-3">
                    {[
                      { name: "Conditions d'utilisation", href: "#" },
                      { name: "Politique de confidentialité", href: "#" },
                      { name: "Mentions légales", href: "#" },
                      { name: "Cookies", href: "#" }
                    ].map((item, index) => (
                      <li key={index}>
                        <a href={item.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors dark:text-gray-400 dark:hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600">
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-800/30 dark:border-gray-800/30 light:border-gray-200/30">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <p className="text-sm text-gray-400 dark:text-gray-500 light:text-gray-600 mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                  </p>
                  <div className="flex items-center">
                    <button
                      onClick={toggleTheme}
                      className="ml-4 p-2 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-gray-800/40 transition-colors dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-gray-800/40 light:text-gray-500 light:hover:text-primary-600 light:hover:bg-gray-200/50"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AuthProvider>
  );
}