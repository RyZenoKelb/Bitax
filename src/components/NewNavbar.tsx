import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import NewBitaxLogo from './NewBitaxLogo';

interface NavbarProps {
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
}

const NewNavbar: React.FC<NavbarProps> = ({ theme = 'dark', toggleTheme }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (profileDropdownOpen) setProfileDropdownOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home' },
    { name: 'Guide', path: '/guide', icon: 'file-text' },
    { name: 'Tarifs', path: '/tarifs', icon: 'dollar-sign' },
    { name: 'Support', path: '/support', icon: 'help-circle' },
  ];
  
  // Gérer le clic sur un élément du menu mobile
  const handleMobileMenuClick = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path: string) => {
    return router.pathname === path || router.pathname.startsWith(`${path}/`);
  };

  // Effet pour fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownOpen || notificationsOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setProfileDropdownOpen(false);
          setNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen, notificationsOpen]);
  
  return (
    <header className={`sticky top-0 z-50 ${theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} backdrop-blur-md border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/dashboard" className="flex items-center focus:outline-none">
              <NewBitaxLogo theme={theme} />
            </Link>
          </div>
          
          {/* Navigation - version Desktop */}
          <nav className="hidden md:ml-6 md:flex md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2
                  transition-all duration-200 
                  ${isActive(item.path) 
                    ? theme === 'dark'
                      ? 'bg-indigo-900/40 text-indigo-300 border-b-2 border-indigo-500' 
                      : 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-500'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="w-4 h-4">
                  <i className={`lucide lucide-${item.icon}`}></i>
                </span>
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Barre de recherche */}
          <div className={`hidden md:flex items-center bg-opacity-20 px-3 py-1.5 rounded-lg border border-opacity-20 flex-1 max-w-xs mx-4 relative group transition-all duration-150 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 focus-within:border-indigo-500' : 'bg-gray-100 border-gray-300 focus-within:border-indigo-500'}`}>
            <span className="w-4 h-4">
              <i className={`lucide lucide-search ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} group-focus-within:text-indigo-500`}></i>
            </span>
            <input
              type="text"
              placeholder="Rechercher..."
              className={`ml-2 bg-transparent border-none outline-none text-sm w-full ${theme === 'dark' ? 'text-white placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'} focus:ring-0`}
            />
          </div>
          
          {/* Actions à droite */}
          <div className="flex items-center">
            {/* Bouton notifications */}
            <div className="relative dropdown-container">
              <button
                onClick={toggleNotifications}
                className={`p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                <span className="w-5 h-5">
                  <i className={`lucide lucide-bell ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}></i>
                </span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              
              {/* Dropdown notifications */}
              {notificationsOpen && (
                <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ring-1 ring-black ring-opacity-5 focus:outline-none`}>
                  <div className={`px-4 py-2 border-b border-opacity-20 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {/* Notifications */}
                    <div className={`px-4 py-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition cursor-pointer`}>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-indigo-800' : 'bg-indigo-100'} flex items-center justify-center`}>
                          <span className="w-4 h-4">
                            <i className={`lucide lucide-bell ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}></i>
                          </span>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Rapport fiscal généré</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Votre rapport pour l'année 2023 est disponible</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Il y a 2 heures</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-4 py-3 hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} transition cursor-pointer`}>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${theme === 'dark' ? 'bg-green-800' : 'bg-green-100'} flex items-center justify-center`}>
                          <span className="w-4 h-4">
                            <i className={`lucide lucide-wallet ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}></i>
                          </span>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nouveau wallet détecté</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Wallet Ethereum connecté avec succès</p>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Hier</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link href="/notifications" className={`block px-4 py-2 text-center text-xs ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                    Voir toutes les notifications
                  </Link>
                </div>
              )}
            </div>
            
            {/* Bouton switch thème */}
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className={`ml-2 p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
            
            {/* Bouton compte utilisateur amélioré */}
            {session?.user && (
              <div className="ml-3 relative dropdown-container">
                <button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center px-3 py-1.5 rounded-full transition-all duration-200 ${profileDropdownOpen ? (theme === 'dark' ? 'bg-gray-800 ring-2 ring-gray-700' : 'bg-gray-100 ring-2 ring-gray-200') : (theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100')}`}
                >
                  {session.user.image ? (
                    <img
                      className={`h-8 w-8 rounded-full border border-opacity-20 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                      src={session.user.image}
                      alt="Profile"
                    />
                  ) : (
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-700'}`}>
                      <span className="text-sm font-medium">{session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}</span>
                    </div>
                  )}
                  
                  <div className="ml-2 mr-1 hidden md:block">
                    <div className="text-left">
                      <div className={`text-sm font-medium truncate max-w-[120px] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {session.user.name || "Utilisateur"}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {session.user.isPremium ? 'Premium' : 'Gratuit'}
                      </div>
                    </div>
                  </div>
                  
                  <span className="w-4 h-4 ml-2">
                    <i className={`lucide lucide-chevron-down ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${profileDropdownOpen ? 'transform rotate-180' : ''}`}></i>
                  </span>
                </button>
                
                {/* Menu dropdown */}
                {profileDropdownOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}>
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Connecté en tant que</p>
                      <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {session.user.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="w-4 h-4 mr-3">
                          <i className="lucide lucide-user"></i>
                        </span>
                        Profil
                      </Link>

                      <Link
                        href="/settings"
                        className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="w-4 h-4 mr-3">
                          <i className="lucide lucide-settings"></i>
                        </span>
                        Paramètres
                      </Link>
                      
                      <Link
                        href="/wallets"
                        className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <span className="w-4 h-4 mr-3">
                          <i className="lucide lucide-wallet"></i>
                        </span>
                        Mes wallets
                      </Link>
                      
                      {!session.user.isPremium && (
                        <Link
                          href="/pricing"
                          className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-indigo-400 hover:bg-indigo-900/50 hover:text-indigo-300' : 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <span className="w-4 h-4 mr-3">
                            <i className="lucide lucide-shield"></i>
                          </span>
                          Passer Premium
                        </Link>
                      )}
                    </div>
                    
                    <div className={`py-1 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                      <button
                        className={`w-full text-left flex items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                      >
                        <span className="w-4 h-4 mr-3">
                          <i className="lucide lucide-log-out"></i>
                        </span>
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Bouton menu mobile */}
            <div className="ml-2 -mr-2 flex md:hidden">
              <button
                onClick={toggleMobileMenu}
                className={`p-2 rounded-md ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                <span className="sr-only">{mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
                {mobileMenuOpen ? (
                  <span className="block h-6 w-6">
                    <i className="lucide lucide-x"></i>
                  </span>
                ) : (
                  <span className="block h-6 w-6">
                    <i className="lucide lucide-menu"></i>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMobileMenuClick(item.path)}
                className={`
                  w-full flex items-center px-3 py-2 rounded-md text-base font-medium
                  ${isActive(item.path) 
                    ? theme === 'dark'
                      ? 'bg-indigo-900 text-indigo-300' 
                      : 'bg-indigo-50 text-indigo-700'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <span className="w-4 h-4 mr-3">
                  <i className={`lucide lucide-${item.icon}`}></i>
                </span>
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default NewNavbar;