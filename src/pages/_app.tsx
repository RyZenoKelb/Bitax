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

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo using the image from public/bitaxlogo.png with a subtle hover effect
const BitaxLogo = ({ collapsed = false, isFooter = false }) => {
  // Improved sizing with different treatments for sidebar vs footer
  const sizeClass = isFooter
    ? "h-8 w-auto" // Significantly smaller size for footer
    : collapsed 
      ? "h-14 w-auto" // Larger size when sidebar is collapsed
      : "h-16 w-auto"; // Even larger when sidebar is expanded
  
  // Better centering within the container with enhanced focus removal
  const containerClass = "flex justify-center items-center w-full py-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";
  
  return (
    <Link href="/" className={containerClass}>
      <img 
        src="/bitaxlogo.png" 
        alt="Bitax Logo" 
        className={`${sizeClass} transition-all duration-300`}
        draggable="false"
      />
    </Link>
  );
};

type AppContentProps = {
  Component: AppProps['Component'];
  pageProps: any;
};

const AppContent = ({ Component, pageProps }: AppContentProps) => {
  // Obtenir les données de l'utilisateur depuis la session
  const { data: session } = useSession();
  const user = session?.user;
  
  // Utilisation de couleurs modernes (thème cyberpunk/crypto)
  const COLORS = {
    cyan: {
      light: '#0FF4C6',
      main: '#0CCEA3',
      dark: '#0A9A7B'
    },
    purple: {
      light: '#A47EF6',
      main: '#8456F0',
      dark: '#6039DD'
    },
    indigo: {
      light: '#8EA2FF',
      main: '#5E77FF',
      dark: '#3A54F2'
    },
    accent: {
      light: '#FF65B6',
      main: '#FF3A9D',
      dark: '#DB1E7C'
    },
    bg: {
      dark: '#0F172A',
      darker: '#091125', 
      light: '#F8FAFC',
      lighter: '#FFFFFF'
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  
  // Add a new state for page transitions
  const [isChangingRoute, setIsChangingRoute] = useState(false);

  // Get current and previous Component for smooth transitions
  const [currentComponent, setCurrentComponent] = useState<React.ComponentType<any>>(Component);
  const [currentProps, setCurrentProps] = useState(pageProps);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Update when background color/theme changes to prevent white flash
  useEffect(() => {
    // Set background color on html and body to prevent white flash
    document.documentElement.style.backgroundColor = theme === 'dark' ? COLORS.bg.darker : COLORS.bg.light;
    document.body.style.backgroundColor = theme === 'dark' ? COLORS.bg.darker : COLORS.bg.light;
    
    return () => {
      // Cleanup
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  // Enhanced router event handling
  useEffect(() => {
    // Preload the Component on route change start
    const handleRouteChangeStart = () => {
      setIsTransitioning(true);
    };
    
    // Update component only after transition has started
    const handleRouteChangeComplete = () => {
      // Short delay to ensure transition is visible
      setTimeout(() => {
        setCurrentComponent(() => Component);
        setCurrentProps(pageProps);
        
        // Small additional delay before finishing transition
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 50);
    };

    // Set initial component
    setCurrentComponent(() => Component);
    setCurrentProps(pageProps);
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [Component, pageProps, router]);

  // Navigation links avec icônes modernisées et animation
  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" rx="1.5" className="fill-current opacity-80" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" className="fill-current opacity-90" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" className="fill-current opacity-90" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" className="fill-current opacity-80" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.indigo.main}, ${COLORS.indigo.light})`
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 16L16 12L20 8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 8L8 12L4 16" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 4L12 20" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.purple.main}, ${COLORS.purple.light})`
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2V8H20" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 13H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 9H9H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.cyan.main}, ${COLORS.cyan.light})`
    },
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.indigo.dark}, ${COLORS.indigo.main})`
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1V23" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.accent.dark}, ${COLORS.accent.main})`
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.364 5.63603L5.63599 18.364" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9.5" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 4.20703C8.82378 3.43049 10.3607 3 12 3C16.9706 3 21 7.02944 21 12C21 13.6393 20.5695 15.1762 19.793 16.5" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 19.793C15.1762 20.5695 13.6393 21 12 21C7.02944 21 3 16.9706 3 12C3 10.3607 3.43049 8.82378 4.20703 7.5" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.purple.dark}, ${COLORS.purple.main})`
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
  
  // Setup router event listeners to handle page transitions
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsChangingRoute(true);
    };
    
    const handleRouteChangeComplete = () => {
      setTimeout(() => {
        setIsChangingRoute(false);
      }, 100); // Small delay to ensure smooth transition
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);
  
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
        {/* Add base background color to prevent flash */}
        <style>{`
          html, body {
            background-color: ${theme === 'dark' ? COLORS.bg.darker : COLORS.bg.light};
            height: 100%;
            overflow-x: hidden;
          }
          #__next {
            min-height: 100%;
            background-color: ${theme === 'dark' ? COLORS.bg.darker : COLORS.bg.light};
          }
        `}</style>
      </Head>
      
      {/* Inclusion du composant CustomStyles qui injectera nos styles prioritaires */}
      <CustomStyles />
      
      <div className={`min-h-screen flex ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500 bg-bg-darker dark:bg-bg-darker light:bg-bg-light`}>
        {/* SIDEBAR - Version ultra moderne avec effets néon et glassmorphism */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-xl
            ${sidebarCollapsed ? 'w-20' : 'w-72'} 
            bg-gradient-to-b from-bg-darker via-bg-dark to-bg-darker border-r border-indigo-900/40
            overflow-hidden`}
          style={{
            boxShadow: '0 0 20px rgba(46, 86, 255, 0.2)',
          }}
        >
          {/* Effets lumineux interactifs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-indigo-500/0 via-indigo-500/30 to-indigo-500/0"></div>
            <div className="absolute -bottom-5 -left-5 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
          </div>
          
          {/* Logo et toggle sidebar avec animation */}
          <div className="relative flex items-center justify-between py-6 px-5">
            <BitaxLogo collapsed={sidebarCollapsed} />
            
          {/* Bouton toggle sidebar supprimé - mais gardons la fonction pour plus tard */}
          <div className="fixed -left-99 opacity-0">
            <button 
              onClick={toggleSidebar}
              className="hidden"
            >
              <span className="sr-only">Toggle Sidebar</span>
            </button>
          </div>
          </div>
          
          {/* Navigation links modernisés et animés */}
          <nav className="flex-1 py-8 overflow-y-auto scrollbar-none">
            <div className={`px-3 space-y-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
              {navLinks.map((link, index) => {
                const isActive = router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/');
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`sidebar-link group relative flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02]
                      ${isActive 
                        ? 'text-white' 
                        : 'text-indigo-100/70 hover:text-white'}`}
                    style={{
                      background: isActive ? link.gradient : 'rgba(13, 18, 36, 0.6)',
                      boxShadow: isActive ? '0 0 15px rgba(46, 86, 255, 0.3)' : 'none',
                    }}
                  >
                    {/* Effet de brillance animé sur hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none"></div>
                    
                    {/* Icône avec animation */}
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'} transition-all duration-300 hover:animate-pulse`}>
                      {link.icon}
                    </div>
                    
                    {/* Texte qui s'affiche/disparait selon l'état de la sidebar */}
                    {!sidebarCollapsed && (
                      <span className="ml-3 transition-all duration-500">{link.name}</span>
                    )}
                    
                    {/* Point lumineux indicateur si actif */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                    
                    {/* Tooltip au survol quand sidebar réduite */}
                    {sidebarCollapsed && (
                      <div className="sidebar-tooltip absolute left-full ml-4 px-3 py-2 min-w-max rounded-lg opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 pointer-events-none transition-all duration-300 text-white z-50"
                        style={{
                          background: link.gradient,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {link.name}
                        {/* Flèche de tooltip */}
                        <div className="absolute -left-1 top-1/2 -mt-1 w-2 h-2 rotate-45" style={{ background: isActive ? COLORS.indigo.main : COLORS.indigo.dark }}></div>
                      </div>
                    )}
                  </Link>
                );
              })}
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
                  <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'email@exemple.com'}</p>
                </div>
              )}
              
              {sidebarCollapsed && (
                <span className="absolute left-full ml-6 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap min:w-max">
                  {user?.name || 'Utilisateur'}<br/>{user?.email || 'email@exemple.com'}
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
              <p className="text-xs text-gray-400">{user?.email || 'email@exemple.com'}</p>
            </div>
            <Link 
              href="/profile" 
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
            <Link 
              href="/settings" 
              className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
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
              className="px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300 light:text-red-600 light:hover:bg-gray-100 light:hover:text-red-700 flex items-center"
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
                  <p className="text-sm font-medium text-white">{user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'email@exemple.com'}</p>
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
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out bg-bg-darker dark:bg-bg-darker light:bg-bg-light ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          {/* Background effects améliorés */}
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Gradient orbs animés */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-t from-secondary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            
            
            {/* Particules/étoiles */}
            <div className="stars-container absolute inset-0"></div>
            
            {/* Vagues subtiles animées en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                      <div className="relative z-10">{item.icon}</div>
                    </a>
                  ))}
                </div>
                
                {/* Lien légaux simples */}
                <div className="flex space-x-4 text-xs">
                  {[
                    { name: "CGU", href: "#" },
                    { name: "Confidentialité", href: "#" },
                  ].map((item, index) => (
                    <a 
                      key={index} 
                      href={item.href}
                      className="text-indigo-300/70 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {/* Toggle thème compact */}
                  <button
                    onClick={toggleTheme}
                    className="text-indigo-300/70 hover:text-white transition-colors duration-300 flex items-center"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
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
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}