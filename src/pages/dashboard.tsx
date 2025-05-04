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
    
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
  }, []);

  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      await fetchTransactions(address, activeNetwork);
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };

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

  const handleScanNetwork = async (network: NetworkType) => {
    setActiveNetwork(network);
    if (walletAddress) {
      await fetchTransactions(walletAddress, network);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleUnlockPremium = () => {
    setIsPremiumUser(true);
    localStorage.setItem('bitax-premium', 'true');
  };

  // Page de connexion professionnelle
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0B]">
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md">
            <div className="bg-white dark:bg-[#111111] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Accédez à votre tableau de bord
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Connectez votre wallet pour gérer votre fiscalité crypto
                </p>
              </div>
              
              <WalletConnectButton 
                onConnect={handleWalletConnect}
                variant="primary"
                fullWidth
                size="lg"
              />
              
              <div className="mt-6 grid grid-cols-5 gap-4">
                {['ETH', 'MATIC', 'ARB', 'OP', 'BASE'].map((network, i) => (
                  <div 
                    key={i} 
                    className="flex justify-center items-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {network}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="mt-6 text-xs text-center text-gray-500 dark:text-gray-400">
                Vos clés privées restent sécurisées. Bitax ne stocke pas vos données sensibles.
              </p>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Conforme</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Blockchains</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard professionnel
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0B0B]">
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
      
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              Wallet: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </div>
            <div className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {transactions.length} transactions
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isPremiumUser && (
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
              </button>
            )}
            <button 
              onClick={() => handleScanNetwork(activeNetwork)}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Actualiser
            </button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/10 p-4 text-red-700 dark:text-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && !transactions.length ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-6">
              {/* Network Selector */}
              <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-800">
                {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                  <button
                    key={network}
                    onClick={() => handleScanNetwork(network as NetworkType)}
                    className={`px-6 py-3 text-sm font-medium rounded-t-lg ${
                      activeNetwork === network 
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                  >
                    {network.charAt(0).toUpperCase() + network.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Components */}
              <TransactionSummary 
                transactions={transactions}
                isPremiumUser={isPremiumUser}
              />
              
              <TaxDashboard 
                transactions={transactions}
                isPremiumUser={isPremiumUser}
                walletAddress={walletAddress}
              />
              
              <TransactionList 
                transactions={transactions}
                isPremiumUser={isPremiumUser}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">
                Aucune transaction trouvée
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Essayez un autre réseau ou vérifiez l'adresse de votre wallet
              </p>
              <button
                onClick={() => handleScanNetwork(activeNetwork)}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Scanner à nouveau
                <svg className="ml-2 -mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Premium Unlock */}
          {!isPremiumUser && (
            <div className="mt-6">
              <PremiumUnlock onUnlock={handleUnlockPremium} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}