// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// Composants
import { 
  WalletConnectButton, 
  WalletConnectPanel, 
  TransactionSummary, 
  TransactionList, 
  TaxDashboard,
  PremiumUnlock,
  OnboardingWizard,
  DashboardHeader
} from '@/components';

export default function Dashboard() {
  // États principaux
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  // Si l'utilisateur n'est pas connecté, afficher l'écran de connexion du wallet
  if (!isWalletConnected) {
    return (
      <div className="space-y-6">
        {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        {/* Interface de connexion wallet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Bienvenue sur votre<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400">
                Dashboard Fiscal
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Connectez votre wallet pour commencer à analyser vos transactions et générer vos rapports fiscaux.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Bitax ne stocke jamais vos clés privées et n'a pas accès à vos fonds. Notre connexion wallet est 100% sécurisée.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden relative z-10">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Connectez votre wallet
                </h2>
                
                <WalletConnectButton 
                  onConnect={handleWalletConnect}
                  variant="primary"
                  fullWidth
                  size="lg"
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                    Blockchains supportées
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network, index) => (
                      <div 
                        key={index}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600/20 to-secondary-600/20 dark:from-primary-900/30 dark:to-secondary-900/30 border border-primary-500/20 dark:border-primary-800/30 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-300"
                        title={network.charAt(0).toUpperCase() + network.slice(1)}
                      >
                        {network.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    100% sécurisé
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Connexion cryptée
                  </div>
                </div>
              </div>
            </div>
            
            {/* Éléments décoratifs */}
            <div className="absolute -z-10 -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-2xl opacity-70"></div>
            <div className="absolute -z-10 -bottom-10 -left-6 w-48 h-48 bg-gradient-to-br from-secondary-400/20 to-primary-400/20 rounded-full blur-3xl opacity-70"></div>
          </div>
        </div>
        
        {/* Section caractéristiques */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Pourquoi choisir Bitax
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Analyse fiscale précise",
                description: "Notre algorithme analyse automatiquement vos transactions et identifie les événements taxables selon différentes méthodes (FIFO, LIFO, etc.)."
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Rapports complets",
                description: "Générez des rapports fiscaux complets et conformes, téléchargeables en PDF, CSV ou Excel pour votre déclaration d'impôts."
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Multi-blockchain",
                description: "Bitax prend en charge les principales blockchains (Ethereum, Polygon, Arbitrum, Optimism, Base) pour une analyse complète de votre portefeuille."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-shadow duration-300">
                <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Affichage du tableau de bord pour les utilisateurs connectés
  return (
    <div className="space-y-8">
      {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
      
      {/* En-tête du dashboard */}
      <DashboardHeader
        walletAddress={walletAddress}
        transactionCount={transactions.length}
        isPremiumUser={isPremiumUser}
        onScanRequest={handleScanNetwork}
        onExportReport={() => {}}
        isLoading={isLoading}
      />
      
      {/* Boutons de changement d'affichage */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Aperçu du portefeuille</h2>
        
        <div className={`inline-flex rounded-lg border ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
        } overflow-hidden`}>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 text-sm ${
              viewMode === 'grid' 
                ? 'bg-primary-600 text-white' 
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm ${
              viewMode === 'list' 
                ? 'bg-primary-600 text-white' 
                : 'bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
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
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Chargement des transactions...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Cette opération peut prendre quelques instants</p>
        </div>
      ) : (
        <>
          {transactions.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-3 gap-6' : 'space-y-6'}>
              {/* Layout en grille */}
              {viewMode === 'grid' && (
                <>
                  {/* Colonne gauche - Connexion wallet et statut premium */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Panneau de connexion wallet */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          Wallet connecté
                        </h2>
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                          </p>
                        </div>
                        
                        {/* Sélection du réseau */}
                        <div className="mt-6">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Scanner un réseau
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                              <button
                                key={network}
                                onClick={() => handleScanNetwork(network as NetworkType)}
                                className={`relative flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg ${
                                  activeNetwork === network 
                                    ? 'bg-primary-600 text-white shadow-sm' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                              >
                                {activeNetwork === network && isLoading && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-primary-600 bg-opacity-90 rounded-lg">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  </div>
                                )}
                                {network.charAt(0).toUpperCase() + network.slice(1)}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => handleScanNetwork(activeNetwork)}
                            disabled={isLoading}
                            className="w-full mt-3 flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                              ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                                handleScanNetwork(network as NetworkType);
                              });
                            }}
                            disabled={isLoading}
                            className="w-full mt-3 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Scan automatique multi-chain
                          </button>
                        </div>
                      </div>
                      
                      {/* Statistiques */}
                      {transactions.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Transactions trouvées</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{transactions.length}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                            <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Bannière Premium */}
                    {!isPremiumUser && (
                      <PremiumUnlock onUnlock={handleUnlockPremium} />
                    )}
                  </div>
                  
                  {/* Colonne droite - Contenu principal */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Résumé des transactions */}
                    <TransactionSummary 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                    
                    {/* Tableau de bord fiscal */}
                    <TaxDashboard 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                      walletAddress={walletAddress}
                    />
                    
                    {/* Liste des transactions */}
                    <TransactionList 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                  </div>
                </>
              )}
              
              {/* Layout en liste */}
              {viewMode === 'list' && (
                <>
                  {/* Panneaux d'information en ligne */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Panneau du wallet */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Wallet connecté
                        </h2>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Panneau réseau actif */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Réseau actif
                        </h2>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-2">
                            {activeNetwork.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {activeNetwork.charAt(0).toUpperCase() + activeNetwork.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Panneau transaction */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          Transactions
                        </h2>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 font-medium">
                            {transactions.length} transactions trouvées
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sélection du réseau */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Scanner un réseau
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                        {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                          <button
                            key={network}
                            onClick={() => handleScanNetwork(network as NetworkType)}
                            className={`relative flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg ${
                              activeNetwork === network 
                                ? 'bg-primary-600 text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                            }`}
                          >
                            {activeNetwork === network && isLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary-600 bg-opacity-90 rounded-lg">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              </div>
                            )}
                            {network.charAt(0).toUpperCase() + network.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleScanNetwork(activeNetwork)}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                            ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                              handleScanNetwork(network as NetworkType);
                            });
                          }}
                          disabled={isLoading}
                          className="flex-1 flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Scan automatique multi-chain
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Résumé des transactions */}
                  <TransactionSummary 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                  />
                  
                  {/* Tableau de bord fiscal */}
                  <TaxDashboard 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                    walletAddress={walletAddress}
                  />
                  
                  {/* Liste des transactions */}
                  <TransactionList 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                  />
                  
                  {/* Bannière Premium */}
                  {!isPremiumUser && (
                    <PremiumUnlock onUnlock={handleUnlockPremium} />
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Aucune transaction trouvée</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork}.
                <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
              </p>
              <button
                onClick={() => handleScanNetwork(activeNetwork)}
                className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                Scanner à nouveau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

function theme(theme: any): string | number | boolean | readonly string[] | readonly number[] | readonly boolean[] | null | undefined {
  throw new Error('Function not implemented.');
}