import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectPanelProps {
  onConnect: (address: string, provider: ethers.BrowserProvider) => void;
  isLoading?: boolean;
}

// Déclaration complète des propriétés pour éviter les erreurs
interface WalletInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  isInstalled: () => boolean;
}

// Wallets supportés avec leurs informations
const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'La solution la plus populaire pour gérer vos actifs crypto',
    color: '#E2761B',
    bgColor: '#FFF5E6',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isMetaMask
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Connectez-vous avec le wallet mobile ou l\'extension Coinbase',
    color: '#1652F0',
    bgColor: '#E7EEFF',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connectez-vous facilement via le scan d\'un QR code',
    color: '#3B99FC',
    bgColor: '#EDF5FF',
    isInstalled: () => true // Toujours disponible
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    description: 'Le wallet mobile officiel de Binance',
    color: '#3375BB',
    bgColor: '#E8F1FA',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isTrust
  }
];

// Placeholder d'image SVG pour les icônes (à remplacer par de vrais fichiers)
const WalletIconPlaceholder: React.FC<{ color: string }> = ({ color }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="12" fill={color} fillOpacity="0.1" />
    <path d="M28 14H12C10.9 14 10 14.9 10 16V24C10 25.1 10.9 26 12 26H28C29.1 26 30 25.1 30 24V16C30 14.9 29.1 14 28 14ZM28 24H12V16H28V24ZM25 20.5C25 21.33 24.33 22 23.5 22C22.67 22 22 21.33 22 20.5C22 19.67 22.67 19 23.5 19C24.33 19 25 19.67 25 20.5Z" fill={color} />
  </svg>
);

const WalletConnectPanel: React.FC<WalletConnectPanelProps> = ({ onConnect, isLoading = false }) => {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>(SUPPORTED_WALLETS);
  const [showNetworkSelector, setShowNetworkSelector] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('eth');

  // Vérifier quels wallets sont disponibles
  useEffect(() => {
    const installedWallets = SUPPORTED_WALLETS.filter(wallet => wallet.isInstalled());
    setAvailableWallets(installedWallets.length > 0 ? installedWallets : SUPPORTED_WALLETS);
    
    // Vérifier si MetaMask est déjà connecté
    checkExistingConnection();
  }, []);
  
  // Vérifier si une connexion wallet existe déjà
  const checkExistingConnection = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          // Un wallet est déjà connecté, déterminer lequel
          let walletId = 'metamask'; // Par défaut
          
          if (window.ethereum.isCoinbaseWallet) walletId = 'coinbase';
          else if (window.ethereum.isTrust) walletId = 'trustwallet';
          
          setSelectedWallet(walletId);
          onConnect(accounts[0].address, provider);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de connexion existante', error);
      }
    }
  };

  const connectWallet = async (walletId: string) => {
    setSelectedWallet(walletId);
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          onConnect(accounts[0], provider);
        } else {
          throw new Error('Aucun compte autorisé');
        }
      } else {
        // Cas où le wallet n'est pas installé
        if (walletId === 'metamask') {
          window.open('https://metamask.io/download.html', '_blank');
          throw new Error('MetaMask n\'est pas installé. Veuillez l\'installer et réessayer.');
        } else if (walletId === 'coinbase') {
          window.open('https://www.coinbase.com/wallet/downloads', '_blank');
          throw new Error('Coinbase Wallet n\'est pas installé. Veuillez l\'installer et réessayer.');
        } else if (walletId === 'walletconnect') {
          // Pour WalletConnect, on devrait avoir une solution dédiée
          throw new Error('Fonctionnalité WalletConnect en cours d\'implémentation');
        } else {
          throw new Error('Le wallet sélectionné n\'est pas disponible');
        }
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
      setSelectedWallet(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const getNetworkColor = (network: NetworkType): string => {
    return SUPPORTED_NETWORKS[network]?.color || '#627EEA';
  };

  return (
    <div className="bg-white dark:bg-bitax-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300">
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          Connectez votre wallet
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Pour commencer, connectez votre wallet crypto pour scanner vos transactions sur différentes blockchains.
        </p>
      </div>
      
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sélectionnez une blockchain
            </h3>
            
            {/* Sélecteur de blockchain en style boutique app */}
            <div className="relative">
              <button
                onClick={() => setShowNetworkSelector(!showNetworkSelector)}
                className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <span 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: getNetworkColor(selectedNetwork) }}
                ></span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {SUPPORTED_NETWORKS[selectedNetwork].name}
                </span>
                <svg className="w-4 h-4 ml-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showNetworkSelector && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
                    {Object.entries(SUPPORTED_NETWORKS).map(([id, network]) => (
                      <button
                        key={id}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          selectedNetwork === id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedNetwork(id as NetworkType);
                          setShowNetworkSelector(false);
                        }}
                      >
                        <span 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: network.color || '#627EEA' }}
                        ></span>
                        <span>{network.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableWallets.map(wallet => (
              <button
                key={wallet.id}
                onClick={() => connectWallet(wallet.id)}
                disabled={isConnecting || isLoading}
                className={`flex items-start p-4 border ${
                  selectedWallet === wallet.id 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                } rounded-xl transition-all duration-200 ${
                  (isConnecting || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex-shrink-0 mr-4">
                  {/* Remplacer par la vraie icône quand disponible */}
                  <WalletIconPlaceholder color={wallet.color} />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 dark:text-white">{wallet.name}</h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{wallet.description}</p>
                  {selectedWallet === wallet.id && isConnecting && (
                    <div className="flex items-center mt-2 text-blue-600 dark:text-blue-400">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-xs">Connexion en cours...</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Important</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Bitax ne stocke jamais vos clés privées et ne peut pas accéder à vos fonds.
                Toutes les données sont traitées localement.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Premier scan ? <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Voir le tutoriel</a>
          </p>
          <button
            onClick={() => window.open('https://metamask.io/download.html', '_blank')}
            className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            Je n'ai pas de wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPanel;