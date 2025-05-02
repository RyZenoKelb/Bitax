"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import { ethers } from 'ethers';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { 
  ArrowRight, TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  BarChart2, PieChart, RefreshCw, Zap, Clock, DollarSign
} from 'lucide-react';

// Interfaces et types
interface TransactionResult {
  hash: string;
  type: string;
  tokenIn: string;
  tokenOut: string;
  valueIn: number;
  valueOut: number;
  timestamp: number;
  isProfit: boolean;
  profitAmount: number;
}

// Modifié pour être compatible avec le type TransactionResult des utils
type ImportedTransactionResult = ReturnType<typeof getTransactions> extends Promise<infer T> ? 
  T extends Array<infer U> ? U : never : never;

interface ChartDataPoint {
  date: string;
  amount: number;
  profit: number;
  loss: number;
}

interface StatusBadgeProps {
  type: 'success' | 'warning' | 'error' | 'info' | 'premium';
  text: string;
}

interface NetworkButtonProps {
  network: string;
  active: boolean;
  onClick: () => void;
  isLoading: boolean;
}

interface TransactionPreviewProps {
  transaction: TransactionResult | null;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  color?: 'blue' | 'green' | 'purple' | 'amber' | 'rose';
  onClick?: () => void;
  isLoading: boolean;
}

// Composants importés
import WalletConnectButton from '@/components/WalletConnectButton';
import OnboardingWizard from '@/components/OnboardingWizard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// Animation de chargement du scanner
const scannerAnimation = {
  hidden: { width: '0%', opacity: 0 },
  visible: { 
    width: '100%', 
    opacity: 1,
    transition: { 
      duration: 2, 
      ease: "easeInOut" 
    }
  }
};

// Animation d'apparition des éléments
const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15
    }
  }
};

// Animation des statistiques
const countAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 10,
      delay: 0.2
    }
  }
};

// Données de démonstration pour les graphiques
const demoTransactionData = [
  { date: 'Jan', amount: 1200, profit: 150, loss: -50 },
  { date: 'Feb', amount: 1800, profit: 220, loss: -120 },
  { date: 'Mar', amount: 2400, profit: 300, loss: -75 },
  { date: 'Apr', amount: 3000, profit: 450, loss: -130 },
  { date: 'May', amount: 2800, profit: 380, loss: -220 },
  { date: 'Jun', amount: 3600, profit: 490, loss: -150 },
  { date: 'Jul', amount: 4200, profit: 580, loss: -90 },
];

// Fonction pour formater les montants
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount);
};

// Fonction pour tronquer les adresses de wallet
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// Composant de badge d'état
const StatusBadge = ({ type, text }: StatusBadgeProps): React.ReactElement => {
  const badgeStyles: Record<StatusBadgeProps['type'], string> = {
    success: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-500 border border-emerald-500/20",
    warning: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-500 border border-amber-500/20",
    error: "bg-gradient-to-r from-rose-500/20 to-red-500/20 text-rose-500 border border-rose-500/20",
    info: "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-500 border border-blue-500/20",
    premium: "bg-gradient-to-r from-purple-500/20 to-violet-500/20 text-purple-500 border border-purple-500/20",
  };

  const icons: Record<StatusBadgeProps['type'], React.ReactElement> = {
    success: <CheckCircle className="w-3.5 h-3.5 mr-1.5" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />,
    error: <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />,
    info: <RefreshCw className="w-3.5 h-3.5 mr-1.5" />,
    premium: <Zap className="w-3.5 h-3.5 mr-1.5" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[type]}`}>
      {icons[type]}
      {text}
    </span>
  );
};

// Composant de bouton réseau
const NetworkButton = ({ network, active, onClick, isLoading }: NetworkButtonProps): React.ReactElement => {
  const getNetworkColor = (networkName: string): string => {
    const colors: Record<string, string> = {
      eth: "#627EEA",
      polygon: "#8247E5",
      arbitrum: "#28A0F0",
      optimism: "#FF0420",
      base: "#0052FF",
      solana: "#14F195"
    };
    return colors[networkName] || "#627EEA";
  };

  const networkColor = getNetworkColor(network);
  
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`relative overflow-hidden group transition-all duration-300 ${
        active 
          ? 'bg-gray-900 text-white shadow-lg shadow-blue-500/10' 
          : 'bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white'
      } rounded-xl py-2.5 px-4 font-medium text-sm`}
    >
      <div className="flex items-center space-x-2">
        <span 
          className="w-3 h-3 rounded-full transition-colors" 
          style={{ backgroundColor: networkColor }} 
        />
        <span>{network.toUpperCase()}</span>
      </div>
      
      {active && (
        <span 
          className="absolute bottom-0 left-0 h-0.5 w-full" 
          style={{ backgroundColor: networkColor }} 
        />
      )}
      
      {/* Effet de survol */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
        style={{ background: `linear-gradient(45deg, transparent, ${networkColor}, transparent)` }} 
      />
    </button>
  );
};

// Composant d'aperçu de transaction
const TransactionPreview = ({ transaction }: TransactionPreviewProps): React.ReactElement => {
  // Simulation de données de transaction
  const tx = transaction || {
    hash: '0x1234...5678',
    type: 'swap',
    tokenIn: 'ETH',
    tokenOut: 'USDC',
    valueIn: 0.5,
    valueOut: 1250,
    timestamp: new Date().getTime() - Math.random() * 10000000000,
    isProfit: Math.random() > 0.5,
    profitAmount: Math.random() * 200,
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div 
      variants={fadeInUp}
      className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 
                rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10 
                cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-3">
            {tx.isProfit ? 
              <TrendingUp className="h-4 w-4 text-green-400" /> : 
              <TrendingDown className="h-4 w-4 text-red-400" />
            }
          </div>
          <div>
            <p className="font-medium text-white mb-0.5">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
            <p className="text-xs text-gray-400">{formatDate(tx.timestamp)}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${tx.isProfit ? 'text-green-400' : 'text-red-400'}`}>
            {tx.isProfit ? '+' : '-'}€{tx.profitAmount.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400">{tx.tokenIn} → {tx.tokenOut}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-700/30 flex justify-between items-center">
        <span className="text-xs text-gray-500">{tx.hash}</span>
        <button className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          Voir details
          <ArrowRight className="ml-1 h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};

// Composant de carte statistique
const StatCard = ({ title, value, icon, trend, color = "blue", onClick, isLoading }: StatCardProps): React.ReactElement => {
  const gradients: Record<string, string> = {
    blue: "from-blue-500/20 to-indigo-500/20 border-blue-500/30",
    green: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    purple: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
    amber: "from-amber-500/20 to-yellow-500/20 border-amber-500/30",
    rose: "from-rose-500/20 to-red-500/20 border-rose-500/30",
  };

  const textColors: Record<string, string> = {
    blue: "text-blue-400",
    green: "text-emerald-400",
    purple: "text-purple-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
  };

  return (
    <motion.div 
      variants={fadeInUp}
      className={`bg-gradient-to-br ${gradients[color]} backdrop-blur-sm
                rounded-xl p-5 border border-opacity-30 transition-all duration-300
                hover:shadow-lg cursor-pointer group relative overflow-hidden`}
      onClick={onClick}
    >
      {/* Cercle décoratif */}
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br from-gray-900/0 to-gray-900/80 backdrop-blur-xl"></div>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${textColors[color]} bg-gray-900/60`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        </div>
        
        {trend && (
          <div className={`flex items-center text-xs font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? 
              <TrendingUp className="h-3 w-3 mr-1" /> : 
              <TrendingDown className="h-3 w-3 mr-1" />
            }
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-8 bg-gray-700/50 animate-pulse rounded-md w-2/3"
            />
          ) : (
            <motion.div
              key="value"
              variants={countAnimation}
              initial="hidden"
              animate="visible"
              className="text-2xl font-bold text-white"
            >
              {value}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Effet au survol */}
      <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
        style={{ backgroundImage: `linear-gradient(45deg, transparent, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : color === 'purple' ? '#8b5cf6' : color === 'amber' ? '#f59e0b' : '#f43f5e'}, transparent)` }}
      />
    </motion.div>
  );
};

// Composant principal Dashboard
export default function Dashboard() {
  const { data: session } = useSession();
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<TransactionResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<string>('eth');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeView, setActiveView] = useState<string>('chart');
  const [timeRange, setTimeRange] = useState<string>('1m'); // 1d, 1w, 1m, 1y, all
  const scanInterval = useRef<number | null>(null);

  // Vérification du statut premium et récupération des wallets
  useEffect(() => {
    // Vérifier si c'est la première visite
    const hasVisited = localStorage.getItem('bitax-visited');
    if (!hasVisited) {
      setShowOnboarding(true);
      localStorage.setItem('bitax-visited', 'true');
    }
    
    // Vérifier le statut premium
    if (session?.user?.isPremium) {
      setIsPremiumUser(true);
    } else {
      const isPremium = localStorage.getItem('bitax-premium') === 'true';
      setIsPremiumUser(isPremium);
    }

    // Récupérer les wallets sauvegardés
    if (session?.user) {
      fetchSavedWallets();
    }

    return () => {
      if (scanInterval.current) {
        clearInterval(scanInterval.current);
      }
    };
  }, [session]);

  // Récupérer les wallets sauvegardés
  const fetchSavedWallets = async () => {
    try {
      const response = await fetch('/api/wallet');
      if (response.ok) {
        const data = await response.json();
        if (data.wallets && data.wallets.length > 0) {
          // Prendre le wallet principal ou le premier de la liste
          const primaryWallet = data.wallets.find((w) => w.isPrimary) || data.wallets[0];
          
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

      // Si l'utilisateur est connecté, sauvegarder le wallet
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

  // Animation de progression du scan
  const startScanAnimation = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    scanInterval.current = window.setInterval(() => {
      setScanProgress((prev: number) => {
        if (prev >= 100) {
          if (scanInterval.current) {
            window.clearInterval(scanInterval.current);
          }
          setIsScanning(false);
          return 0;
        }
        return prev + 1;
      });
    }, 30);
  };

  // Récupérer les transactions
  const fetchTransactions = async (address: string, network: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    startScanAnimation();
    
    try {
      // On simule un délai pour apprécier l'animation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const txs = await getTransactions(address, network as NetworkType);
      const filteredTxs = filterSpamTransactions(txs);
      
      // Conversion des transactions avec mapping des propriétés
      const mappedTransactions: TransactionResult[] = filteredTxs.map((tx: ImportedTransactionResult) => ({
        hash: tx.hash || '',
        type: tx.type || 'swap',
        tokenIn: tx.tokenIn || tx.token || 'ETH',
        tokenOut: tx.tokenOut || '',
        valueIn: tx.valueIn || 0,
        valueOut: tx.valueOut || 0,
        timestamp: tx.timestamp || Date.now(),
        isProfit: !!tx.isProfit,
        profitAmount: tx.profitAmount || 0
      }));
      
      setTransactions(mappedTransactions);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
      setIsScanning(false);
      if (scanInterval.current) {
        window.clearInterval(scanInterval.current);
      }
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network: string) => {
    setActiveNetwork(network);
    if (walletAddress) {
      await fetchTransactions(walletAddress, network);
    }
  };

  // Compléter l'onboarding
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Générer des données pour les graphiques
  const getChartData = () => {
    // Utilisation de données de démo pour l'interface
    return demoTransactionData;
  };

  // Affichage pour les utilisateurs non connectés
  if (!isWalletConnected) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16"
      >
        {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        <motion.div 
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="max-w-xl w-full p-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20"
        >
          <div className="relative overflow-hidden rounded-xl bg-gray-900/90 backdrop-blur-xl p-8 border border-gray-700/50">
            {/* Cercles décoratifs */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full filter blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full filter blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Bienvenue sur votre Dashboard Bitax</h2>
                <p className="text-gray-400 max-w-md">
                  Connectez votre wallet pour accéder à toutes les fonctionnalités de fiscalité crypto et générer vos rapports.
                </p>
              </div>
              
              <WalletConnectButton 
                onConnect={handleWalletConnect}
                variant="primary"
                fullWidth
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl text-white font-semibold shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 transform"
              />
              
              <div className="mt-8 pt-6 border-t border-gray-700/30">
                <h3 className="text-sm font-medium text-gray-300 mb-4 text-center">Blockchains supportées</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {['ETH', 'POLYGON', 'ARBITRUM', 'OPTIMISM', 'BASE', 'SOLANA'].map((network, index) => (
                    <div key={index} className="flex items-center space-x-1.5 rounded-full px-3 py-1.5 bg-gray-800/60 text-xs text-gray-300 border border-gray-700/50 hover:bg-gray-800 transition-colors duration-300 cursor-pointer">
                      <span className="w-2 h-2 rounded-full" style={{ 
                        backgroundColor: 
                          network === 'ETH' ? '#627EEA' : 
                          network === 'POLYGON' ? '#8247E5' :
                          network === 'ARBITRUM' ? '#28A0F0' :
                          network === 'OPTIMISM' ? '#FF0420' :
                          network === 'BASE' ? '#0052FF' : '#14F195'
                      }}></span>
                      <span>{network}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 pt-4 text-center">
                <button 
                  onClick={() => setShowOnboarding(true)} 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Besoin d'aide pour démarrer ? Lancer le tutoriel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Caractéristiques principales */}
        <div className="mt-16 w-full max-w-4xl">
          <h2 className="text-xl font-bold text-white text-center mb-8">
            Des outils puissants pour votre fiscalité crypto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart2 className="w-6 h-6" />,
                title: "Analyse complète",
                description: "Visualisez l'ensemble de vos transactions et calculez vos plus-values/moins-values."
              },
              {
                icon: <PieChart className="w-6 h-6" />,
                title: "Rapports automatisés",
                description: "Générez des rapports fiscaux conformes à la législation en quelques clics."
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Temps réel",
                description: "Suivez vos investissements crypto et vos obligations fiscales en temps réel."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 * index }}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-900/10"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Affichage du tableau de bord pour les utilisateurs connectés
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Afficher l'assistant d'onboarding si nécessaire */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
      
      {/* En-tête du dashboard */}
      <div className="mb-6">
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-100 mb-1">
            Dashboard Fiscal
          </h1>
          <p className="text-gray-400">
            Gérez et analysez vos transactions crypto pour une fiscalité simplifiée
          </p>
        </motion.div>
        
        {/* Statut du wallet */}
        <motion.div 
          variants={fadeInUp} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 0.1 }}
          className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-900/20">
              <div className="h-full w-full flex items-center justify-center bg-gray-900 rounded-[0.65rem]">
                <span className="text-blue-400 font-bold text-xs">BX</span>
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <h2 className="font-semibold text-white">{truncateAddress(walletAddress)}</h2>
                <div className="flex ml-2">
                  <StatusBadge type="success" text="Connecté" />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Réseau actif: {activeNetwork.toUpperCase()}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowOnboarding(true)}
              className="text-sm text-gray-300 hover:text-white flex items-center px-3 py-1.5 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-700/60 transition-colors"
            >
              <span>Tutoriel</span>
            </button>
            
            <Link href="/profile" className="text-sm text-gray-300 hover:text-white flex items-center px-3 py-1.5 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 border border-gray-700/30 hover:border-gray-700/60 transition-colors">
              <span>Mon profil</span>
            </Link>
            
            {!isPremiumUser && (
              <Link href="/pricing" className="text-sm text-white flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-colors shadow-md shadow-indigo-900/10 hover:shadow-lg hover:shadow-indigo-900/20">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                <span>Passer Premium</span>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Barre latérale */}
        <div className="lg:col-span-1 space-y-6">
          {/* Carte Sélection du réseau */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <h3 className="font-medium text-white mb-4">Réseaux Blockchain</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                  <NetworkButton 
                    key={network}
                    network={network}
                    active={activeNetwork === network}
                    onClick={() => handleScanNetwork(network)}
                    isLoading={isLoading && activeNetwork === network}
                  />
                ))}
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleScanNetwork(activeNetwork)}
                  disabled={isLoading}
                  className="relative w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 overflow-hidden group"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Scan en cours...</span>
                      
                      {isScanning && (
                        <motion.div 
                          variants={scannerAnimation}
                          initial="hidden"
                          animate="visible"
                          className="absolute bottom-0 left-0 h-1 bg-white/50"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                      <span>Scanner {activeNetwork.toUpperCase()}</span>
                      
                      {/* Effet de surbrillance au survol */}
                      <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    // Fonction pour scanner toutes les blockchains en série
                    const networks = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
                    let currentIndex = 0;
                    
                    const scanNext = async () => {
                      if (currentIndex < networks.length) {
                        const network = networks[currentIndex];
                        await handleScanNetwork(network);
                        currentIndex++;
                        scanNext();
                      }
                    };
                    
                    scanNext();
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm font-medium rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-colors"
                >
                  <Zap className="w-4 h-4 mr-2 text-indigo-400" />
                  Scan multi-chaînes
                </button>
              </div>
            </div>
            
            {/* Statistiques du scan */}
            {transactions.length > 0 && (
              <div className="px-5 py-4 bg-gradient-to-b from-transparent to-blue-900/10 border-t border-gray-700/30">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">Transactions trouvées</span>
                  <span className="text-sm font-medium text-white">{transactions.length}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full" 
                    style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Réseau</p>
                    <p className="text-sm font-medium text-white">{activeNetwork.toUpperCase()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Tokens</p>
                    <p className="text-sm font-medium text-white">21</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Jours</p>
                    <p className="text-sm font-medium text-white">180</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Transactions récentes */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-white">Transactions récentes</h3>
                <Link href="/transactions" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  Voir tout
                </Link>
              </div>
              
              <div className="space-y-3">
                {isLoading ? (
                  // Skeleton loader
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-gray-800/30 rounded-xl p-4 animate-pulse">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-700/50 mr-3"></div>
                          <div>
                            <div className="h-4 w-24 bg-gray-700/50 rounded mb-2"></div>
                            <div className="h-3 w-16 bg-gray-700/50 rounded"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-gray-700/50 rounded mb-2"></div>
                          <div className="h-3 w-12 bg-gray-700/50 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : transactions.length > 0 ? (
                  // Vraies transactions
                  transactions.slice(0, 3).map((tx, i) => (
                    <TransactionPreview key={i} transaction={tx} />
                  ))
                ) : (
                  // Transactions de démonstration
                  Array(3).fill(0).map((_, i) => (
                    <TransactionPreview key={i} transaction={null} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Contenu principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Affichage d'erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-rose-400 flex items-start"
            >
              <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">Une erreur est survenue</h3>
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            </motion.div>
          )}
          
          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Valeur totale" 
              value={formatAmount(12500)} 
              icon={<DollarSign className="w-5 h-5" />}
              trend={2.5}
              color="blue"
              onClick={() => {}}
              isLoading={isLoading}
            />
            <StatCard 
              title="Plus-values" 
              value={formatAmount(3250)} 
              icon={<TrendingUp className="w-5 h-5" />}
              trend={5.2}
              color="green"
              onClick={() => {}}
              isLoading={isLoading}
            />
            <StatCard 
              title="Moins-values" 
              value={formatAmount(850)} 
              icon={<TrendingDown className="w-5 h-5" />}
              trend={-1.8}
              color="rose"
              onClick={() => {}}
              isLoading={isLoading}
            />
            <StatCard 
              title="Transactions" 
              value={transactions.length || "142"} 
              icon={<BarChart2 className="w-5 h-5" />}
              trend={0}
              color="purple"
              onClick={() => {}}
              isLoading={isLoading}
            />
          </div>
          
          {/* Onglets de rapport */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden"
          >
            <div className="border-b border-gray-700/50">
              <div className="flex flex-wrap">
                {['overview', 'transactions', 'taxes', 'assets'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-medium transition-colors relative ${
                      activeTab === tab 
                        ? 'text-blue-400' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-5">
              {/* Contrôles du rapport */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="flex bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setActiveView('chart')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeView === 'chart' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Graphique
                    </button>
                    <button
                      onClick={() => setActiveView('table')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                        activeView === 'table' 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Tableau
                    </button>
                  </div>
                  
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                  >
                    <option value="1d">Aujourd'hui</option>
                    <option value="1w">7 jours</option>
                    <option value="1m">30 jours</option>
                    <option value="1y">1 an</option>
                    <option value="all">Tout</option>
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm transition-colors border border-gray-700/50 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Exporter
                  </button>
                  
                  <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors shadow-md shadow-blue-900/10 hover:shadow-lg hover:shadow-blue-900/20 flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Générer rapport
                  </button>
                </div>
              </div>
              
              {/* Contenu du rapport */}
              <AnimatePresence mode="wait">
                {activeView === 'chart' ? (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5 h-[350px]"
                  >
                    {isLoading ? (
                      <div className="h-full flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getChartData()} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickMargin={10} />
                          <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `€${value}`} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                              borderColor: 'rgba(59, 130, 246, 0.5)',
                              borderRadius: '0.5rem',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            }}
                            itemStyle={{ color: '#E5E7EB' }}
                            labelStyle={{ color: '#9CA3AF' }}
                            formatter={(value) => [`€${value}`, null]}
                          />
                          <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                          <Area type="monotone" dataKey="loss" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl overflow-hidden"
                  >
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700/30">
                        <thead className="bg-gray-800/50">
                          <tr>
                            <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Montant</th>
                            <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Résultat</th>
                            <th scope="col" className="px-5 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                          {isLoading ? (
                            // Skeleton loader
                            Array(5).fill(0).map((_, i) => (
                              <tr key={i} className="animate-pulse">
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="h-4 w-24 bg-gray-700/50 rounded"></div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="h-4 w-16 bg-gray-700/50 rounded"></div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="h-4 w-16 bg-gray-700/50 rounded"></div>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            // Données d'exemple
                            demoTransactionData.map((item, i) => (
                              <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{item.date} 2024</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">Swap</td>
                                <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-300">{formatAmount(item.amount)}</td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <span className={`text-sm font-medium ${item.profit > Math.abs(item.loss) ? 'text-green-400' : 'text-red-400'}`}>
                                    {formatAmount(item.profit + item.loss)}
                                  </span>
                                </td>
                                <td className="px-5 py-4 whitespace-nowrap">
                                  <StatusBadge 
                                    type={item.profit > Math.abs(item.loss) ? 'success' : 'warning'} 
                                    text={item.profit > Math.abs(item.loss) ? 'Gain' : 'Perte'} 
                                  />
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Information sur la méthode de calcul */}
              <div className="mt-5 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg text-sm text-gray-300">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-blue-400 mb-1">Méthode de calcul: FIFO (First In, First Out)</p>
                    <p>Les calculs sont effectués selon la méthode FIFO, conforme à la législation fiscale française. <Link href="/guide" className="text-blue-400 hover:underline">En savoir plus</Link></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Widgets supplémentaires */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribution des actifs */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden p-5"
            >
              <h3 className="font-medium text-white mb-4">Distribution par tokens</h3>
              
              <div className="h-[250px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'ETH', value: 45 },
                        { name: 'WBTC', value: 20 },
                        { name: 'USDC', value: 15 },
                        { name: 'USDT', value: 10 },
                        { name: 'LINK', value: 7 },
                        { name: 'Autres', value: 3 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `${value}%`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                          borderRadius: '0.5rem',
                        }}
                        itemStyle={{ color: '#E5E7EB' }}
                        formatter={(value) => [`${value}%`, null]}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {[
                          { name: 'ETH', fill: '#627EEA' },
                          { name: 'WBTC', fill: '#F7931A' },
                          { name: 'USDC', fill: '#2775CA' },
                          { name: 'USDT', fill: '#26A17B' },
                          { name: 'LINK', fill: '#2A5ADA' },
                          { name: 'Autres', fill: '#9CA3AF' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
            
            {/* Historique des performances */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden p-5"
            >
              <h3 className="font-medium text-white mb-4">Performance fiscale</h3>
              
              <div className="h-[250px]">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={demoTransactionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#374151" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `€${value}`} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(17, 24, 39, 0.9)', 
                          borderColor: 'rgba(59, 130, 246, 0.5)',
                          borderRadius: '0.5rem',
                        }}
                        itemStyle={{ color: '#E5E7EB' }}
                        formatter={(value) => [`€${value}`, null]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        name="Gain"
                        stroke="#10B981" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="loss" 
                        name="Perte"
                        stroke="#EF4444" 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}