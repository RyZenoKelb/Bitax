// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import DashboardLayout from '@/components/DashboardLayout';
import WalletConnectButton from '@/components/WalletConnectButton';
import DashboardHeader from '@/components/DashboardHeader';
import TaxDashboard from '@/components/TaxDashboard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  const [showWelcomeBox, setShowWelcomeBox] = useState<boolean>(true);

  // Vérifier le statut premium (simulé pour l'instant)
  useEffect(() => {
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
      setShowWelcomeBox(false);
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

  // Section de bienvenue et de connexion wallet
  const WelcomeSection = () => (
    <div className="px-1 py-1 bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-2xl overflow-hidden backdrop-blur-sm mb-8">
      <div className="px-6 py-8 bg-gray-900/90 rounded-xl border-2 border-gray-800/50 relative overflow-hidden">
        {/* Background glow effect */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-600/20 to-secondary-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-secondary-600/20 to-primary-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Bienvenue sur votre tableau de bord Bitax</h1>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Pour commencer, connectez votre wallet crypto pour analyser vos transactions et générer votre rapport fiscal en quelques clics.
          </p>
          
          <div className="max-w-md mx-auto">
            <WalletConnectButton 
              onConnect={handleWalletConnect}
              variant="primary"
              fullWidth
              size="lg"
            />
            
            <div className="mt-6 grid grid-cols-5 gap-3">
              {['ETH', 'POLYGON', 'ARBITRUM', 'OPTIMISM', 'BASE'].map((network, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center"
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-medium mb-2"
                    style={{ 
                      background: index === 0 ? '#627EEA' : 
                               index === 1 ? '#8247E5' : 
                               index === 2 ? '#28A0F0' : 
                               index === 3 ? '#FF0420' : '#0052FF' 
                    }}
                  >
                    {network.substring(0, 1)}
                  </div>
                  <span className="text-xs text-gray-400">{network}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Section des statistiques - en haut du dashboard
  const StatisticCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {[
        {
          title: "Valeur du portfolio",
          value: "24,586 €",
          change: "+12.4%",
          changeType: "positive",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )
        },
        {
          title: "Transactions",
          value: transactions.length.toString(),
          subtitle: "Dernière: il y a 2 jours",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          )
        },
        {
          title: "Plus-values",
          value: "5,481 €",
          change: "+3.2%",
          changeType: "positive",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )
        },
        {
          title: "Impôts estimés",
          value: "1,374 €",
          subtitle: "Année fiscale 2023",
          icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          )
        }
      ].map((stat, index) => (
        <div 
          key={index} 
          className="p-6 rounded-2xl bg-gradient-to-b from-gray-800/60 to-gray-900/60 border border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="text-gray-400 text-sm font-medium mb-1">{stat.title}</div>
              <div className="flex items-baseline">
                <div className="text-white text-2xl font-bold">{stat.value}</div>
                {stat.change && (
                  <div className={`ml-2 text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change}
                  </div>
                )}
              </div>
              {stat.subtitle && (
                <div className="text-gray-500 text-xs mt-1">{stat.subtitle}</div>
              )}
            </div>
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-900/50 to-gray-800/50 border border-gray-700/50 text-primary-400">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  // Network Scanner
  const NetworkScanner = () => (
    <div className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 border border-gray-800/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Scanner une blockchain</h2>
          <p className="text-gray-400 text-sm">Sélectionnez un réseau pour scanner vos transactions</p>
        </div>
        
        <button
          onClick={() => handleScanNetwork(activeNetwork)}
          disabled={isLoading || !isWalletConnected}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
          <button
            key={network}
            onClick={() => setActiveNetwork(network as NetworkType)}
            disabled={isLoading}
            className={`relative flex flex-col items-center justify-center p-4 text-sm font-medium rounded-xl transition-all duration-200 ${
              activeNetwork === network 
                ? 'bg-primary-900/50 text-primary-300 border-2 border-primary-700/50 shadow-lg shadow-primary-900/20' 
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50'
            }`}
          >
            {activeNetwork === network && isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary-900/80 rounded-xl backdrop-blur-sm">
                <svg className="animate-spin h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white mb-2 shadow-lg"
              style={{ 
                background: network === 'eth' ? '#627EEA' : 
                         network === 'polygon' ? '#8247E5' : 
                         network === 'arbitrum' ? '#28A0F0' : 
                         network === 'optimism' ? '#FF0420' : '#0052FF' 
              }}
            >
              {network.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm">{network.charAt(0).toUpperCase() + network.slice(1)}</span>
            
            {transactions.length > 0 && network === activeNetwork && (
              <span className="mt-2 px-2 py-0.5 text-xs bg-gray-700 rounded-full">
                {transactions.length} tx
              </span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 border-t border-gray-800 pt-4">
        <button
          onClick={() => {
            // Fonction pour scanner toutes les blockchains en parallèle
            ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
              handleScanNetwork(network as NetworkType);
            });
          }}
          disabled={isLoading || !isWalletConnected}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-primary-700 to-secondary-700 hover:from-primary-800 hover:to-secondary-800 text-white text-sm font-medium rounded-lg shadow-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Scan automatique multi-chain
        </button>
      </div>
    </div>
  );
  
  // Mise en page principale
  return (
    <DashboardLayout
      walletConnected={isWalletConnected}
      walletAddress={walletAddress}
      isPremiumUser={isPremiumUser}
    >
      {/* Contenu du dashboard */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Tableau de bord</h1>
          <div className="text-sm text-gray-400">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        
        {/* Message d'erreur si nécessaire */}
        {error && (
          <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 text-red-400 flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        )}
        
        {/* Écran de bienvenue si pas de wallet connecté */}
        {!isWalletConnected && showWelcomeBox && <WelcomeSection />}
        
        {/* Cartes des statistiques */}
        {isWalletConnected && transactions.length > 0 && <StatisticCards />}
        
        {/* Section scanner réseau */}
        {isWalletConnected && <NetworkScanner />}
        
        {/* Dashboard fiscal avec les transactions */}
        {isWalletConnected && transactions.length > 0 && (
          <>
            {/* En-tête du dashboard avec fonctionnalités principales */}
            <DashboardHeader
              walletAddress={walletAddress}
              balance={24586}
              balanceCurrency="EUR"
              transactionCount={transactions.length}
              isPremiumUser={isPremiumUser}
              onScanRequest={(network) => handleScanNetwork(network || activeNetwork)}
              onExportReport={() => console.log('Exporting report...')}
              isLoading={isLoading}
              lastUpdated={new Date()}
              className="mb-6"
            />
            
            {/* Dashboard fiscal complet */}
            <TaxDashboard
              transactions={transactions}
              isPremiumUser={isPremiumUser}
              walletAddress={walletAddress}
            />
          </>
        )}
        
        {/* Message si wallet connecté mais pas de transactions */}
        {isWalletConnected && transactions.length === 0 && !isLoading && (
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Aucune transaction trouvée</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork.toUpperCase()}.
              <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
            </p>
            <button
              onClick={() => handleScanNetwork(activeNetwork)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Scanner à nouveau
            </button>
          </div>
        )}
        
        {/* Spinner de chargement */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-primary-500 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-secondary-500 rounded-full animate-ping"></div>
            </div>
            <p className="ml-6 text-gray-300">Chargement des transactions...</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}