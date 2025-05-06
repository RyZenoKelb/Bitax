// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import Head from 'next/head';
import WalletConnectButton from '@/components/WalletConnectButton';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
import PremiumUnlock from '@/components/PremiumUnlock';
import OnboardingWizard from '@/components/OnboardingWizard';
import DashboardHeader from '@/components/DashboardHeader';
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
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

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
      // Scan multi-blockchain
      if (walletAddress) {
        setIsLoading(true);
        try {
          const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
          for (const net of networks) {
            await fetchTransactions(walletAddress, net);
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  // Fonction d'export (simulée)
  const handleExportReport = () => {
    console.log('Exporting report...');
    // Logique d'export à implémenter
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

  // Contenu principal basé sur l'état
  const renderMainContent = () => {
    if (isLoading && transactions.length === 0) {
      return (
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-700 shadow-lg">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-700 dark:border-gray-700"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 animate-spin"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chargement des transactions</h3>
            <p className="text-gray-400 mb-6">
              Nous analysons vos transactions sur {activeNetwork.toUpperCase()}...
            </p>
            <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (!isWalletConnected) {
      return (
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-700 shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bienvenue sur Bitax</h3>
            <p className="text-gray-400 mb-6">
              Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
            </p>
            <WalletConnectButton
              onConnect={handleWalletConnect}
              variant="primary"
              size="lg"
            />
            <p className="mt-6 text-sm text-gray-500">
              Nous ne stockons jamais vos clés privées. Vos données restent sécurisées.
            </p>
          </div>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-700 shadow-lg">
          <div className="flex flex-col items-center max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-700 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucune transaction trouvée</h3>
            <p className="text-gray-400 mb-6">
              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork.toUpperCase()}.
              <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => handleScanNetwork(activeNetwork)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center"
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
                className="px-4 py-2 bg-gray-700 dark:bg-gray-700 hover:bg-gray-600 dark:hover:bg-gray-600 text-gray-200 dark:text-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Essayer un autre réseau
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Résumé des transactions */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-700 dark:border-gray-700 shadow-sm p-5">
          <TransactionSummary 
            transactions={transactions}
            isPremiumUser={isPremiumUser}
          />
        </div>
        
        {/* Tableau de bord fiscal */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-700 dark:border-gray-700 shadow-sm p-5">
          <TaxDashboard 
            transactions={transactions}
            isPremiumUser={isPremiumUser}
            walletAddress={walletAddress}
          />
        </div>
        
        {/* Liste des transactions */}
        <div className="bg-gray-800 dark:bg-gray-800 rounded-xl border border-gray-700 dark:border-gray-700 shadow-sm p-5">
          <TransactionList 
            transactions={transactions}
            isPremiumUser={isPremiumUser}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Bitax | Dashboard</title>
        <meta name="description" content="Bitax - Analysez et déclarez facilement vos taxes crypto." />
      </Head>

      {/* Arrière-plan élégant (sera visible à travers les éléments transparents) */}
      <div className="fixed inset-0 bg-gray-900 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-indigo-900/20 to-transparent opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent opacity-30 blur-3xl"></div>
      </div>

      <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Fenêtre d'onboarding pour les nouveaux utilisateurs */}
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panneau latéral - 1/4 de largeur sur desktop */}
          <div className="lg:col-span-1 space-y-6">
            {/* Panneau de connexion wallet */}
            {!isWalletConnected ? (
              <div className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 dark:border-gray-700">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Connectez votre wallet
                  </h2>
                  <p className="text-gray-400 mb-6">
                    Pour commencer, connectez votre wallet crypto et analysez vos transactions.
                  </p>
                  <WalletConnectButton 
                    onConnect={handleWalletConnect}
                    variant="primary"
                    fullWidth
                    size="lg"
                  />
                </div>
                
                {/* Réseaux supportés */}
                <div className="bg-gray-700/50 px-6 py-4 border-t border-gray-700">
                  <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">Réseaux supportés</p>
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
                        className="flex items-center px-2 py-1 rounded-full bg-gray-800 shadow-sm border border-gray-700 text-xs"
                        title={network.name}
                      >
                        <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: network.color }}></div>
                        <span className="font-medium text-gray-300">{network.abbr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 dark:border-gray-700">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Wallet connecté
                  </h2>
                  <div className="flex items-center mb-4 bg-gray-700/50 rounded-lg p-3 border border-gray-700">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="text-gray-200 font-mono text-sm">
                      {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                    </p>
                    <button 
                      className="ml-auto text-gray-400 hover:text-gray-300"
                      title="Copier l'adresse"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Sélection du réseau */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                    
                    {/* Boutons d'action pour scanner */}
                    <button
                      onClick={() => handleScanNetwork(activeNetwork)}
                      disabled={isLoading}
                      className="w-full mb-2 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                        handleScanNetwork();
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
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
                  <div className="bg-gray-700/50 px-6 py-4 border-t border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">Transactions trouvées</span>
                      <span className="text-lg font-bold text-blue-400">{transactions.length}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    {/* Mini statistiques supplémentaires */}
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Réseau</span>
                          <span className="font-medium text-gray-200">{activeNetwork.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="font-medium text-green-400">Actif</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Bannière Premium */}
            {!isPremiumUser && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg overflow-hidden relative">
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
            <div className="bg-gray-800 dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-300 dark:text-gray-300">Cours Crypto</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { symbol: "BTC", name: "Bitcoin", price: "51,243.75 €", change: "+1.2%", color: "text-green-500" },
                  { symbol: "ETH", name: "Ethereum", price: "2,829.16 €", change: "-0.5%", color: "text-red-500" },
                  { symbol: "SOL", name: "Solana", price: "124.50 €", change: "+4.7%", color: "text-green-500" }
                ].map((crypto, idx) => (
                  <div key={idx} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                        <span className="font-semibold text-xs text-gray-300">{crypto.symbol}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-200">{crypto.name}</p>
                        <p className="text-xs text-gray-400">{crypto.symbol}/EUR</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-200">{crypto.price}</p>
                      <p className={`text-xs ${crypto.color}`}>{crypto.change}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-700/50 border-t border-gray-700">
                <a href="#" className="text-xs text-blue-400 hover:underline flex items-center justify-center">
                  <span>Voir plus de cours</span>
                  <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contenu principal - 3/4 de largeur sur desktop */}
          <div className="lg:col-span-3 space-y-6">
            {/* En-tête du tableau de bord */}
            {isWalletConnected && (
              <DashboardHeader
                walletAddress={walletAddress}
                transactionCount={transactions.length}
                isPremiumUser={isPremiumUser}
                onScanRequest={handleScanNetwork}
                onExportReport={handleExportReport}
                isLoading={isLoading}
                lastUpdated={lastUpdated}
              />
            )}
            
            {/* Affichage du contenu principal basé sur l'état */}
            {renderMainContent()}
          </div>
        </div>
      </div>
    </>
  );
}