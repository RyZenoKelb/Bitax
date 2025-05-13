// src/components/Wallet/WalletConnectModal.tsx
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NetworkType } from '@/utils/transactions';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { ethers } from 'ethers';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWallet: (address: string, network: NetworkType, name?: string) => void;
  supportedNetworks: Record<string, { name: string; chainId: number; color: string }>;
}

const WALLET_PROVIDERS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    bgColor: 'bg-orange-500/20',
    color: 'text-orange-500',
    description: 'Connectez-vous facilement avec l\'extension MetaMask',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: '🔵',
    bgColor: 'bg-blue-500/20',
    color: 'text-blue-500',
    description: 'Utilisez Coinbase Wallet pour scanner vos transactions',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    bgColor: 'bg-blue-400/20',
    color: 'text-blue-400',
    description: 'Scannez un QR code pour connecter n\'importe quel wallet',
    isInstalled: () => true, // WalletConnect est toujours disponible
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    icon: '🛡️',
    bgColor: 'bg-blue-600/20',
    color: 'text-blue-600',
    description: 'Le wallet crypto sécurisé de Binance',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isTrust,
  },
];

type InputMode = 'manual' | 'connect';

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddWallet,
  supportedNetworks
}) => {
  const [inputMode, setInputMode] = useState<InputMode>('connect');
  const [manualAddress, setManualAddress] = useState<string>('');
  const [walletName, setWalletName] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('eth');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState<boolean>(true);
  
  // Réinitialiser l'état lors de la fermeture de la modal
  const handleClose = () => {
    setInputMode('connect');
    setManualAddress('');
    setWalletName('');
    setSelectedNetwork('eth');
    setIsConnecting(false);
    setError(null);
    setIsAddressValid(true);
    onClose();
  };
  
  // Validation d'adresse Ethereum
  const validateAddress = (address: string): boolean => {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  };
  
  // Gestion de la saisie manuelle d'adresse
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setManualAddress(value);
    setIsAddressValid(value === '' || validateAddress(value));
  };
  
  // Soumettre l'adresse manuelle
  const handleSubmitManual = () => {
    if (!manualAddress || !validateAddress(manualAddress)) {
      setError('Veuillez entrer une adresse valide');
      return;
    }
    
    setError(null);
    onAddWallet(manualAddress, selectedNetwork, walletName || undefined);
    handleClose();
  };
  
  // Connexion avec un wallet
  const connectWithWallet = async (providerId: string) => {
    try {
      setIsConnecting(true);
      setError(null);
      
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Aucun wallet détecté. Veuillez installer un wallet compatible.');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('Aucun compte autorisé');
      }
      
      const address = accounts[0];
      onAddWallet(address, selectedNetwork, walletName || `${providerId.charAt(0).toUpperCase() + providerId.slice(1)}`);
      handleClose();
    } catch (err: any) {
      console.error('Erreur de connexion wallet:', err);
      if (err.code === 4001) {
        setError('Vous avez refusé la connexion. Veuillez réessayer.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Une erreur est survenue lors de la connexion au wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Déterminer quels wallets sont installés
  const availableWallets = WALLET_PROVIDERS.filter(provider => {
    if (provider.id === 'walletconnect') return true; // WalletConnect est toujours disponible
    return provider.isInstalled();
  });
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        {/* Fond semi-transparent */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-gray-800/70 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-semibold leading-6 text-white mb-6"
                >
                  Ajouter un wallet
                </Dialog.Title>
                
                {/* Tabs pour choisir le mode d'ajout */}
                <div className="mb-6">
                  <div className="flex border-b border-gray-800">
                    <button
                      onClick={() => setInputMode('connect')}
                      className={`py-2 px-4 text-sm font-medium border-b-2 ${
                        inputMode === 'connect'
                          ? 'text-primary-400 border-primary-500'
                          : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      Connecter un Wallet
                    </button>
                    <button
                      onClick={() => setInputMode('manual')}
                      className={`py-2 px-4 text-sm font-medium border-b-2 ${
                        inputMode === 'manual'
                          ? 'text-primary-400 border-primary-500'
                          : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      Ajouter manuellement
                    </button>
                  </div>
                </div>

                {/* Champ commun pour sélectionner le réseau */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sélectionnez un réseau
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {Object.entries(supportedNetworks).map(([id, network]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedNetwork(id as NetworkType)}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                          selectedNetwork === id
                            ? 'bg-primary-900/30 border-primary-500/50'
                            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800 hover:border-gray-700'
                        } transition-colors`}
                      >
                        <NetworkIcon network={id as NetworkType} size={24} className="mb-1" />
                        <span className="text-xs font-medium">{network.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Message d'erreur */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400 text-sm">
                    <div className="flex items-start">
                      <svg className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                {/* Contenu selon le mode */}
                {inputMode === 'connect' ? (
                  /* Mode connexion wallet */
                  <div className="space-y-4">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom du wallet (optionnel)
                      </label>
                      <input
                        type="text"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        placeholder="Mon wallet principal..."
                        className="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-300 mb-3">
                        Choisissez votre wallet
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {availableWallets.map((provider) => (
                          <button
                            key={provider.id}
                            onClick={() => connectWithWallet(provider.id)}
                            disabled={isConnecting}
                            className="flex items-center p-4 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-800 hover:border-gray-700 transition-colors"
                          >
                            <div className={`flex-shrink-0 w-10 h-10 ${provider.bgColor} ${provider.color} rounded-lg flex items-center justify-center mr-3`}>
                              <span className="text-xl">{provider.icon}</span>
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-white">{provider.name}</div>
                              <div className="text-xs text-gray-400">{provider.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {availableWallets.length === 0 && (
                      <div className="text-center p-4">
                        <p className="text-gray-400 mb-4">Aucun wallet compatible n'est installé</p>
                        <div className="grid grid-cols-2 gap-3">
                          <a
                            href="https://metamask.io/download/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline flex items-center justify-center"
                          >
                            <span className="mr-2">🦊</span>
                            Installer MetaMask
                          </a>
                          <a
                            href="https://www.coinbase.com/wallet/downloads" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline flex items-center justify-center"
                          >
                            <span className="mr-2">🔵</span>
                            Installer Coinbase
                          </a>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg">
                      🔒 Bitax n'a jamais accès à vos clés privées et ne peut pas effectuer de transactions.
                    </div>
                  </div>
                ) : (
                  /* Mode saisie manuelle */
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Adresse du wallet
                      </label>
                      <input
                        type="text"
                        value={manualAddress}
                        onChange={handleAddressChange}
                        placeholder="0x..."
                        className={`w-full px-3 py-2 bg-gray-800/70 border rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white ${
                          !isAddressValid ? 'border-red-500' : 'border-gray-700'
                        }`}
                      />
                      {!isAddressValid && manualAddress && (
                        <p className="mt-1 text-xs text-red-500">
                          Cette adresse n'est pas valide
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nom du wallet (optionnel)
                      </label>
                      <input
                        type="text"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        placeholder="Mon wallet principal..."
                        className="w-full px-3 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-white"
                      />
                    </div>
                    
                    <div className="pt-2 text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg">
                      ℹ️ Entrez une adresse valide pour le réseau sélectionné. L'ajout manuel permet de suivre les transactions sans avoir à connecter un wallet.
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="btn btn-outline"
                  >
                    Annuler
                  </button>
                  
                  {inputMode === 'manual' && (
                    <button
                      type="button"
                      onClick={handleSubmitManual}
                      disabled={!manualAddress || !isAddressValid || isConnecting}
                      className="btn btn-primary"
                    >
                      {isConnecting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Ajout en cours...
                        </>
                      ) : 'Ajouter ce wallet'}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WalletConnectModal;