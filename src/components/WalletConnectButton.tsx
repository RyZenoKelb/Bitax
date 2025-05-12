import React, { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
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
import NetworkIcon from '@/components/NetworkIcon';

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

interface Wallet {
  id: string;
  address: string;
  network: string;
  name?: string;
  isPrimary: boolean;
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
  selectedWallet?: Wallet | null;
  onWalletSelect?: (wallet: Wallet) => void;
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
  walletName?: string;
  walletCount?: number;
}

// Liste des wallets supportés
const SUPPORTED_WALLETS = [
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connectez n\'importe quel wallet via WalletConnect',
    color: '#3B99FC',
    icon: '🔗',
    bgColor: '#EDF5FF',
    priority: 1, // Priorité plus élevée
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'La solution la plus populaire pour gérer vos actifs crypto',
    color: '#E2761B',
    icon: '🦊',
    bgColor: '#FFF5E6',
    priority: 2,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connectez-vous avec le wallet mobile ou l\'extension Coinbase',
    color: '#1652F0',
    icon: '🔵',
    bgColor: '#E7EEFF',
    priority: 3,
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    description: 'Le wallet mobile officiel de Binance',
    color: '#3375BB',
    icon: '🛡️',
    bgColor: '#E8F1FA',
    priority: 4,
  }
];

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
  address = '',
  walletName = '',
  walletCount = 0
}) => {
  // Classes CSS basées sur les props
  const getButtonClasses = () => {
    // Classe de base
    let classes = 'btn ';
    
    // Classes de taille
    switch(size) {
      case 'sm':
        classes += 'btn-sm ';
        break;
      case 'lg':
        classes += 'btn-lg ';
        break;
      default: // md
        classes += ''; // Taille par défaut
    }
    
    // Classes de variante
    switch(variant) {
      case 'primary':
        classes += 'btn-primary ';
        break;
      case 'outline':
        classes += 'btn-outline ';
        break;
      case 'premium':
        classes += 'btn-premium ';
        break;
      default: // default
        classes += 'btn-outline ';
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
        <>
          <div className="animate-spin w-5 h-5 mr-3 bg-transparent border-2 border-transparent border-t-white rounded-full"></div>
          <span>Connexion...</span>
        </>
      ) : (
        <>
          {showIcon && (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14H7V21L16 10H13Z" fill="currentColor" />
            </svg>
          )}
          
          {address ? (
            <div className="flex items-center">
              {showAddress ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  {walletName || formatAddress(address)}
                  {walletCount > 1 && (
                    <span className="ml-2 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300">
                      {walletCount}
                    </span>
                  )}
                </span>
              ) : (
                <span>Wallet Connecté</span>
              )}
            </div>
          ) : (
            <span>Connecter Wallet</span>
          )}
        </>
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
  isLoading: externalIsLoading = false,
  selectedWallet = null,
  onWalletSelect
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
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
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(selectedWallet);
  
  // Récupérer la configuration du réseau
  const getNetworkInfo = (network: NetworkType) => {
    return SUPPORTED_NETWORKS[network];
  };

  // Vérifier le statut premium lors du chargement
  useEffect(() => {
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    // Charger les wallets
    if (session) {
      fetchWallets();
    }
  }, [session]);
  
  // Mettre à jour le wallet sélectionné quand selectedWallet change
  useEffect(() => {
    if (selectedWallet) {
      setCurrentWallet(selectedWallet);
    }
  }, [selectedWallet]);
  
  // Charger les wallets depuis l'API
  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/wallet');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des wallets');
      }
      
      const data = await response.json();
      const retrievedWallets: Wallet[] = data.wallets || [];
      setWallets(retrievedWallets);
      
      // Sélectionner le wallet principal par défaut
      const primaryWallet = retrievedWallets.find((w: Wallet) => w.isPrimary);
      if (primaryWallet && !currentWallet) {
        setCurrentWallet(primaryWallet);
        if (onWalletSelect) {
          onWalletSelect(primaryWallet);
        }
      }
      
      // Si au moins un wallet, établir une connexion
      if (retrievedWallets.length > 0 && retrievedWallets[0].address) {
        checkExistingConnection(retrievedWallets[0].address);
      }
    } catch (error) {
      console.error('Erreur de chargement des wallets:', error);
      setError('Impossible de charger vos wallets');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Vérifier si un wallet est déjà connecté
  const checkExistingConnection = async (address: string) => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const connectedAccount = accounts[0].address;
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
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!session) {
      router.push('/login?redirect=wallets');
      return;
    }
    
    // Si l'utilisateur est connecté mais n'a pas de wallets, rediriger vers la page de gestion des wallets
    router.push('/wallets');
  };
  
  // Ouvrir la page des wallets
  const openWalletManager = () => {
    router.push('/wallets');
  };

  // Scanner automatiquement toutes les blockchains
  const scanAuto = async () => {
    if (!currentWallet) return;
    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      let allTxs: Transaction[] = [];
      const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
      
      // Utilisation de Promise.all pour paralléliser les requêtes
      const txPromises = networks.map(network => getTransactions(currentWallet.address, network));
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
    if (!currentWallet) return;
    setIsLoading(true);
    setError(null);
    setTransactions([]);

    try {
      const txs = await getTransactions(currentWallet.address, selectedNetwork);
      
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
    // Si connecté et avec des wallets, afficher le dashboard complet
    if (currentWallet) {
      setIsFullDashboard(true);
    }
  }, [currentWallet]);

  // Sélectionner un wallet
  const handleSelectWallet = (wallet: Wallet) => {
    setCurrentWallet(wallet);
    if (onWalletSelect) {
      onWalletSelect(wallet);
    }
    setShowWalletSelector(false);
    
    // Charger les transactions du wallet sélectionné
    if (wallet.address) {
      scanManual();
    }
  };

  // Formater une adresse pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Si c'est juste le bouton simple à afficher
  if (!isFullDashboard && !currentWallet) {
    return (
      <>
        <SimpleWalletButton 
          onClick={wallets.length > 0 ? () => setShowWalletSelector(true) : connectWallet}
          variant={variant}
          size={size}
          fullWidth={fullWidth}
          showIcon={showIcon}
          showAddress={showAddress}
          isLoading={isLoading || externalIsLoading}
          className={className}
          walletCount={wallets.length}
        />
        
        {/* Sélecteur de wallet */}
        {showWalletSelector && wallets.length > 0 && (
          <div className="absolute z-50 mt-2 w-60 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                Vos wallets
              </div>
              
              {wallets.map((wallet) => {
                // Utilisation d'une variable pour contourner le problème TypeScript
                const isSelected = currentWallet ? (currentWallet as any).id === (wallet as any).id : false;
                return (
                  <button
                    key={(wallet as any).id}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => handleSelectWallet(wallet as Wallet)}
                  >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${wallet.isPrimary ? 'bg-primary-500 animate-pulse' : 'bg-gray-400'} mr-2`}></div>
                    <div>
                      <div>{wallet.name || `Wallet ${formatAddress(wallet.address)}`}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatAddress(wallet.address)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={openWalletManager}
                >
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Gérer les wallets
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger mt-2 py-2 px-3 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // Si pas encore connecté, afficher l'écran de bienvenue
  if (!currentWallet) {
    return (
      <div className="space-y-6">
        {/* Header avec titre de bienvenue */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Simplifiez votre <span className="text-gradient">fiscalité crypto</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Scannez vos transactions, analysez vos plus-values et générez votre rapport fiscal en quelques minutes.
          </p>
        </div>

        {/* Section de connexion principale */}
        <div className="card relative overflow-hidden border border-gray-800/50">
          {/* Effet de grille animée */}
          <div className="absolute inset-0 grid-animation -z-10 opacity-10"></div>
          
          {error && (
            <div className="alert alert-danger mx-6 mt-6">
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
              <h2 className="text-2xl font-display font-semibold mb-3 text-white">
                Connectez votre wallet
              </h2>
              <p className="text-gray-300 mb-8">
                Pour commencer, connectez votre wallet crypto pour scanner vos transactions sur différentes blockchains.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {SUPPORTED_WALLETS.sort((a, b) => a.priority - b.priority).map(wallet => (
                  <button
                    key={wallet.id}
                    onClick={connectWallet}
                    className={`relative flex items-center justify-center p-4 backdrop-blur-md bg-white/5 border border-gray-700/50 rounded-xl hover:bg-gray-800/30 hover:border-primary-500/50 transition-all duration-300 ${
                      wallet.id === 'walletconnect' ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
                    }`}
                  >
                    {wallet.id === 'walletconnect' && (
                      <div className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Recommandé
                      </div>
                    )}
                    <div className="flex flex-col items-center">
                      <span className="text-3xl mb-2">{wallet.icon}</span>
                      <span className="font-medium text-white">{wallet.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Illustration ou graphique */}
            <div className="bg-gray-800/30 backdrop-blur-sm p-6 rounded-2xl w-full max-w-lg border border-gray-700/50">
              <div className="aspect-video relative bg-gray-900/50 rounded-lg shadow-md flex items-center justify-center p-4">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path d="M10,40 L30,20 L50,30 L70,10 L90,25" fill="none" stroke="url(#chartGradient)" strokeWidth="2" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7B3FE4" />
                      <stop offset="100%" stopColor="#0EEAFF" />
                    </linearGradient>
                  </defs>
                  <circle cx="10" cy="40" r="3" fill="#7B3FE4" />
                  <circle cx="30" cy="20" r="3" fill="#7B3FE4" />
                  <circle cx="50" cy="30" r="3" fill="#7B3FE4" />
                  <circle cx="70" cy="10" r="3" fill="#7B3FE4" />
                  <circle cx="90" cy="25" r="3" fill="#7B3FE4" />
                </svg>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500"></span>
                  <span className="text-sm text-gray-300">Visualisez vos plus-values</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"></span>
                  <span className="text-sm text-gray-300">Détectez les transactions taxables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></span>
                  <span className="text-sm text-gray-300">Générez votre rapport fiscal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section d'avis clients */}
        <div className="mt-12 card">
          <div className="card-body">
            <h2 className="text-2xl font-semibold text-center mb-8 text-white">Ils font confiance à Bitax</h2>
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
                <div key={index} className="bg-gray-800/40 backdrop-blur-md p-6 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start mb-4">
                    <svg className="h-10 w-10 text-secondary-500 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white flex items-center justify-center font-medium">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Affichage du tableau de bord pour les utilisateurs connectés
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne latérale */}
        <div className="lg:col-span-1 space-y-6">
          {/* Panneau d'info wallet */}
          <div className="card">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  <span className="text-gradient">Wallets connectés</span>
                </h2>
                <button
                  onClick={openWalletManager}
                  className="text-sm text-primary-400 hover:text-primary-300 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Gérer
                </button>
              </div>
              
              {/* Wallet sélectionné */}
              <div className="flex items-center mb-6 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {currentWallet.name || 'Wallet principal'}
                  </p>
                  <p className="text-sm text-gray-400 font-mono">
                    {formatAddress(currentWallet.address)}
                  </p>
                </div>
                {wallets.length > 1 && (
                  <button
                    onClick={() => setShowWalletSelector(!showWalletSelector)}
                    className="p-1.5 rounded-md hover:bg-gray-700/50"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Sélecteur de wallets */}
              {showWalletSelector && wallets.length > 1 && (
                <div className="mb-6 bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
                  <div className="p-2 max-h-60 overflow-y-auto">
                    {wallets
                      .filter(w => !currentWallet || (w as any).id !== (currentWallet as any).id)
                      .map((wallet: Wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => handleSelectWallet(wallet)}
                          className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-700/50 text-gray-300"
                        >
                        <div className={`w-2 h-2 rounded-full ${wallet.isPrimary ? 'bg-primary-500' : 'bg-gray-400'} mr-2`}></div>
                        <div>
                          <p className="text-sm font-medium">{wallet.name || `Wallet ${formatAddress(wallet.address)}`}</p>
                          <p className="text-xs text-gray-400 font-mono">{formatAddress(wallet.address)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-700/50 p-2">
                    <button
                      onClick={openWalletManager}
                      className="flex items-center w-full text-left p-2 rounded-md hover:bg-gray-700/50 text-primary-400"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm">Gérer les wallets</span>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Sélection du réseau */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 9L21 3M21 3H15M21 3L13 11M10 5H7.8C6.11984 5 5.27976 5 4.63803 5.32698C4.07354 5.6146 3.6146 6.07354 3.32698 6.63803C3 7.27976 3 8.11984 3 9.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H14.2C15.8802 21 16.7202 21 17.362 20.673C17.9265 20.3854 18.3854 19.9265 18.673 19.362C19 18.7202 19 17.8802 19 16.2V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Scanner un réseau
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                    <button
                      key={network}
                      onClick={() => setSelectedNetwork(network as NetworkType)}
                      className={`relative flex items-center justify-center flex-col p-2 rounded-lg ${
                        selectedNetwork === network 
                          ? 'bg-primary-900/40 border border-primary-500/50 shadow-sm' 
                          : 'bg-gray-800/30 border border-gray-700/30 hover:border-gray-600/80'
                      } transition-all duration-200`}
                    >
                      {selectedNetwork === network && isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary-900/80 rounded-lg z-10">
                          <svg className="animate-spin h-5 w-5 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      )}
                      <NetworkIcon network={network as NetworkType} size={28} />
                      <span className="text-xs mt-1 text-gray-300">
                        {network.charAt(0).toUpperCase() + network.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-3 mt-4">
                  <button
                    onClick={() => scanManual()}
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-5 h-5 mr-3 bg-transparent border-2 border-transparent border-t-white rounded-full"></div>
                        <span>Scan en cours...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Scanner {selectedNetwork.toUpperCase()}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => scanAuto()}
                    disabled={isLoading}
                    className="btn btn-secondary w-full"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 3H21M21 3V8M21 3L13 11M4 4L11 4C11.5523 4 12 4.44772 12 5V11C12 11.5523 11.5523 12 11 12L4 12C3.44772 12 3 11.5523 3 11V5C3 4.44772 3.44772 4 4 4ZM4 16L11 16C11.5523 16 12 16.4477 12 17V19C12 19.5523 11.5523 20 11 20L4 20C3.44772 20 3 19.5523 3 19V17C3 16.4477 3.44772 16 4 16ZM16 16L20 16C20.5523 16 21 16.4477 21 17V19C21 19.5523 20.5523 20 20 20L16 20C15.4477 20 15 19.5523 15 19V17C15 16.4477 15.4477 16 16 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Scan multi-chain
                  </button>
                </div>
              </div>
            </div>
            
            {/* Statistiques */}
            {transactions.length > 0 && (
              <div className="card-footer backdrop-blur-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Transactions trouvées</span>
                  <span className="text-lg font-bold text-white">{transactions.length}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-1.5 mt-2">
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full" style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bannière Premium */}
          {!isPremiumUser && (
            <PremiumUnlock onUnlock={handleUnlockPremium} />
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <h1 className="text-3xl font-bold mb-4 sm:mb-0">
              Dashboard <span className="text-gradient">fiscal</span>
            </h1>
            
            {transactions.length > 0 && isPremiumUser && (
              <button
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="btn btn-premium"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin w-5 h-5 mr-3 bg-transparent border-2 border-transparent border-t-white rounded-full"></div>
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 10V16M12 16L9 13M12 16L15 13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Générer Rapport PDF
                  </>
                )}
              </button>
            )}
          </div>
          
          {error && (
            <div className="alert alert-danger">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="card flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-primary-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-6 text-primary-400 font-medium">Analyse en cours...</p>
              <p className="text-gray-400 text-sm mt-2">Cette opération peut prendre quelques instants</p>
            </div>
          ) : (
            <>
              {currentWallet ? (
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
                      walletAddress={currentWallet.address}
                    />
                    
                    {/* Liste des transactions */}
                    <TransactionList 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                  </>
                ) : (
                  <div className="card flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-800/70 flex items-center justify-center mb-6">
                      <svg className="w-10 h-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white mb-2">Aucune transaction trouvée</h3>
                    <p className="text-gray-400 max-w-md">
                      Nous n'avons pas trouvé de transactions pour ce wallet sur {selectedNetwork}.
                      <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => scanManual()}
                        className="btn btn-primary"
                      >
                        Scanner {selectedNetwork.toUpperCase()}
                      </button>
                      <button
                        onClick={() => scanAuto()}
                        className="btn btn-secondary"
                      >
                        Scan multi-blockchain
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="card flex flex-col items-center justify-center py-16 text-center">
                  <h3 className="text-xl font-medium text-white mb-2">Bienvenue sur Bitax</h3>
                  <p className="text-gray-400 mb-8">
                    Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
                  </p>
                  <SimpleWalletButton
                    onClick={connectWallet}
                    variant="premium"
                    size="lg"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnectButton;