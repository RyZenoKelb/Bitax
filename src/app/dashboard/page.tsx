"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import WalletConnectButton from '@/components/WalletConnectButton';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import DashboardHeader from '@/components/DashboardHeader';
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
        <div className="bg-red-900/20 text-red-300 p-4 rounded-lg border border-red-800/30">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
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
            <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Blockchains supportées</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Solana'].map((network, index) => (
                  <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 flex flex-col items-center justify-center text-center transform transition-all hover:scale-105 hover:bg-indigo-900/30 hover:border-indigo-500/50 duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                      {network.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-300">{network}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar avec info utilisateur et stats */}
          <div className="space-y-6">
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Votre compte</h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mr-4">
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
                    <span className="bg-yellow-900/30 text-yellow-300 px-2 py-1 rounded-full text-xs font-medium">Premium</span>
                  ) : (
                    <span className="bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">Gratuit</span>
                  )}
                </div>
                
                {!session?.user?.isPremium && (
                  <Link href="/tarifs" className="mt-3 block text-center py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-colors">
                    Passer Premium
                  </Link>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Actions rapides</h3>
              
              <div className="space-y-3">
                <Link href="/profile" className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <svg className="w-5 h-5 mr-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-200">Gérer mon profil</span>
                </Link>
                
                <Link href="/dashboard/wallets" className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-gray-200">Gérer mes wallets</span>
                </Link>
                
                <Link href="/support" className="flex items-center p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors">
                  <svg className="w-5 h-5 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-200">Support</span>
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
            {/* Graphique d'aperçu */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Aperçu des transactions</h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="bg-gray-800/40 rounded-lg p-4 h-64 relative">
                  <div className="absolute inset-4 flex items-end space-x-2">
                    {[35, 28, 49, 58, 23, 65, 40, 48, 52, 38, 60, 55].map((height, i) => (
                      <div 
                        key={i} 
                        className="bg-gradient-to-t from-primary-500 to-secondary-500 rounded-t-sm" 
                        style={{ 
                          height: `${height}%`, 
                          width: '8%' 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-800/40 rounded-lg p-4">
                  <svg className="w-12 h-12 text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-400 text-center">Aucune transaction trouvée pour le moment.<br />Scannez votre wallet pour commencer.</p>
                </div>
              )}
            </div>
            
            {/* Résumé des transactions */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Transactions récentes</h3>
                {transactions.length > 0 && (
                  <Link href="/dashboard/transactions" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center">
                    Voir toutes
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-700/50">
                  <table className="min-w-full divide-y divide-gray-700/50">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Montant</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Réseau</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800/20 divide-y divide-gray-700/50">
                      {transactions.slice(0, 5).map((tx, index) => (
                        <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                            {new Date(tx.block_timestamp || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.type === 'in' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {tx.type === 'in' ? 'Réception' : 'Envoi'}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                            {tx.valueInETH?.toFixed(6) || '0.00'} {tx.tokenSymbol || 'ETH'}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 uppercase">
                              {tx.network || activeNetwork}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 bg-gray-800/40 rounded-lg p-4">
                  <svg className="w-8 h-8 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-gray-400 text-center">Aucune transaction trouvée.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Panneau d'info wallet */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Résumé du portefeuille</h3>
              
              <div className="flex items-center p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <p className="text-white font-mono text-sm">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Balance estimée</div>
                  <div className="text-2xl font-semibold text-white">{balance?.toFixed(2) || "—"} €</div>
                </div>
                
                <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-700/50">
                  <div className="text-sm text-gray-400 mb-1">Transactions</div>
                  <div className="text-2xl font-semibold text-white">{transactions.length}</div>
                </div>
              </div>
              
              <button 
                onClick={() => handleScanNetwork()}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium text-white hover:from-indigo-700 hover:to-purple-700 transition-colors"
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Rafraîchir les données</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Sélecteur de réseau */}
            <div className="p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 backdrop-blur-md">
              <h3 className="text-xl font-semibold mb-4 text-white">Réseaux blockchain</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                  <button
                    key={network}
                    onClick={() => setActiveNetwork(network as NetworkType)}
                    className={`relative flex items-center justify-center flex-col p-2 rounded-lg ${
                      activeNetwork === network 
                        ? 'bg-primary-900/40 border border-primary-500/50 shadow-sm' 
                        : 'bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/80'
                    } transition-all duration-200`}
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold mb-1">
                      {network.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-300">
                      {network.charAt(0).toUpperCase() + network.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => handleScanNetwork(activeNetwork)}
                disabled={isLoading}
                className="w-full mt-3 flex items-center justify-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium text-white transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" />
                </svg>
                Scanner {activeNetwork.toUpperCase()}
              </button>
            </div>
            
            {/* Plans premium */}
            {!session?.user?.isPremium && (
              <div className="p-5 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30 backdrop-blur-md">
                <div className="mb-4">
                  <div className="inline-block px-2.5 py-1 bg-yellow-900/30 text-yellow-300 rounded-full text-xs font-medium mb-2">Premium</div>
                  <h3 className="text-xl font-semibold text-white">Débloquez toutes les fonctionnalités</h3>
                </div>
                
                <ul className="space-y-2 mb-5">
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
                
                <Link href="/tarifs" className="block text-center py-2.5 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg font-medium text-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-0.5">
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