// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import WalletConnectButton from '@/components/WalletConnectButton';
import WalletConnectPanel from '@/components/WalletConnectPanel';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
import PremiumUnlock from '@/components/PremiumUnlock';
import OnboardingWizard from '@/components/OnboardingWizard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

export default function Dashboard() {
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

  // Si l'utilisateur n'est pas connecté, afficher une page d'accueil améliorée
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Effets de fond subtils */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-[-100px] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-[-100px] w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[40%] right-[15%] w-[300px] h-[300px] bg-accent-500/10 rounded-full blur-2xl"></div>
        </div>

        {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        {/* Section d'accueil principale */}
        <section className="relative pt-16 pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-full px-6 py-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-primary-400">Accédez à votre tableau de bord</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Connectez votre wallet crypto
                  </span>
                </h1>
                
                <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                  Analysez vos transactions et gérez votre fiscalité crypto en temps réel
                </p>
              </div>
              
              {/* Carte de connexion moderne */}
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  {/* Effet de glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                  
                  <div className="relative backdrop-blur-xl bg-dark-secondary/80 p-8 rounded-xl border border-white/5 shadow-2xl">
                    <div className="flex items-center space-x-8">
                      <div className="w-96 h-64 relative overflow-hidden rounded-lg bg-gradient-to-br from-primary-900/30 to-secondary-900/30 p-1">
                        <div className="w-full h-full bg-dark rounded-lg p-6 flex flex-col justify-center">
                          <div className="mb-6">
                            <WalletConnectButton 
                              onConnect={handleWalletConnect}
                              variant="primary"
                              fullWidth
                              size="lg"
                            />
                          </div>
                          
                          {/* Statistiques de confiance */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-white">100%</div>
                              <div className="text-xs text-gray-400">Sécurisé</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">5+</div>
                              <div className="text-xs text-gray-400">Blockchains</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-white">24/7</div>
                              <div className="text-xs text-gray-400">Support</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Informations et réseaux */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-4">Connexion sécurisée</h3>
                        <p className="text-gray-400 mb-6">
                          Vos clés privées restent sous votre contrôle. Bitax n'accède jamais à vos fonds.
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span className="text-gray-300">Connexion chiffrée et sécurisée</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-300">Pas de dépôt de fonds requis</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-gray-300">Données chiffrées de bout en bout</span>
                          </div>
                        </div>
                        
                        <div className="mt-8">
                          <h4 className="text-sm font-medium text-gray-400 mb-3">Réseaux supportés</h4>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { name: "Ethereum", color: "#627EEA", icon: "ETH" },
                              { name: "Polygon", color: "#8247E5", icon: "MATIC" },
                              { name: "Arbitrum", color: "#28A0F0", icon: "ARB" },
                              { name: "Optimism", color: "#FF0420", icon: "OP" },
                              { name: "Base", color: "#0052FF", icon: "BASE" },
                            ].map((network, index) => (
                              <div 
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors"
                                style={{ backgroundColor: `${network.color}15` }}
                              >
                                <div 
                                  className="w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs font-bold text-white"
                                  style={{ backgroundColor: network.color }}
                                >
                                  {network.icon.charAt(0)}
                                </div>
                                <span className="text-sm text-gray-300">{network.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Affichage du tableau de bord pour les utilisateurs connectés
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Effets de fond subtils */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-0 w-[500px] h-[500px] bg-secondary-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[40%] right-[15%] w-[300px] h-[300px] bg-accent-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
      
      <div className="relative">
        {/* Quick Actions Toolbar */}
        <div className="sticky top-20 z-40 mb-8">
          <div className="container mx-auto px-6">
            <div className="backdrop-blur-xl bg-dark-secondary/50 rounded-2xl p-4 border border-white/5 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Wallet status */}
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 p-[1px]">
                        <div className="w-full h-full rounded-lg bg-dark flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v8m0 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v16m4 0h4" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full border-2 border-dark animate-pulse"></div>
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                      </div>
                      <div className="text-xs text-gray-400">Connecté</div>
                    </div>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="flex items-center space-x-8 border-l border-white/10 pl-6">
                    <div>
                      <div className="text-sm text-gray-400">Transactions</div>
                      <div className="text-white font-medium">{transactions.length}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Réseau</div>
                      <div className="text-white font-medium capitalize">{activeNetwork}</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleScanNetwork(activeNetwork)}
                    disabled={isLoading}
                    className="group relative inline-flex items-center px-4 py-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 rounded-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                  
                  {isPremiumUser && (
                    <button
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Exporter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard content */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {/* Network Selector */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative backdrop-blur-xl bg-dark-secondary/60 rounded-xl p-6 border border-white/5 shadow">
                  <h3 className="text-lg font-bold text-white mb-4">Réseau actif</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                      <button
                        key={network}
                        onClick={() => handleScanNetwork(network as NetworkType)}
                        className={`relative p-3 rounded-lg border transition-all duration-300 ${
                          activeNetwork === network 
                            ? 'border-primary-500 bg-primary-500/10 text-primary-400' 
                            : 'border-white/10 hover:border-white/20 text-gray-300 hover:text-white'
                        }`}
                      >
                        {activeNetwork === network && isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-dark/90 rounded-lg">
                            <svg className="animate-spin h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        )}
                        <span className="capitalize font-medium">{network}</span>
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                        handleScanNetwork(network as NetworkType);
                      });
                    }}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 ${
                      isLoading 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-accent-500 to-primary-500 text-white hover:opacity-90'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Scan Multi-chain
                  </button>
                </div>
              </div>
              
              {/* Stats summary */}
              {transactions.length > 0 && (
                <div className="backdrop-blur-xl bg-dark-secondary/60 rounded-xl p-6 border border-white/5 shadow">
                  <h3 className="text-lg font-bold text-white mb-4">Aperçu des transactions</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Total transactions</span>
                      <span className="text-white font-bold">{transactions.length}</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Premium Banner */}
              {!isPremiumUser && (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-60 group-hover:opacity-80 transition duration-300 animate-pulse"></div>
                  <PremiumUnlock onUnlock={handleUnlockPremium} />
                </div>
              )}
            </div>
            
            {/* Main content */}
            <div className="col-span-12 lg:col-span-9 space-y-6">
              {error && (
                <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 animate-shake">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {isLoading && !transactions.length ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-primary-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
                  </div>
                  <p className="text-gray-400 text-lg">Chargement des transactions...</p>
                </div>
              ) : transactions.length > 0 ? (
                <>
                  {/* Dashboard Header - Modernized */}
                  <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/10 via-secondary-500/10 to-primary-500/10 blur-lg"></div>
                    <div className="relative backdrop-blur-xl bg-dark-secondary/60 rounded-xl p-8 border border-white/5 shadow-lg">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
                        <div>
                          <h1 className="text-3xl font-display font-bold text-white mb-2">
                            Tableau de bord fiscal
                          </h1>
                          <div className="flex items-center space-x-4">
                            <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-400 text-sm border border-primary-500/20">
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Conforme à la législation
                            </div>
                            {isPremiumUser && (
                              <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Premium
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Summary - Modernized */}
                  <TransactionSummary 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                  />
                  
                  {/* Tax Dashboard - Modernized */}
                  <TaxDashboard 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                    walletAddress={walletAddress}
                  />
                  
                  {/* Transaction List - Modernized */}
                  <TransactionList 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                  />
                </>
              ) : (
                <div className="backdrop-blur-xl bg-dark-secondary/60 rounded-xl p-12 text-center border border-white/5 shadow-lg">
                  <div className="w-24 h-24 mx-auto mb-6 p-6 rounded-full bg-gradient-to-br from-primary-500/10 to-secondary-500/10">
                    <svg className="w-full h-full text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Aucune transaction trouvée</h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork}.
                    Essayez de scanner un autre réseau ou connectez un wallet différent.
                  </p>
                  <button
                    onClick={() => handleScanNetwork(activeNetwork)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Scanner à nouveau
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}