// src/pages/dashboard.tsx
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import WalletConnectButton from '@/components/WalletConnectButton';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
// Removed unused import
import OnboardingWizard from '@/components/OnboardingWizard';
import DashboardHeader from '@/components/DashboardHeader';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
// Removed unused import

// Ignore le layout par défaut pour cette page
Dashboard.getLayout = (page: any) => page;

export default function Dashboard() {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [, setProvider] = useState<ethers.BrowserProvider | null>(null); // Removed unused variable
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setIsFirstVisit] = useState<boolean>(true); // Removed unused variable
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [selectedNetworks, setSelectedNetworks] = useState<NetworkType[]>(['eth']);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: {price: number, change24h: number}}>({});
  const [showNetworkSelector, setShowNetworkSelector] = useState<boolean>(false);

  // Toggle du thème (light/dark)
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

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

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
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

  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasVisited = localStorage.getItem('bitax-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('bitax-visited', 'true');
    } else {
      setIsFirstVisit(false);
    }
    
    // Vérifier le statut premium (simulé ici)
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
  }, []);

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Préselectionner tous les réseaux par défaut pour le multi-scan
      setSelectedNetworks(['eth', 'polygon', 'arbitrum', 'optimism', 'base']);
      
      // Charger automatiquement les transactions après connexion
      await fetchTransactions(address, activeNetwork);
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };

  // Récupérer les transactions
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      setTransactions(filteredTxs);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network?: NetworkType) => {
    if (network) {
      setActiveNetwork(network);
      if (walletAddress) {
        await fetchTransactions(walletAddress, network);
      }
    } else {
      // Mode multi-chaîne - ici nous scannons seulement l'active network pour l'instant
      if (walletAddress) {
        await fetchTransactions(walletAddress, activeNetwork);
      }
    }
  };

  // Fonction de scan multi-chain
  const handleScanMultiChain = async () => {
    if (!walletAddress || selectedNetworks.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Tableau pour stocker toutes les transactions
      let allTransactions: any[] = [];
      
      // Parcourir tous les réseaux sélectionnés
      for (const network of selectedNetworks) {
        try {
          const txs = await getTransactions(walletAddress, network);
          const filteredTxs = filterSpamTransactions(txs);
          
          // Ajouter les transactions de ce réseau au tableau global
          allTransactions = [...allTransactions, ...filteredTxs];
        } catch (networkError) {
          console.error(`Erreur lors de la récupération des transactions pour ${network}:`, networkError);
          // Continuer avec les autres réseaux même si un échoue
        }
      }
      
      // Mettre à jour l'état avec toutes les transactions
      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erreur lors du scan multi-chain:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle la sélection d'un réseau pour le multi-scan
  const toggleNetworkSelection = (network: NetworkType) => {
    setSelectedNetworks(prev => {
      if (prev.includes(network)) {
        return prev.filter(n => n !== network);
      } else {
        return [...prev, network];
      }
    });
  };

  // Fonction d'export
  const handleExportReport = () => {
    // Simulation d'export
    console.log("Exporting report...");
    // Implémentation réelle à ajouter
  };

  // Compléter l'onboarding
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Débloquer les fonctionnalités premium
  const handleUnlockPremium = () => {
    setIsPremiumUser(true);
    localStorage.setItem('bitax-premium', 'true');
  };

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

  // Sélection de tous les réseaux d'un coup
  const selectAllNetworks = () => {
    setSelectedNetworks(['eth', 'polygon', 'arbitrum', 'optimism', 'base']);
  };

  // Désélection de tous les réseaux d'un coup
  const deselectAllNetworks = () => {
    setSelectedNetworks([]);
  };

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
          </div>
        );
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
        </motion.div>
      </motion.main>
        </div>
      </motion.div>
    );
  };

  // Liste des liens de la sidebar modernisée
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

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-[#0a051b]">
      <Head>
        <title>Bitax | Dashboard</title>
        <meta name="description" content="Bitax - Analysez et déclarez facilement vos taxes crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
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
        
        /* Stars animation */
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          animation: starTwinkle var(--twinkle-duration, 3s) ease-in-out infinite;
          animation-delay: var(--twinkle-delay, 0s);
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

      {/* Overlay pour la sidebar mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        </motion.div>
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
              <motion.div>
          <div className="space-y-1 mb-6">
            {sidebarLinks.map((link, index) => (
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
          
          {/* Widget Multi-chain */}
          {isWalletConnected && (
            <motion.div
              className="mb-6 rounded-xl p-3 bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-700/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase pl-1.5 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Multi-Chain Scan
                </h3>
                <div className="flex space-x-1">
                  <button 
                    onClick={selectAllNetworks}
                    className="p-1 text-xs text-indigo-400 hover:text-indigo-300"
                    title="Sélectionner tous"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </button>
                  <button 
                    onClick={deselectAllNetworks}
                    className="p-1 text-xs text-gray-400 hover:text-gray-300"
                    title="Désélectionner tous"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 mb-3">
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
                      <span className="text-sm text-gray-200">{SUPPORTED_NETWORKS[network]?.name || network}</span>
                    </div>
                  </div>
                )))}
              </div>
              
              <button
                onClick={handleScanMultiChain}
                disabled={isLoading || selectedNetworks.length === 0}
                className={`w-full py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center
                  ${isLoading 
                    ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                    : selectedNetworks.length === 0
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
            
            {/* Étoiles/Particules brillantes */}
            <div className="absolute w-full h-full">
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
                    '--twinkle-duration': `${Math.random() * 3 + 2}s`,
                    '--twinkle-delay': `${Math.random() * 2}s`
                  } as React.CSSProperties}
                />
              ))}
            </div>
            
            {/* Orbes lumineux */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/5 pulse-glow blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-500/5 pulse-glow blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-blue-500/5 pulse-glow blur-3xl"></div>
          </div>
          
          {/* Contenu du dashboard */}
          <div className="py-6 px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
            {showOnboarding && (
              <OnboardingWizard 
                onComplete={handleOnboardingComplete} 
                onConnect={handleWalletConnect} 
                skipOnboarding={() => setShowOnboarding(false)}
              />
            )}
            
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Colonne latérale - réduite à 1/4 pour donner plus d'espace au contenu principal */}
              <div className="lg:col-span-1 space-y-6">
                {/* Panneau de connexion wallet - amélioré visuellement */}
                {!isWalletConnected ? (
                  <motion.div 
                    className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg border border-gray-100/10 dark:border-gray-700/20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 relative overflow-hidden">
                      {/* Effet de particules animées */}
                      <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute rounded-full bg-white"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              width: `${Math.random() * 6 + 2}px`,
                              height: `${Math.random() * 6 + 2}px`,
                              animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
                              animationDelay: `${Math.random() * 2}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center relative z-10">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 mr-3 shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        Connectez votre wallet
                      </h2>
                      <p className="text-gray-300 mb-6 relative z-10">
                        Pour commencer, connectez votre wallet crypto et analysez vos transactions.
                      </p>
                      <WalletConnectButton 
                        onConnect={handleWalletConnect}
                        variant="primary"
                        fullWidth
                        size="lg"
                      />
                    </div>
                    
                    {/* Réseaux supportés - design moderne */}
                    <div className="bg-white/5 dark:bg-gray-900/30 px-6 py-4 border-t border-gray-100/5 dark:border-gray-700/30">
                      <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Réseaux supportés</p>
                      <div className="flex flex-wrap gap-2">
                        {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network, i) => (
                          <div 
                            key={i} 
                            className="group flex items-center px-2 py-1 rounded-full bg-white/5 dark:bg-gray-800/50 shadow-sm border border-gray-100/5 dark:border-gray-700/30 text-xs transition-all duration-300 hover:bg-white/10 dark:hover:bg-gray-700/50"
                            title={SUPPORTED_NETWORKS[network]?.name || network}
                          >
                            <div 
                              className="w-3 h-3 rounded-full mr-1.5 transition-transform group-hover:scale-110" 
                              style={{ backgroundColor: SUPPORTED_NETWORKS[network]?.color || '#627EEA' }}
                            ></div>
                            <span className="font-medium text-white">{(network as string).toUpperCase().substring(0, 4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg overflow-hidden backdrop-blur-lg border border-gray-100/10 dark:border-gray-700/20"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 relative overflow-hidden">
                      {/* Fond animé subtil */}
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl pulse-glow"></div>
                      <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl pulse-glow"></div>
                      
                      <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mr-3 shadow-lg">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        Wallet connecté
                      </h2>
                      <div className="flex items-center mb-4 bg-gray-900/30 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100/5 dark:border-gray-700/30">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-gray-100 font-mono text-sm">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </p>
                        <button 
                          className="ml-auto text-gray-400 hover:text-gray-200 dark:hover:text-gray-300 transition-colors"
                          title="Copier l'adresse"
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            // Notification à ajouter
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Sélection du réseau */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          Sélectionner un réseau
                        </h3>
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => (
                            <button
                              key={network}
                              onClick={() => handleScanNetwork(network)}
                              className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeNetwork === network 
                                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md border border-indigo-500/40' 
                                  : 'bg-gray-900/20 text-gray-300 hover:bg-gray-900/40 dark:bg-gray-800/30 dark:hover:bg-gray-700/50 backdrop-blur-sm border border-gray-100/5 dark:border-gray-700/30'
                              }`}
                            >
                              {/* Icônes des réseaux */}
                              <div className="flex items-center">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center mr-3 shadow-sm" 
                                  style={{ backgroundColor: SUPPORTED_NETWORKS[network]?.color || '#627EEA' }}
                                >
                                  <span className="text-xs font-bold text-white">{network.charAt(0).toUpperCase()}</span>
                                </div>
                                {/* Nom du réseau avec première lettre en majuscule */}
                                {SUPPORTED_NETWORKS[network]?.name || network.charAt(0).toUpperCase() + network.slice(1)}
                              </div>
                              
                              {/* Indicateur actif avec animation */}
                              {activeNetwork === network && (
                                <div className="ml-auto">
                                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              )}
                              
                              {/* Indicateur de chargement */}
                              {activeNetwork === network && isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 bg-opacity-90 rounded-lg">
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        {/* Bouton pour afficher/masquer la sélection multi-chain */}
                        <button
                          onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                          className="w-full mb-2 flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-white/10 dark:bg-gray-800/30 dark:hover:bg-gray-700/50 border border-gray-100/5 dark:border-gray-700/30 text-gray-300 text-sm font-medium rounded-lg shadow-sm transition-colors duration-300 backdrop-blur-sm"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          {showNetworkSelector ? "Masquer la sélection Multi-Chain" : "Afficher la sélection Multi-Chain"}
                        </button>
                        
                        {/* UI de sélection multi-chain */}
                        <AnimatePresence>
                          {showNetworkSelector && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mb-3"
                            >
                              <div className="p-3 rounded-lg bg-white/5 dark:bg-gray-800/30 border border-gray-100/5 dark:border-gray-700/30 backdrop-blur-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-xs font-medium text-gray-300">Sélection réseaux</h4>
                                  <div className="flex space-x-2">
                                    <button 
                                      onClick={selectAllNetworks}
                                      className="p-1 text-xs text-indigo-400 hover:text-indigo-300"
                                    >
                                      Tout sélectionner
                                    </button>
                                    <div className="w-px h-4 bg-gray-700"></div>
                                    <button 
                                      onClick={deselectAllNetworks}
                                      className="p-1 text-xs text-gray-400 hover:text-gray-300"
                                    >
                                      Effacer
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-1 mb-3">
                                  {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => (
                                    <div 
                                      key={network}
                                      className="flex items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                      onClick={() => toggleNetworkSelection(network)}
                                    >
                                      <div className={`w-4 h-4 rounded border ${
                                        selectedNetworks.includes(network) 
                                          ? 'bg-indigo-500 border-indigo-500' 
                                          : 'bg-transparent border-gray-500'
                                      } mr-2 flex items-center justify-center transition-colors`}>
                                        {selectedNetworks.includes(network) && (
                                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                          </svg>
                                        )}
                                      </div>
                                      <div className="flex items-center">
                                        <div 
                                          className="w-5 h-5 rounded-full flex items-center justify-center mr-2 shadow-sm" 
                                          style={{ backgroundColor: SUPPORTED_NETWORKS[network]?.color || '#627EEA' }}
                                        >
                                          <span className="text-xs font-bold text-white">{network.charAt(0).toUpperCase()}</span>
                                        </div>
                                        <span className="text-sm text-gray-200">{SUPPORTED_NETWORKS[network]?.name || network}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                <button
                                  onClick={handleScanMultiChain}
                                  disabled={isLoading || selectedNetworks.length === 0}
                                  className={`w-full py-2 rounded-lg text-sm font-medium shadow-sm flex items-center justify-center
                                    ${isLoading || selectedNetworks.length === 0
                                      ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                                    } transition-all duration-300`}
                                >
                                  {isLoading ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      <span>Scan en cours...</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                      </svg>
                                      <span>Lancer le Scan Multi-Chain</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Statistiques */}
                    {transactions.length > 0 && (
                      <div className="bg-white/5 dark:bg-gray-900/30 px-6 py-4 border-t border-gray-100/5 dark:border-gray-700/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="flex items-center text-sm font-medium text-gray-300">
                            <svg className="w-4 h-4 mr-1.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Transactions trouvées
                          </span>
                          <span className="text-lg font-bold text-white">{transactions.length}</span>
                        </div>
                        <div className="w-full bg-gray-800/50 dark:bg-gray-800/80 rounded-full h-1.5 mb-3 overflow-hidden">
                          <motion.div 
                            className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                        
                        {/* Mini statistiques améliorées */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/5 dark:bg-gray-800/30 rounded-lg p-2 border border-gray-100/5 dark:border-gray-700/30 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Réseau</span>
                              <span className="font-medium text-white">{activeNetwork.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="bg-white/5 dark:bg-gray-800/30 rounded-lg p-2 border border-gray-100/5 dark:border-gray-700/30 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Status</span>
                              <span className="font-medium text-green-400">Actif</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {/* Bannière Premium - design luxueux */}
                {!isPremiumUser && (
                  <motion.div 
                    className="relative rounded-2xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 animate-gradient"></div>
                    
                    {/* Particules animées */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div 
                          key={i} 
                          className="absolute rounded-full bg-white"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            opacity: Math.random() * 0.5 + 0.3,
                            animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite alternate`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Effet de cercle brillant */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h3 className="ml-3 text-lg font-bold text-white">Passez à Premium</h3>
                      </div>
                      <p className="text-white/90 text-sm mb-4">
                        Débloquez toutes les fonctionnalités et analysez un nombre illimité de transactions.
                      </p>
                      <div className="space-y-3 mb-5">
                        {[
                          "Transactions illimitées",
                          "Méthodes de calcul avancées",
                          "Exports complets PDF/CSV"
                        ].map((feature, idx) => (
                          <div key={idx} className="flex items-start">
                            <svg className="w-5 h-5 text-white mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-white/90 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleUnlockPremium}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-white hover:bg-white/90 text-indigo-600 text-sm font-medium rounded-lg shadow-lg transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Débloquer Premium
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Contenu principal - redesign complet mais en préservant les fonctionnalités */}
              <div className="lg:col-span-3 space-y-6">
                {/* Header du dashboard avec DashboardHeader amélioré */}
                {isWalletConnected && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <DashboardHeader
                      walletAddress={walletAddress}
                      transactionCount={transactions.length}
                      isPremiumUser={isPremiumUser}
                      onScanRequest={handleScanNetwork}
                      onExportReport={handleExportReport}
                      isLoading={isLoading}
                      lastUpdated={lastUpdated || undefined}
                    />
                  </motion.div>
                )}
                
                {/* Message d'erreur animé */}
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {isLoading ? (
                  <motion.div 
                    className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg p-8 text-center border border-gray-100/10 dark:border-gray-700/20 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-700/30"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-500 animate-spin"></div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Chargement des transactions</h3>
                      <p className="text-gray-300 mb-6">
                        Nous analysons vos transactions sur {activeNetwork.toUpperCase()}...
                      </p>
                      <div className="w-64 h-2 bg-gray-800/80 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {isWalletConnected ? (
                      transactions.length > 0 ? (
                        <>
                          {/* Composants du tableau de bord, avec animation d'apparition */}
                          <motion.div 
                            className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg border border-gray-100/10 dark:border-gray-700/20 p-5 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            <TransactionSummary 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                            />
                          </motion.div>
                          
                          <motion.div 
                            className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg border border-gray-100/10 dark:border-gray-700/20 p-5 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <TaxDashboard 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                              walletAddress={walletAddress}
                            />
                          </motion.div>
                          
                          <motion.div 
                            className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg border border-gray-100/10 dark:border-gray-700/20 p-5 backdrop-blur-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            <TransactionList 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                            />
                          </motion.div>
                        </>
                      ) : (
                        <motion.div 
                          className="bg-white/10 dark:bg-gray-800/40 rounded-2xl shadow-lg p-8 text-center border border-gray-100/10 dark:border-gray-700/20 backdrop-blur-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="flex flex-col items-center max-w-md mx-auto">
                            <div className="w-24 h-24 relative mb-6">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 animate-pulse-slow opacity-25 blur-xl"></div>
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 opacity-50"></div>
                              <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Bienvenue sur Bitax</h3>
                            <p className="text-gray-300 mb-6">
                              Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
                            </p>
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              <WalletConnectButton
                                onConnect={handleWalletConnect}
                                variant="primary"
                                size="lg"
                              />
                            </motion.div>
                            <motion.p 
                              className="mt-6 text-sm text-gray-400"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.5 }}
                            >
                              Nous ne stockons jamais vos clés privées. Vos données restent sécurisées.
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
          </motion.main>
        </div>
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
                          <div className="flex flex-col items-center max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 relative">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 opacity-50"></div>
                              <svg className="w-12 h-12 text-gray-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork?.toUpperCase()}.
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Aucune transaction trouvée</h3>
                            <p className="text-gray-300 mb-6">
                              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork.toUpperCase()}.
                              <br />Essayez de scanner un autre réseau ou utilisez le scan multi-chain.
                            </p>
                                onClick={() => handleScanNetwork(activeNetwork || 'eth')}
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleScanNetwork(activeNetwork)}
                                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all duration-200 flex items-center shadow-md"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Scanner à nouveau
                              </motion.button>
                              <motion.button
                                  setShowNetworkSelector?.(true);
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  // Activer le panel multi-chain
                                  setShowNetworkSelector(true);
                                }}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center backdrop-blur-sm border border-gray-100/10 dark:border-gray-700/20 shadow-md"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Essayer le scan multi-chain
                              </motion.button>
                            </div>
                          </div>