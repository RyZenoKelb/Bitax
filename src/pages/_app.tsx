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

// Logo SVG amélioré avec design premium
const BitaxLogo = ({ isDarkMode = true }: { isDarkMode?: boolean }) => {
  return (
    <div className="group flex items-center transition-transform duration-300 hover:scale-105">
      <div className="relative">
        {/* Logo icon */}
        <div className="w-8 h-8 rounded-lg overflow-hidden mr-3 bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <path 
              d="M20 80V40h20v40h-20zm30-40h20v40h-20V40zm30 0h20v20h-20V40z" 
              fill="currentColor" 
              className="opacity-90"
            />
            <rect x="15" y="20" width="70" height="6" rx="2" fill="currentColor" className="opacity-70"/>
          </svg>
        </div>
        
        {/* Text overlay */}
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-700 tracking-tight">
              BITAX
            </span>
            <span className="ml-1.5 px-1.5 py-0.5 text-xs font-medium text-primary-600 bg-primary-100 dark:bg-primary-900/40 dark:text-primary-400 rounded-md">
              Alpha
            </span>
          </div>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 -mt-0.5 font-medium tracking-[0.08em] uppercase">
            Fiscalité crypto française
          </span>
        </div>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // Toggle du thème
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
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
  }, [Component]);

  // Navigation links améliorés
  const navLinks = [
    { 
      name: 'Tableau de bord', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Comment ça marche', 
      href: '/guide', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Tarification', 
      href: '/pricing', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <AuthProvider>
      <Head>
        <title>Bitax | Fiscalité crypto simplifiée</title>
        <meta name="description" content="Bitax - La solution de référence pour la fiscalité crypto en France. Déclarez vos plus-values facilement avec notre plateforme intelligente." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0D0B22" />
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <CustomStyles />
      
      <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* Background premium */}
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-secondary-900/10 opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.08),transparent_70%)]"></div>
        </div>
        
        {/* Header premium */}
        <header 
          className={`fixed top-0 left-0 right-0 z-50 ${
            theme === 'dark' 
              ? 'bg-gray-900/70 border-gray-800/50' 
              : 'bg-white/70 border-gray-200/50'
          } backdrop-blur-xl border-b transition-all duration-500`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <BitaxLogo isDarkMode={theme === 'dark'} />
              </Link>
              
              {/* Desktop navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`group flex items-center px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      router.pathname === link.href
                        ? theme === 'dark'
                          ? 'text-primary-400 bg-primary-900/50 shadow-sm'
                          : 'text-primary-600 bg-primary-50 shadow-sm'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                ))}
              </nav>
              
              {/* Actions */}
              <div className="flex items-center space-x-3">
                {/* Theme toggle */}
                <button 
                  onClick={toggleTheme}
                  className={`relative p-2 rounded-lg inline-flex items-center justify-center transition-all duration-300 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle theme"
                >
                  <div className="relative w-5 h-5">
                    <Transition
                      show={theme === 'dark'}
                      enter="transition-all duration-300"
                      enterFrom="opacity-0 scale-0 rotate-45"
                      enterTo="opacity-100 scale-100 rotate-0"
                      leave="transition-all duration-300"
                      leaveFrom="opacity-100 scale-100 rotate-0"
                      leaveTo="opacity-0 scale-0 -rotate-45"
                    >
                      <svg className="absolute inset-0 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                    </Transition>
                    <Transition
                      show={theme === 'light'}
                      enter="transition-all duration-300"
                      enterFrom="opacity-0 scale-0 rotate-45"
                      enterTo="opacity-100 scale-100 rotate-0"
                      leave="transition-all duration-300"
                      leaveFrom="opacity-100 scale-100 rotate-0"
                      leaveTo="opacity-0 scale-0 -rotate-45"
                    >
                      <svg className="absolute inset-0 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </Transition>
                  </div>
                </button>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                      theme === 'dark'
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      JD
                    </div>
                    <span className={`hidden sm:block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      John Doe
                    </span>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <Transition
                    show={isUserMenuOpen}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 overflow-hidden ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                    }`}>
                      <div className={`px-4 py-3 border-b ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <p className={`text-sm font-medium ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          John Doe
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          john.doe@example.com
                        </p>
                      </div>
                      
                      {[
                        { 
                          name: 'Mon profil', 
                          href: '/profile', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )
                        },
                        { 
                          name: 'Paramètres', 
                          href: '/settings', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )
                        },
                        { 
                          name: 'Déconnexion', 
                          href: '/logout', 
                          icon: (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          )
                        }
                      ].map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className={`flex items-center px-4 py-2 text-sm ${
                            theme === 'dark'
                              ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          } transition-colors duration-150`}
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="mr-3 opacity-60">{item.icon}</span>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </Transition>
                </div>
                
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`lg:hidden p-2 rounded-lg ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-expanded={isMenuOpen}
                >
                  <span className="sr-only">Ouvrir le menu</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile menu */}
          <Transition
            show={isMenuOpen}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <div className={`lg:hidden border-t ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="px-2 pt-2 pb-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                      router.pathname === link.href
                        ? theme === 'dark'
                          ? 'text-primary-400 bg-primary-900/50'
                          : 'text-primary-600 bg-primary-50'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </Transition>
        </header>
        
        {/* Main content */}
        <main className={`pt-16 flex-grow transition-all duration-500 ${
          theme === 'dark' ? 'bg-transparent' : 'bg-gray-50'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoaded ? (
              <div className="animate-fade-in-up">
                <Component {...pageProps} />
              </div>
            ) : (
              <div className="opacity-0">
                <Component {...pageProps} />
              </div>
            )}
          </div>
        </main>
        
        {/* Footer premium */}
        <footer className={`mt-auto border-t transition-all duration-500 ${
          theme === 'dark' 
            ? 'bg-gray-900/50 border-gray-800/50' 
            : 'bg-white/50 border-gray-200/50'
        } backdrop-blur-sm`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Company info */}
              <div className="md:col-span-1">
                <BitaxLogo isDarkMode={theme === 'dark'} />
                <p className={`mt-4 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  La solution de référence pour la fiscalité crypto en France.
                </p>
                
                {/* Social links */}
                <div className="mt-6 flex space-x-4">
                  {[
                    { 
                      name: 'Twitter', 
                      href: '#',
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      )
                    },
                    { 
                      name: 'Discord', 
                      href: '#',
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                        </svg>
                      )
                    },
                    { 
                      name: 'GitHub', 
                      href: '#',
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      )
                    }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`inline-flex items-center justify-center p-2 rounded-lg ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="sr-only">{social.name}</span>
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Navigation links */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Navigation
                </h3>
                <ul className="mt-4 space-y-3">
                  {navLinks.map((link, index) => (
                    <li key={index}>
                      <Link 
                        href={link.href}
                        className={`text-sm ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-200' 
                            : 'text-gray-600 hover:text-gray-900'
                        } transition-colors duration-200`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Legal links */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Légal
                </h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { name: "Conditions d'utilisation", href: '#' },
                    { name: "Politique de confidentialité", href: '#' },
                    { name: "Mentions légales", href: '#' },
                    { name: "Cookies", href: '#' }
                  ].map((item, index) => (
                    <li key={index}>
                      <Link 
                        href={item.href}
                        className={`text-sm ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-gray-200' 
                            : 'text-gray-600 hover:text-gray-900'
                        } transition-colors duration-200`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  Contact
                </h3>
                <div className="mt-4 space-y-3">
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    support@bitax.fr
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="/support"
                      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        theme === 'dark'
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      Nous contacter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom bar */}
            <div className={`mt-12 pt-8 border-t ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                </p>
                <p className={`mt-4 sm:mt-0 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Fait avec ❤️ en France
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}