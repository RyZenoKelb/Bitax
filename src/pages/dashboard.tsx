// src/pages/dashboard.tsx
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WalletConnectButton from '@/components/WalletConnectButton';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
import PremiumUnlock from '@/components/PremiumUnlock';
import OnboardingWizard from '@/components/OnboardingWizard';
import DashboardHeader from '@/components/DashboardHeader';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// Ignore le layout par défaut pour cette page
Dashboard.getLayout = (page: any) => page;

// Types pour les prix crypto
interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  const [currentlyScanning, setCurrentlyScanning] = useState<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [scanComplete, setScanComplete] = useState(false);
  const scanCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [multiChainScanning, setMultiChainScanning] = useState(false);
  const [multiChainProgress, setMultiChainProgress] = useState<Record<string, number>>({
    eth: 0,
    polygon: 0,
    arbitrum: 0,
    optimism: 0,
    base: 0
  });
  const [sidebarHover, setSidebarHover] = useState(false);

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
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
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

  // Récupérer les prix des cryptos
  useEffect(() => {
    const fetchCryptoPrices = async () => {
      setLoadingPrices(true);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=fr');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des prix');
        }
        const data = await response.json();
        setCryptoPrices(data.slice(0, 5)); // Prendre les 5 premières cryptos
      } catch (error) {
        console.error('Erreur lors de la récupération des prix des cryptos:', error);
        // Utiliser des données de secours en cas d'échec
        setCryptoPrices([
          { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 51243.75, price_change_percentage_24h: 1.2, image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
          { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2829.16, price_change_percentage_24h: -0.5, image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
          { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 124.50, price_change_percentage_24h: 4.7, image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png' },
          { id: 'binancecoin', symbol: 'bnb', name: 'Binance Coin', current_price: 340.25, price_change_percentage_24h: 0.8, image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
          { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 0.45, price_change_percentage_24h: -1.2, image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png' }
        ]);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchCryptoPrices();
    // Rafraîchir les prix toutes les 2 minutes
    const interval = setInterval(fetchCryptoPrices, 120000);
    return () => clearInterval(interval);
  }, []);

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

  // Nettoyer les timeouts lors du démontage du composant
  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      if (scanCompleteTimeoutRef.current) {
        clearTimeout(scanCompleteTimeoutRef.current);
      }
    };
  }, []);

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions après connexion
      await fetchTransactions(address, activeNetwork);
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };

  // Animation de progression du scan
  const animateScanProgress = (network: string) => {
    setCurrentlyScanning(network);
    setShowScanAnimation(true);
    setScanProgress(0);
    
    // Simuler la progression du scan
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(Math.min(progress, 95)); // Jusqu'à 95%, les 5% restants seront complétés quand les données arrivent
      if (progress >= 95) {
        clearInterval(interval);
      }
    }, 100);
    
    return interval;
  };

  // Récupérer les transactions
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return [];
    
    setIsLoading(true);
    setError(null);
    
    // Démarrer l'animation de progression
    const progressInterval = animateScanProgress(SUPPORTED_NETWORKS[network]?.name || network);
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      // Compléter le scan à 100%
      clearInterval(progressInterval);
      setScanProgress(100);
      
      // Afficher le message de complétion
      setScanComplete(true);
      if (scanCompleteTimeoutRef.current) {
        clearTimeout(scanCompleteTimeoutRef.current);
      }
      scanCompleteTimeoutRef.current = setTimeout(() => {
        setScanComplete(false);
        setShowScanAnimation(false);
        setCurrentlyScanning(null);
      }, 2000);
      
      setLastUpdated(new Date());
      return filteredTxs;
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions sur ${network}:`, error);
      
      // Arrêter l'animation en cas d'erreur
      clearInterval(progressInterval);
      setShowScanAnimation(false);
      
      if (!multiChainScanning) {
        setError(`Impossible de récupérer les transactions sur ${network}. Veuillez réessayer plus tard.`);
      }
      return [];
    } finally {
      if (!multiChainScanning) {
        setIsLoading(false);
      }
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network?: NetworkType) => {
    if (!walletAddress) return;
    
    if (!network) {
      // Mode multi-chaîne - scanner toutes les chaînes disponibles
      setMultiChainScanning(true);
      setIsLoading(true);
      
      // Réinitialiser la progression multi-chaîne
      setMultiChainProgress({
        eth: 0,
        polygon: 0,
        arbitrum: 0,
        optimism: 0,
        base: 0
      });
      
      const allNetworks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
      const allTransactions: any[] = [];
      
      for (const net of allNetworks) {
        // Mettre à jour le réseau actif
        setActiveNetwork(net);
        
        // Mettre à jour la progression pour ce réseau
        setMultiChainProgress(prev => ({
          ...prev,
          [net]: 10 // Démarrage à 10%
        }));
        
        // Simuler la progression pour ce réseau
        const updateProgress = () => {
          setMultiChainProgress(prev => {
            const currentProgress = prev[net];
            if (currentProgress < 90) {
              return {
                ...prev,
                [net]: currentProgress + 5
              };
            }
            return prev;
          });
        };
        
        const progressInterval = setInterval(updateProgress, 150);
        
        // Récupérer les transactions pour ce réseau
        try {
          const networkTxs = await fetchTransactions(walletAddress, net);
          allTransactions.push(...networkTxs);
          
          // Marquer ce réseau comme terminé
          setMultiChainProgress(prev => ({
            ...prev,
            [net]: 100
          }));
        } catch (error) {
          console.error(`Erreur lors du scan de ${net}:`, error);
        } finally {
          clearInterval(progressInterval);
        }
      }
      
      // Mise à jour de l'ensemble des transactions trouvées
      setTransactions(allTransactions);
      setLastUpdated(new Date());
      setIsLoading(false);
      setMultiChainScanning(false);
    } else {
      // Scanner un réseau spécifique
      setActiveNetwork(network);
      const txs = await fetchTransactions(walletAddress, network);
      setTransactions(txs);
    }
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

  // Formater les prix de crypto
  const formatCryptoPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };

  // Logo Bitax Amélioré
  const BitaxLogo = ({ size = 'normal', animated = false }: { size?: 'small' | 'normal' | 'large', animated?: boolean }) => {
    const fontSize = size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl';
    const subtitleSize = size === 'small' ? 'text-[0.6rem]' : size === 'large' ? 'text-sm' : 'text-xs';

    return (
      <div className="flex items-center">
        <div className={`flex flex-col ${animated ? 'animate-logo-pulse' : ''}`}>
          <div className="relative">
            <span className={`${fontSize} font-extrabold font-display tracking-tight`}>
              <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-500">
                BITAX
              </span>
            </span>
            {animated && (
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 opacity-30 blur-lg rounded-lg"></div>
            )}
          </div>
          <span className={`${subtitleSize} text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide`}>
            FISCALITÉ CRYPTO
          </span>
        </div>
      </div>
    );
  };

  // Liste des liens de la sidebar
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
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-gray-900 relative">
      <Head>
        <title>Bitax | Dashboard</title>
        <meta name="description" content="Bitax - Analysez et déclarez facilement vos taxes crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Styles spécifiques pour le dashboard */}
      <style jsx global>{`
        /* Importation des polices */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        
        /* Effets de background */
        body {
          position: relative;
          overflow-x: hidden;
          font-family: 'Inter', sans-serif;
        }
        
        /* Scrollbar stylisée */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.7);
        }
        
        /* Animations */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-floating {
          animation: floating 5s ease-in-out infinite;
        }
        
        @keyframes logo-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(99, 102, 241, 0.8));
          }
        }
        
        .animate-logo-pulse {
          animation: logo-pulse 2s ease-in-out infinite;
        }
        
        @keyframes bg-gradient-shift {
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
        
        .animate-bg-shift {
          background-size: 200% 200%;
          animation: bg-gradient-shift 15s ease infinite;
        }
        
        /* Effet de néon pour les éléments importants */
        .neon-effect {
          filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.6));
        }
        
        /* Boutons */
        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px -1px rgba(99, 102, 241, 0.3);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid;
          border-color: #6366f1;
          color: #6366f1;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .btn-outline:hover {
          background: rgba(99, 102, 241, 0.1);
          transform: translateY(-2px);
        }
        
        .light .btn-outline {
          border-color: #4f46e5;
          color: #4f46e5;
        }
        
        .light .btn-outline:hover {
          background: rgba(99, 102, 241, 0.05);
        }
        
        /* Glassmorphism pour les cartes */
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        }
        
        .light .glass-card {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        /* Network button styles */
        .network-button {
          background: rgba(99, 102, 241, 0.1);
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }
        
        .network-button:hover {
          background: rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }
        
        .network-button-active {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.8), rgba(79, 70, 229, 0.9));
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          border: 1px solid rgba(99, 102, 241, 0.6);
        }
        
        /* Sidebar transitions */
        .sidebar-expanded {
          width: 240px;
          transition: width 0.3s ease-in-out;
        }
        
        .sidebar-collapsed {
          width: 80px;
          transition: width 0.3s ease-in-out;
        }
        
        .sidebar-text {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
        
        .sidebar-text-hidden {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        /* Progress bar animation */
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        
        .animate-progress {
          animation: progress 2s linear;
        }
        
        /* Rise in animation */
        @keyframes rise-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-rise {
          animation: rise-in 0.5s ease-out forwards;
        }
        
        /* Fade in animation */
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-fade {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        /* Staggered animations for lists */
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        .stagger-5 { animation-delay: 0.5s; }
      `}</style>

      {/* Effets de background avancés */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-900 dark:to-gray-950 animate-bg-shift"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-floating"></div>
        
        {/* Grille élégante */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMSkiIHN0cm9rZS13aWR0aD0iMC41Ij48cGF0aCBkPSJNMCAwaDYwdjYwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHN0cm9rZT0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjAuNSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
        
        {/* Particles effect (subtle) */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-white dark:bg-indigo-500/30"
                style={{
                  width: `${Math.random() * 6 + 1}px`,
                  height: `${Math.random() * 6 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.3,
                  animation: `floating ${Math.random() * 10 + 10}s linear infinite`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay pour la sidebar mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar modernisée */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 transform transition-all duration-300 ease-in-out bg-white dark:bg-gray-800/90 backdrop-blur-xl border-r border-gray-200/70 dark:border-gray-700/50 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        {/* Logo et branding */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/70 dark:border-gray-700/50">
          <Link href="/" className="flex items-center space-x-2">
            <div className={`transition-all duration-300 ${isCollapsed && !sidebarHover ? 'ml-1' : ''}`}>
              <BitaxLogo animated={true} size={isCollapsed && !sidebarHover ? 'small' : 'normal'} />
            </div>
          </Link>
          
          <div className="flex items-center">
            {/* Bouton de toggle sidebar sur desktop */}
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hidden lg:block transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              )}
            </button>
            
            {/* Bouton de fermeture sur mobile */}
            <button 
              className="p-2 text-gray-500 dark:text-gray-400 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="px-3 py-4 overflow-y-auto h-full flex flex-col">
          <div className="space-y-1.5">
            {sidebarLinks.map((link, index) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  router.pathname === link.href 
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 hover:shadow-sm"
                } ${isCollapsed && !sidebarHover ? 'justify-center' : ''}`}
              >
                <span className={`${
                  router.pathname === link.href 
                    ? "text-indigo-600 dark:text-indigo-400" 
                    : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                } ${isCollapsed && !sidebarHover ? '' : 'mr-3'} transition-all duration-200`}>
                  {link.icon}
                </span>
                <span className={`transition-all duration-300 ${isCollapsed && !sidebarHover ? 'hidden' : 'sidebar-text'}`}>
                  {link.name}
                </span>
                
                {/* Indicateur actif */}
                {router.pathname === link.href && (
                  <span className={`absolute ${isCollapsed && !sidebarHover ? 'right-2' : 'right-3'} w-1.5 h-1.5 rounded-full bg-indigo-500`}></span>
                )}
              </Link>
            ))}
          </div>
          
          {/* Séparateur */}
          <div className={`my-5 border-t border-gray-200 dark:border-gray-700/50 ${isCollapsed && !sidebarHover ? 'mx-2' : 'mx-0'}`}></div>
          
          {/* Mon compte */}
          <div className="space-y-1.5">
            <h3 className={`px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${isCollapsed && !sidebarHover ? 'hidden' : ''}`}>
              Compte
            </h3>
            <Link 
              href="/profile"
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 group hover:shadow-sm ${isCollapsed && !sidebarHover ? 'justify-center' : ''}`}
            >
              <span className={`mr-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isCollapsed && !sidebarHover ? 'mr-0' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <span className={`${isCollapsed && !sidebarHover ? 'hidden' : 'sidebar-text'}`}>
                Mon Profil
              </span>
            </Link>
            <Link 
              href="/settings"
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 group hover:shadow-sm ${isCollapsed && !sidebarHover ? 'justify-center' : ''}`}
            >
              <span className={`mr-3 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 ${isCollapsed && !sidebarHover ? 'mr-0' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className={`${isCollapsed && !sidebarHover ? 'hidden' : 'sidebar-text'}`}>
                Paramètres
              </span>
            </Link>
            <Link 
              href="/logout"
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 group hover:shadow-sm ${isCollapsed && !sidebarHover ? 'justify-center' : ''}`}
            >
              <span className={`mr-3 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 ${isCollapsed && !sidebarHover ? 'mr-0' : ''}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
              <span className={`${isCollapsed && !sidebarHover ? 'hidden' : 'sidebar-text'}`}>
                Déconnexion
              </span>
            </Link>
          </div>
          
          {/* Spacer qui pousse le footer vers le bas */}
          <div className="flex-grow"></div>
          
          {/* Footer de la sidebar */}
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700/50">
            <div className={`flex ${isCollapsed && !sidebarHover ? 'justify-center' : 'justify-between items-center'}`}>
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
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
              
              {!isCollapsed || sidebarHover ? (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span>v1.2.0</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header pour mobile */}
        <div className="relative z-10 flex items-center justify-between h-16 bg-white dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-700/50 px-4 lg:hidden">
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center">
            <BitaxLogo size="small" animated={true} />
          </Link>
          
          {/* Profil user sur mobile */}
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          {/* Menu utilisateur mobile */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-16 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Mon Profil
              </Link>
              <Link 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Paramètres
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <Link 
                href="/logout" 
                className="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Déconnexion
              </Link>
            </div>
          )}
        </div>
        
        {/* Notification/progression de scan */}
        {showScanAnimation && (
          <div className="absolute top-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-rise">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Scan en cours</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowScanAnimation(false)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {multiChainScanning ? (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Scan multi-chaînes en cours</p>
                  {Object.entries(multiChainProgress).map(([network, progress]) => (
                    <div key={network} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">{network.toUpperCase()}</span>
                        <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {currentlyScanning && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scanner {currentlyScanning}</p>
                  )}
                  
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  
                  {scanComplete && (
                    <div className="flex items-center text-green-500 text-xs mt-2 animate-fade">
                      <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Scan terminé avec succès</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none backdrop-blur-none">
          {/* Contenu du dashboard */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
            {showOnboarding && (
              <OnboardingWizard 
                onComplete={handleOnboardingComplete} 
                onConnect={handleWalletConnect} 
                skipOnboarding={() => setShowOnboarding(false)}
              />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Colonne latérale - réduite à 1/4 pour donner plus d'espace au contenu principal */}
              <div className="lg:col-span-1 space-y-6">
                {/* Panneau de connexion wallet - amélioré visuellement */}
                {!isWalletConnected ? (
                  <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg overflow-hidden backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/50 animate-rise">
                    <div className="p-6 relative overflow-hidden">
                      {/* Effet de glow */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"></div>
                      
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center relative">
                        <span className="text-indigo-500 dark:text-indigo-400 mr-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </span>
                        Connectez votre wallet
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10">
                        Pour commencer, connectez votre wallet crypto et analysez vos transactions.
                      </p>
                      <WalletConnectButton 
                        onConnect={handleWalletConnect}
                        variant="primary"
                        fullWidth
                        size="lg"
                      />
                    </div>
                    
                    {/* Réseaux supportés - refonte avec design plus moderne */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200/70 dark:border-gray-700/50">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Réseaux supportés</p>
                      <div className="flex flex-wrap gap-2">
                        {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network, i) => (
                          <div 
                            key={i} 
                            className="flex items-center px-2 py-1 rounded-full bg-white dark:bg-gray-700/70 shadow-sm border border-gray-200/70 dark:border-gray-600/30 text-xs hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                            title={SUPPORTED_NETWORKS[network as NetworkType]?.name || network}
                          >
                            <div 
                              className="w-3 h-3 rounded-full mr-1.5" 
                              style={{ backgroundColor: SUPPORTED_NETWORKS[network as NetworkType]?.color || '#627EEA' }}
                            ></div>
                            <span className="font-medium">{(network as string).toUpperCase().substring(0, 4)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg overflow-hidden backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/50 animate-rise">
                    <div className="p-6 relative overflow-hidden">
                      {/* Effet de glow */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>
                      
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <span className="text-green-500 mr-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </span>
                        Wallet connecté
                      </h2>
                      <div className="flex items-center mb-4 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/70 dark:border-gray-700/50 hover:shadow-md transition-all duration-200 group">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </p>
                        <button 
                          className="ml-auto text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          title="Copier l'adresse"
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            // Vous pourriez ajouter une notification ici
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      
                      {/* Sélection du réseau - design amélioré */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <span className="text-indigo-500 dark:text-indigo-400 mr-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          </span>
                          Sélectionner un réseau
                        </h3>
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network, idx) => (
                            <button
                              key={network}
                              onClick={() => handleScanNetwork(network as NetworkType)}
                              className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                                activeNetwork === network 
                                  ? 'network-button-active' 
                                  : 'network-button'
                              } animate-rise stagger-${idx + 1}`}
                            >
                              {/* Icônes des réseaux */}
                              <div className="w-6 h-6 mr-3 flex items-center justify-center">
                                <img 
                                  src={`/images/networks/${network}.svg`} 
                                  alt={network} 
                                  className="w-5 h-5"
                                  onError={(e) => {
                                    // Fallback si l'image n'existe pas
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0icmdiYSg5OSwgMTAyLCAyNDEsIDAuMikiLz48cGF0aCBkPSJNOCAxMkwxMiAxNkwxNiA4IiBzdHJva2U9InJnYmEoOTksIDEwMiwgMjQxLCAxKSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=";
                                  }}
                                />
                              </div>
                              
                              {/* Nom du réseau avec première lettre en majuscule */}
                              <span>
                                {SUPPORTED_NETWORKS[network as NetworkType]?.name || 
                                 network.charAt(0).toUpperCase() + network.slice(1)}
                              </span>
                              
                              {/* Indicateur de chargement */}
                              {activeNetwork === network && isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-indigo-500 bg-opacity-90 rounded-xl">
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        {/* Boutons d'action pour scanner */}
                        <button
                          onClick={() => handleScanNetwork(activeNetwork)}
                          disabled={isLoading}
                          className="w-full mb-2 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Scan en cours...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Scanner {activeNetwork.toUpperCase()}
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleScanNetwork()}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Scan multi-chain
                        </button>
                      </div>
                    </div>
                    
                    {/* Statistiques */}
                    {transactions.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200/70 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions trouvées</span>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{transactions.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 animate-pulse-slow" 
                            style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        {/* Mini statistiques supplémentaires */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Réseau</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">{activeNetwork.toUpperCase()}</span>
                              <div className="ml-2 w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-700/50 rounded-xl p-3 border border-gray-200/70 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                            <div className="flex items-center mb-1">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Dernière mise à jour</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '--:--'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Bannière Premium - design amélioré */}
                {!isPremiumUser && (
                  <div className="rounded-2xl shadow-lg overflow-hidden relative animate-rise stagger-2">
                    {/* Fond avec gradient animé */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 animate-bg-shift"></div>
                    
                    {/* Effets visuels */}
                    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                      <div className="w-full h-full bg-white opacity-10 rounded-full blur-xl"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-8 translate-y-8">
                      <div className="w-full h-full bg-white opacity-10 rounded-full blur-xl"></div>
                    </div>
                    
                    {/* Particules d'effet */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-white/30 rounded-full animate-floating"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animationDelay: `${Math.random() * 2}s`,
                          animationDuration: `${3 + Math.random() * 5}s`
                        }}
                      ></div>
                    ))}
                    
                    <div className="p-6 relative z-10">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <span className="px-2 py-1 text-xs font-semibold bg-white/20 text-white rounded-full">PREMIUM</span>
                          <h3 className="text-lg font-bold text-white mt-1">Débloquez tout le potentiel</h3>
                        </div>
                      </div>
                      <p className="text-white/90 text-sm mb-4">
                        Des fonctionnalités exclusives pour une gestion fiscale sans limite.
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
                        className="w-full flex items-center justify-center px-4 py-3 bg-white hover:bg-white/90 text-indigo-600 text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Débloquer Premium
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Widget des cours crypto en temps réel */}
                <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-lg overflow-hidden backdrop-blur-xl border border-gray-200/70 dark:border-gray-700/50 animate-rise stagger-3">
                  <div className="p-5 pb-3 border-b border-gray-200/70 dark:border-gray-700/50 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Cours Crypto
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Temps réel</span>
                  </div>
                  <div className="divide-y divide-gray-200/70 dark:divide-gray-700/50">
                    {loadingPrices ? (
                      // État de chargement avec skeleton loader
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div key={idx} className="p-4 animate-pulse">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                            <div className="text-right">
                              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 ml-auto"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Données réelles des cryptos
                      cryptoPrices.map((crypto, idx) => (
                        <div 
                          key={crypto.id} 
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200 cursor-pointer"
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-700 p-0.5">
                              <img 
                                src={crypto.image} 
                                alt={crypto.name} 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {crypto.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                                {crypto.symbol}/EUR
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {formatCryptoPrice(crypto.current_price)}
                              </div>
                              <div className={`text-xs font-medium ${
                                crypto.price_change_percentage_24h >= 0 
                                  ? 'text-green-500' 
                                  : 'text-red-500'
                              }`}>
                                {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                                {crypto.price_change_percentage_24h.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200/70 dark:border-gray-700/50 text-center">
                    <a 
                      href="https://www.coingecko.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline flex items-center justify-center"
                    >
                      <span>Powered by CoinGecko</span>
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
            
              {/* Contenu principal - redesign complet mais en préservant les fonctionnalités */}
              <div className="lg:col-span-3 space-y-6">
                {/* Header du dashboard avec DashboardHeader */}
                {isWalletConnected && (
                  <DashboardHeader
                    walletAddress={walletAddress}
                    transactionCount={transactions.length}
                    isPremiumUser={isPremiumUser}
                    onScanRequest={handleScanNetwork}
                    onExportReport={handleExportReport}
                    isLoading={isLoading}
                    lastUpdated={lastUpdated || undefined}
                  />
                )}
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
                
                {isLoading ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative w-24 h-24 mb-6">
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                        <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-primary-500 animate-spin"></div>
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Chargement des transactions</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Nous analysons vos transactions sur {activeNetwork.toUpperCase()}...
                      </p>
                      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-primary-500 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {isWalletConnected ? (
                      transactions.length > 0 ? (
                        <>
                          {/* Composants du tableau de bord, conteneurés individuellement */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
                            <TransactionSummary 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                            />
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
                            <TaxDashboard 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                              walletAddress={walletAddress}
                            />
                          </div>
                          
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
                            <TransactionList 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                          <div className="flex flex-col items-center max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aucune transaction trouvée</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork.toUpperCase()}.
                              <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center">
                              <button
                                onClick={() => handleScanNetwork(activeNetwork)}
                                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Scanner à nouveau
                              </button>
                              <button
                                onClick={() => {
                                  // Choisir un réseau aléatoire différent de l'actuel
                                  const networks = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
                                  const availableNetworks = networks.filter(n => n !== activeNetwork);
                                  const randomNetwork = availableNetworks[Math.floor(Math.random() * availableNetworks.length)] as NetworkType;
                                  handleScanNetwork(randomNetwork);
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                Essayer un autre réseau
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col items-center max-w-md mx-auto">
                          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Bienvenue sur Bitax</h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
                          </p>
                          <WalletConnectButton
                            onConnect={handleWalletConnect}
                            variant="primary"
                            size="lg"
                          />
                          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                            Nous ne stockons jamais vos clés privées. Vos données restent sécurisées.
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}