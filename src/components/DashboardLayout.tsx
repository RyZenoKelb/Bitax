// src/components/DashboardLayout.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onScanMultiChain?: (chains: NetworkType[]) => void;
}

// Logo SVG amélioré avec animation
const BitaxLogo = ({ isDarkMode = true, size = 'normal' }: { isDarkMode?: boolean; size?: 'small' | 'normal' | 'large' }) => {
  const fontSize = size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl';
  const subtitleSize = size === 'small' ? 'text-[0.6rem]' : size === 'large' ? 'text-sm' : 'text-xs';

  return (
    <motion.div 
      className="flex items-center" 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative mr-2 w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
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

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onScanMultiChain }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: {price: number, change24h: number}}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkType[]>(['eth', 'polygon', 'arbitrum', 'optimism', 'base']);

  // Récupérer les prix des cryptos depuis CoinGecko
  const fetchCryptoPrices = useCallback(async () => {
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
  }, []);

  // Fonction pour le scan multi-chain réel
  const handleMultiChainScan = useCallback(() => {
    setIsLoading(true);
    
    if (onScanMultiChain && selectedNetworks.length > 0) {
      onScanMultiChain(selectedNetworks);
    }
    
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [onScanMultiChain, selectedNetworks]);

  // Sélectionner/désélectionner un réseau pour le scan multi-chain
  const toggleNetworkSelection = (network: NetworkType) => {
    setSelectedNetworks(prev => {
      if (prev.includes(network)) {
        return prev.filter(n => n !== network);
      } else {
        return [...prev, network];
      }
    });
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
    setMounted(true);
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Récupérer les prix des cryptos
    fetchCryptoPrices();
    
    // Actualiser les prix toutes les 60 secondes
    const interval = setInterval(fetchCryptoPrices, 60000);
    
    return () => clearInterval(interval);
  }, [fetchCryptoPrices]);

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

  // Fermer la sidebar sur mobile quand on change de page
  useEffect(() => {
    setIsOpen(false);
    
    // Ajouter un événement de redimensionnement pour fermer le menu sur desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  // Navigation links pour la sidebar
  const sidebarLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'Portefeuille', 
      href: '/wallet', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ) 
    },
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    }
  ];

  if (!mounted) {
    // Éviter le flash en attendant que le thème soit chargé
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a051b]">
      <Head>
        <title>Bitax | Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Style global pour les animations et la personnalisation */}
      <style jsx global>{`
        /* Animations de fond */
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientBG 15s ease infinite;
        }
        
        /* Grille d'arrière-plan animée */
        @keyframes gridMove {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 50px 50px;
          }
        }
        
        .animate-grid-move {
          animation: gridMove 25s linear infinite;
        }
        
        /* Animation d'impulsion lente */
        @keyframes pulseSlow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Étoiles/particules flottantes */
        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .star {
          position: absolute;
          background-color: white;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          opacity: 0.3;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
        
        /* Glassy effect */
        .glass-effect {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Scrollbar personnalisée */
        ::-webkit-scrollbar {
          width: 5px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
        
        /* Éléments de brillance */
        .glow-element {
          box-shadow: 0 0 15px rgba(123, 63, 228, 0.3);
        }
        
        /* Lueur pour les éléments en survol */
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(123, 63, 228, 0.5);
          transition: box-shadow 0.3s ease;
        }
      `}</style>
      
      {/* Overlay pour la sidebar mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar améliorée avec animations */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'} transform transition-all duration-300 ease-in-out bg-white/10 dark:bg-[#110a36]/80 border-r border-gray-100/10 dark:border-gray-700/20 lg:static lg:translate-x-0 backdrop-blur-xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        initial={{ x: -20, opacity: 0.8 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo et branding */}
        <div className={`flex items-center justify-between h-16 px-6 border-b border-gray-100/5 dark:border-gray-700/20 ${!sidebarCollapsed ? '' : 'justify-center'}`}>
          {!sidebarCollapsed ? (
            <Link href="/" className="flex items-center space-x-2">
              <BitaxLogo isDarkMode={theme === 'dark'} />
            </Link>
          ) : (
            <div className="mx-auto">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white font-bold text-lg">B</span>
              </motion.div>
            </div>
          )}
          
          {!sidebarCollapsed && (
            <button 
              className="p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          
          {/* Bouton pour réduire/agrandir la sidebar (visible uniquement sur desktop) */}
          <button 
            className={`p-1.5 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hidden lg:block ${sidebarCollapsed ? 'mx-auto mt-2' : ''}`}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
        
        {/* Navigation links animés */}
        <div className={`px-3 py-4 overflow-y-auto h-[calc(100vh-64px)] flex flex-col`}>
          <div className="space-y-1 flex-1">
            {sidebarLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link 
                  href={link.href}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-3'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    router.pathname === link.href 
                      ? "bg-primary-600/20 text-primary-400 dark:text-primary-300 border-l-2 border-primary-500 backdrop-blur-md"
                      : "text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 hover:backdrop-blur-md"
                  }`}
                >
                  <span className={`${sidebarCollapsed ? 'mr-0' : 'mr-3'} ${
                    router.pathname === link.href 
                      ? "text-primary-500 dark:text-primary-400" 
                      : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}>
                    {link.icon}
                  </span>
                  {!sidebarCollapsed && <span>{link.name}</span>}
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Séparateur avec animation */}
          <motion.div 
            className="my-3 border-t border-gray-100/5 dark:border-gray-700/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          
          {/* Crypto Prices Widget avec données réelles */}
          {!sidebarCollapsed && (
            <motion.div 
              className="mb-6 rounded-xl p-3 bg-gradient-to-br from-gray-900/40 to-gray-800/20 border border-gray-700/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 pl-1.5">Cours Crypto</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {Object.entries(cryptoPrices).map(([symbol, data], index) => (
                  <motion.div 
                    key={symbol}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="flex items-center">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center mr-2 shadow-sm">
                        <span className="text-xs font-semibold text-white">{symbol}</span>
                      </div>
                      <span className="text-sm text-white">{formatPrice(data.price)}</span>
                    </div>
                    <span className={`text-xs ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercentage(data.change24h)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Multi-chain selection */}
          {!sidebarCollapsed && onScanMultiChain && (
            <motion.div
              className="mb-6 rounded-xl p-3 bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-700/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 pl-1.5">Multi-Chain Scan</h3>
              <div className="space-y-2 mb-3">
                {/* Type explicite des réseaux pour éviter l'erreur TypeScript */}
                {((['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => (
                  <div 
                    key={network}
                    className="flex items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => toggleNetworkSelection(network)}
                  >
                    <div className={`w-4 h-4 rounded border ${
                      selectedNetworks.includes(network) 
                        ? 'bg-primary-500 border-primary-500' 
                        : 'bg-transparent border-gray-500'
                    } mr-2 flex items-center justify-center transition-colors`}>
                      {selectedNetworks.includes(network) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm" style={{ backgroundColor: SUPPORTED_NETWORKS[network]?.color || '#627EEA' }}>
                        <span className="text-xs font-bold text-white">{network.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-sm text-white">{SUPPORTED_NETWORKS[network]?.name || network}</span>
                    </div>
                  </div>
                )))}
              </div>
              <button
                onClick={handleMultiChainScan}
                disabled={isLoading || selectedNetworks.length === 0}
                className={`w-full py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center
                  ${isLoading || selectedNetworks.length === 0
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                  } transition-all`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Scanning...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <span>Scan Multi-Chain</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
          
          {/* Mon compte - avec animation */}
          <div className={`mt-auto space-y-1 ${sidebarCollapsed ? 'px-0' : 'px-2'}`}>
            <h3 className={`text-xs font-semibold text-gray-400 uppercase tracking-wider ${sidebarCollapsed ? 'text-center' : 'px-3 mb-2'}`}>
              {!sidebarCollapsed ? 'Compte' : ''}
            </h3>
            {!sidebarCollapsed && (
              <>
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
              </>
            )}
            
            {/* Icons seulement si sidebar collapsed */}
            {sidebarCollapsed && (
              <>
                <Link 
                  href="/profile"
                  className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 group"
                >
                  <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/settings"
                  className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-white/5 dark:text-gray-300 dark:hover:bg-gray-800/40 group"
                >
                  <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                </Link>
                <Link 
                  href="/logout"
                  className="flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-500 hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-900/20 group"
                >
                  <span className="text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Footer de la sidebar */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/5 dark:border-gray-700/20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
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
            
            {!sidebarCollapsed && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <span>v1.0.0</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header pour mobile */}
        <motion.div 
          className="relative z-10 flex items-center justify-between h-16 bg-white/10 dark:bg-[#110a36]/80 border-b border-gray-100/5 dark:border-gray-700/20 px-4 lg:hidden backdrop-blur-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none rounded-lg hover:bg-white/5"
            onClick={() => setIsOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center">
            <BitaxLogo isDarkMode={theme === 'dark'} size="small" />
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
                <div className="border-t border-gray-100/5 dark:border-gray-700/20 my-1"></div>
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
          className="relative flex-1 overflow-y-auto focus:outline-none bg-gradient-to-b from-gray-50 to-gray-100 dark:from-[#0a051b] dark:to-[#0a051b]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Effets d'arrière-plan améliorés */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Grille animée améliorée */}
            <div className="absolute inset-0 dark:bg-[url('/dashboard-grid.svg')] bg-[url('/dashboard-grid-light.svg')] bg-repeat opacity-10 animate-grid-move"></div>
            
            {/* Effets de dégradé lumineux plus élégants */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-indigo-900/10 via-purple-900/5 to-transparent opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/10 via-purple-900/5 to-transparent opacity-30 blur-3xl"></div>
            
            {/* Étoiles/Particules améliorées générées dynamiquement */}
            <div className="absolute w-full h-full opacity-20 stars-container">
              {Array.from({ length: 50 }).map((_, i) => (
                <div 
                  key={i} 
                  className="star" 
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    opacity: Math.random() * 0.5 + 0.2,
                    animation: `pulseSlow ${Math.random() * 5 + 3}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>
            
            {/* Orbes lumineux animés de façon plus fluide */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/5 animate-pulse-slow blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-500/5 animate-pulse-slow blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-blue-500/5 animate-pulse-slow blur-3xl"></div>
          </div>
          
          {/* Contenu principal avec transition améliorée */}
          <div className="py-6 px-4 sm:px-6 lg:px-8 relative z-10">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

// Exporter DashboardStyles séparément (si nécessaire)
export const DashboardStyles = () => {
  return (
    <style jsx global>{`
      @font-face {
        font-family: 'Orbitron';
        font-style: normal;
        font-weight: 400-900;
        font-display: swap;
        src: url('/fonts/Orbitron-Variable.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100-900;
        font-display: swap;
        src: url('/fonts/Inter-Variable.woff2') format('woff2');
      }
      
      /* Mode sombre/clair pour le body */
      body.dark {
        background-color: #0a051b;
        color: #e2e8f0;
      }
      
      body.light {
        background-color: #f8fafc;
        color: #1e293b;
      }
      
      /* Transitions globales */
      *, *::before, *::after {
        transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
      
      /* Glow effects pour les cartes et boutons */
      .card-glow {
        box-shadow: 0 0 20px rgba(80, 70, 230, 0.1);
      }
      
      .card-glow:hover {
        box-shadow: 0 0 30px rgba(80, 70, 230, 0.2);
      }
      
      /* Styles de boutons personnalisés */
      .btn-primary {
        background-image: linear-gradient(to right, #4f46e5, #8b5cf6);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
      }
      
      .btn-primary:hover {
        background-image: linear-gradient(to right, #4338ca, #7c3aed);
        box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
      }
      
      /* Styles de texte modernes */
      .text-gradient {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        background-image: linear-gradient(to right, #4f46e5, #8b5cf6);
      }
      
      /* Animations spéciales */
      @keyframes float-up-down {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }
      
      .animate-float {
        animation: float-up-down 3s ease-in-out infinite;
      }
      
      /* Verre dépoli */
      .backdrop-blur {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
    `}</style>
  );
};

export default DashboardLayout;