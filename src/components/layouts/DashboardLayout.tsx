// src/components/layouts/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

// Logo SVG amélioré avec animation et effet de lueur
const BitaxLogo = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className={`flex items-center ${compact ? 'justify-center' : ''}`}>
      <div className="relative z-10">
        <div className={`flex ${compact ? 'flex-col items-center' : 'items-center'}`}>
          <div className="relative">
            <span className={`${compact ? 'text-xl' : 'text-2xl'} font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 tracking-tight`}>
              BITAX
            </span>
            <div className="absolute inset-0 blur-sm opacity-50 bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500 filter"></div>
          </div>
          {!compact && (
            <span className="text-xs text-gray-400 dark:text-gray-500 ml-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');

  // Détection du mode préféré
  useEffect(() => {
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Appliquer le thème
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle du thème
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  // Adapter la sidebar à la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation links avec icônes améliorées
  const mainNavLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      section: 'dashboard'
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      section: 'transactions'
    },
    { 
      name: 'Portefeuille', 
      href: '/wallet', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      section: 'wallet'
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      section: 'reports'
    },
  ];

  const secondaryNavLinks = [
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      section: 'guide'
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      section: 'pricing'
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      section: 'support'
    }
  ];

  const profileLinks = [
    { 
      name: 'Mon Profil', 
      href: '/profile', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      section: 'profile'
    },
    { 
      name: 'Paramètres', 
      href: '/settings', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      section: 'settings'
    }
  ];

  const userInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Premium",
    avatar: "JD"
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        {/* Top-right gradient */}
        <div className="absolute top-0 right-0 w-3/4 h-2/3 bg-gradient-to-b from-primary-800/20 via-primary-900/10 to-transparent opacity-70 dark:opacity-30 blur-3xl"></div>
        
        {/* Bottom-left gradient */}
        <div className="absolute bottom-0 left-0 w-3/4 h-2/3 bg-gradient-to-t from-secondary-800/20 via-secondary-900/10 to-transparent opacity-70 dark:opacity-30 blur-3xl"></div>
        
        {/* Moving particle effect */}
        <div className="stars-container absolute inset-0"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
      </div>

      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 inset-x-0 z-50 h-16 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-lg border-b ${theme === 'dark' ? 'border-gray-800/50' : 'border-gray-200/50'}`}>
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 mr-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
            <Link href="/" className="flex items-center">
              <BitaxLogo />
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
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
            
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md overflow-hidden"
              >
                <span className="text-sm font-medium">{userInfo.avatar}</span>
                <span className="sr-only">Menu utilisateur</span>
              </button>
              
              {/* User dropdown for mobile */}
              <Transition
                show={isUserMenuOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div className={`absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50 shadow-xl py-1 ${
                  theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userInfo.name}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{userInfo.email}</p>
                  </div>
                  
                  {profileLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className={`block px-4 py-2 text-sm ${
                        theme === 'dark' 
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      } flex items-center`}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <span className="w-5 h-5 mr-3">{link.icon}</span>
                      {link.name}
                    </Link>
                  ))}
                  
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
                    <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Déconnexion
                  </Link>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <Transition
        show={isMobileMenuOpen}
        enter="transition-opacity ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="lg:hidden fixed inset-0 z-40"
      >
        <div 
          className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        
        <div className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto py-4 px-2 ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } shadow-xl transition-all transform`}>
          <div className="flex items-center justify-between px-3 mb-6">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <BitaxLogo />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-4 px-3">
            <div className={`p-3 rounded-xl ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-gray-100/80 border border-gray-200/80'
            }`}>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
                  <span className="text-sm font-medium">{userInfo.avatar}</span>
                </div>
                <div className="ml-3 truncate">
                  <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userInfo.name}</p>
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{userInfo.email}</p>
                </div>
              </div>
              
              <div className={`flex items-center space-x-1 text-xs ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'} mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/70'}`}>
                <div className={`px-2 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-primary-900/30 border border-primary-700/30' : 'bg-primary-100 border border-primary-200'}`}>
                  {userInfo.role}
                </div>
                <span>•</span>
                <span>3 jours restants</span>
              </div>
            </div>
          </div>
          
          <div className="px-3 mb-1">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              Principal
            </h3>
          </div>
          
          <div className="space-y-1 px-3">
            {mainNavLinks.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? theme === 'dark' 
                        ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                        : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentSection(item.section);
                  }}
                >
                  <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                    {item.icon}
                  </span>
                  {item.name}
                  
                  {/* Indicator for active item */}
                  {isActive && (
                    <span className="ml-auto mr-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-primary-400' : 'bg-primary-600'}`}></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="px-3 mt-6 mb-1">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              Pages
            </h3>
          </div>
          
          <div className="space-y-1 px-3">
            {secondaryNavLinks.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? theme === 'dark' 
                        ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                        : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentSection(item.section);
                  }}
                >
                  <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="px-3 mt-6 mb-1">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
              Compte
            </h3>
          </div>
          
          <div className="space-y-1 px-3">
            {profileLinks.map((item) => {
              const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? theme === 'dark' 
                        ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                        : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setCurrentSection(item.section);
                  }}
                >
                  <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
            
            <Link
              href="/logout"
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-100/50 hover:text-red-700'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Link>
          </div>
        </div>
      </Transition>

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 hidden lg:block transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className={`h-full ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-r ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} flex flex-col overflow-hidden`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800/20 dark:border-gray-800/20">
            <Link href="/" className="flex items-center pl-1.5">
              <BitaxLogo />
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-5 px-3">
            <div className="mb-6">
              <div className={`p-3 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 border border-gray-700/50' 
                  : 'bg-gray-100/80 border border-gray-200/80'
              }`}>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
                    <span className="text-sm font-medium">{userInfo.avatar}</span>
                  </div>
                  <div className="ml-3 truncate">
                    <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{userInfo.name}</p>
                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{userInfo.email}</p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 text-xs ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'} mt-2 pt-2 border-t ${theme === 'dark' ? 'border-gray-700/50' : 'border-gray-200/70'}`}>
                  <div className={`px-2 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-primary-900/30 border border-primary-700/30' : 'bg-primary-100 border border-primary-200'}`}>
                    {userInfo.role}
                  </div>
                  <span>•</span>
                  <span>3 jours restants</span>
                </div>
              </div>
            </div>
            
            <div className="mb-1">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} px-3 mb-2`}>
                Principal
              </h3>
            </div>
            
            <div className="space-y-1">
              {mainNavLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                          : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    {item.name}
                    
                    {/* Indicator for active item */}
                    {isActive && (
                      <span className="ml-auto mr-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-primary-400' : 'bg-primary-600'}`}></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-6 mb-1">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} px-3 mb-2`}>
                Pages
              </h3>
            </div>
            
            <div className="space-y-1">
              {secondaryNavLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                          : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
            
            <div className="mt-6 mb-1">
              <h3 className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} px-3 mb-2`}>
                Compte
              </h3>
            </div>
            
            <div className="space-y-1">
              {profileLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400 border-l-2 border-primary-500'
                          : 'bg-primary-100/70 text-primary-800 border-l-2 border-primary-500'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`mr-3 text-gray-500 group-hover:text-current ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className={`p-3 border-t ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'}`}>
            <Link
              href="/logout"
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-100/50 hover:text-red-700'
              }`}
            >
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Link>
            
            <div className={`mt-3 pt-3 border-t ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} flex items-center justify-between`}>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                Mode sombre
              </span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                  theme === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`${
                    theme === 'dark' ? 'translate-x-6 bg-white text-primary-800' : 'translate-x-1 bg-white text-gray-500'
                  } inline-block w-4 h-4 transform rounded-full transition-transform duration-200 ease-in-out flex items-center justify-center text-xs`}
                >
                  {theme === 'dark' ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800/30 dark:border-gray-800/30">
              <div className="flex items-center">
                <BitaxLogo compact={true} />
                <div className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                  <div>© 2025 Bitax</div>
                  <div className="mt-0.5">v2.1.4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Collapsed Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-16 hidden lg:block transform ${!isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className={`h-full ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-r ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} flex flex-col overflow-hidden`}>
          <div className="h-16 flex items-center justify-center px-4 border-b border-gray-800/20 dark:border-gray-800/20">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-5 px-1">
            <div className="flex flex-col items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-md">
                <span className="text-sm font-medium">{userInfo.avatar}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4 mb-6">
              {mainNavLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`p-2 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400'
                          : 'bg-primary-100/70 text-primary-800'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`block ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute left-12 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      {item.name}
                    </div>
                    
                    {/* Indicator for active item */}
                    {isActive && (
                      <span className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1.5">
                        <span className={`block w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-primary-400' : 'bg-primary-600'}`}></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            
            <div className="border-t border-gray-800/20 dark:border-gray-800/20 mb-4 pt-4"></div>
            
            <div className="flex flex-col items-center space-y-4 mb-6">
              {secondaryNavLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`p-2 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400'
                          : 'bg-primary-100/70 text-primary-800'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`block ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute left-12 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
            
            <div className="border-t border-gray-800/20 dark:border-gray-800/20 mb-4 pt-4"></div>
            
            <div className="flex flex-col items-center space-y-4">
              {profileLinks.map((item) => {
                const isActive = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`p-2 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? theme === 'dark' 
                          ? 'bg-primary-900/30 text-primary-400'
                          : 'bg-primary-100/70 text-primary-800'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setCurrentSection(item.section);
                    }}
                  >
                    <span className={`block ${isActive ? theme === 'dark' ? 'text-primary-400' : 'text-primary-600' : ''}`}>
                      {item.icon}
                    </span>
                    
                    {/* Tooltip */}
                    <div className="absolute left-12 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                      {item.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 flex flex-col items-center border-t border-gray-800/30 dark:border-gray-800/30">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-200 group relative ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100/80 hover:text-gray-900'
              }`}
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
              
              {/* Tooltip */}
              <div className="absolute left-12 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
              </div>
            </button>
            
            <Link
              href="/logout"
              className={`p-2 mt-4 rounded-lg transition-all duration-200 group relative ${
                theme === 'dark'
                  ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300'
                  : 'text-red-600 hover:bg-red-100/50 hover:text-red-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              
              {/* Tooltip */}
              <div className="absolute left-12 p-2 bg-gray-900 text-white text-sm rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
                Déconnexion
              </div>
            </Link>
            
            <div className="mt-4 pt-4 border-t border-gray-800/30 dark:border-gray-800/30">
              <BitaxLogo compact={true} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content with Header */}
      <div className={`flex-1 lg:ml-${isSidebarOpen ? '64' : '16'} transition-all duration-300 ease-in-out mt-16 lg:mt-0`}>
        <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer redesigné */}
        <footer className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'} backdrop-blur-md border-t ${theme === 'dark' ? 'border-gray-800/30' : 'border-gray-200/30'} py-6 transition-colors duration-300`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <BitaxLogo />
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  La plateforme qui simplifie votre fiscalité crypto avec précision et conformité.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-primary-400' : 'bg-gray-100 text-gray-600 hover:text-primary-600'} transition-colors duration-300`}>
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
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
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  Liens Rapides
                </h3>
                <ul className="space-y-2.5">
                  {mainNavLinks.concat(secondaryNavLinks).map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className={`flex items-center text-sm ${
                          theme === 'dark' 
                            ? 'text-gray-400 hover:text-primary-400' 
                            : 'text-gray-600 hover:text-primary-600'
                        } transition-colors duration-200`}
                      >
                        <span className="w-4 h-4 mr-2">{link.icon}</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  Légal
                </h3>
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
                      } transition-colors duration-200`}>
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
                  <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-200`}>
                    Mentions légales
                  </a>
                  <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-200`}>
                    Politique de confidentialité
                  </a>
                  <a href="#" className={`text-sm ${theme === 'dark' ? 'text-gray-500 hover:text-primary-400' : 'text-gray-600 hover:text-primary-600'} transition-colors duration-200`}>
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;