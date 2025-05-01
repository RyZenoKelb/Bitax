import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo SVG amélioré avec style professionnel
const BitaxLogo = ({ isDarkMode = true }: { isDarkMode?: boolean }) => (
  <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill={isDarkMode ? "#1E224A" : "#3949AB"} />
    <path d="M13.3333 21.6667V11.6667L26.6667 20L13.3333 28.3333V21.6667Z" fill={isDarkMode ? "#0891B2" : "#22D3EE"} />
    <text x="50" y="25" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fontSize="22" fill={isDarkMode ? "#FFFFFF" : "#111827"}>BITAX</text>
    <text x="50" y="35" fontFamily="Inter, sans-serif" fontSize="10" fontWeight="500" fill={isDarkMode ? "#9CA3AF" : "#4B5563"}>Fiscalité crypto redéfinie</text>
  </svg>
);

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();

  // Toggle du thème (light/dark)
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      document.documentElement.classList.toggle('light', newTheme === 'light');
      return newTheme;
    });
  };

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
    // Initialiser avec un délai pour éviter le flash lors du chargement
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
      document.documentElement.classList.add('light');
    }
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [Component]);

  return (
    <>
      <Head>
        <title>Bitax | Fiscalité crypto redéfinie</title>
        <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={theme === 'dark' ? "#0f172a" : "#ffffff"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta name="twitter:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta property="og:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Effets de fond plus subtils */}
        <div className="bg-glow bg-glow-primary"></div>
        <div className="bg-glow bg-glow-secondary"></div>
        
        {/* Header avec navigation */}
        <header className="backdrop-blur-xl bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/90 border-b border-gray-800/50 light:border-gray-200/50 sticky top-0 z-50 transition-colors duration-300">
          <div className="container mx-auto py-3 px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <BitaxLogo isDarkMode={theme === 'dark'} />
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Navigation desktop */}
              <nav className="hidden md:flex space-x-1">
                <Link href="/" className={`nav-link ${
                  router.pathname === '/' 
                    ? 'nav-link-active' 
                    : ''
                }`}>
                  Dashboard
                </Link>
                <Link href="/guide" className={`nav-link ${
                  router.pathname === '/guide' 
                    ? 'nav-link-active' 
                    : ''
                }`}>
                  Guide
                </Link>
                <Link href="/pricing" className={`nav-link ${
                  router.pathname === '/pricing' 
                    ? 'nav-link-active' 
                    : ''
                }`}>
                  Tarifs
                </Link>
                <Link href="/support" className={`nav-link ${
                  router.pathname === '/support' 
                    ? 'nav-link-active' 
                    : ''
                }`}>
                  Support
                </Link>
              </nav>
              
              {/* Bouton toggle thème stylisé */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-400 hover:text-gray-300 light:hover:text-gray-700 focus:outline-none transition-colors duration-200"
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
              
              {/* Menu hamburger mobile avec effet plus sobre */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-300 light:hover:text-gray-700 focus:outline-none transition-colors duration-200"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Menu mobile avec transition */}
          <Transition
            as={Fragment}
            show={isMenuOpen}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 backdrop-blur-xl bg-gray-900/90 light:bg-white/90 border-b border-gray-800/50 light:border-gray-200/50 md:hidden">
              <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/' 
                  ? 'bg-primary-900/40 text-primary-300 light:bg-primary-100 light:text-primary-700' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900'
              }`}>
                Dashboard
              </Link>
              <Link href="/guide" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/guide' 
                  ? 'bg-primary-900/40 text-primary-300 light:bg-primary-100 light:text-primary-700' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900'
              }`}>
                Guide
              </Link>
              <Link href="/pricing" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/pricing' 
                  ? 'bg-primary-900/40 text-primary-300 light:bg-primary-100 light:text-primary-700' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900'
              }`}>
                Tarifs
              </Link>
              <Link href="/support" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/support' 
                  ? 'bg-primary-900/40 text-primary-300 light:bg-primary-100 light:text-primary-700' 
                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900'
              }`}>
                Support
              </Link>
            </div>
          </Transition>
        </header>
        
        {/* Contenu principal avec animation d'entrée */}
        <main className="flex-grow py-10 px-4 sm:px-6 transition-all duration-300 relative">
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
        
        {/* Footer professionnel */}
        <footer className="backdrop-blur-xl bg-gray-900/80 dark:bg-gray-900/80 light:bg-white/90 border-t border-gray-800/50 light:border-gray-200/50 py-8 transition-colors duration-300 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-4 text-white light:text-gray-900">Bitax</h3>
                <p className="text-sm text-gray-400 light:text-gray-600 mb-4">
                  Révolutionnez votre fiscalité crypto avec notre plateforme dopée à l'IA. Analysez, visualisez, déclarez.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 transition-colors duration-300">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 transition-colors duration-300">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 transition-colors duration-300">
                    <span className="sr-only">Discord</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 text-white light:text-gray-900">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">
                      Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4 text-white light:text-gray-900">Légal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">Conditions d'utilisation</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">Politique de confidentialité</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">Mentions légales</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-gray-400 hover:text-primary-400 light:text-gray-600 light:hover:text-primary-600 transition-colors duration-300">Cookies</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-800/50 light:border-gray-200/50">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 text-sm transition-colors duration-300">
                    Mentions légales
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 text-sm transition-colors duration-300">
                    Politique de confidentialité
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-400 light:hover:text-primary-600 text-sm transition-colors duration-300">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}