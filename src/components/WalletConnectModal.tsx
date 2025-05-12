// src/components/WalletConnectModal.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import

// Types
interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, provider: any) => void;
}

interface WalletOption {
  id: string;
  name: string;
  description: string;
  logo: string;
  mobile: boolean;
  desktop: boolean;
}

// Liste des wallets populaires supportés par WalletConnect
const POPULAR_WALLETS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'La solution la plus populaire pour gérer vos actifs crypto',
    logo: '/wallets/metamask.svg',
    mobile: true,
    desktop: true
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    description: 'Wallet sécurisé et intuitif pour Ethereum et autres tokens',
    logo: '/wallets/rainbow.svg',
    mobile: true,
    desktop: false
  },
  {
    id: 'argent',
    name: 'Argent',
    description: 'Wallet Ethereum prenant en charge les smart contracts',
    logo: '/wallets/argent.svg',
    mobile: true,
    desktop: false
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    description: 'Le wallet mobile officiel de Binance',
    logo: '/wallets/trust.svg',
    mobile: true,
    desktop: false
  },
  {
    id: 'ledger',
    name: 'Ledger Live',
    description: 'Connectez votre hardware wallet Ledger pour plus de sécurité',
    logo: '/wallets/ledger.svg',
    mobile: true,
    desktop: true
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Wallet de l\'exchange Coinbase avec support DeFi',
    logo: '/wallets/coinbase.svg',
    mobile: true,
    desktop: true
  }
];

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [view, setView] = useState<'main' | 'qrcode' | 'recent'>('main');
  const [selectedWallet, setSelectedWallet] = useState<WalletOption | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [qrValue, setQrValue] = useState<string>('');
  const [recentWallets, setRecentWallets] = useState<string[]>([]);

  // Déterminer si l'appareil est mobile
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
      return false;
    };

    setIsMobile(checkMobile());
  }, []);

  // Charger les wallets récemment utilisés
  useEffect(() => {
    if (isOpen) {
      const recent = localStorage.getItem('bitax-recent-wallets');
      if (recent) {
        try {
          setRecentWallets(JSON.parse(recent));
        } catch (e) {
          console.error('Erreur lors du chargement des wallets récents:', e);
        }
      }
    }
  }, [isOpen]);

  // Simuler la connexion à WalletConnect
  const connectWallet = async (wallet: WalletOption) => {
    setSelectedWallet(wallet);
    setLoading(true);

    // Si mobile et le wallet est compatible mobile, rediriger vers le wallet
    if (isMobile && wallet.mobile) {
      // Simuler un deep linking
      toast.info(`Ouverture de ${wallet.name}...`);
      setLoading(false);
      onClose();
      return;
    }

    // Sinon, montrer le QR code
    setView('qrcode');
    
    // Simuler la génération d'un QR code
    // Dans une implémentation réelle, WalletConnect générerait une URI unique
    setTimeout(() => {
      setQrValue('wc:7a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t?bridge=https://bridge.walletconnect.org&key=abcdefg123456789');
      setLoading(false);
    }, 1000);
  };

  // Simuler une connexion réussie via QR code
  const simulateSuccessfulConnection = () => {
    // Adresse simulée
    const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    
    // Ajouter l'adresse aux wallets récents
    const updatedRecent = [...recentWallets];
    if (!updatedRecent.includes(address)) {
      updatedRecent.unshift(address);
      if (updatedRecent.length > 5) updatedRecent.pop();
      localStorage.setItem('bitax-recent-wallets', JSON.stringify(updatedRecent));
    }
    
    console.log('Wallet connecté avec succès!');
    onConnect(address, null); // Ici, provider serait un vrai provider dans l'implémentation réelle
    onClose();
  };

  // Formater une adresse pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="wallet-connect-modal" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 overflow-hidden transform transition-all">
          {/* Bouton fermer */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* En-tête */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {view === 'main' ? 'Connecter votre wallet' : 
               view === 'qrcode' ? 'Scanner le QR code' : 
               'Wallets récents'}
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {view === 'main' ? 'Choisissez votre méthode de connexion préférée' : 
               view === 'qrcode' ? `Scannez ce QR code avec ${selectedWallet?.name || 'votre wallet'}` : 
               'Se reconnecter rapidement à un wallet précédent'}
            </p>
          </div>
          
          {/* Contenu principal */}
          {view === 'main' && (
            <>
              {/* Wallets populaires */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Wallets populaires</h4>
                <div className="grid grid-cols-2 gap-3">
                  {POPULAR_WALLETS.slice(0, 4).map((wallet) => (
                    <button
                      key={wallet.id}
                      className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => connectWallet(wallet)}
                      disabled={loading}
                    >
                      <div className="w-12 h-12 mb-2 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {/* Ici, on utiliserait des vraies images de wallets */}
                        <span className="text-2xl">{wallet.id === 'metamask' ? '🦊' : 
                                                  wallet.id === 'rainbow' ? '🌈' : 
                                                  wallet.id === 'trust' ? '🛡️' : 
                                                  wallet.id === 'coinbase' ? '🔵' : 
                                                  wallet.id === 'ledger' ? '🔒' : 
                                                  wallet.id === 'argent' ? '💲' : '📱'}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{wallet.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Autres moyens de connexion */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Autres options</h4>
                <div className="space-y-2">
                  <button
                    className="flex items-center justify-between w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => setView('qrcode')}
                    disabled={loading}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">WalletConnect QR Code</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {recentWallets.length > 0 && (
                    <button
                      className="flex items-center justify-between w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      onClick={() => setView('recent')}
                      disabled={loading}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span className="text-gray-900 dark:text-white font-medium">Connexions récentes</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
          
          {/* Vue QR Code */}
          {view === 'qrcode' && (
            <div className="text-center">
              <div className="mb-6">
                {loading ? (
                  <div className="w-64 h-64 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : (
                  <>
                    {/* Dans une implémentation réelle, utilisez une bibliothèque QR code */}
                    <div className="w-64 h-64 mx-auto bg-white p-3 rounded-lg shadow-md" onClick={simulateSuccessfulConnection}>
                      <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                        <span className="text-sm text-gray-500">Cliquez pour simuler la connexion</span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      ou connectez-vous avec {selectedWallet?.name || 'un autre wallet'} mobile
                    </p>
                  </>
                )}
              </div>
              
              <button
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                onClick={() => setView('main')}
                disabled={loading}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            </div>
          )}
          
          {/* Vue connexions récentes */}
          {view === 'recent' && (
            <div>
              <div className="space-y-2 mb-6">
                {recentWallets.map((address, index) => (
                  <button
                    key={index}
                    className="flex items-center justify-between w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    onClick={() => simulateSuccessfulConnection()}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium font-mono">{formatAddress(address)}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
              
              <button
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                onClick={() => setView('main')}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </button>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Connexion sécurisée via WalletConnect v2
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;