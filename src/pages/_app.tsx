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
import { useSession } from 'next-auth/react';
import { DevModeProvider } from '@/context/DevModeContext';
import DevModeIndicator from '@/components/DevModeIndicator';

// Type pour les propriétés CSS React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo SVG minimaliste avec animation subtile
const BitaxLogo = ({ collapsed = false, isFooter = false }) => {
  const sizeClass = isFooter
    ? "h-6 w-auto" 
    : collapsed 
      ? "h-9 w-auto" 
      : "h-10 w-auto";
  
  const containerClass = "flex items-center justify-center focus:outline-none";
  
  return (
    <Link href="/" className={containerClass} aria-label="Accueil Bitax">
      <svg 
        className={`${sizeClass} transition-all duration-300`}
        viewBox="0 0 120 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M16.2 7.2h13.6c4.8 0 8.2 3.3 8.2 7.8s-3.4 7.8-8.2 7.8h-8.1v6h-5.5V7.2z" 
          className="fill-white dark:fill-white light:fill-gray-900"
        />
        <path 
          d="M21.7 17.7h7.5c1.9 0 3.2-1.1 3.2-2.7s-1.3-2.7-3.2-2.7h-7.5v5.4z" 
          className="fill-gray-900 dark:fill-gray-900 light:fill-white"
        />
        <path 
          d="M44.5 7.2h5.5v9.8l9.2-9.8h6.7l-9.9 10.2 10.5 11.4h-7.1l-9.4-10.6v10.6h-5.5V7.2z" 
          className="fill-white dark:fill-white light:fill-gray-900"
        />
        <path 
          d="M69 7.2h5.5v21.6H69V7.2z" 
          className="fill-white dark:fill-white light:fill-gray-900"
        />
        <path 
          d="M79.8 18c0-6.4 4.9-11.2 11.4-11.2 4.1 0 7.5 1.6 9.3 4.6l-4.2 2.9c-1.1-1.6-2.9-2.5-4.9-2.5-3.6 0-6.1 2.7-6.1 6.3 0 3.6 2.4 6.3 6.1 6.3 2 0 3.8-0.8 4.9-2.5l4.2 2.9c-1.9 3-5.3 4.6-9.4 4.6-6.4 0-11.3-4.8-11.3-11.4z" 
          className="fill-white dark:fill-white light:fill-gray-900"
        />
        <rect 
          x="0" y="0" 
          width="120" height="36" 
          rx="4" 
          className="stroke-current text-white/20 dark:text-white/20 light:text-gray-900/20" 
          strokeWidth="1.5" 
          fill="none"
        />
        <circle 
          cx="9" cy="18" 
          r="4.5" 
          className="fill-teal-400 dark:fill-teal-400 light:fill-teal-500" 
        />
        <circle 
          cx="111" cy="18" 
          r="4.5" 
          className="fill-blue-400 dark:fill-blue-400 light:fill-blue-500" 
        />
      </svg>
    </Link>
  );
};

const AppContent = ({ Component, pageProps }: { Component: AppProps['Component']; pageProps: AppProps['pageProps'] }) => {
  const { data: session } = useSession();
  const user = session?.user;
  
  // Palette de couleurs élégante et moderne
  const COLORS = {
    primary: {
      light: '#64B5F6', // Bleu clair
      main: '#2196F3',  // Bleu principal
      dark: '#1976D2'   // Bleu foncé
    },
    secondary: {
      light: '#4ECDC4', // Turquoise clair
      main: '#26A69A',  // Turquoise principal
      dark: '#00897B'   // Turquoise foncé
    },
    accent: {
      light: '#FF8A65', // Corail clair
      main: '#FF5722',  // Corail principal
      dark: '#E64A19'   // Corail foncé
    },
    bg: {
      dark: '#0A1929',  // Bleu foncé presque noir
      darker: '#071426', 
      paper: '#0F1E30',  // Bleu foncé pour les cartes
      light: '#F8FAFC',
      lighter: '#FFFFFF'
    },
    text: {
      primary: '#FFFFFF',   // Texte principal mode sombre
      secondary: '#B2BAC2', // Texte secondaire mode sombre
      light: '#202939',     // Texte principal mode clair
      lightSecondary: '#65748B' // Texte secondaire mode clair
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('/dashboard');

  // Navigation links avec icônes modernes
  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" className="fill-current" />
          <rect x="14" y="3" width="7" height="7" rx="1" className="fill-current" />
          <rect x="3" y="14" width="7" height="7" rx="1" className="fill-current" />
          <rect x="14" y="14" width="7" height="7" rx="1" className="fill-current" />
        </svg>
      )
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 6L17 6M17 6L13 2M17 6L13 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 18L7 18M7 18L11 14M7 18L11 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 6H16M8 10H16M8 14H12M6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    
    // Définir la page active
    setActivePage(router.pathname);
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [router.pathname]);

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
    <>
      <Head>
        <title>Bitax | Fiscalité crypto simplifiée</title>
        <meta name="description" content="Bitax - Simplifiez votre fiscalité crypto avec notre solution intelligente. Analyse en temps réel, rapports automatisés, conformité garantie." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={theme === 'dark' ? COLORS.bg.dark : COLORS.bg.light} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitax | Fiscalité crypto simplifiée" />
        <meta name="twitter:description" content="Simplifiez votre fiscalité crypto avec notre solution intelligente. Analyse en temps réel, rapports automatisés, conformité garantie." />
        <meta property="og:title" content="Bitax | Fiscalité crypto simplifiée" />
        <meta property="og:description" content="Simplifiez votre fiscalité crypto avec notre solution intelligente. Analyse en temps réel, rapports automatisés, conformité garantie." />
        <meta property="og:type" content="website" />
        
        {/* Polices */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Styles personnalisés */}
      <CustomStyles />
      
      <div className={`min-h-screen flex bg-gradient-to-b from-bg-dark to-bg-darker dark:from-bg-dark dark:to-bg-darker light:from-bg-light light:to-bg-lighter ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* SIDEBAR - Version épurée et moderne */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
            ${sidebarCollapsed ? 'w-20' : 'w-64'} 
            bg-bg-paper/90 dark:bg-bg-paper/90 light:bg-white
            border-r border-white/[0.08] light:border-gray-200
            overflow-hidden backdrop-blur-lg`}
        >
          {/* Header de la sidebar avec logo et toggle */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08] light:border-gray-200">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              <BitaxLogo collapsed={sidebarCollapsed} />
              {!sidebarCollapsed && (
                <span className="ml-2 text-lg font-medium text-white light:text-gray-900">Bitax</span>
              )}
            </div>
            
            {!sidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.08] light:hover:bg-gray-100 light:text-gray-500 light:hover:text-gray-900 transition-colors"
                aria-label="Réduire le menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {sidebarCollapsed && (
              <button 
                onClick={toggleSidebar}
                className="w-8 h-8 mx-auto flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.08] light:hover:bg-gray-100 light:text-gray-500 light:hover:text-gray-900 transition-colors"
                aria-label="Agrandir le menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          
          {/* Navigation links */}
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto scrollbar-none">
            <div className={`space-y-1 px-3 ${sidebarCollapsed ? 'items-center' : ''}`}>
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href || 
                                (link.href === '/dashboard' && router.pathname === '/');
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`group flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md transition-all duration-200 ease-in-out
                      ${isActive 
                        ? 'bg-primary-main/20 text-primary-light' 
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05] light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100'}`}
                  >
                    <div className={`flex-shrink-0 ${isActive ? 'text-primary-light' : 'text-gray-400 group-hover:text-white light:text-gray-500 light:group-hover:text-gray-900'}`}>
                      {link.icon}
                    </div>
                    
                    {!sidebarCollapsed && (
                      <span className="ml-3 text-sm font-medium whitespace-nowrap">{link.name}</span>
                    )}
                    
                    {/* Indicateur pour le lien actif */}
                    {isActive && (
                      <div className={`${sidebarCollapsed ? 'absolute -right-0.5 top-1/2 -translate-y-1/2' : 'ml-auto'} w-1 h-5 bg-primary-main rounded-full`}></div>
                    )}
                    
                    {/* Tooltip lorsque sidebar réduite */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full z-10 ml-6 px-2 py-1 rounded-md text-sm font-medium bg-bg-paper light:bg-white border border-white/[0.08] light:border-gray-200 shadow-lg opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 pointer-events-none transition-all duration-200 whitespace-nowrap">
                        {link.name}
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 rotate-45 bg-bg-paper light:bg-white border-l border-t border-white/[0.08] light:border-gray-200"></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* User profile section */}
          <div className="p-3 border-t border-white/[0.08] light:border-gray-200">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative group w-full flex items-center px-2 py-2 rounded-md hover:bg-white/[0.05] light:hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white overflow-hidden">
                {user?.image ? (
                  <img 
                    src={user.image} 
                    alt={user?.name || 'Utilisateur'} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              
              {!sidebarCollapsed && (
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-white light:text-gray-900 truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-400 light:text-gray-500 truncate">{user?.email || 'email@exemple.com'}</p>
                </div>
              )}
              
              {!sidebarCollapsed && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400 light:text-gray-500">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
          
          {/* Theme toggle et aide */}
          <div className="p-3 border-t border-white/[0.08] light:border-gray-200 flex items-center justify-between">
            <button 
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.08] light:hover:bg-gray-100 light:text-gray-500 light:hover:text-gray-900 transition-colors"
              aria-label={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V4M12 20V21M3 12H4M20 12H21M5.6 5.6L6.3 6.3M18.4 5.6L17.7 6.3M5.6 18.4L6.3 17.7M18.4 18.4L17.7 17.7M12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.0672 11.8568L20.1245 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 3.87545V3.87545L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.1245 11.469C19.7306 9.82886 18.8718 8.35679 17.6648 7.20996L16.6152 8.29738C17.6166 9.25044 18.3388 10.4739 18.6683 11.8323L20.1245 11.469ZM12 2.75C13.6684 2.75 15.237 3.23384 16.5492 4.09492L17.2942 2.77639C15.7403 1.76472 13.9302 1.25 12 1.25V2.75ZM12.5311 2.99007C12.3515 2.83275 12.1504 2.75 12 2.75V1.25C12.4376 1.25 12.8988 1.45211 13.2708 1.78733L12.5311 2.99007ZM17.6648 7.20996C16.9083 6.49283 16.0779 5.87208 15.1582 5.4016L14.519 6.77821C15.2801 7.17623 15.9817 7.69194 16.6152 8.29738L17.6648 7.20996ZM20.1526 12.2446C20.1525 12.2446 20.1525 12.2447 20.1524 12.2448L21.0098 13.1022C21.01 13.102 21.0103 13.1018 21.0105 13.1016L20.1526 12.2446ZM12.5311 1.78733C16.2383 5.02567 16.7141 10.7834 12.7998 14.6977L13.8787 15.7766C18.5397 11.1155 17.9579 4.26229 13.2708 1.78733L12.5311 1.78733ZM11.7553 3.87545C11.7553 3.87545 11.7553 3.87545 11.7553 3.87545L12.5311 1.99007C12.5311 1.99007 12.5311 1.99007 12.5311 1.99007L11.7553 3.87545ZM18.6683 11.8323C18.6683 11.8322 18.6684 11.8322 18.6684 11.8322L20.0659 11.8814C20.0659 11.8815 20.0659 11.8815 20.0659 11.8815L18.6683 11.8323ZM13.8787 15.7766C13.8788 15.7765 13.8788 15.7765 13.8789 15.7764L12.7207 14.619C12.7206 14.619 12.7206 14.6191 12.7205 14.6191L13.8787 15.7766ZM20.1524 12.2448C19.8258 12.5714 19.8258 13.0988 20.1524 13.4255L21.0098 12.5681C21.1389 12.6972 21.1389 12.9731 21.0098 13.1022L20.1524 12.2448ZM20.1524 13.4255C20.4791 13.7521 21.0065 13.7521 21.3331 13.4255L20.4757 12.5681C20.6048 12.4389 20.8807 12.4389 21.0098 12.5681L20.1524 13.4255ZM21.3331 13.4255C21.6598 13.0988 21.6598 12.5714 21.3331 12.2448L20.4757 13.1022C20.3466 12.9731 20.3466 12.6972 20.4757 12.5681L21.3331 13.4255ZM20.1525 12.2447C20.1525 12.2446 20.1525 12.2446 20.1526 12.2446L21.0105 13.1016C21.0104 13.1017 21.0103 13.1019 21.0102 13.102L20.1525 12.2447ZM20.0659 11.8815C20.0659 11.8815 20.0659 11.8815 20.0659 11.8815L18.6707 11.7831C18.6707 11.7831 18.6707 11.7831 18.6707 11.7831L20.0659 11.8815ZM12.7205 14.6191C12.7205 14.6191 12.7204 14.6192 12.7204 14.6192L13.879 15.7764C13.879 15.7763 13.879 15.7763 13.879 15.7763L12.7205 14.6191Z" fill="currentColor"/>
                </svg>
              )}
            </button>
            
            <Link 
              href="/support"
              className={`${sidebarCollapsed ? 'w-8 h-8 flex items-center justify-center' : 'text-sm px-3 py-1.5'} rounded-md text-gray-400 hover:text-white hover:bg-white/[0.08] light:hover:bg-gray-100 light:text-gray-500 light:hover:text-gray-900 transition-colors`}
            >
              {sidebarCollapsed ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.22766 9C8.77678 7.83481 10.2584 7 12.0001 7C14.2092 7 16.0001 8.34315 16.0001 10C16.0001 11.3994 14.7224 12.5751 12.9943 12.9066C12.4519 13.0106 12.0001 13.447 12.0001 14M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                'Aide'
              )}
            </Link>
          </div>
        </aside>
        
        {/* Menu utilisateur dropdown */}
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
          <div className={`fixed z-50 mt-1 rounded-md shadow-lg py-1 bg-bg-paper light:bg-white border border-white/[0.08] light:border-gray-200 focus:outline-none ${sidebarCollapsed ? 'left-20 bottom-24' : 'left-64 bottom-28'} w-56`}>
            <div className="px-4 py-3 border-b border-white/[0.08] light:border-gray-200">
              <p className="text-sm font-medium text-white light:text-gray-900">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-gray-400 light:text-gray-500 truncate">{user?.email || 'email@exemple.com'}</p>
            </div>
            
            <div className="py-1">
              <Link
                href="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-300 light:text-gray-700 hover:bg-white/[0.05] light:hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 light:text-gray-500">
                  <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mon profil
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-300 light:text-gray-700 hover:bg-white/[0.05] light:hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-gray-400 light:text-gray-500">
                  <path d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Paramètres
              </Link>
            </div>
            
            <div className="border-t border-white/[0.08] light:border-gray-200 py-1">
              <Link
                href="/logout"
                className="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-white/[0.05] light:hover:bg-gray-100"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-red-500">
                  <path d="M17 16L21 12M21 12L17 8M21 12H7M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Déconnexion
              </Link>
            </div>
          </div>
        </Transition>
        
        {/* Bouton menu mobile */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-md bg-bg-paper/90 light:bg-white/90 text-gray-400 hover:text-white light:text-gray-500 light:hover:text-gray-900 hover:bg-white/[0.05] light:hover:bg-gray-100 focus:outline-none border border-white/[0.08] light:border-gray-200 backdrop-blur-lg"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Bouton actions rapides */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            className="h-12 w-12 rounded-full bg-primary-main flex items-center justify-center text-white shadow-lg hover:bg-primary-dark transition-colors focus:outline-none"
            aria-label="Actions rapides"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 6V12M12 12V18M12 12H18M12 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Menu mobile overlay */}
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
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </Transition>
        
        {/* Menu mobile */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition duration-300 ease-out transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-200 ease-in transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-bg-paper light:bg-white overflow-hidden md:hidden border-r border-white/[0.08] light:border-gray-200">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08] light:border-gray-200">
              <div className="flex items-center">
                <BitaxLogo collapsed={false} />
                <span className="ml-2 text-lg font-medium text-white light:text-gray-900">Bitax</span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white light:text-gray-500 light:hover:text-gray-900 hover:bg-white/[0.05] light:hover:bg-gray-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <nav className="mt-5 px-2">
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = router.pathname === link.href || 
                                  (link.href === '/dashboard' && router.pathname === '/');
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className={`group flex items-center px-3 py-2 rounded-md transition-all duration-200 ease-in-out
                        ${isActive 
                          ? 'bg-primary-main/20 text-primary-light' 
                          : 'text-gray-400 hover:text-white hover:bg-white/[0.05] light:text-gray-600 light:hover:text-gray-900 light:hover:bg-gray-100'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`flex-shrink-0 ${isActive ? 'text-primary-light' : 'text-gray-400 group-hover:text-white light:text-gray-500 light:group-hover:text-gray-900'}`}>
                        {link.icon}
                      </div>
                      <span className="ml-3 text-sm font-medium">{link.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1 h-5 bg-primary-main rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>
            
            <div className="absolute bottom-0 w-full p-4 border-t border-white/[0.08] light:border-gray-200">
              <div className="flex items-center px-2 py-2">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary-main to-secondary-main flex items-center justify-center text-white overflow-hidden">
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user?.name || 'Utilisateur'} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white light:text-gray-900 truncate">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-400 light:text-gray-500 truncate">{user?.email || 'email@exemple.com'}</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="ml-auto w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-white light:text-gray-500 light:hover:text-gray-900 hover:bg-white/[0.05] light:hover:bg-gray-100"
                >
                  {theme === 'dark' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3V4M12 20V21M3 12H4M20 12H21M5.6 5.6L6.3 6.3M18.4 5.6L17.7 6.3M5.6 18.4L6.3 17.7M18.4 18.4L17.7 17.7M12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.0672 11.8568L20.1245 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 3.87545V3.87545L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.1245 11.469C19.7306 9.82886 18.8718 8.35679 17.6648 7.20996L16.6152 8.29738C17.6166 9.25044 18.3388 10.4739 18.6683 11.8323L20.1245 11.469ZM12 2.75C13.6684 2.75 15.237 3.23384 16.5492 4.09492L17.2942 2.77639C15.7403 1.76472 13.9302 1.25 12 1.25V2.75ZM12.5311 2.99007C12.3515 2.83275 12.1504 2.75 12 2.75V1.25C12.4376 1.25 12.8988 1.45211 13.2708 1.78733L12.5311 2.99007ZM17.6648 7.20996C16.9083 6.49283 16.0779 5.87208 15.1582 5.4016L14.519 6.77821C15.2801 7.17623 15.9817 7.69194 16.6152 8.29738L17.6648 7.20996ZM20.1526 12.2446C20.1525 12.2446 20.1525 12.2447 20.1524 12.2448L21.0098 13.1022C21.01 13.102 21.0103 13.1018 21.0105 13.1016L20.1526 12.2446ZM12.5311 1.78733C16.2383 5.02567 16.7141 10.7834 12.7998 14.6977L13.8787 15.7766C18.5397 11.1155 17.9579 4.26229 13.2708 1.78733L12.5311 1.78733ZM11.7553 3.87545C11.7553 3.87545 11.7553 3.87545 11.7553 3.87545L12.5311 1.99007C12.5311 1.99007 12.5311 1.99007 12.5311 1.99007L11.7553 3.87545ZM18.6683 11.8323C18.6683 11.8322 18.6684 11.8322 18.6684 11.8322L20.0659 11.8814C20.0659 11.8815 20.0659 11.8815 20.0659 11.8815L18.6683 11.8323ZM13.8787 15.7766C13.8788 15.7765 13.8788 15.7765 13.8789 15.7764L12.7207 14.619C12.7206 14.619 12.7206 14.6191 12.7205 14.6191L13.8787 15.7766ZM20.1524 12.2448C19.8258 12.5714 19.8258 13.0988 20.1524 13.4255L21.0098 12.5681C21.1389 12.6972 21.1389 12.9731 21.0098 13.1022L20.1524 12.2448ZM20.1524 13.4255C20.4791 13.7521 21.0065 13.7521 21.3331 13.4255L20.4757 12.5681C20.6048 12.4389 20.8807 12.4389 21.0098 12.5681L20.1524 13.4255ZM21.3331 13.4255C21.6598 13.0988 21.6598 12.5714 21.3331 12.2448L20.4757 13.1022C20.3466 12.9731 20.3466 12.6972 20.4757 12.5681L21.3331 13.4255ZM20.1525 12.2447C20.1525 12.2446 20.1525 12.2446 20.1526 12.2446L21.0105 13.1016C21.0104 13.1017 21.0103 13.1019 21.0102 13.102L20.1525 12.2447ZM20.0659 11.8815C20.0659 11.8815 20.0659 11.8815 20.0659 11.8815L18.6707 11.7831C18.6707 11.7831 18.6707 11.7831 18.6707 11.7831L20.0659 11.8815ZM12.7205 14.6191C12.7205 14.6191 12.7204 14.6192 12.7204 14.6192L13.879 15.7764C13.879 15.7763 13.879 15.7763 13.879 15.7763L12.7205 14.6191Z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Transition>
        
        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {/* Header fixe avec breadcrumbs et actions */}
          <header className="sticky top-0 z-30 h-16 flex items-center bg-bg-paper/80 light:bg-white/80 backdrop-blur-lg border-b border-white/[0.08] light:border-gray-200 px-4 md:px-6">
            <div className="flex-1 flex items-center justify-between">
              <div className="breadcrumbs text-sm text-gray-400 light:text-gray-500">
                {activePage === '/dashboard' && (
                  <span className="font-medium text-white light:text-gray-900">Tableau de bord</span>
                )}
                {activePage === '/transactions' && (
                  <>
                    <Link href="/dashboard" className="hover:text-white light:hover:text-gray-900">Tableau de bord</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-white light:text-gray-900">Transactions</span>
                  </>
                )}
                {activePage === '/reports' && (
                  <>
                    <Link href="/dashboard" className="hover:text-white light:hover:text-gray-900">Tableau de bord</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-white light:text-gray-900">Rapports fiscaux</span>
                  </>
                )}
                {activePage === '/guide' && (
                  <>
                    <Link href="/dashboard" className="hover:text-white light:hover:text-gray-900">Tableau de bord</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-white light:text-gray-900">Guide d'utilisation</span>
                  </>
                )}
                {activePage === '/pricing' && (
                  <>
                    <Link href="/dashboard" className="hover:text-white light:hover:text-gray-900">Tableau de bord</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-white light:text-gray-900">Tarification</span>
                  </>
                )}
                {activePage === '/support' && (
                  <>
                    <Link href="/dashboard" className="hover:text-white light:hover:text-gray-900">Tableau de bord</Link>
                    <span className="mx-2">/</span>
                    <span className="font-medium text-white light:text-gray-900">Support</span>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.05] light:text-gray-500 light:hover:text-gray-900 light:hover:bg-gray-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.05] light:text-gray-500 light:hover:text-gray-900 light:hover:bg-gray-100">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10H8.01M12 10H12.01M16 10H16.01M9 16H5C3.89543 16 3 15.1046 3 14V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V14C21 15.1046 20.1046 16 19 16H14L9 21V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-white/[0.05] hover:bg-white/[0.08] light:bg-gray-100 light:hover:bg-gray-200 text-white light:text-gray-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Nouveau rapport
                </button>
              </div>
            </div>
          </header>
          
          {/* Contenu principal avec effet de transition */}
          <main className="py-6 px-4 md:px-6 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-bg-dark to-bg-darker dark:from-bg-dark dark:to-bg-darker light:from-bg-light light:to-bg-lighter">
            <div className="max-w-7xl mx-auto">
              {isLoaded ? (
                <div className="transition-all duration-500 ease-out transform translate-y-0 opacity-100">
                  <Component {...pageProps} />
                </div>
              ) : (
                <div className="opacity-0 translate-y-4">
                  <Component {...pageProps} />
                </div>
              )}
            </div>
          </main>
          
          {/* Footer minimaliste */}
          <footer className="py-4 px-4 md:px-6 border-t border-white/[0.08] light:border-gray-200 bg-bg-paper/50 light:bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <BitaxLogo isFooter={true} />
                <span className="text-xs text-gray-400 light:text-gray-500 ml-2">
                  &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-400 light:text-gray-500">
                <Link href="/privacy" className="hover:text-white light:hover:text-gray-900">Confidentialité</Link>
                <Link href="/terms" className="hover:text-white light:hover:text-gray-900">Conditions</Link>
                <Link href="/support" className="hover:text-white light:hover:text-gray-900">Support</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <DevModeProvider>
        <AppContent Component={Component} pageProps={pageProps} />
        <DevModeIndicator />
      </DevModeProvider>
    </AuthProvider>
  );
}