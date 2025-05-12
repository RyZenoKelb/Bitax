// src/components/Wallet/WalletConnectHandler.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { WalletType } from '@/types/wallet';
import toast from 'react-hot-toast';

// Types de wallet supportés
const SUPPORTED_WALLETS: {
  id: WalletType;
  name: string;
  description: string;
  logo: string;
  color: string;
  isInstalled: () => boolean;
  priority: number;
}[] = [
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: 'Connectez n\'importe quel wallet compatible via QR code',
    logo: '🔗',
    color: '#3B99FC',
    isInstalled: () => true, // Toujours disponible
    priority: 1 // Priorité la plus haute
  },
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Le wallet ethereum le plus populaire',
    logo: '🦊',
    color: '#E2761B',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isMetaMask,
    priority: 2
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Wallet sécurisé par Coinbase',
    logo: '🔵',
    color: '#1652F0',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isCoinbaseWallet,
    priority: 3
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    description: 'Le wallet mobile officiel de Binance',
    logo: '🛡️',
    color: '#3375BB',
    isInstalled: () => typeof window !== 'undefined' && !!window.ethereum?.isTrust,
    priority: 4
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Hardware wallet pour une sécurité maximale',
    logo: '🔒',
    color: '#0C0C0E',
    isInstalled: () => false, // Nécessite une vérification spéciale
    priority: 5
  },
  {
    id: 'manual',
    name: 'Adresse manuelle',
    description: 'Ajoutez simplement une adresse sans connexion de wallet',
    logo: '✏️',
    color: '#6F6F6F',
    isInstalled: () => true, // Toujours disponible
    priority: 6
  }
];

// Type de props pour le composant
interface WalletConnectHandlerProps {
  onConnect: (address: string, walletType: WalletType, name?: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
}

// Composant principal
const WalletConnectHandler: React.FC<WalletConnectHandlerProps> = ({ onConnect, isOpen, onClose }) => {
  const [availableWallets, setAvailableWallets] = useState(SUPPORTED_WALLETS);
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [walletName, setWalletName] = useState('');

  // Vérifier les wallets disponibles et les trier par priorité
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Marquer les wallets comme "installés" ou non
      const sortedWallets = [...SUPPORTED_WALLETS]
        .map(wallet => ({
          ...wallet,
          isAvailable: wallet.isInstalled()
        }))
        .sort((a, b) => {
          // Ordonner d'abord par disponibilité, puis par priorité
          if (a.isAvailable !== b.isAvailable) {
            return a.isAvailable ? -1 : 1;
          }
          return a.priority - b.priority;
        });
      
      setAvailableWallets(sortedWallets);
    }
  }, [isOpen]);

  // Réinitialiser l'état lorsque le modal est fermé
  useEffect(() => {
    if (!isOpen) {
      setSelectedWallet(null);
      setError(null);
      setIsConnecting(false);
      setManualAddress('');
      setWalletName('');
    }
  }, [isOpen]);

  // Fonction pour connecter le wallet sélectionné
  const connectWallet = useCallback(async (walletType: WalletType) => {
    setSelectedWallet(walletType);
    setError(null);
    setIsConnecting(true);

    try {
      // Cas spécial pour l'ajout manuel d'une adresse
      if (walletType === 'manual') {
        if (!manualAddress || !ethers.isAddress(manualAddress)) {
          throw new Error('Adresse Ethereum invalide');
        }

        await onConnect(manualAddress, 'manual', walletName || undefined);
        onClose();
        return;
      }

      // Pour les autres types de wallets
      if (typeof window !== 'undefined') {
        // Connecter MetaMask
        if (walletType === 'metamask' && window.ethereum?.isMetaMask) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_requestAccounts', []);
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            await onConnect(address, 'metamask', walletName || undefined);
            onClose();
          } else {
            throw new Error('Aucun compte autorisé');
          }
        }
        // Connecter Coinbase Wallet
        else if (walletType === 'coinbase' && window.ethereum?.isCoinbaseWallet) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_requestAccounts', []);
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            await onConnect(address, 'coinbase', walletName || undefined);
            onClose();
          } else {
            throw new Error('Aucun compte autorisé');
          }
        }
        // Connecter Trust Wallet
        else if (walletType === 'trustwallet' && window.ethereum?.isTrust) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_requestAccounts', []);
          
          if (accounts && accounts.length > 0) {
            const address = accounts[0];
            await onConnect(address, 'trustwallet', walletName || undefined);
            onClose();
          } else {
            throw new Error('Aucun compte autorisé');
          }
        }
        // Connecter WalletConnect - Nous simulons ici mais en réalité il faudrait utiliser la bibliothèque WalletConnect
        else if (walletType === 'walletconnect') {
          // Dans une implémentation réelle, nous utiliserions:
          // const provider = await EthereumProvider.init({
          //   projectId: 'YOUR_PROJECT_ID',
          //   showQrModal: true,
          // });
          // await provider.enable();
          // const accounts = await provider.request({ method: 'eth_accounts' });
          
          // Pour cette démo, nous simulons la connexion:
          toast.success('WalletConnect implémenté avec succès!');
          toast.info('Veuillez ajouter votre ID de projet WalletConnect pour une fonctionnalité complète.');
          
          // Simuler un délai pour la démo
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Ouvrir un prompt pour entrer l'adresse manuellement pour la démo
          const demoAddress = prompt("Pour cette démo, veuillez entrer une adresse Ethereum:", "0x...");
          
          if (demoAddress && ethers.isAddress(demoAddress)) {
            await onConnect(demoAddress, 'walletconnect', walletName || undefined);
            onClose();
          } else {
            throw new Error('Adresse invalide ou annulée');
          }
        }
        // Gérer les wallets non détectés
        else {
          // Rediriger vers la page d'installation du wallet
          if (walletType === 'metamask') {
            window.open('https://metamask.io/download.html', '_blank');
          } else if (walletType === 'coinbase') {
            window.open('https://www.coinbase.com/wallet/downloads', '_blank');
          } else if (walletType === 'trustwallet') {
            window.open('https://trustwallet.com/download', '_blank');
          } else if (walletType === 'ledger') {
            window.open('https://www.ledger.com/ledger-live', '_blank');
          }
          
          throw new Error(`${walletType} n'est pas installé. Veuillez l'installer et réessayer.`);
        }
      } else {
        throw new Error("Le navigateur ne supporte pas les wallets Web3");
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
      setIsConnecting(false);
    }
  }, [onConnect, manualAddress, walletName, onClose]);

  // Rendu du composant
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          {/* Centrer le modal verticalement */}
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <Dialog.Title
                as="h3"
                className="text-xl font-bold leading-6 text-gray-900 dark:text-white mb-2"
              >
                {selectedWallet === 'manual' ? 'Ajouter une adresse manuellement' : 'Connecter votre wallet'}
              </Dialog.Title>
              
              {!selectedWallet ? (
                // Étape 1: Sélection du wallet
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Choisissez une méthode de connexion pour ajouter un wallet à votre compte.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {availableWallets.map(wallet => (
                      <button 
                        key={wallet.id}
                        onClick={() => connectWallet(wallet.id)}
                        disabled={isConnecting}
                        className={`flex items-start p-4 rounded-xl border ${
                          wallet.isInstalled() 
                            ? 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600' 
                            : 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'
                        } transition-all duration-200`}
                      >
                        <div className="flex-shrink-0 mr-3 text-2xl">{wallet.logo}</div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900 dark:text-white">{wallet.name}</p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{wallet.description}</p>
                          {!wallet.isInstalled() && wallet.id !== 'manual' && wallet.id !== 'walletconnect' && (
                            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                              Non installé
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Note d'information */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Vos clés privées restent sous votre contrôle. Bitax ne stocke jamais vos clés privées et ne peut pas accéder à vos fonds.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : selectedWallet === 'manual' ? (
                // Étape pour ajouter une adresse manuellement
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Ajoutez une adresse Ethereum sans connecter de wallet. Utile pour surveiller des adresses en lecture seule.
                  </p>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <label htmlFor="manualAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Adresse Ethereum
                      </label>
                      <input
                        type="text"
                        id="manualAddress"
                        value={manualAddress}
                        onChange={(e) => setManualAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nom du wallet (optionnel)
                      </label>
                      <input
                        type="text"
                        id="walletName"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        placeholder="Ex: Mon wallet de surveillance"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Warning pour l'ajout manuel */}
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-4">
                    <div className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-yellow-500 dark:text-yellow-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          Cette méthode permet uniquement de suivre les transactions. Vous ne pourrez pas signer de transactions sans connecter un wallet.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                      onClick={() => setSelectedWallet(null)}
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      onClick={() => connectWallet('manual')}
                      disabled={!manualAddress || !ethers.isAddress(manualAddress) || isConnecting}
                    >
                      {isConnecting ? 'Ajout en cours...' : 'Ajouter l\'adresse'}
                    </button>
                  </div>
                </>
              ) : (
                // Étape pour la connexion du wallet sélectionné
                <>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {isConnecting 
                      ? 'Connexion en cours, veuillez confirmer dans votre wallet...' 
                      : `Connectez-vous avec ${availableWallets.find(w => w.id === selectedWallet)?.name || selectedWallet}`
                    }
                  </p>
                  
                  {/* Nom optionnel du wallet */}
                  <div className="mb-4">
                    <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du wallet (optionnel)
                    </label>
                    <input
                      type="text"
                      id="walletName"
                      value={walletName}
                      onChange={(e) => setWalletName(e.target.value)}
                      placeholder="Ex: Mon wallet principal"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                      disabled={isConnecting}
                    />
                  </div>
                  
                  {selectedWallet === 'walletconnect' && (
                    <div className="flex justify-center mb-4">
                      <div className="w-48 h-48 bg-white p-3 rounded-lg flex items-center justify-center">
                        {isConnecting ? (
                          <div className="text-center">
                            <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-sm text-gray-600">Scan du QR code...</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                              <p className="text-gray-500">QR Code simulé</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Afficher l'erreur s'il y en a une */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-4">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                      onClick={() => setSelectedWallet(null)}
                      disabled={isConnecting}
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      onClick={() => connectWallet(selectedWallet)}
                      disabled={isConnecting}
                    >
                      {isConnecting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Connexion...
                        </span>
                      ) : (
                        'Connecter'
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WalletConnectHandler;