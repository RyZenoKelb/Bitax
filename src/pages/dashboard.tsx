// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
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
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

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
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network: NetworkType) => {
    setActiveNetwork(network);
    if (walletAddress) {
      await fetchTransactions(walletAddress, network);
    }
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

  // Logo Bitax
  const BitaxLogo = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
    const fontSize = size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl';
    const subtitleSize = size === 'small' ? 'text-[0.6rem]' : size === 'large' ? 'text-sm' : 'text-xs';

    return (
      <div className="flex items-center">
        <div className="flex flex-col">
          <span className={`${fontSize} font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight`}>BITAX</span>
          <span className={`${subtitleSize} text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide`}>FISCALITÉ CRYPTO</span>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Bitax | Dashboard</title>
        <meta name="description" content="Bitax - Analysez et déclarez facilement vos taxes crypto." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
          width: 5px;
          height: 5px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
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
        
        /* Effet de néon pour les éléments importants */
        .neon-effect {
          box-shadow: 0 0 8px rgba(123, 63, 228, 0.6);
        }
        
        /* Boutons */
        .btn-primary {
          background: linear-gradient(135deg, #7B3FE4, #6A2DD1);
          color: white;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(123, 63, 228, 0.2);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 10px -1px rgba(123, 63, 228, 0.3);
        }
        
        .btn-outline {
          background: transparent;
          border: 1px solid;
          border-color: #7B3FE4;
          color: #7B3FE4;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .btn-outline:hover {
          background: rgba(123, 63, 228, 0.1);
        }
        
        .light .btn-outline {
          border-color: #6A2DD1;
          color: #6A2DD1;
        }
        
        .light .btn-outline:hover {
          background: rgba(123, 63, 228, 0.05);
        }
        
        /* Network button styles */
        .network-button {
          background: transparent;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        
        .network-button:hover {
          background: rgba(123, 63, 228, 0.1);
        }
        
        .network-button-active {
          background: linear-gradient(135deg, rgba(123, 63, 228, 0.8), rgba(123, 63, 228, 0.7));
          color: white;
          box-shadow: 0 2px 5px rgba(123, 63, 228, 0.3);
        }
      `}</style>

      {/* Overlay pour la sidebar mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo et branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <BitaxLogo />
          </Link>
          
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
        
        {/* Navigation links */}
        <div className="px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                  router.pathname === link.href 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 border-l-2 border-primary-500"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <span className={`mr-3 ${
                  router.pathname === link.href 
                    ? "text-primary-600 dark:text-primary-400" 
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                }`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Séparateur */}
          <div className="my-5 border-t border-gray-200 dark:border-gray-700"></div>
          
          {/* Mon compte */}
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Compte
            </h3>
            <Link 
              href="/profile"
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
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
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 group"
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
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 group"
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Header pour mobile */}
        <div className="relative z-10 flex items-center justify-between h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 lg:hidden">
          <button 
            className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none"
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
            className="p-2 text-gray-500 dark:text-gray-400 focus:outline-none"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          {/* Menu utilisateur mobile */}
          {isUserMenuOpen && (
            <div className="absolute right-0 top-16 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-xl border border-gray-200 dark:border-gray-700 z-50">
              <Link 
                href="/profile" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Mon Profil
              </Link>
              <Link 
                href="/settings" 
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        
        {/* Main content area */}
        <main className="relative flex-1 overflow-y-auto focus:outline-none">
          {/* Effets avancés en arrière-plan */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Effet de grille en arrière-plan */}
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(155, 155, 155, 0.3)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            {/* Effets lumineux */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-primary-900/10 to-transparent opacity-30 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-secondary-900/10 to-transparent opacity-30 blur-3xl"></div>
          </div>
          
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
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Connectez votre wallet
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">
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
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Réseaux supportés</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: "Ethereum", color: "#627EEA", abbr: "ETH" },
                          { name: "Polygon", color: "#8247E5", abbr: "POLY" },
                          { name: "Arbitrum", color: "#28A0F0", abbr: "ARB" },
                          { name: "Optimism", color: "#FF0420", abbr: "OPT" },
                          { name: "Base", color: "#0052FF", abbr: "BASE" }
                        ].map((network, i) => (
                          <div 
                            key={i} 
                            className="flex items-center px-2 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 text-xs"
                            title={network.name}
                          >
                            <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: network.color }}></div>
                            <span className="font-medium">{network.abbr}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Wallet connecté
                      </h2>
                      <div className="flex items-center mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">
                          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                        </p>
                        <button 
                          className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          Sélectionner un réseau
                        </h3>
                        <div className="grid grid-cols-1 gap-2 mb-3">
                          {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                            <button
                              key={network}
                              onClick={() => handleScanNetwork(network as NetworkType)}
                              className={`relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                activeNetwork === network 
                                  ? 'bg-primary-500 text-white shadow-md' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              {/* Icônes des réseaux */}
                              <div className="w-5 h-5 mr-2">
                                {network === 'eth' && (
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <path d="M12 2L4 12L12 16L20 12L12 2Z" fill={activeNetwork === network ? "white" : "#627EEA"} />
                                    <path d="M12 16V22L20 12L12 16Z" fill={activeNetwork === network ? "white" : "#627EEA"} fillOpacity="0.8" />
                                    <path d="M12 16V22L4 12L12 16Z" fill={activeNetwork === network ? "white" : "#627EEA"} fillOpacity="0.6" />
                                  </svg>
                                )}
                                {network === 'polygon' && (
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <path d="M17.5 8.5L12 5L6.5 8.5V15.5L12 19L17.5 15.5V8.5Z" stroke={activeNetwork === network ? "white" : "#8247E5"} strokeWidth="2" />
                                    <path d="M12 5V12M12 12V19M12 12L17.5 15.5M12 12L6.5 15.5" stroke={activeNetwork === network ? "white" : "#8247E5"} strokeWidth="2" />
                                  </svg>
                                )}
                                {network === 'arbitrum' && (
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <circle cx="12" cy="12" r="9" fill={activeNetwork === network ? "white" : "#28A0F0"} fillOpacity="0.2" />
                                    <path d="M12 3V21M3 12H21" stroke={activeNetwork === network ? "white" : "#28A0F0"} strokeWidth="2" />
                                  </svg>
                                )}
                                {network === 'optimism' && (
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <circle cx="12" cy="12" r="9" fill={activeNetwork === network ? "white" : "#FF0420"} fillOpacity="0.2" />
                                    <path d="M8 12L11 15L16 9" stroke={activeNetwork === network ? "white" : "#FF0420"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                )}
                                {network === 'base' && (
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                    <rect x="5" y="5" width="14" height="14" rx="2" fill={activeNetwork === network ? "white" : "#0052FF"} fillOpacity="0.2" />
                                    <path d="M12 8V16M8 12H16" stroke={activeNetwork === network ? "white" : "#0052FF"} strokeWidth="2" strokeLinecap="round" />
                                  </svg>
                                )}
                              </div>
                              {/* Nom du réseau avec première lettre en majuscule */}
                              {network.charAt(0).toUpperCase() + network.slice(1)}
                              
                              {/* Indicateur de chargement */}
                              {activeNetwork === network && isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-primary-500 bg-opacity-90 rounded-lg">
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
                          className="w-full mb-2 flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                          onClick={() => {
                            // Fonction pour scanner toutes les blockchains en parallèle
                            ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                              handleScanNetwork(network as NetworkType);
                            });
                          }}
                          disabled={isLoading}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                      <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Transactions trouvées</span>
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{transactions.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                          ></div>
                        </div>
                        
                        {/* Mini statistiques supplémentaires */}
                        <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Réseau</span>
                              <span className="font-medium text-gray-800 dark:text-gray-200">{activeNetwork.toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 dark:text-gray-400">Status</span>
                              <span className="font-medium text-green-600 dark:text-green-400">Actif</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Bannière Premium - design amélioré */}
                {!isPremiumUser && (
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
                      <div className="w-full h-full bg-white opacity-10 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 transform -translate-x-8 translate-y-8">
                      <div className="w-full h-full bg-white opacity-10 rounded-full"></div>
                    </div>
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
                      <div className="space-y-3 mb-4">
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
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-white hover:bg-white/90 text-indigo-600 text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Débloquer Premium
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Widget informations crypto */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Cours Crypto</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {[
                      { symbol: "BTC", name: "Bitcoin", price: "51,243.75 €", change: "+1.2%", color: "text-green-500" },
                      { symbol: "ETH", name: "Ethereum", price: "2,829.16 €", change: "-0.5%", color: "text-red-500" },
                      { symbol: "SOL", name: "Solana", price: "124.50 €", change: "+4.7%", color: "text-green-500" }
                    ].map((crypto, idx) => (
                      <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                            <span className="font-semibold text-xs">{crypto.symbol}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{crypto.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{crypto.symbol}/EUR</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{crypto.price}</p>
                          <p className={`text-xs ${crypto.color}`}>{crypto.change}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
                    <a href="#" className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center">
                      <span>Voir plus de cours</span>
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contenu principal - redesign complet mais en préservant les fonctionnalités */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                      <svg className="w-8 h-8 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Tableau de bord fiscal
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      Visualisez et analysez vos transactions crypto
                    </p>
                  </div>
                  
                  {/* Actions rapides */}
                  <div className="flex flex-wrap gap-2">
                    <button className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Générer rapport
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Exporter
                    </button>
                    <button className="inline-flex items-center px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Historique
                    </button>
                  </div>
                </div>
                
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
                          {/* Résumé des transactions - préservé mais avec un wrapper stylisé */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
                            <TransactionSummary 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                            />
                          </div>
                          
                          {/* Tableau de bord fiscal - préservé mais avec un wrapper stylisé */}
                          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-5">
                            <TaxDashboard 
                              transactions={transactions}
                              isPremiumUser={isPremiumUser}
                              walletAddress={walletAddress}
                            />
                          </div>
                          
                          {/* Liste des transactions - préservé mais avec un wrapper stylisé */}
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
                                  const randomNetwork = ['polygon', 'arbitrum', 'optimism', 'base'][Math.floor(Math.random() * 4)] as NetworkType;
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