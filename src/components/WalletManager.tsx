// src/components/WalletManager.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import NetworkIcon from '@/components/NetworkIcon';
import { NetworkType } from '@/utils/transactions';

// Types
interface Wallet {
  id: string;
  address: string;
  network: string;
  name?: string;
  isPrimary: boolean;
}

interface WalletManagerProps {
  onWalletSelect?: (wallet: Wallet) => void;
  className?: string;
}

// Wallets supportés avec leurs informations
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

const WalletManager: React.FC<WalletManagerProps> = ({ onWalletSelect, className = '' }) => {
  const { data: session } = useSession();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingWallet, setAddingWallet] = useState<boolean>(false);
  const [showWalletSelector, setShowWalletSelector] = useState<boolean>(false);
  const [newWalletName, setNewWalletName] = useState<string>('');
  const [newWalletNetwork, setNewWalletNetwork] = useState<NetworkType>('eth');
  const [selectedWalletType, setSelectedWalletType] = useState<string>('');
  const [connectLoading, setConnectLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // Trier les wallets par priorité
  const sortedWallets = [...SUPPORTED_WALLETS].sort((a, b) => a.priority - b.priority);

  // Charger les wallets depuis l'API
  useEffect(() => {
    if (session) {
      fetchWallets();
    }
  }, [session]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallet');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des wallets');
      }
      
      const data = await response.json();
      setWallets(data.wallets || []);
    } catch (error) {
      console.error('Erreur de chargement des wallets:', error);
      toast.error('Impossible de charger vos wallets');
    } finally {
      setLoading(false);
    }
  };

  // Connecter un nouveau wallet
  const connectWallet = async (walletType: string) => {
    setSelectedWalletType(walletType);
    setConnectLoading(true);
    
    try {
      let walletAddress = '';
      let walletProvider;
      
      if (walletType === 'walletconnect') {
        // Logique d'intégration WalletConnect
        // À compléter avec la bibliothèque WalletConnect v2
        toast.error('WalletConnect sera disponible prochainement');
        setConnectLoading(false);
        return;
      } else if (typeof window !== 'undefined' && window.ethereum) {
        walletProvider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await walletProvider.send('eth_requestAccounts', []);
        
        if (accounts.length > 0) {
          walletAddress = accounts[0];
          setProvider(walletProvider);
        } else {
          throw new Error('Aucun compte autorisé');
        }
      } else {
        // Rediriger vers l'installation du wallet
        const walletInfo = SUPPORTED_WALLETS.find(w => w.id === walletType);
        
        if (walletType === 'metamask') {
          window.open('https://metamask.io/download.html', '_blank');
        } else if (walletType === 'coinbase') {
          window.open('https://www.coinbase.com/wallet/downloads', '_blank');
        } else if (walletType === 'trustwallet') {
          window.open('https://trustwallet.com/download', '_blank');
        }
        
        throw new Error(`${walletInfo?.name || 'Le wallet'} n'est pas installé`);
      }
      
      // Si nous arrivons ici, nous avons une adresse
      if (walletAddress) {
        // Vérifier si le wallet existe déjà
        const walletExists = wallets.some(w => w.address.toLowerCase() === walletAddress.toLowerCase());
        
        if (walletExists) {
          toast.error('Ce wallet est déjà connecté');
          setConnectLoading(false);
          setShowWalletSelector(false);
          return;
        }
        
        // Ajouter le wallet à la base de données
        const response = await fetch('/api/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: walletAddress,
            network: newWalletNetwork,
            name: newWalletName || `Wallet ${wallets.length + 1}`,
            isPrimary: wallets.length === 0, // Premier wallet = wallet principal
          }),
        });
        
        if (!response.ok) {
          throw new Error('Erreur lors de l\'ajout du wallet');
        }
        
        const data = await response.json();
        
        // Mettre à jour la liste des wallets
        setWallets([...wallets, data.wallet]);
        
        toast.success('Wallet ajouté avec succès');
        setShowWalletSelector(false);
        setNewWalletName('');
      }
    } catch (error: any) {
      console.error('Erreur de connexion wallet:', error);
      if (error.code === 4001) {
        // L'utilisateur a refusé la connexion
        toast.error('Vous avez refusé la connexion');
      } else {
        toast.error(error.message || 'Erreur lors de la connexion du wallet');
      }
    } finally {
      setConnectLoading(false);
    }
  };

  // Supprimer un wallet
  const deleteWallet = async (walletId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce wallet ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du wallet');
      }
      
      // Mettre à jour la liste des wallets
      setWallets(wallets.filter(w => w.id !== walletId));
      toast.success('Wallet supprimé avec succès');
      
    } catch (error) {
      console.error('Erreur de suppression du wallet:', error);
      toast.error('Impossible de supprimer le wallet');
    }
  };

  // Définir un wallet comme principal
  const setPrimaryWallet = async (walletId: string) => {
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPrimary: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du wallet');
      }
      
      // Mettre à jour la liste des wallets
      const updatedWallets = wallets.map(w => ({
        ...w,
        isPrimary: w.id === walletId,
      }));
      
      setWallets(updatedWallets);
      
      // Si onWalletSelect est fourni, sélectionner le wallet principal
      const primaryWallet = updatedWallets.find(w => w.isPrimary);
      if (primaryWallet && onWalletSelect) {
        onWalletSelect(primaryWallet);
      }
      
      toast.success('Wallet principal mis à jour');
      
    } catch (error) {
      console.error('Erreur de mise à jour du wallet:', error);
      toast.error('Impossible de mettre à jour le wallet');
    }
  };

  // Formatter une adresse pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className={`rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 ${className}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Vos wallets</h2>
          <button 
            onClick={() => setShowWalletSelector(!showWalletSelector)}
            className="btn btn-sm btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter un wallet
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {wallets.length === 0 ? (
              <div className="text-center py-8 px-4">
                <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucun wallet connecté</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Connectez un wallet pour commencer à utiliser Bitax
                </p>
                <button 
                  onClick={() => setShowWalletSelector(true)}
                  className="btn btn-primary"
                >
                  Connecter un wallet
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <div 
                    key={wallet.id} 
                    className={`p-4 rounded-lg border ${wallet.isPrimary 
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700' 
                      : 'border-gray-200 dark:border-gray-700'
                    } transition-all duration-200`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full ${wallet.isPrimary ? 'bg-primary-500 animate-pulse' : 'bg-gray-400'} mr-2.5`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {wallet.name || `Wallet ${index + 1}`}
                          </p>
                          <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                            {formatAddress(wallet.address)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!wallet.isPrimary && (
                          <button 
                            onClick={() => setPrimaryWallet(wallet.id)}
                            className="p-1.5 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Définir comme wallet principal"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={() => deleteWallet(wallet.id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Supprimer ce wallet"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center">
                      <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-700 dark:text-gray-300 flex items-center">
                        <NetworkIcon network={wallet.network as NetworkType} size={14} className="mr-1.5" />
                        {wallet.network.toUpperCase()}
                      </div>
                      
                      {wallet.isPrimary && (
                        <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md text-xs">
                          Principal
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Sélecteur de wallet pour l'ajout */}
        {showWalletSelector && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h3 className="text-lg font-medium mb-4">Connecter un nouveau wallet</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du wallet (optionnel)
              </label>
              <input
                type="text"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                placeholder="Mon wallet principal"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Réseau par défaut
              </label>
              <select
                value={newWalletNetwork}
                onChange={(e) => setNewWalletNetwork(e.target.value as NetworkType)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="eth">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
                <option value="base">Base</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sortedWallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => connectWallet(wallet.id)}
                  disabled={connectLoading}
                  className={`flex items-start p-4 border ${
                    selectedWalletType === wallet.id 
                      ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } rounded-xl transition-all duration-200 ${
                    connectLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${wallet.id === 'walletconnect' ? 'relative overflow-hidden' : ''}`}
                >
                  {wallet.id === 'walletconnect' && (
                    <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-2 py-0.5 rounded-bl-md">
                      Recommandé
                    </div>
                  )}
                  <div className="flex-shrink-0 mr-4 text-3xl">
                    {wallet.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900 dark:text-white">{wallet.name}</h4>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{wallet.description}</p>
                    {selectedWalletType === wallet.id && connectLoading && (
                      <div className="flex items-center mt-2 text-primary-600 dark:text-primary-400">
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
            
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowWalletSelector(false)}
                className="btn btn-outline mr-2"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManager;