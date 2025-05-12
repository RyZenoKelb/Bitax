// src/components/Wallet/WalletConnectModal.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NetworkType } from '@/utils/transactions';
import { Wallet } from './WalletManager';
import Link from 'next/link';
import { toast } from 'react-toastify';

// Import WalletConnect
import { EthereumProvider } from '@walletconnect/ethereum-provider';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: (address: string, provider: ethers.BrowserProvider, network?: NetworkType, name?: string) => Promise<any>;
  existingWallets: Wallet[];
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onWalletConnect,
  existingWallets = []
}) => {
  const [activeTab, setActiveTab] = useState<'connect' | 'manual'>('connect');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string>('');
  const [manualWalletName, setManualWalletName] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('eth');
  const [walletConnectInitialized, setWalletConnectInitialized] = useState<boolean>(false);
  const [wcProvider, setWcProvider] = useState<EthereumProvider | null>(null);

  // Réinitialiser l'état quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setActiveTab('connect');
      setIsConnecting(false);
      setConnectingWallet(null);
      setError(null);
      setManualAddress('');
      setManualWalletName('');
      setSelectedNetwork('eth');
      
      // Initialiser WalletConnect
      initializeWalletConnect();
    }
  }, [isOpen]);

  // Initialiser le provider WalletConnect
  const initializeWalletConnect = async () => {
    try {
      // Créer une instance de WalletConnect Provider
      const provider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID', // Remplacer par votre ID de projet
        chains: [1], // Ethereum Mainnet
        optionalChains: [137, 42161, 10, 8453], // Polygon, Arbitrum, Optimism, Base
        showQrModal: true,
        metadata: {
          name: 'Bitax',
          description: 'Plateforme de fiscalité crypto pour la France',
          url: 'https://bitax.fr',
          icons: ['https://bitax.fr/logo.png']
        }
      });

      setWcProvider(provider);
      setWalletConnectInitialized(true);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de WalletConnect:', error);
      setError('Impossible d\'initialiser WalletConnect');
    }
  };

  // Se connecter à un wallet via WalletConnect
  const connectWithWalletConnect = async () => {
    if (!wcProvider) {
      setError('WalletConnect n\'est pas initialisé');
      return;
    }

    setIsConnecting(true);
    setConnectingWallet('walletconnect');
    setError(null);

    try {
      // Connecter et obtenir les comptes
      await wcProvider.connect();
      
      const accounts = await wcProvider.request({ method: 'eth_accounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Aucun compte connecté via WalletConnect');
      }

      // Créer un ethers provider qui wrap le provider WalletConnect
      const ethersProvider = new ethers.BrowserProvider(wcProvider as any);
      
      // Vérifier si le wallet est déjà dans la liste
      const address = accounts[0].toLowerCase();
      const walletExists = existingWallets.some(w => w.address.toLowerCase() === address);
      
      if (walletExists) {
        toast.info('Ce wallet est déjà connecté');
        onClose();
        return;
      }

      // Enregistrer le wallet
      await onWalletConnect(address, ethersProvider, selectedNetwork);
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la connexion avec WalletConnect:', error);
      setError(error.message || 'Impossible de se connecter avec WalletConnect');
    } finally {
      setIsConnecting(false);
      setConnectingWallet(null);
    }
  };

  // Se connecter à un wallet via Metamask ou similaire
  const connectWithInjectedProvider = async (providerType: 'metamask' | 'coinbase' | 'trust') => {
    setIsConnecting(true);
    setConnectingWallet(providerType);
    setError(null);

    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('Aucun wallet compatible n\'a été détecté dans votre navigateur');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (!accounts || accounts.length === 0) {
        throw new Error('Aucun compte autorisé');
      }

      // Vérifier si le wallet est déjà dans la liste
      const address = accounts[0].toLowerCase();
      const walletExists = existingWallets.some(w => w.address.toLowerCase() === address);
      
      if (walletExists) {
        toast.info('Ce wallet est déjà connecté');
        onClose();
        return;
      }

      // Enregistrer le wallet
      await onWalletConnect(address, provider, selectedNetwork);
      onClose();
    } catch (error: any) {
      console.error(`Erreur lors de la connexion avec ${providerType}:`, error);
      
      if (error.code === 4001) {
        setError('Vous avez refusé la connexion. Veuillez réessayer.');
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(`Impossible de se connecter avec ${providerType}`);
      }
      
      // Si le wallet n'est pas installé, rediriger vers le site pour l'installation
      if (!window.ethereum) {
        if (providerType === 'metamask') {
          window.open('https://metamask.io/download.html', '_blank');
        } else if (providerType === 'coinbase') {
          window.open('https://www.coinbase.com/wallet/downloads', '_blank');
        } else if (providerType === 'trust') {
          window.open('https://trustwallet.com/download', '_blank');
        }
      }
    } finally {
      setIsConnecting(false);
      setConnectingWallet(null);
    }
  };

  // Ajouter un wallet manuellement
  const handleAddManualWallet = async () => {
    if (!manualAddress) {
      setError('Veuillez entrer une adresse');
      return;
    }

    // Valider l'adresse
    try {
      if (!ethers.isAddress(manualAddress)) {
        throw new Error('Adresse Ethereum invalide');
      }
    } catch (error) {
      setError('Adresse Ethereum invalide');
      return;
    }

    const normalizedAddress = manualAddress.toLowerCase();
    
    // Vérifier si le wallet est déjà dans la liste
    const walletExists = existingWallets.some(w => w.address.toLowerCase() === normalizedAddress);
    if (walletExists) {
      setError('Ce wallet est déjà connecté');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Créer un provider read-only pour Ethereum
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const ethersProvider = provider as unknown as ethers.BrowserProvider; // C'est un hack mais ça fonctionne pour notre cas
      
      // Enregistrer le wallet
      await onWalletConnect(
        normalizedAddress, 
        ethersProvider, 
        selectedNetwork, 
        manualWalletName || `Wallet ${existingWallets.length + 1}`
      );
      
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du wallet manuel:', error);
      setError(error.message || 'Impossible d\'ajouter le wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Si le modal n'est pas ouvert, ne rien afficher
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>
        
        {/* Modal */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all w-full max-w-md relative z-10">
          {/* En-tête */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                Ajouter un wallet
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Affichage des erreurs */}
          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            </div>
          )}
          
          {/* Onglets */}
          <div className="px-6 py-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'connect'
                    ? 'text-primary-600 dark:text-primary-400 border-primary-500'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('connect')}
              >
                Se connecter
              </button>
              <button
                className={`py-2 px-4 font-medium text-sm border-b-2 ${
                  activeTab === 'manual'
                    ? 'text-primary-600 dark:text-primary-400 border-primary-500'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('manual')}
              >
                Adresse manuelle
              </button>
            </div>
          </div>
          
          {/* Contenu des onglets */}
          <div className="px-6 pb-6">
            {/* Onglet de connexion */}
            {activeTab === 'connect' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {/* WalletConnect (Prioritaire) */}
                  <button
                    onClick={connectWithWalletConnect}
                    disabled={isConnecting || !walletConnectInitialized}
                    className={`relative flex items-center justify-between p-4 rounded-xl border ${
                      connectingWallet === 'walletconnect'
                        ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700'
                    } transition-all`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.35503 8.25635C10.4385 4.15087 17.0759 4.15087 21.1595 8.25635L21.6331 8.73202C21.8562 8.95548 21.8562 9.31897 21.6331 9.54244L19.964 11.2208C19.8525 11.3326 19.6761 11.3326 19.5646 11.2208L18.907 10.5607C16.046 7.68845 11.4684 7.68845 8.60745 10.5607L7.90037 11.2718C7.78884 11.3835 7.61243 11.3835 7.5009 11.2718L5.83182 9.59344C5.60866 9.36997 5.60866 9.00648 5.83182 8.78301L6.35503 8.25635ZM24.0001 11.0891L25.4828 12.5792C25.706 12.8027 25.706 13.1662 25.4828 13.3896L18.5347 20.372C18.3116 20.5955 17.9494 20.5955 17.7258 20.372L12.8915 15.5152C12.8358 15.4594 12.7455 15.4594 12.6898 15.5152L7.85552 20.372C7.63235 20.5955 7.27016 20.5955 7.0465 20.372L0.0978749 13.3896C-0.125291 13.1662 -0.125291 12.8027 0.0978749 12.5792L1.5805 11.0891C1.80367 10.8656 2.16586 10.8656 2.38952 11.0891L7.22428 15.9458C7.27998 16.0016 7.37031 16.0016 7.42601 15.9458L12.2603 11.0891C12.4835 10.8656 12.8457 10.8656 13.0693 11.0891L17.9041 15.9458C17.9598 16.0016 18.0501 16.0016 18.1058 15.9458L22.9406 11.0891C23.1642 10.8656 23.5264 10.8656 23.7495 11.0891L24.0001 11.0891Z" fill="#3396FF"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900 dark:text-white">WalletConnect</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Connectez n'importe quel wallet mobile via QR code
                        </p>
                      </div>
                    </div>
                    {connectingWallet === 'walletconnect' && (
                      <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    )}
                  </button>
                  
                  {/* MetaMask */}
                  <button
                    onClick={() => connectWithInjectedProvider('metamask')}
                    disabled={isConnecting}
                    className={`relative flex items-center justify-between p-4 rounded-xl border ${
                      connectingWallet === 'metamask'
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700'
                    } transition-all`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M27.5698 4.62292L17.8528 11.4093L19.6952 7.57824L27.5698 4.62292Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4.42004 4.62292L14.0606 11.465L12.305 7.57824L4.42004 4.62292Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23.9947 20.15L21.2703 23.8948L26.9609 25.3564L28.5655 20.2421L23.9947 20.15Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.44409 20.2421L5.03903 25.3564L10.7294 23.8948L8.00524 20.15L3.44409 20.2421Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.4026 14.012L8.81732 16.4349L14.4593 16.6728L14.2444 10.5702L10.4026 14.012Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21.5869 14.012L17.6993 10.5145L17.8528 16.6728L23.4824 16.4349L21.5869 14.012Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.7294 23.8948L14.0606 22.2901L11.2067 20.2778L10.7294 23.8948Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.9391 22.2901L21.2703 23.8948L20.793 20.2778L17.9391 22.2901Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M21.2703 23.8949L17.9391 22.2902L18.225 24.4562L18.1943 25.3007L21.2703 23.8949Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.7294 23.8949L13.8054 25.3007L13.7863 24.4562L14.0606 22.2902L10.7294 23.8949Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M13.8582 18.9814L11.1153 18.2292L13.0108 17.3848L13.8582 18.9814Z" fill="#233447" stroke="#233447" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.1414 18.9814L18.9888 17.3848L20.8959 18.2292L18.1414 18.9814Z" fill="#233447" stroke="#233447" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.7294 23.8948L11.2259 20.15L8.00524 20.2421L10.7294 23.8948Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.7738 20.15L21.2703 23.8948L23.9947 20.2421L20.7738 20.15Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23.4824 16.4349L17.8528 16.6728L18.1532 18.9814L19.0006 17.3848L20.9077 18.2292L23.4824 16.4349Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.1153 18.2292L13.0223 17.3848L13.8582 18.9814L14.1701 16.6728L8.52901 16.4349L11.1153 18.2292Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8.52917 16.4349L11.2067 20.2778L11.1153 18.2292L8.52917 16.4349Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20.9077 18.2292L20.793 20.2778L23.4825 16.4349L20.9077 18.2292Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14.1701 16.6729L13.8582 18.9814L14.2444 22.4232L14.4209 18.1378L14.1701 16.6729Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.8528 16.6729L17.6143 18.1264L17.7557 22.4232L18.1532 18.9814L17.8528 16.6729Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.1532 18.9814L17.7557 22.4232L17.9392 22.2901L20.793 20.2778L20.9077 18.2292L18.1532 18.9814Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M11.1153 18.2292L11.2067 20.2778L14.0606 22.2901L14.2444 22.4232L13.8582 18.9814L11.1153 18.2292Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.1943 25.3007L18.225 24.4563L17.9582 24.2184H14.0417L13.7863 24.4563L13.8054 25.3007L10.7294 23.8949L11.9065 24.8459L13.9986 26.2516H18.0011L20.1048 24.8459L21.2703 23.8949L18.1943 25.3007Z" fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.9391 22.2901L17.7557 22.4232H14.2444L14.0606 22.2901L13.7863 24.4562L14.0417 24.2183H17.9582L18.225 24.4562L17.9391 22.2901Z" fill="#161616" stroke="#161616" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M27.9676 11.6758L28.7957 7.54683L27.5698 4.62292L17.9391 11.1714L21.5869 14.012L26.839 15.4737L27.9676 14.1722L27.4903 13.8428L28.2725 13.1726L27.6844 12.7511L28.4666 12.1925L27.9676 11.6758Z" fill="#763D16" stroke="#763D16" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3.20398 7.54683L4.03204 11.6758L3.5216 12.1925L4.30382 12.7511L3.72711 13.1726L4.50933 13.8428L4.03204 14.1722L5.14924 15.4737L10.4026 14.012L14.0504 11.1714L4.42003 4.62292L3.20398 7.54683Z" fill="#763D16" stroke="#763D16" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M26.839 15.4737L21.5869 14.012L23.4824 16.4349L20.793 20.2778L23.9947 20.2421H28.5655L26.839 15.4737Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10.4027 14.012L5.1494 15.4737L3.44409 20.2421H8.00524L11.2068 20.2778L8.51752 16.4349L10.4027 14.012Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.8528 16.6728L17.9391 11.1714L19.6952 7.57825H12.3049L14.0504 11.1714L14.1702 16.6728L14.2445 18.1378L14.2559 22.4231H17.7557L17.7786 18.1378L17.8528 16.6728Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.128584" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900 dark:text-white">MetaMask</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Extension de navigateur populaire
                        </p>
                      </div>
                    </div>
                    {connectingWallet === 'metamask' && (
                      <div className="animate-spin h-5 w-5 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                    )}
                  </button>
                  
                  {/* Coinbase Wallet */}
                  <button
                    onClick={() => connectWithInjectedProvider('coinbase')}
                    disabled={isConnecting}
                    className={`relative flex items-center justify-between p-4 rounded-xl border ${
                      connectingWallet === 'coinbase'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
                    } transition-all`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="28" height="28" rx="6" fill="#0052FF"/>
                          <path d="M14.0001 23.3334C19.1547 23.3334 23.3334 19.1547 23.3334 14.0001C23.3334 8.84542 19.1547 4.66675 14.0001 4.66675C8.84542 4.66675 4.66675 8.84542 4.66675 14.0001C4.66675 19.1547 8.84542 23.3334 14.0001 23.3334Z" fill="white"/>
                          <path d="M11.9826 11.9826H16.0174V16.0174H11.9826V11.9826Z" fill="#0052FF"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900 dark:text-white">Coinbase Wallet</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Connectez via Coinbase Wallet
                        </p>
                      </div>
                    </div>
                    {connectingWallet === 'coinbase' && (
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                  </button>
                  
                  {/* Trust Wallet */}
                  <button
                    onClick={() => connectWithInjectedProvider('trust')}
                    disabled={isConnecting}
                    className={`relative flex items-center justify-between p-4 rounded-xl border ${
                      connectingWallet === 'trust'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
                    } transition-all`}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#0500FF"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4557 5.4865L8.45573 8.9865C7.84637 9.31298 7.46436 9.95363 7.46436 10.6435V21.3565C7.46436 22.0463 7.84637 22.687 8.45573 23.0135L14.4557 26.5135C15.0651 26.84 15.8289 26.84 16.4382 26.5135L22.4382 23.0135C23.0476 22.687 23.4296 22.0463 23.4296 21.3565V10.6435C23.4296 9.95363 23.0476 9.31298 22.4382 8.9865L16.4382 5.4865C15.8289 5.16002 15.0651 5.16002 14.4557 5.4865ZM15.447 19.8073C14.4547 19.8073 13.654 18.9658 13.654 17.9265C13.654 16.887 14.4547 16.0455 15.447 16.0455C16.4394 16.0455 17.2401 16.887 17.2401 17.9265C17.2401 18.9658 16.4394 19.8073 15.447 19.8073ZM19.0333 17.9265C19.0333 18.9658 19.8341 19.8073 20.8264 19.8073C21.8187 19.8073 22.6195 18.9658 22.6195 17.9265C22.6195 16.887 21.8187 16.0455 20.8264 16.0455C19.8341 16.0455 19.0333 16.887 19.0333 17.9265ZM10.0676 17.9265C10.0676 18.9658 10.8683 19.8073 11.8607 19.8073C12.853 19.8073 13.6538 18.9658 13.6538 17.9265C13.6538 16.887 12.853 16.0455 11.8607 16.0455C10.8683 16.0455 10.0676 16.887 10.0676 17.9265ZM15.447 25.1827C14.4547 25.1827 13.654 24.3412 13.654 23.3019C13.654 22.2625 14.4547 21.421 15.447 21.421C16.4394 21.421 17.2401 22.2625 17.2401 23.3019C17.2401 24.3412 16.4394 25.1827 15.447 25.1827ZM15.447 14.4318C14.4547 14.4318 13.654 13.5903 13.654 12.551C13.654 11.5116 14.4547 10.6701 15.447 10.6701C16.4394 10.6701 17.2401 11.5116 17.2401 12.551C17.2401 13.5903 16.4394 14.4318 15.447 14.4318Z" fill="white"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900 dark:text-white">Trust Wallet</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Wallet mobile et extension
                        </p>
                      </div>
                    </div>
                    {connectingWallet === 'trust' && (
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                  </button>
                </div>
                
                {/* Informations supplémentaires */}
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/70 rounded-lg text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Aucun wallet? <Link href="https://ethereum.org/wallets" target="_blank" className="text-primary-600 dark:text-primary-400 hover:underline">
                      Découvrez comment en installer un
                    </Link>
                  </p>
                </div>
              </div>
            )}
            
            {/* Onglet d'ajout manuel */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adresse Ethereum
                  </label>
                  <input
                    type="text"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom (optionnel)
                  </label>
                  <input
                    type="text"
                    value={manualWalletName}
                    onChange={(e) => setManualWalletName(e.target.value)}
                    placeholder="Mon wallet principal"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Réseau
                  </label>
                  <select
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value as NetworkType)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="eth">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="optimism">Optimism</option>
                    <option value="base">Base</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={handleAddManualWallet}
                    disabled={isConnecting || !manualAddress}
                    className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isConnecting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Ajout en cours...
                      </div>
                    ) : (
                      "Ajouter le wallet"
                    )}
                  </button>
                </div>
                
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 rounded-lg text-sm">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>
                      En ajoutant un wallet manuellement, vous pourrez voir les transactions mais pas signer de transactions.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;