// src/pages/dashboard.tsx
import { useState, useEffect, useMemo, useCallback } from 'react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { 
  Wallet, 
  ArrowDownToLine, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Layers,
  FileText,
  Globe,
  DollarSign,
  PieChart,
  ActivitySquare,
  Database,
  LockKeyhole,
  Sparkles
} from 'lucide-react';

// Lazy loaded components
const OnboardingWizard = dynamic(() => import('@/components/OnboardingWizard'), { ssr: false });
const WalletConnectPanel = dynamic(() => import('@/components/WalletConnectPanel'));
const TransactionAnalytics = dynamic(() => import('@/components/TransactionAnalytics'));
const TaxOptimizationCenter = dynamic(() => import('@/components/TaxOptimizationCenter'));
const PortfolioTracker = dynamic(() => import('@/components/PortfolioTracker'));
const ComplianceMonitor = dynamic(() => import('@/components/ComplianceMonitor'));

import WalletConnectButton from '@/components/WalletConnectButton';
import TransactionSummary from '@/components/TransactionSummary';
import TaxDashboard from '@/components/TaxDashboard';
import TransactionList from '@/components/TransactionList';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// Hooks personnalisés
const useWalletConnection = () => {
  const [state, setState] = useState({
    isConnected: false,
    address: '',
    provider: null as ethers.BrowserProvider | null,
    balance: 0,
    ensName: null as string | null
  });

  const connect = useCallback(async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      const ensName = await provider.lookupAddress(address);
      setState({
        isConnected: true,
        address,
        provider,
        balance: Number(ethers.formatEther(balance)),
        ensName
      });
    } catch (error) {
      console.error('Erreur de connexion wallet:', error);
      throw error;
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: '',
      provider: null,
      balance: 0,
      ensName: null
    });
  }, []);

  return { ...state, connect, disconnect };
};

const useTransactionManager = (walletAddress: string) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [syncProgress, setSyncProgress] = useState(0);

  const fetchTransactions = useCallback(async (network: NetworkType) => {
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);
    setSyncProgress(0);

    const networks = network === 'all' ? Object.keys(SUPPORTED_NETWORKS) : [network];
    let allTransactions: any[] = [];

    try {
      for (let i = 0; i < networks.length; i++) {
        const net = networks[i] as NetworkType;
        const txs = await getTransactions(walletAddress, net);
        allTransactions = [...allTransactions, ...txs];
        setSyncProgress(((i + 1) / networks.length) * 100);
      }

      const filtered = filterSpamTransactions(allTransactions);
      setTransactions(filtered);
    } catch (err) {
      console.error('Erreur lors de la récupération des transactions:', err);
      setError('Impossible de récupérer les transactions. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
      setSyncProgress(100);
    }
  }, [walletAddress]);

  const scanNetwork = useCallback(async (network: NetworkType) => {
    setActiveNetwork(network);
    await fetchTransactions(network);
  }, [fetchTransactions]);

  return {
    transactions,
    isLoading,
    error,
    activeNetwork,
    syncProgress,
    scanNetwork,
    fetchTransactions
  };
};

const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    isPremiumUser: false,
    taxCalculationMethod: 'FIFO' as const,
    currency: 'EUR' as const,
    theme: 'system' as const,
    notifications: true,
    taxYearOverride: null as number | null
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('bitax-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const updatePreference = useCallback((key: keyof typeof preferences, value: any) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('bitax-preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { preferences, updatePreference };
};

export default function Dashboard() {
  const router = useRouter();
  const wallet = useWalletConnection();
  const { preferences, updatePreference } = useUserPreferences();
  const transactionManager = useTransactionManager(wallet.address);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'analytics' | 'tax' | 'portfolio' | 'compliance'>('overview');

  // Mémorisation des données calculées
  const dashboardStats = useMemo(() => {
    const txs = transactionManager.transactions;
    const totalValue = txs.reduce((sum, tx) => sum + (Number(tx.value) || 0), 0);
    const uniqueTokens = new Set(txs.map(tx => tx.tokenSymbol || 'ETH')).size;
    const averageGasPrice = txs.reduce((sum, tx) => sum + (Number(tx.gasPrice) || 0), 0) / txs.length || 0;

    return {
      totalValue,
      uniqueTokens,
      averageGasPrice,
      transactionCount: txs.length
    };
  }, [transactionManager.transactions]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('bitax-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
    }
  }, []);

  const handleWalletConnect = useCallback(async (address: string, provider: ethers.BrowserProvider) => {
    try {
      await wallet.connect(address, provider);
      await transactionManager.fetchTransactions('all');
      localStorage.setItem('bitax-visited', 'true');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      // Gérer l'erreur appropriée ici
    }
  }, [wallet, transactionManager]);

  const renderNetworkSelector = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      {Object.keys(SUPPORTED_NETWORKS).map((network) => (
        <motion.button
          key={network}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => transactionManager.scanNetwork(network as NetworkType)}
          className={`
            relative overflow-hidden px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${transactionManager.activeNetwork === network
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }
          `}
        >
          {transactionManager.isLoading && transactionManager.activeNetwork === network && (
            <motion.div
              className="absolute inset-0 bg-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${transactionManager.syncProgress}%` }}
              transition={{ duration: 0.5 }}
              style={{ opacity: 0.2 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {SUPPORTED_NETWORKS[network as NetworkType]?.name || network}
          </span>
        </motion.button>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    dashboardStats.totalValue > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}>
                    {dashboardStats.totalValue > 0 ? '+' : ''}{((dashboardStats.totalValue / wallet.balance) * 100).toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Valeur Totale</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: preferences.currency }).format(dashboardStats.totalValue)}
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    {Object.keys(SUPPORTED_NETWORKS).length} réseaux
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tokens Uniques</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{dashboardStats.uniqueTokens}</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <ActivitySquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    {transactionManager.transactions.length > 100 ? '+100' : transactionManager.transactions.length}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transactions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{transactionManager.transactions.length}</p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                    {dashboardStats.averageGasPrice > 0 ? Math.round(dashboardStats.averageGasPrice / 1e9) + ' Gwei' : 'N/A'}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gas Moyen</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {dashboardStats.averageGasPrice > 0 ? (dashboardStats.averageGasPrice / 1e18).toFixed(8) + ' ETH' : '—'}
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransactionSummary 
                  transactions={transactionManager.transactions}
                  isPremiumUser={preferences.isPremiumUser}
                />
              </div>
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité Récente</h3>
                  <div className="space-y-4">
                    {transactionManager.transactions.slice(0, 3).map((tx, index) => (
                      <motion.div 
                        key={index}
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ArrowDownToLine className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {tx.from?.substring(0, 6)}...{tx.from?.substring(-4)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(tx.timestamp * 1000).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {Number(ethers.formatEther(tx.value)).toFixed(4)} ETH
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sécurité</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Connexion sécurisée</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Wallet connecté via Web3</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Actif
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <LockKeyhole className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Données chiffrées</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">End-to-end encryption</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Actif
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return <TransactionAnalytics transactions={transactionManager.transactions} />;
      case 'tax':
        return (
          <TaxDashboard 
            transactions={transactionManager.transactions}
            isPremiumUser={preferences.isPremiumUser}
            walletAddress={wallet.address}
          />
        );
      case 'portfolio':
        return <PortfolioTracker transactions={transactionManager.transactions} walletAddress={wallet.address} />;
      case 'compliance':
        return <ComplianceMonitor transactions={transactionManager.transactions} isPremiumUser={preferences.isPremiumUser} />;
      default:
        return null;
    }
  };

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={() => setShowOnboarding(false)}
            onConnect={handleWalletConnect}
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg px-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-8">
                <div className="text-center mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-4"
                  >
                    <Wallet className="w-full h-full text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Connectez votre wallet
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Accédez à votre tableau de bord fiscal en quelques clics
                  </p>
                </div>
                
                <WalletConnectButton 
                  onConnect={handleWalletConnect}
                  variant="primary"
                  fullWidth
                  size="lg"
                />
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Réseaux supportés
                  </h3>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.values(SUPPORTED_NETWORKS).map((network, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2">
                          <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                            {network.name.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {network.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Sécurisé & Confidentiel</span>
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>TLS 1.3</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {wallet.ensName || `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}`}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {preferences.currency} {wallet.balance.toFixed(4)}
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              {preferences.isPremiumUser && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm"
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  Exporter
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => transactionManager.fetchTransactions(transactionManager.activeNetwork)}
                disabled={transactionManager.isLoading}
                className="inline-flex items-center p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RefreshCw className={`w-5 h-5 ${transactionManager.isLoading ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for sync */}
        {transactionManager.isLoading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${transactionManager.syncProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactionManager.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800"
          >
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Erreur</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{transactionManager.error}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
              { id: 'analytics', name: 'Analytics', icon: PieChart },
              { id: 'tax', name: 'Fiscalité', icon: FileText },
              { id: 'portfolio', name: 'Portfolio', icon: Database },
              { id: 'compliance', name: 'Conformité', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                    ${selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <Icon className={`mr-2 w-5 h-5 ${selectedTab === tab.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
                  {tab.name}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Network Selection */}
        {selectedTab === 'overview' && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Réseaux Blockchain</h2>
            {renderNetworkSelector()}
          </motion.div>
        )}

        {/* Tab Content */}
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Transaction List */}
        {transactionManager.transactions.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TransactionList 
              transactions={transactionManager.transactions}
              isPremiumUser={preferences.isPremiumUser}
            />
          </motion.div>
        )}
      </main>

      {/* Premium Upgrade CTA */}
      {!preferences.isPremiumUser && transactionManager.transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg cursor-pointer max-w-sm"
            onClick={() => updatePreference('isPremiumUser', true)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Passez à Premium</h3>
                <p className="text-sm opacity-90">Accédez à toutes les fonctionnalités avancées</p>
              </div>
              <ChevronRight className="ml-4 h-5 w-5" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}