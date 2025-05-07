// src/pages/transactions.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectButton from '@/components/WalletConnectButton';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

export default function Transactions() {
  // États
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'summary' | 'list'>('summary');

  // Vérifier le statut premium
  useEffect(() => {
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    // Vérifier si un wallet est déjà connecté (persister l'état entre les pages)
    const connectedWallet = localStorage.getItem('bitax-connected-wallet');
    if (connectedWallet) {
      setWalletAddress(connectedWallet);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions
      fetchTransactions(connectedWallet, activeNetwork);
    }
  }, []);

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Sauvegarder l'adresse pour la persistance
      localStorage.setItem('bitax-connected-wallet', address);
      
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
  
  // Fonction pour exporter les données
  const handleExportTransactions = () => {
    if (transactions.length === 0) return;
    
    const headers = [
      'Hash',
      'Date',
      'Type',
      'Token',
      'Montant',
      'De',
      'À'
    ].join(',');
    
    const rows = transactions.map(tx => [
      tx.hash,
      tx.block_timestamp ? new Date(tx.block_timestamp).toLocaleDateString() : '',
      tx.type || 'Inconnu',
      tx.tokenSymbol || 'ETH',
      tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0),
      tx.from_address || '',
      tx.to_address || ''
    ].join(','));
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'bitax_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Interface utilisateur
  return (
    <div className="space-y-6">
      {/* En-tête avec effet de gradient et animation */}
      <div className="relative mb-6 pb-6">
        {/* Effet de fond animé */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Titre et navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Transactions
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Visualisez, analysez et exportez l'historique complet de vos transactions crypto sur différentes blockchains.
            </p>
          </div>
          
          {/* Actions et vue du wallet */}
          {isWalletConnected && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <div className="flex flex-shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wallet connecté</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                  </div>
                </div>
              </div>
              
              <div className="inline-flex rounded-lg shadow-sm">
                <button
                  onClick={() => setViewMode('summary')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${
                    viewMode === 'summary'
                      ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700/50'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Aperçu
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${
                    viewMode === 'list'
                      ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700/50'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  Liste
                </button>
              </div>
              
              {isPremiumUser && (
                <button
                  onClick={handleExportTransactions}
                  disabled={transactions.length === 0 || isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex items-center ${
                    transactions.length === 0 || isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500'
                      : 'bg-white text-primary-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-primary-400 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Barre de réseau */}
        {isWalletConnected && (
          <div className="mt-6 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Réseau :</span>
              
              <div className="flex flex-wrap gap-2">
                {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => (
                  <button
                    key={network}
                    onClick={() => handleScanNetwork(network)}
                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeNetwork === network 
                        ? 'text-white shadow-sm transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      backgroundColor: activeNetwork === network 
                        ? network === 'eth' ? '#3B82F6' 
                        : network === 'polygon' ? '#8B5CF6' 
                        : network === 'arbitrum' ? '#2563EB' 
                        : network === 'optimism' ? '#EF4444' 
                        : '#60A5FA' 
                        : undefined
                    }}
                  >
                    {activeNetwork === network && isLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {network === 'eth' && 'Ethereum'}
                    {network === 'polygon' && 'Polygon'}
                    {network === 'arbitrum' && 'Arbitrum'}
                    {network === 'optimism' && 'Optimism'}
                    {network === 'base' && 'Base'}
                  </button>
                ))}
              </div>
              
              <div className="ml-auto flex items-center">
                <button
                  onClick={() => handleScanNetwork(activeNetwork)}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Rafraîchir
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
                  className="ml-2 p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  title="Scanner toutes les blockchains"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Contenu principal */}
      {!isWalletConnected ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connectez votre wallet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Pour visualiser et analyser vos transactions sur différentes blockchains, veuillez d'abord connecter votre wallet crypto.
            </p>
            
            <div className="max-w-xs mx-auto">
              <WalletConnectButton 
                onConnect={handleWalletConnect}
                variant="primary"
                fullWidth
                size="lg"
              />
              
              {/* Wallet supportés */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Wallets supportés</p>
                <div className="flex justify-center space-x-4">
                  {[
                    { name: "MetaMask", icon: "🦊" },
                    { name: "Coinbase", icon: "🔷" },
                    { name: "WalletConnect", icon: "📱" }
                  ].map((wallet, idx) => (
                    <div key={idx} className="flex flex-col items-center" title={wallet.name}>
                      <div className="text-2xl mb-1">{wallet.icon}</div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{wallet.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isLoading && transactions.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400 rounded-full animate-spin"></div>
          <div className="ml-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chargement des transactions</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Veuillez patienter pendant que nous analysons la blockchain...</p>
          </div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="space-y-6">
          {/* Statistiques rapides */}
          {transactions.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  title: "Transactions",
                  value: transactions.length,
                  icon: (
                    <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                },
                {
                  title: "Tokens",
                  value: new Set(transactions.filter(tx => tx.tokenSymbol).map(tx => tx.tokenSymbol)).size,
                  icon: (
                    <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Volume",
                  value: transactions.reduce((sum, tx) => {
                    const value = tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0);
                    return sum + value;
                  }, 0).toFixed(2) + " ETH",
                  icon: (
                    <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Période",
                  value: (() => {
                    let oldestDate = new Date();
                    let newestDate = new Date(0);
                    
                    transactions.forEach(tx => {
                      if (tx.block_timestamp) {
                        const date = new Date(tx.block_timestamp);
                        if (date < oldestDate) oldestDate = date;
                        if (date > newestDate) newestDate = date;
                      }
                    });
                    
                    const days = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
                    return `${days} jours`;
                  })(),
                  icon: (
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Vue d'ensemble des transactions */}
          {viewMode === 'summary' && (
            <TransactionSummary 
              transactions={transactions}
              isPremiumUser={isPremiumUser}
            />
          )}
          
          {/* Liste détaillée des transactions */}
          <TransactionList 
            transactions={transactions}
            isPremiumUser={isPremiumUser}
            onExportCSV={handleExportTransactions}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Aucune transaction trouvée</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork === 'eth' ? 'Ethereum' 
              : activeNetwork === 'polygon' ? 'Polygon' 
              : activeNetwork === 'arbitrum' ? 'Arbitrum' 
              : activeNetwork === 'optimism' ? 'Optimism' 
              : 'Base'}.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400 mb-6">
            Essayez de scanner un autre réseau ou connectez un wallet différent.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => handleScanNetwork(activeNetwork)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Scanner à nouveau</span>
            </button>
            <button
              onClick={() => {
                // Fonction pour scanner toutes les blockchains en parallèle
                ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                  handleScanNetwork(network as NetworkType);
                });
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Scanner toutes les blockchains</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Section premium (si non premium) */}
      {!isPremiumUser && transactions.length > 0 && (
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Débloquez toutes vos transactions</h3>
              <p className="text-blue-100 max-w-xl">
                Passez à Premium pour accéder à un historique illimité, des analyses avancées et des rapports fiscaux complets.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a 
                href="/pricing" 
                className="inline-block px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Découvrir Premium
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}