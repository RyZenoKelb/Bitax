// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import CustomStyles from '@/components/CustomStyles';
import AuthProvider from '@/components/AuthProvider';

// Ajout d'un type pour les pages avec un layout personnalisé
type NextPageWithLayout = {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: {price: number, change24h: number}}>({});
  
  // Logo Bitax amélioré
  const BitaxLogo = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
    const fontSize = size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl';
    const subtitleSize = size === 'small' ? 'text-[0.6rem]' : size === 'large' ? 'text-sm' : 'text-xs';

    return (
      <motion.div 
        className="flex items-center" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mr-2 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden shadow-lg">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-600 opacity-60"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear"
            }}
          />
          <span className="relative z-10 text-white font-bold text-lg">B</span>
        </div>
        <div className="flex flex-col">
          <motion.span 
            className={`${fontSize} font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            BITAX
          </motion.span>
          <motion.span 
            className={`${subtitleSize} text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            FISCALITÉ CRYPTO
          </motion.span>
        </div>
      </motion.div>
    );
  };

  // Récupérer les prix des cryptos depuis CoinGecko
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polygon,arbitrum,optimism&vs_currencies=eur&include_24h_change=true');
      const data = await response.json();
      
      const formattedData: {[key: string]: {price: number, change24h: number}} = {
        BTC: { 
          price: data.bitcoin.eur, 
          change24h: data.bitcoin.eur_24h_change 
        },
        ETH: { 
          price: data.ethereum.eur, 
          change24h: data.ethereum.eur_24h_change 
        },
        SOL: { 
          price: data.solana.eur, 
          change24h: data.solana.eur_24h_change 
        },
        MATIC: { 
          price: data.polygon.eur, 
          change24h: data.polygon.eur_24h_change 
        },
        ARB: { 
          price: data.arbitrum.eur, 
          change24h: data.arbitrum.eur_24h_change 
        },
        OP: { 
          price: data.optimism.eur, 
          change24h: data.optimism.eur_24h_change 
        }
      };
      
      setCryptoPrices(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des prix crypto:', error);
      // Valeurs par défaut en cas d'erreur
      setCryptoPrices({
        BTC: { price: 61243.75, change24h: 1.2 },
        ETH: { price: 3829.16, change24h: -0.5 },
        SOL: { price: 154.50, change24h: 4.7 },
        MATIC: { price: 0.65, change24h: 2.3 },
        ARB: { price: 1.28, change24h: 5.1 },
        OP: { price: 2.45, change24h: -1.8 }
      });
    }
  };

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
    
    // Récupérer les prix crypto
    fetchCryptoPrices();
    
    // Actualiser les prix toutes les 60 secondes
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
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
    setSidebarOpen(false);
  }, [router.pathname]);

  // Format numérique pour les prix et pourcentages
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };
  
  const formatPercentage = (percentage: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'always'
    }).format(percentage / 100);
  };

  // Vérifier si nous sommes sur une page avec un layout personnalisé (comme dashboard)
  const hasCustomLayout = Component.getLayout || router.pathname === '/dashboard';

  // Si la page a un layout personnalisé, utiliser ce layout
  if (hasCustomLayout && Component.getLayout) {
    return (
      <AuthProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    );
  }

  // Si c'est une page dashboard mais sans custom layout, renvoyer directement
  if (router.pathname === '/dashboard') {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

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

  // Appliquer le layout commun à toutes les autres pages
  return (
    <AuthProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-[#0a051b]">
        <Head>
          <title>Bitax | Fiscalité crypto redéfinie</title>
          <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        
        {/* Styles globaux */}
        <style jsx global>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientFlow 8s ease infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          .pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 5px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
        `}</style>
        
        {/* Inclusion du composant CustomStyles */}
        <CustomStyles />
        
        {/* Overlay pour la sidebar mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Sidebar moderne */}
        <motion.div 
          className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-all duration-300 ease-in-out bg-white/5 dark:bg-gray-900/50 border-r border-gray-200/10 dark:border-gray-700/20 lg:static lg:translate-x-0 backdrop-blur-xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          initial={{ x: -20, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo et branding */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/10 dark:border-gray-700/20">
            <Link href="/" className="flex items-center space-x-2">
              <BitaxLogo />
            </Link>
            
            {/* Bouton de fermeture sur mobile */}
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 lg:hidden hover:bg-gray-100/5 rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation links */}
          <div className="px-3 py-4 overflow-y-auto h-[calc(100vh-64px)] flex flex-col">
            <div className="space-y-1 mb-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link 
                    href={link.href}
                    className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      router.pathname === link.href 
                        ? "bg-primary-600/20 text-primary-400 dark:text-primary-300 border-l-2 border-primary-500 backdrop-blur-md"
                        : "text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 hover:backdrop-blur-md"
                    }`}
                  >
                    <span className={`mr-3 ${
                      router.pathname === link.href 
                        ? "text-primary-500 dark:text-primary-400" 
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}>
                      {link.icon}
                    </span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Crypto Prices Widget avec données réelles */}
            <motion.div 
              className="mb-6 rounded-xl p-3 bg-gradient-to-br from-gray-900/40 to-gray-800/20 border border-gray-700/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 pl-1.5 flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Cours Crypto
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {Object.entries(cryptoPrices).map(([symbol, data], index) => (
                  <motion.div 
                    key={symbol}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mr-2 shadow-sm">
                        <span className="text-xs font-semibold text-white">{symbol}</span>
                      </div>
                      <span className="text-sm text-gray-200">{formatPrice(data.price)}</span>
                    </div>
                    <span className={`text-xs font-medium ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(data.change24h)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Mon compte */}
            <div className="mt-auto space-y-1 border-t border-gray-700/20 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                Compte
              </h3>
              <Link 
                href="/profile"
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 group"
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Mon Profil
              </Link>
              <Link 
                href="/settings"
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 group"
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Paramètres
              </Link>
              <Link 
                href="/logout"
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-900/20 group"
              >
                <span className="mr-3 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                Déconnexion
              </Link>
            </div>
          </div>
          
          {/* Footer de la sidebar */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/20">
            <div className="flex items-center justify-between">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-white/5 dark:hover:bg-gray-700/30 transition-colors"
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
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Header pour mobile */}
          <motion.div 
            className="relative z-10 flex items-center justify-between h-16 bg-white/10 dark:bg-gray-900/50 border-b border-gray-200/10 dark:border-gray-700/20 px-4 lg:hidden backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none rounded-lg hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center">
              <BitaxLogo size="small" />
            </Link>
            
            {/* Profil user sur mobile */}
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none rounded-lg hover:bg-white/5"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Menu utilisateur mobile */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  className="absolute right-0 top-16 w-48 py-2 mt-2 bg-white/10 dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-200/10 dark:border-gray-700/30 backdrop-blur-xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-gray-700/30"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white/5 dark:hover:bg-gray-700/30"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Paramètres
                  </Link>
                  <div className="border-t border-gray-200/10 dark:border-gray-700/20 my-1"></div>
                  <Link 
                    href="/logout" 
                    className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-900/20"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Déconnexion
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Main content area avec background amélioré */}
          <motion.main 
            className="relative flex-1 overflow-y-auto focus:outline-none bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a051b] dark:to-[#0f0a2b]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Effets d'arrière-plan améliorés */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Grille animée */}
              <div className="absolute inset-0 dark:bg-[url('/dashboard-grid.svg')] bg-[url('/dashboard-grid-light.svg')] bg-repeat opacity-10 animate-grid-move"></div>
              
              {/* Effets de dégradé */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent opacity-30 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/10 via-purple-900/5 to-transparent opacity-30 blur-3xl"></div>
              
              {/* Orbes lumineux */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/5 pulse-glow blur-3xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-500/5 pulse-glow blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-blue-500/5 pulse-glow blur-3xl"></div>
            </div>
            
            {/* Contenu principal */}
            <div className="py-6 px-4 sm:px-6 lg:px-8 relative z-10">
              <Component {...pageProps} />
            </div>
          </motion.main>
        </div>
      </div>
    </AuthProvider>
  );
}