import React, { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { generatePDF } from '@/utils/pdf';
import TransactionList from './TransactionList';
import TransactionSummary from './TransactionSummary';
import PremiumUnlock from './PremiumUnlock';
import TaxDashboard from './TaxDashboard';
import WalletConnectPanel from './WalletConnectPanel';
import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { filterSpamTransactions } from '@/utils/SpamFilter';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Transaction {
  hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  input?: string;
  type: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  valueInETH?: number;
  network: NetworkType;
}

// Interface pour le composant principal
interface WalletConnectButtonProps {
  onConnect?: (address: string, provider: ethers.BrowserProvider) => void;
  className?: string;
  variant?: 'default' | 'primary' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showIcon?: boolean;
  showAddress?: boolean;
  isLoading?: boolean;
}

// Interface pour le bouton simple
interface SimpleButtonProps {
  onClick: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg'; 
  fullWidth?: boolean;
  showIcon?: boolean;
  showAddress?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  address?: string;
}

// Composant bouton simple pour la réutilisabilité
export const SimpleWalletButton: React.FC<SimpleButtonProps> = ({
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showIcon = true,
  showAddress = false,
  isLoading = false,
  disabled = false,
  address = ''
}) => {
  // Classes CSS basées sur les props
  const getButtonClasses = () => {
    // Classe de base
    let classes = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ';
    
    // Classes de taille
    switch(size) {
      case 'sm':
        classes += 'px-3 py-1.5 text-sm ';
        break;
      case 'lg':
        classes += 'px-8 py-4 text-lg ';
        break;
      default: // md
        classes += 'px-5 py-2.5 text-base ';
    }
    
    // Classes de variante
    switch(variant) {
      case 'primary':
        classes += 'bg-bitax-primary-600 hover:bg-bitax-primary-700 text-white focus:ring-bitax-primary-500 dark:focus:ring-offset-bitax-gray-800 ';
        break;
      case 'outline':
        classes += 'border border-bitax-gray-300 text-bitax-gray-700 hover:bg-bitax-gray-50 focus:ring-bitax-gray-500 dark:border-bitax-gray-600 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-800 dark:focus:ring-offset-bitax-gray-800 ';
        break;
      case 'premium':
        classes += 'bg-gradient-to-r from-bitax-premium-500 to-bitax-premium-600 hover:from-bitax-premium-600 hover:to-bitax-premium-700 text-white shadow-lg hover:shadow-xl focus:ring-bitax-premium-500 dark:focus:ring-offset-bitax-gray-800 ';
        break;
      default: // default
        classes += 'bg-white hover:bg-bitax-gray-50 text-bitax-gray-800 border border-bitax-gray-300 focus:ring-bitax-primary-500 dark:bg-bitax-gray-800 dark:hover:bg-bitax-gray-700 dark:text-white dark:border-bitax-gray-600 dark:focus:ring-offset-bitax-gray-800 ';
    }
    
    // Largeur
    if (fullWidth) {
      classes += 'w-full ';
    }
    
    // États
    if (isLoading || disabled) {
      classes += 'opacity-70 cursor-not-allowed ';
    }
    
    return classes + className;
  };
  
  // Formater une adresse pour l'affichage
  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={getButtonClasses()}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        showIcon && (
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      )}
      
      {address ? (
        <span>
          {showAddress ? formatAddress(address) : 'Wallet Connecté'}
        </span>
      ) : (
        <span>
          {isLoading ? 'Connexion...' : 'Connecter Wallet'}
        </span>
      )}
    </button>
  );
};

// Composant principal
const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  onConnect,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showIcon = true,
  showAddress = false,
  isLoading: externalIsLoading = false
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('eth');
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'tax'>('transactions');
  const [showNetworkSelector, setShowNetworkSelector] = useState<boolean>(false);
  const [isFullDashboard, setIsFullDashboard] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  
  // Récupérer la configuration du réseau
  const getNetworkInfo = (network: NetworkType) => {
    return SUPPORTED_NETWORKS[network];
  };

  // Vérifier le statut premium lors du chargement
  useEffect(() => {
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    // Vérifier si un wallet est déjà connecté
    checkExistingConnection();
  }, []);
  
  // Vérifier si un wallet est déjà connecté
  const checkExistingConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const connectedAccount = accounts[0].address;
          setAccount(connectedAccount);
          setProvider(provider);
          
          if (onConnect) {
            onConnect(connectedAccount, provider);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de connexion existante', error);
      }
    }
  };

  // Connecter le wallet
  const connectWallet = async () => {
    if (isLoading || externalIsLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const walletProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await walletProvider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(walletProvider);
          
          if (onConnect) {
            onConnect(accounts[0], walletProvider);
          }
        } else {
          throw new Error('Aucun compte autorisé');
        }
      } else {
        window.open('https://metamask.io/download.html', '_blank');
        throw new Error('Wallet non détecté. Veuillez installer MetaMask ou un autre wallet compatible.');
      }
    } catch (err: any) {
      console.error('Erreur de connexion wallet:', err);
      if (err.code === 4001) {
        // L'utilisateur a refusé la connexion
        setError('Vous avez refusé la connexion. Veuillez réessayer.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la connexion au wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner automatiquement toutes les blockchains
  const scanAuto = async () => {
    if (!account) return;
    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      let allTxs: Transaction[] = [];
      const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
      
      // Utilisation de Promise.all pour paralléliser les requêtes
      const txPromises = networks.map(network => getTransactions(account, network));
      const results = await Promise.all(txPromises);
      
      // Combiner tous les résultats
      allTxs = results.flat().filter(tx => tx) as Transaction[]; // Filtrer les valeurs null/undefined
      
      // Filtrer les transactions spam
      const filteredTxs = filterSpamTransactions(allTxs);
      setTransactions(filteredTxs);
      
      if (filteredTxs.length === 0) {
        setError('Aucune transaction trouvée. Essayez une autre blockchain ou vérifiez votre adresse.');
      }
    } catch (error) {
      console.error('Erreur lors du scan automatique:', error);
      setError('Erreur lors du scan automatique. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner une blockchain spécifique
  const scanManual = async () => {
    if (!account) return;
    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const txs = await getTransactions(account, selectedNetwork);
      
      // Filtrer les transactions spam
      const filteredTxs = filterSpamTransactions(txs);
      setTransactions(filteredTxs);
      
      if (filteredTxs.length === 0) {
        const networkInfo = getNetworkInfo(selectedNetwork);
        setError(`Aucune transaction trouvée sur ${networkInfo.name}. Essayez une autre blockchain.`);
      }
    } catch (error) {
      console.error(`Erreur lors du scan sur ${selectedNetwork}:`, error);
      const networkInfo = getNetworkInfo(selectedNetwork);
      setError(`Erreur lors du scan sur ${networkInfo.name}. Veuillez réessayer.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un rapport PDF
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setError(null);
  
    try {
      await generatePDF(transactions);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF', error);
      setError('Erreur lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // Débloquer les fonctionnalités premium
  const handleUnlockPremium = useCallback(() => {
    setIsPremiumUser(true);
    localStorage.setItem('bitax-premium', 'true');
  }, []);

  // Afficher le composant complet ou seulement le bouton
  useEffect(() => {
    // Si connecté et avec des transactions, afficher le dashboard complet
    if (account && transactions.length > 0) {
      setIsFullDashboard(true);
    }
  }, [account, transactions]);

  // Si c'est juste le bouton simple à afficher
  if (!isFullDashboard && !account) {
    return (
      <>
        <SimpleWalletButton 
          onClick={connectWallet}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          showIcon={showIcon}
          showAddress={showAddress}
          isLoading={isLoading || externalIsLoading}
          className={className}
        />
        
        {error && (
          <div className="text-sm text-bitax-danger-600 dark:text-red-400 mt-2">
            {error}
          </div>
        )}
      </>
    );
  }

  // Liste des wallets supportés avec leurs logos
  const supportedWallets = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'trustwallet', name: 'Trust Wallet', icon: '🛡️' },
  ];

  // Si pas encore connecté, afficher l'écran de bienvenue
  if (!account) {
    return (
      <div className="space-y-6">
        {/* Header avec titre de bienvenue */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Simplifiez votre fiscalité crypto
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Scannez vos transactions, analysez vos plus-values et générez votre rapport fiscal en quelques minutes.
          </p>
        </div>

        {/* Section de connexion principale */}
        <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-md overflow-hidden p-0">
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-xl">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <div className="p-8 flex flex-col items-center gap-8">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-display font-semibold mb-3 text-gray-800 dark:text-white">
                Connectez votre wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Pour commencer, connectez votre wallet crypto pour scanner vos transactions sur différentes blockchains.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {supportedWallets.map(wallet => (
                  <button
                    key={wallet.id}
                    onClick={connectWallet}
                    className="flex items-center justify-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span className="text-2xl mr-3">{wallet.icon}</span>
                    <span className="font-medium dark:text-white">{wallet.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Illustration ou graphique */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl w-full max-w-lg">
              <div className="aspect-video relative bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 100 50" className="w-full h-full p-4">
                  <path d="M10,40 L30,20 L50,30 L70,10 L90,25" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="10" cy="40" r="3" fill="#6366F1" />
                  <circle cx="30" cy="20" r="3" fill="#6366F1" />
                  <circle cx="50" cy="30" r="3" fill="#6366F1" />
                  <circle cx="70" cy="10" r="3" fill="#6366F1" />
                  <circle cx="90" cy="25" r="3" fill="#6366F1" />
                </svg>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Visualisez vos plus-values</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Détectez les transactions taxables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Générez votre rapport fiscal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section d'avis clients */}
        <div className="mt-12 bg-white dark:bg-bitax-gray-800 rounded-2xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-8 dark:text-white">Ils font confiance à Bitax</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Thomas L.",
                role: "Trader Crypto",
                avatar: "T",
                quote: "Bitax m'a fait économiser des heures de travail sur ma déclaration fiscale. Un outil indispensable !"
              },
              {
                name: "Sophie M.",
                role: "Investisseuse",
                avatar: "S",
                quote: "Interface intuitive et rapport détaillé. Je recommande à tous les détenteurs de crypto-monnaies."
              },
              {
                name: "Marc D.",
                role: "Développeur Web3",
                avatar: "M",
                quote: "Le suivi des transactions DeFi est impressionnant. Bitax comprend vraiment les besoins des utilisateurs."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Si connecté, afficher le dashboard
  return (
    <div className="p-0">
      {/* En-tête du dashboard */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Wallet connecté</div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-800 dark:text-white font-medium">
                {account.substring(0, 6)}...{account.substring(account.length - 4)}
              </span>
            </div>
          </div>
          
          {transactions.length > 0 && (
            <div className="flex flex-col items-start ml-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transactions</div>
              <div className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm text-gray-800 dark:text-white">
                <span className="font-medium">{transactions.length}</span> détectées
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Pour mobile, un menu compact */}
          <div className="block md:hidden">
            <button
              onClick={() => setShowNetworkSelector(!showNetworkSelector)}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
              <span className="mr-2">{getNetworkInfo(selectedNetwork).icon}</span>
              <span>{getNetworkInfo(selectedNetwork).name}</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <Transition
              as={Fragment}
              show={showNetworkSelector}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <div className="absolute z-10 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 w-48">
                {Object.entries(SUPPORTED_NETWORKS).map(([networkId, networkConfig]) => (
                  <button
                    key={networkId}
                    className={`flex items-center w-full text-left px-4 py-2 rounded-lg ${
                      selectedNetwork === networkId 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedNetwork(networkId as NetworkType);
                      setShowNetworkSelector(false);
                    }}
                  >
                    <span className="mr-2">{networkConfig.icon}</span>
                    <span>{networkConfig.name}</span>
                  </button>
                ))}
              </div>
            </Transition>
          </div>
          
          {/* Version desktop avec sélecteur standard */}
          <div className="hidden md:flex md:space-x-2">
            {Object.entries(SUPPORTED_NETWORKS).slice(0, 5).map(([networkId, networkConfig]) => (
              <button
                key={networkId}
                onClick={() => setSelectedNetwork(networkId as NetworkType)}
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm ${
                  selectedNetwork === networkId
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                } border border-gray-200 dark:border-gray-600`}
              >
                <span className="mr-1">{networkConfig.icon}</span>
                <span>{networkConfig.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={scanManual}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition duration-150 ease-in-out"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Scanner
          </button>

          <button
            onClick={scanAuto}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition duration-150 ease-in-out whitespace-nowrap"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Auto Multi-Chain
          </button>
        </div>
      </div>

      {/* État de chargement */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-700 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Scan en cours...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Cette opération peut prendre quelques instants</p>
        </div>
      ) : (
        <>
          {transactions.length > 0 ? (
            <div className="p-6">
              <TransactionSummary 
                transactions={transactions}
                isPremiumUser={isPremiumUser}
              />
              
              {!isPremiumUser && <PremiumUnlock onUnlock={handleUnlockPremium} />}
              
              {/* Onglets améliorés */}
              <div className="mt-8">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className={`py-3 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'transactions' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Transactions
                  </button>
                  <button
                    onClick={() => setActiveTab('tax')}
                    className={`py-3 px-6 text-sm font-medium border-b-2 ${
                      activeTab === 'tax' 
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <svg className="w-5 h-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Rapport Fiscal
                  </button>
                </div>
                
                <div className="pt-6">
                  {activeTab === 'transactions' ? (
                    <TransactionList 
                      transactions={transactions} 
                      isPremiumUser={isPremiumUser} 
                    />
                  ) : (
                    <TaxDashboard
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                      walletAddress={account || ''}
                    />
                  )}
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
                <button
                  onClick={handleGeneratePDF}
                  disabled={isGeneratingPDF}
                  className={`inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isGeneratingPDF 
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:focus:ring-offset-gray-800'
                  }`}
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Télécharger le Rapport PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <svg className="w-20 h-20 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">Aucune transaction</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md">
                Commencez par scanner une blockchain pour voir vos transactions ou essayez le scan automatique multi-blockchain.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={scanManual} 
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-xl shadow-sm transition duration-150 ease-in-out"
                >
                  Scanner {getNetworkInfo(selectedNetwork).name}
                </button>
                <button 
                  onClick={scanAuto} 
                  className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-medium rounded-xl shadow-sm transition duration-150 ease-in-out"
                >
                  Scan Automatique Multi-Chain
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletConnectButton;