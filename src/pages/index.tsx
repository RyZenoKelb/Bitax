import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectButton from '@/components/WalletConnectButton';
import WalletConnectPanel from '@/components/WalletConnectPanel';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
import PremiumUnlock from '@/components/PremiumUnlock';
import OnboardingWizard from '@/components/OnboardingWizard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

export default function Home() {
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
          {/* Panneau de connexion wallet */}
          {!isWalletConnected ? (
            <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-lg overflow-hidden">
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
            <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Wallet connecté
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {walletAddress.substring(0, 8)}...{walletAddress.substring(walletAddress.length - 6)}
                </p>
                
                {/* Sélection du réseau */}
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scanner un réseau spécifique
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                      <button
                        key={network}
                        onClick={() => handleScanNetwork(network as NetworkType)}
                        className={`px-3 py-2 text-xs font-medium rounded-lg ${
                          activeNetwork === network 
                            ? 'bg-bitax-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Bannière Premium */}
          {!isPremiumUser && (
            <PremiumUnlock onUnlock={handleUnlockPremium} />
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
              <div className="w-12 h-12 border-4 border-bitax-primary-200 border-t-bitax-primary-600 rounded-full animate-spin"></div>
              <p className="ml-4 text-bitax-gray-600 dark:text-bitax-gray-300">Chargement des transactions...</p>
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
                    <TransactionList 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                  </>
                ) : (
                  <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-lg p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-bitax-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-bitax-gray-900 dark:text-white">Aucune transaction trouvée</h3>
                    <p className="mt-2 text-bitax-gray-500 dark:text-bitax-gray-400">
                      Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork}.
                      <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                    </p>
                    <button
                      onClick={() => handleScanNetwork(activeNetwork)}
                      className="mt-6 px-4 py-2 bg-bitax-primary-600 hover:bg-bitax-primary-700 text-white rounded-lg"
                    >
                      Scanner à nouveau
                    </button>
                  </div>
                )
              ) : (
                <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-bitax-gray-900 dark:text-white">Bienvenue sur Bitax</h3>
                  <p className="mt-2 text-bitax-gray-600 dark:text-bitax-gray-400">
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