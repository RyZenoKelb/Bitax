"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import WalletConnectButton from '@/components/WalletConnectButton';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import NetworkIcon from '@/components/NetworkIcon';
import Link from 'next/link';

export default function Dashboard() {
  const { data: session } = useSession();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isScanningMultiple, setIsScanningMultiple] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<{network: NetworkType, count: number, completed: boolean}[]>([]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('bitax-theme', newMode ? 'dark' : 'light');
  };

  // Vérifier le thème actuel au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('bitax-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    
    // Initialiser les écouteurs pour le menu utilisateur
    initUserMenuListeners();
  }, []);

  // Initialiser les écouteurs pour le menu utilisateur
  const initUserMenuListeners = () => {
    // L'initialisation est maintenant gérée par le script dans layout.tsx
  };

  // Vérifier le statut premium et les wallets sauvegardés au chargement
  useEffect(() => {
    if (session?.user) {
      // Vérifier le statut premium
      const isPremium = session.user.isPremium;
      if (isPremium) {
        localStorage.setItem('bitax-premium', 'true');
      }
      
      // Récupérer les wallets sauvegardés
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
  const handleWalletConnect = async (address: string, walletProvider: any) => {
    try {
      setWalletAddress(address);
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

  // Récupérer les transactions pour un réseau spécifique
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      // Ajouter l'information du réseau à chaque transaction
      const txsWithNetwork = filteredTxs.map(tx => ({...tx, network}));
      
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
      
      // Scanner chaque réseau séquentiellement pour montrer la progression
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
          
          // Ajouter l'information du réseau à chaque transaction
          const txsWithNetwork = filteredTxs.map(tx => ({...tx, network}));
          
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

  // Exporter un rapport
  const handleExportReport = () => {
    // Implémentation de l'export de rapport
    alert('Fonctionnalité d\'export à venir prochainement!');
  };

  return (
    <div className="space-y-8">
      {/* Header du Dashboard avec information sur le wallet connecté */}
      {isWalletConnected && (
        <DashboardHeader 
          walletAddress={walletAddress}
          balance={balance}
          transactionCount={transactions.length}
          isPremiumUser={session?.user?.isPremium || false}
          onScanRequest={handleScanNetwork}
          onExportReport={handleExportReport}
          isLoading={isLoading}
          lastUpdated={lastUpdated || undefined}
        />
      )}
      
      {/* Affichage de l'erreur s'il y en a une */}
      {error && (
        <div className="bg-red-900/20 text-red-300 p-4 rounded-xl border border-red-800/30 animate-fade-in">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Si aucun wallet n'est connecté, afficher le bouton de connexion */}
      {!isWalletConnected ? (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Bienvenue sur votre dashboard Bitax</h2>
              <p className="text-gray-300 mb-6">
                Pour commencer à utiliser Bitax, connectez votre wallet crypto pour scanner vos transactions et générer votre rapport fiscal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <WalletConnectButton 
                  onConnect={handleWalletConnect}
                  isLoading={isLoading}
                  className="w-full sm:w-auto"
                  variant="primary"
                  size="lg"
                  showIcon={true}
                />
                
                <Link href="/guide" className="btn-secondary w-full sm:w-auto flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </Link>
              </div>
            </div>
            
            {/* Section des blockchains supportées */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-semibold mb-6 text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Blockchains supportées
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                  <div key={network} className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 flex flex-col items-center justify-center text-center transform transition-all hover:scale-105 hover:bg-indigo-900/30 hover:border-indigo-500/50 duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                    <NetworkIcon network={network as NetworkType} size={40} className="mb-3" />
                    <span className="text-sm font-medium text-gray-300">{SUPPORTED_NETWORKS[network as NetworkType].name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar avec info utilisateur et stats */}
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Votre compte
              </h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg shadow-indigo-500/20">
                  {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "U"}
                </div>
                <div>
                  <div className="font-semibold text-white">{session?.user?.name || "Utilisateur"}</div>
                  <div className="text-sm text-gray-400">{session?.user?.email || ""}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-700/50 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400">Plan</span>
                  {session?.user?.isPremium ? (
                    <span className="bg-gradient-to-r from-yellow-600/50 to-yellow-500/50 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium border border-yellow-500/30">Premium</span>
                  ) : (
                    <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">Gratuit</span>
                  )}
                </div>
                
                {!session?.user?.isPremium && (
                  <Link href="/tarifs" className="mt-4 block text-center py-2 px-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-lg font-medium text-white hover:from-yellow-500 hover:to-yellow-400 transition-colors hover:shadow-lg hover:shadow-yellow-500/20">
                    Passer Premium
                  </Link>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/70 transition-colors group">
                  <svg className="w-5 h-5 mr-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-200 group-hover:text-white transition-colors">Gérer mon profil</span>
                </Link>
                
                <Link href="/dashboard/wallets" className="flex items-center p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/70 transition-colors group">
                  <svg className="w-5 h-5 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-gray-200 group-hover:text-white transition-colors">Gérer mes wallets</span>
                </Link>
                
                <Link href="/support" className="flex items-center p-3 bg-gray-800/70 rounded-lg hover:bg-gray-700/70 transition-colors group">
                  <svg className="w-5 h-5 mr-3 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-200 group-hover:text-white transition-colors">Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Si un wallet est connecté, afficher les données */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-sm font-medium text-gray-400">Wallet</div>
                  <div className="bg-green-900/30 text-green-400 p-1 rounded-full">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="font-mono text-sm text-white break-all">
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-lg">
                <div className="text-sm font-medium text-gray-400 mb-3">Balance estimée</div>
                <div className="text-xl font-semibold text-white">{balance?.toFixed(2) || "0.00"} €</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-lg">
                <div className="text-sm font-medium text-gray-400 mb-3">Transactions</div>
                <div className="text-xl font-semibold text-white">{transactions.length}</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-lg">
                <div className="text-sm font-medium text-gray-400 mb-3">Dernière mise à jour</div>
                <div className="text-sm text-white">
                  {lastUpdated ? lastUpdated.toLocaleString() : "Jamais"}
                </div>
              </div>
            </div>
            
            {/* Résumé des transactions */}
            {transactions.length > 0 ? (
              <TransactionSummary 
                transactions={transactions}
                isPremiumUser={session?.user?.isPremium || false}
              />
            ) : isLoading ? (
              <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-300">Chargement des transactions...</p>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl flex flex-col items-center justify-center h-64">
                <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400">Aucune transaction trouvée pour le moment.<br />Scannez votre wallet pour commencer.</p>
              </div>
            )}
            
            {/* Liste des transactions si disponibles */}
            {transactions.length > 0 && (
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Transactions récentes
                </h3>
                
                <TransactionList 
                  transactions={transactions}
                  isPremiumUser={session?.user?.isPremium || false}
                />
              </div>
            )}
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Panneau d'info wallet */}
            <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Scan multi-blockchain
              </h3>
              
              <p className="text-gray-300 text-sm mb-4">
                Scannez vos transactions sur toutes les blockchains supportées en un seul clic pour une vue complète de votre activité crypto.
              </p>
              
              {/* Bouton scan multi-blockchain */}
              <button 
                onClick={scanAllNetworks}
                disabled={isLoading || isScanningMultiple}
                className="w-full mb-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading || isScanningMultiple ? (
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
                    <span>Scanner toutes les blockchains</span>
                  </>
                )}
              </button>
              
              {/* Indicateur de progression si scan en cours */}
              {isScanningMultiple && scanProgress.length > 0 && (
                <div className="space-y-2 bg-gray-800/70 rounded-lg p-3 border border-gray-700/50 mt-4">
                  <p className="text-sm text-gray-300 mb-2">Progression du scan:</p>
                  {scanProgress.map((item) => (
                    <div key={item.network} className="flex items-center justify-between text-xs">
                      <div className="flex items-center">
                        <NetworkIcon network={item.network} size={16} className="mr-2" />
                        <span className="text-gray-300">{SUPPORTED_NETWORKS[item.network].name}</span>
                      </div>
                      <div className="flex items-center">
                        {item.completed ? (
                          <span className="text-green-400 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item.count} tx
                          </span>
                        ) : (
                          <span className="text-blue-400 flex items-center">
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
              )}

              <div className="mt-6 border-t border-gray-700/50 pt-4">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Scan par réseau individuel</h4>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                    <button
                      key={network}
                      onClick={() => setActiveNetwork(network as NetworkType)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-lg ${
                        activeNetwork === network 
                          ? 'bg-indigo-900/50 border border-indigo-500/50 shadow-sm shadow-indigo-500/20' 
                          : 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600/80 hover:bg-gray-800/80'
                        } transition-all duration-200`}
                    >
                      <NetworkIcon network={network as NetworkType} size={24} className="mb-2" />
                      <span className="text-xs text-gray-300 text-center">
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handleScanNetwork(activeNetwork)}
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading && activeNetwork ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Scan de {activeNetwork.toUpperCase()} en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
                      </svg>
                      Scanner {activeNetwork.toUpperCase()}
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Toggle du thème */}
            <div className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700/50 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="text-white font-medium">Mode {isDarkMode ? 'sombre' : 'clair'}</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="relative overflow-hidden h-6 w-12 rounded-full bg-gray-700 flex items-center transition-colors duration-300 focus:outline-none"
                >
                  <span
                    className={`absolute left-0.5 bg-white rounded-full h-5 w-5 transform transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
            
            {/* Plans premium */}
            {!session?.user?.isPremium && (
              <div className="p-5 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30 backdrop-blur-md shadow-xl relative overflow-hidden">
                {/* Effet de lumière */}
                <div className="absolute -top-24 -right-24 w-40 h-40 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
                
                <div className="mb-4 relative">
                  <div className="inline-block px-2.5 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-medium mb-2">Premium</div>
                  <h3 className="text-xl font-semibold text-white">Débloquez toutes les fonctionnalités</h3>
                </div>
                
                <ul className="space-y-2 mb-5 relative">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Transactions illimitées</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Exports PDF, CSV, Excel</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">Support prioritaire</span>
                  </li>
                </ul>
                
                <Link href="/pricing" className="relative block text-center py-2.5 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg font-medium text-white shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/30 hover:-translate-y-0.5 transform transition-all">
                  Passer premium
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}