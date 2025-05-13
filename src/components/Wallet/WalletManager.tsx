// src/components/Wallet/WalletManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { PlusIcon, TrashIcon, CheckIcon, ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { NetworkType, SUPPORTED_NETWORKS, getTransactions } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { toast } from 'react-hot-toast';

// Types
interface Wallet {
  id: string;
  address: string;
  name: string;
  network?: NetworkType;
  type: 'connected' | 'imported';
  balance?: string;
  lastSynced?: string;
  isPrimary?: boolean;
  tokens?: number;
}

interface ScanStatus {
  network: NetworkType;
  status: 'idle' | 'scanning' | 'completed' | 'error';
  message?: string;
  txCount?: number;
}

interface WalletManagerProps {
  onWalletsUpdate?: (wallets: Wallet[]) => void;
  onTransactionsLoaded?: (transactions: any[]) => void;
  className?: string;
}

const WalletManager: React.FC<WalletManagerProps> = ({
  onWalletsUpdate,
  onTransactionsLoaded,
  className = '',
}) => {
  // États
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isAddingWallet, setIsAddingWallet] = useState<boolean>(false);
  const [newWalletAddress, setNewWalletAddress] = useState<string>('');
  const [newWalletName, setNewWalletName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [scanStatuses, setScanStatuses] = useState<Record<string, ScanStatus>>({});
  const [isEthereumAvailable, setIsEthereumAvailable] = useState<boolean>(false);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);

  // Vérifier si Ethereum est disponible dans le navigateur
  useEffect(() => {
    const checkEthereum = () => {
      const isAvailable = typeof window !== 'undefined' && window.ethereum !== undefined;
      setIsEthereumAvailable(isAvailable);
    };
    
    checkEthereum();
    
    // Charger les wallets depuis le localStorage ou l'API
    loadWallets();
  }, []);

  // Charger les wallets depuis le storage ou l'API
  const loadWallets = async () => {
    try {
      // Essayer de charger depuis l'API d'abord
      const response = await fetch('/api/wallet');
      if (response.ok) {
        const data = await response.json();
        if (data.wallets && Array.isArray(data.wallets)) {
          setWallets(data.wallets);
          // Si un wallet est principal, le définir comme actif
          const primaryWallet = data.wallets.find((w: Wallet) => w.isPrimary);
          if (primaryWallet) {
            setActiveWalletId(primaryWallet.id);
          } else if (data.wallets.length > 0) {
            setActiveWalletId(data.wallets[0].id);
          }
          return;
        }
      }
      
      // Si l'API échoue, essayer localStorage
      const savedWallets = localStorage.getItem('bitax-wallets');
      if (savedWallets) {
        const parsedWallets = JSON.parse(savedWallets);
        setWallets(parsedWallets);
        // Si un wallet est principal, le définir comme actif
        const primaryWallet = parsedWallets.find((w: Wallet) => w.isPrimary);
        if (primaryWallet) {
          setActiveWalletId(primaryWallet.id);
        } else if (parsedWallets.length > 0) {
          setActiveWalletId(parsedWallets[0].id);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des wallets:', error);
      // Utiliser le localStorage comme fallback
      const savedWallets = localStorage.getItem('bitax-wallets');
      if (savedWallets) {
        const parsedWallets = JSON.parse(savedWallets);
        setWallets(parsedWallets);
        if (parsedWallets.length > 0) {
          setActiveWalletId(parsedWallets[0].id);
        }
      }
    }
  };

  // Sauvegarder les wallets dans le storage ou l'API
  const saveWallets = async (updatedWallets: Wallet[]) => {
    try {
      // Essayer de sauvegarder via l'API
      // Note: Normalement, vous utiliseriez POST pour un nouveau wallet et PUT pour mettre à jour
      // Par simplicité ici, on n'implémente pas la logique complète
      
      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem('bitax-wallets', JSON.stringify(updatedWallets));
      
      // Notifier le parent du changement
      if (onWalletsUpdate) {
        onWalletsUpdate(updatedWallets);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des wallets:', error);
      // Sauvegarder dans localStorage comme fallback
      localStorage.setItem('bitax-wallets', JSON.stringify(updatedWallets));
    }
  };

  // Connexion via Web3 (MetaMask, etc.)
  const connectWeb3Wallet = async () => {
    if (!isEthereumAvailable) {
      toast.error('Aucun portefeuille Web3 détecté. Veuillez installer MetaMask ou un autre portefeuille compatible.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const address = accounts[0];
        
        // Vérifier si le wallet existe déjà
        if (wallets.some(wallet => wallet.address.toLowerCase() === address.toLowerCase())) {
          toast.error('Ce wallet est déjà connecté');
          setIsLoading(false);
          return;
        }
        
        // Récupérer le solde initial
        const balance = await provider.getBalance(address);
        const formattedBalance = ethers.formatEther(balance);
        
        const newWallet: Wallet = {
          id: `wallet-${Date.now()}`,
          address,
          name: `Wallet ${wallets.length + 1}`,
          type: 'connected',
          network: 'eth',
          balance: formattedBalance,
          lastSynced: new Date().toISOString(),
          isPrimary: wallets.length === 0,
          tokens: 0,
        };
        
        const updatedWallets = [...wallets, newWallet];
        setWallets(updatedWallets);
        
        // Si c'est le premier wallet, le définir comme actif
        if (updatedWallets.length === 1) {
          setActiveWalletId(newWallet.id);
        }
        
        saveWallets(updatedWallets);
        toast.success('Wallet connecté avec succès');
        
        // Pré-scanner les transactions
        scanWalletTransactions(address, 'eth');
      }
    } catch (error: any) {
      console.error('Erreur lors de la connexion du wallet:', error);
      if (error.code === 4001) {
        toast.error('Vous avez refusé la connexion du wallet');
      } else {
        toast.error('Erreur lors de la connexion du wallet');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter manuellement un wallet
  const addManualWallet = () => {
    if (!newWalletAddress) {
      toast.error('Veuillez saisir une adresse de wallet valide');
      return;
    }
    
    // Vérifier si l'adresse est valide (format Ethereum)
    if (!ethers.isAddress(newWalletAddress)) {
      toast.error('Adresse de wallet invalide');
      return;
    }
    
    // Vérifier si le wallet existe déjà
    if (wallets.some(wallet => wallet.address.toLowerCase() === newWalletAddress.toLowerCase())) {
      toast.error('Ce wallet est déjà ajouté');
      return;
    }
    
    const walletName = newWalletName || `Wallet ${wallets.length + 1}`;
    
    const newWallet: Wallet = {
      id: `wallet-${Date.now()}`,
      address: newWalletAddress,
      name: walletName,
      type: 'imported',
      network: 'eth',
      lastSynced: new Date().toISOString(),
      isPrimary: wallets.length === 0,
      tokens: 0,
    };
    
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    
    // Si c'est le premier wallet, le définir comme actif
    if (updatedWallets.length === 1) {
      setActiveWalletId(newWallet.id);
    }
    
    saveWallets(updatedWallets);
    
    // Réinitialiser les champs
    setNewWalletAddress('');
    setNewWalletName('');
    setIsAddingWallet(false);
    
    toast.success('Wallet ajouté avec succès');
    
    // Scanner automatiquement les transactions
    scanWalletTransactions(newWalletAddress, 'eth');
  };

  // Supprimer un wallet
  const removeWallet = (walletId: string) => {
    const updatedWallets = wallets.filter(wallet => wallet.id !== walletId);
    
    // Si on supprime le wallet actif, sélectionner le premier de la liste
    if (activeWalletId === walletId && updatedWallets.length > 0) {
      setActiveWalletId(updatedWallets[0].id);
    } else if (updatedWallets.length === 0) {
      setActiveWalletId(null);
    }
    
    // Si on supprime le wallet principal, définir le premier comme principal
    if (wallets.find(w => w.id === walletId)?.isPrimary && updatedWallets.length > 0) {
      updatedWallets[0].isPrimary = true;
    }
    
    setWallets(updatedWallets);
    saveWallets(updatedWallets);
    toast.success('Wallet supprimé');
  };

  // Définir un wallet comme principal
  const setWalletAsPrimary = (walletId: string) => {
    const updatedWallets = wallets.map(wallet => ({
      ...wallet,
      isPrimary: wallet.id === walletId,
    }));
    
    setWallets(updatedWallets);
    setActiveWalletId(walletId);
    saveWallets(updatedWallets);
    toast.success('Wallet défini comme principal');
  };

  // Scanner les transactions d'un wallet sur un réseau spécifique
  const scanWalletTransactions = async (address: string, network: NetworkType) => {
    // Trouver l'ID du wallet à partir de l'adresse
    const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!wallet) return;
    
    const walletId = wallet.id;
    
    // Mettre à jour le statut du scan
    setScanStatuses(prev => ({
      ...prev,
      [`${walletId}-${network}`]: {
        network,
        status: 'scanning',
        message: `Scan de ${network} en cours...`,
      },
    }));
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      // Mettre à jour les transactions
      setTransactions(prev => {
        // Filtrer les anciennes transactions de cette adresse et ce réseau
        const filtered = prev.filter(tx => 
          tx.from_address.toLowerCase() !== address.toLowerCase() || 
          tx.network !== network
        );
        
        // Ajouter les nouvelles transactions
        return [...filtered, ...filteredTxs];
      });
      
      // Mettre à jour le statut du scan
      setScanStatuses(prev => ({
        ...prev,
        [`${walletId}-${network}`]: {
          network,
          status: 'completed',
          message: `${filteredTxs.length} transactions trouvées`,
          txCount: filteredTxs.length,
        },
      }));
      
      // Mettre à jour le wallet avec la date de synchronisation
      const updatedWallets = wallets.map(w => {
        if (w.id === walletId) {
          return {
            ...w,
            lastSynced: new Date().toISOString(),
            tokens: filteredTxs.reduce<string[]>((acc, tx) => {
              // Compter les tokens uniques (simpliste, à améliorer)
              if (tx.tokenSymbol && !acc.includes(tx.tokenSymbol)) {
                acc.push(tx.tokenSymbol);
              }
              return acc;
            }, []).length,
          };
        }
        return w;
      });
      
      setWallets(updatedWallets);
      saveWallets(updatedWallets);
      
      // Notifier le parent des transactions chargées
      if (onTransactionsLoaded) {
        onTransactionsLoaded(filteredTxs);
      }
      
      toast.success(`Scan de ${network} terminé avec ${filteredTxs.length} transactions`);
    } catch (error) {
      console.error(`Erreur lors du scan de ${address} sur ${network}:`, error);
      
      // Mettre à jour le statut du scan en cas d'erreur
      setScanStatuses(prev => ({
        ...prev,
        [`${walletId}-${network}`]: {
          network,
          status: 'error',
          message: `Erreur lors du scan: ${(error as Error).message || 'Erreur inconnue'}`,
        },
      }));
      
      toast.error(`Erreur lors du scan de ${network}`);
    }
  };

  // Scanner tous les wallets sur un réseau spécifique
  const scanAllWalletsOnNetwork = async (network: NetworkType) => {
    setIsLoading(true);
    
    const scanPromises = wallets.map(wallet => 
      scanWalletTransactions(wallet.address, network)
    );
    
    await Promise.all(scanPromises);
    
    setIsLoading(false);
  };

  // Scanner un wallet sur tous les réseaux
  const scanWalletOnAllNetworks = async (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;
    
    setIsSyncingAll(true);
    
    const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
    
    for (const network of networks) {
      await scanWalletTransactions(wallet.address, network);
    }
    
    setIsSyncingAll(false);
    toast.success('Synchronisation multi-réseaux terminée');
  };

  // Format d'adresse courte
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format de date relative
  const formatRelativeTime = (dateString: string): string => {
    if (!dateString) return 'Jamais';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'à l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `il y a ${hours} h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `il y a ${days} j`;
    }
  };

  return (
    <div className={`rounded-xl border border-gray-800/50 overflow-hidden ${className}`}>
      {/* En-tête */}
      <div className="bg-gray-800/30 border-b border-gray-800/50 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Mes Wallets</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingWallet(!isAddingWallet)}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1
                bg-gray-700 hover:bg-gray-600 text-white"
              disabled={isLoading}
            >
              <PlusIcon className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
            <button
              onClick={() => activeWalletId && scanWalletOnAllNetworks(activeWalletId)}
              className="px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1
                bg-primary-600 hover:bg-primary-700 text-white"
              disabled={isLoading || !activeWalletId || isSyncingAll}
            >
              {isSyncingAll ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  <span>Synchronisation...</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Tout synchroniser</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Formulaire d'ajout de wallet */}
      {isAddingWallet && (
        <div className="p-4 bg-gray-800/20 border-b border-gray-800/50">
          <h3 className="text-md font-medium text-white mb-3">Ajouter un wallet</h3>
          
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Adresse du wallet
                </label>
                <input
                  type="text"
                  value={newWalletAddress}
                  onChange={(e) => setNewWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nom (optionnel)
                </label>
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Mon wallet principal"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={addManualWallet}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex-grow"
                disabled={!newWalletAddress}
              >
                Ajouter manuellement
              </button>
              
              <button
                onClick={connectWeb3Wallet}
                className="px-4 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 flex-grow"
                disabled={!isEthereumAvailable}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10V3L4 14H7V21L16 10H13Z" fill="currentColor" />
                </svg>
                Connecter avec MetaMask
              </button>
              
              <button
                onClick={() => setIsAddingWallet(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Liste des wallets */}
      <div className="divide-y divide-gray-800/50">
        {wallets.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Aucun wallet connecté</h3>
            <p className="text-gray-400 mb-4">
              Ajoutez votre premier wallet pour commencer à analyser vos transactions.
            </p>
            <button
              onClick={() => setIsAddingWallet(true)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Ajouter un wallet
            </button>
          </div>
        ) : (
          wallets.map((wallet) => (
            <div 
              key={wallet.id}
              className={`p-4 transition-colors ${
                activeWalletId === wallet.id 
                  ? 'bg-primary-900/20 border-l-2 border-primary-500' 
                  : 'hover:bg-gray-800/20 border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex-grow cursor-pointer" 
                  onClick={() => setActiveWalletId(wallet.id)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-md font-medium text-white truncate">{wallet.name}</h3>
                        {wallet.isPrimary && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-900/40 text-primary-400 rounded-full border border-primary-700/40">
                            Principal
                          </span>
                        )}
                        {wallet.type === 'connected' && (
                          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-900/40 text-green-400 rounded-full border border-green-700/40 flex items-center">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                            Connecté
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="truncate">{formatAddress(wallet.address)}</span>
                        <span className="mx-2">•</span>
                        <span>Synchro: {wallet.lastSynced ? formatRelativeTime(wallet.lastSynced) : 'Jamais'}</span>
                        {wallet.tokens !== undefined && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{wallet.tokens} tokens</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  {!wallet.isPrimary && (
                    <button
                      onClick={() => setWalletAsPrimary(wallet.id)}
                      className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
                      title="Définir comme principal"
                    >
                      <CheckIcon className="w-5 h-5" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => activeWalletId === wallet.id && scanWalletTransactions(wallet.address, activeNetwork)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
                    title="Synchroniser"
                    disabled={isLoading}
                  >
                    <ArrowPathIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => removeWallet(wallet.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {activeWalletId === wallet.id && (
                <div className="mt-4 pt-4 border-t border-gray-800/30">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => {
                      const scanStatus = scanStatuses[`${wallet.id}-${network}`];
                      const isActive = activeNetwork === network;
                      
                      return (
                        <button
                          key={network}
                          onClick={() => {
                            setActiveNetwork(network);
                            if (!scanStatus || scanStatus.status === 'idle' || scanStatus.status === 'error') {
                              scanWalletTransactions(wallet.address, network);
                            }
                          }}
                          disabled={isLoading}
                          className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2
                            ${isActive 
                              ? 'text-white shadow-sm transform scale-105' 
                              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                          style={{
                            backgroundColor: isActive 
                              ? network === 'eth' ? '#3B82F6' 
                              : network === 'polygon' ? '#8B5CF6' 
                              : network === 'arbitrum' ? '#2563EB' 
                              : network === 'optimism' ? '#EF4444' 
                              : '#60A5FA' 
                              : undefined
                          }}
                        >
                          <NetworkIcon network={network} size={16} />
                          <span>{SUPPORTED_NETWORKS[network].name}</span>
                          
                          {scanStatus && (
                            <>
                              {scanStatus.status === 'scanning' && (
                                <svg className="animate-spin w-4 h-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              )}
                              
                              {scanStatus.status === 'completed' && scanStatus.txCount !== undefined && (
                                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium">
                                  {scanStatus.txCount}
                                </span>
                              )}
                              
                              {scanStatus.status === 'error' && (
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Afficher les détails du statut de scan pour le réseau actif */}
                  {scanStatuses[`${wallet.id}-${activeNetwork}`] && (
                    <div className={`text-sm p-3 rounded-lg ${
                      scanStatuses[`${wallet.id}-${activeNetwork}`].status === 'error'
                        ? 'bg-red-900/20 text-red-400 border border-red-900/30'
                        : scanStatuses[`${wallet.id}-${activeNetwork}`].status === 'completed'
                          ? 'bg-green-900/20 text-green-400 border border-green-900/30'
                          : 'bg-blue-900/20 text-blue-400 border border-blue-900/30'
                    }`}>
                      {scanStatuses[`${wallet.id}-${activeNetwork}`].message}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WalletManager;