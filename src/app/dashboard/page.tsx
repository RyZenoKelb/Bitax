"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
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
import NetworkIcon from '@/components/NetworkIcon';

export default function Dashboard() {
  const { data: session } = useSession();
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [isScanningMultiple, setIsScanningMultiple] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<{network: NetworkType, count: number, completed: boolean}[]>([]);

  // Vérifier si c'est la première visite et le statut premium
  useEffect(() => {
    const hasVisited = localStorage.getItem('bitax-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('bitax-visited', 'true');
    } else {
      setIsFirstVisit(false);
    }
    
    // Vérifier le statut premium (d'abord depuis la session, puis depuis localStorage comme fallback)
    if (session?.user?.isPremium) {
      setIsPremiumUser(true);
      localStorage.setItem('bitax-premium', 'true');
    } else {
      const isPremium = localStorage.getItem('bitax-premium') === 'true';
      setIsPremiumUser(isPremium);
    }
    
    // Si l'utilisateur est connecté, récupérer ses wallets sauvegardés
    if (session?.user) {
      fetchSavedWallets();
    }
  }, [session]);

  // Récupérer les wallets sauvegardés
  const fetchSavedWallets = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (response.ok) {
        const data = await response.json();
        if (data.wallets && data.wallets.length > 0) {
          // Prendre le wallet principal ou le premier de la liste
          const primaryWallet = data.wallets.find((w: any) => w.isPrimary) || data.wallets[0];
          
          setWalletAddress(primaryWallet.address);
          setIsWalletConnected(true);
          
          // Charger les transactions pour ce wallet
          await fetchTransactions(primaryWallet.address, activeNetwork);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des wallets:', error);
    }
  };

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions après connexion
      await fetchTransactions(address, activeNetwork);
      
      // Si l'utilisateur est connecté, on peut sauvegarder le wallet dans la base de données
      if (session?.user) {
        try {
          await fetch('/api/wallet', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              address,
              network: activeNetwork,
              isPrimary: true
            }),
          });
        } catch (error) {
          console.error('Erreur lors de la sauvegarde du wallet:', error);
        }
      }
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
      
      // Ajouter l'information du réseau à chaque transaction
      const txsWithNetwork = filteredTxs.map((tx, index) => ({
        ...tx, 
        network,
        id: `${tx.hash}-${index}` // Ajouter un id unique pour éviter les problèmes de clés dupliquées
      }));
      
      setTransactions(txsWithNetwork);
      setLastUpdated(new Date());
      
      // Simuler un solde (dans une vraie application, cela viendrait d'une API)
      const mockBalance = Math.floor(Math.random() * 10000) / 100;
      setBalance(mockBalance);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner toutes les blockchains supportées
  const scanAllNetworks = async () => {
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    setIsScanningMultiple(true);
    setTransactions([]);
    
    // Réseaux à scanner
    const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
    
    // Initialiser la progression du scan
    setScanProgress(networks.map(network => ({
      network,
      count: 0,
      completed: false
    })));
    
    try {
      let allTransactions: any[] = [];
      
      // Scanner chaque réseau séquentiellement
      for (let i = 0; i < networks.length; i++) {
        const network = networks[i];
        
        try {
          // Mettre à jour la progression du scan
          setScanProgress(prev => prev.map(item => 
            item.network === network 
              ? {...item, count: 0} 
              : item
          ));
          
          const txs = await getTransactions(walletAddress, network);
          const filteredTxs = filterSpamTransactions(txs);
          
          // Ajouter l'information du réseau et un id unique à chaque transaction
          const txsWithNetwork = filteredTxs.map((tx, index) => ({
            ...tx, 
            network,
            id: `${tx.hash}-${network}-${index}` // ID unique avec hash, réseau et index
          }));
          
          // Ajouter les transactions au tableau total
          allTransactions = [...allTransactions, ...txsWithNetwork];
          
          // Mettre à jour la progression du scan
          setScanProgress(prev => prev.map(item => 
            item.network === network 
              ? {...item, count: txsWithNetwork.length, completed: true} 
              : item
          ));
          
          // Mettre à jour l'affichage des transactions au fur et à mesure
          setTransactions(allTransactions);
          
        } catch (error) {
          console.error(`Erreur lors du scan de ${network}:`, error);
          // Marquer ce réseau comme terminé même en cas d'erreur
          setScanProgress(prev => prev.map(item => 
            item.network === network 
              ? {...item, completed: true} 
              : item
          ));
        }
      }
      
      // Tout a été scanné
      setLastUpdated(new Date());
      
      // Simuler un solde total
      const mockBalance = Math.floor(Math.random() * 20000) / 100;
      setBalance(mockBalance);
      
      if (allTransactions.length === 0) {
        setError("Aucune transaction trouvée sur les réseaux scannés.");
      }
    } catch (error) {
      console.error('Erreur lors du scan multiple:', error);
      setError('Impossible de scanner tous les réseaux. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
      setIsScanningMultiple(false);
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network?: NetworkType) => {
    if (network) {
      setActiveNetwork(network);
    }
    
    if (walletAddress) {
      await fetchTransactions(walletAddress, network || activeNetwork);
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne latérale */}
        <div className="lg:col-span-1 space-y-6">
          {/* Panneau de connexion wallet - ceci ne sera pas affiché car isWalletConnected est déjà true */}
          {!isWalletConnected ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Connectez votre wallet
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Pour commencer, connectez votre wallet crypto pour analyser vos transactions.
                </p>
                <WalletConnectButton 
                  onConnect={handleWalletConnect}
                  variant="primary"
                  fullWidth
                  size="lg"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
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
                    onClick={scanAllNetworks}
                    disabled={isLoading || isScanningMultiple}
                    className="w-full mt-3 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                  >
                    {isLoading || isScanningMultiple ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scan multi-chain en cours...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Scan automatique multi-chain
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Statistiques */}
              {transactions.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
          )}
          
          {/* Bannière Premium */}
          {!isPremiumUser && (
            <PremiumUnlock onUnlock={handleUnlockPremium} />
          )}
          
          {/* Progression du scan multi-chain */}
          {isScanningMultiple && scanProgress.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Progression du scan
                </h2>
                
                <div className="space-y-3">
                  {scanProgress.map((item) => (
                    <div key={item.network} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <NetworkIcon network={item.network} size={20} className="mr-2" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {item.network.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {item.completed ? (
                          <span className="text-green-600 dark:text-green-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item.count} transactions
                          </span>
                        ) : (
                          <span className="text-blue-600 dark:text-blue-400 flex items-center">
                            <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Scan en cours...
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord fiscal
          </h1>
          
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
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="ml-4 text-gray-600 dark:text-gray-300">Chargement des transactions...</p>
            </div>
          ) : (
            <>
              {isWalletConnected ? (
                transactions.length > 0 ? (
                  <>
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/80">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Transactions
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Historique de vos transactions sur {activeNetwork.toUpperCase()}
                        </p>
                      </div>
                      <div className="p-6">
                        <TransactionList 
                          transactions={transactions}
                          isPremiumUser={isPremiumUser}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Aucune transaction trouvée</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork.toUpperCase()}.
                      <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                    </p>
                    <button
                      onClick={() => handleScanNetwork(activeNetwork)}
                      className="mt-6 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
                    >
                      Scanner à nouveau
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Bienvenue sur votre dashboard Bitax</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
                  </p>
                  <div className="mt-6">
                    <WalletConnectButton
                      onConnect={handleWalletConnect}
                      variant="primary"
                      size="lg"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}