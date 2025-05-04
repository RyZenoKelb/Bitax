// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import WalletConnectButton from '@/components/WalletConnectButton';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionSummary from '@/components/TransactionSummary';
import TaxDashboard from '@/components/TaxDashboard';
import TransactionList from '@/components/TransactionList';
import OnboardingWizard from '@/components/OnboardingWizard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

const networks = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as const;

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    setShowOnboarding(!localStorage.getItem('bitax-visited'));
    setIsPremiumUser(localStorage.getItem('bitax-premium') === 'true');
  }, []);

  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    setWalletAddress(address);
    setProvider(walletProvider);
    setIsWalletConnected(true);
    await handleScanNetwork('eth');
  };

  const handleScanNetwork = async (network: NetworkType) => {
    setActiveNetwork(network);
    if (!walletAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await getTransactions(walletAddress, network);
      setTransactions(filterSpamTransactions(txs));
    } catch (error) {
      setError('Échec de la récupération des transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic here
  };

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={() => {
              setShowOnboarding(false);
              localStorage.setItem('bitax-visited', 'true');
            }}
            onConnect={handleWalletConnect}
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg mx-auto px-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Connectez votre wallet
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Accédez à votre dashboard fiscal en quelques clics
              </p>
            </div>
            
            <WalletConnectButton 
              onConnect={handleWalletConnect}
              variant="primary"
              fullWidth
              size="lg"
            />
            
            <div className="mt-6 flex justify-center items-center space-x-4">
              {networks.map((network) => (
                <div key={network} className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {network.charAt(0).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader
        walletAddress={walletAddress}
        transactionCount={transactions.length}
        isPremiumUser={isPremiumUser}
        onScanRequest={handleScanNetwork}
        onExportReport={handleExport}
        isLoading={isLoading}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800"
          >
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {isLoading && transactions.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : transactions.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
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
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Aucune transaction
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Scannez un autre réseau ou vérifiez votre wallet
            </p>
            <button
              onClick={() => handleScanNetwork(activeNetwork)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Actualiser
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}