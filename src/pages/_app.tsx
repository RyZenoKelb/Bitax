// src/pages/_app.tsx
import '@/styles/globals.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment, ReactElement, ReactNode } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import CustomStyles from '@/components/CustomStyles';
import AuthProvider from '@/components/AuthProvider';

// Type for pages with custom layout
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo SVG for non-dashboard pages
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

// Default layout for pages without custom layout
const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Check if user has theme preference
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

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

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
    <div className={`min-h-screen flex flex-col ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary-900/20 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
      </div>
      
      {/* Header */}
      <header className={`backdrop-blur-xl ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} border-b ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} sticky top-0 z-50 transition-colors duration-300`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group">
              <div className="flex items-center">
                <BitaxLogo isDarkMode={theme === 'dark'} />
              </div>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/') 
                      ? theme === 'dark' 
                        ? 'bg-gray-800/80 text-primary-400 border-b-2 border-primary-500' 
                        : 'bg-gray-100/80 text-primary-700 border-b-2 border-primary-600'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800/50' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
                >
                  <span className="mr-1.5">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
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
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute inset-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                  </Transition>
                </div>
              </button>
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`md:hidden p-2.5 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                } transition-all duration-200`}
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open menu</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
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
          </div>
        </Transition>
      </header>
      
      {/* Main content */}
      <main className="flex-grow py-6 px-4 sm:px-6 transition-all duration-300 relative">
        <div className="container mx-auto relative z-10">
          {isLoaded ? (
            <div className="transition-all duration-700 ease-out transform translate-y-0 opacity-100">
              {children}
            </div>
          ) : (
            <div className="opacity-0 translate-y-10">
              {children}
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
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
        
        {getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    </ThemeProvider>
  );
}