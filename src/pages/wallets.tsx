// src/pages/wallets.tsx
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ethers } from 'ethers';
import { useSession } from 'next-auth/react';
import { requireAuth } from '@/lib/server-auth';
import { GetServerSideProps } from 'next';
import { Tab } from '@headlessui/react';
import { WalletType, Blockchain, SupportedNetwork } from '@/types/wallet';
import WalletList from '@/components/Wallet/WalletList';
import AddWalletModal from '@/components/Wallet/AddWalletModal';
import ImportFromExchangeModal from '@/components/Wallet/ImportFromExchangeModal';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import WalletStatusBadge from '@/components/Wallet/WalletStatusBadge';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

// Type pour les wallets
interface Wallet {
  id: string;
  address: string;
  network: string; 
  name: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  lastSynced?: string;
  status?: 'synced' | 'syncing' | 'error' | 'pending';
  balance?: string;
  transactions?: number;
}

export default function WalletsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddWalletModalOpen, setIsAddWalletModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedWallets, setSelectedWallets] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncingWalletId, setSyncingWalletId] = useState<string | null>(null);

  // Récupérer les wallets de l'utilisateur
  const fetchWallets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/wallet');
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des wallets');
      }
      
      const data = await response.json();
      setWallets(data.wallets.map((wallet: any) => ({
        ...wallet,
        // Convertir les dates en format lisible
        createdAt: new Date(wallet.createdAt).toISOString(),
        updatedAt: new Date(wallet.updatedAt).toISOString(),
        lastSynced: wallet.lastSynced ? new Date(wallet.lastSynced).toISOString() : undefined,
        // Ajouter status par défaut si non défini
        status: wallet.status || 'pending'
      })));
      
    } catch (err: any) {
      console.error('Erreur de chargement des wallets:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des wallets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les wallets au chargement de la page
  useEffect(() => {
    if (status === 'authenticated') {
      fetchWallets();
    }
  }, [status, fetchWallets]);

  // Ajouter un nouveau wallet
  const handleAddWallet = async (newWallet: { address: string; network: string; name?: string; isPrimary?: boolean }) => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWallet),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du wallet');
      }
      
      const data = await response.json();
      setWallets([...wallets, {
        ...data.wallet,
        createdAt: new Date(data.wallet.createdAt).toISOString(),
        updatedAt: new Date(data.wallet.updatedAt).toISOString(),
        status: 'pending'
      }]);
      
      toast.success('Wallet ajouté avec succès');
      setIsAddWalletModalOpen(false);
      
      // Si c'est marqué comme wallet principal et qu'il y en avait d'autres
      if (newWallet.isPrimary && wallets.some(w => w.isPrimary)) {
        // Mise à jour de l'état local
        setWallets(prev => prev.map(w => ({
          ...w,
          isPrimary: w.id === data.wallet.id
        })));
      }
      
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du wallet:', err);
      toast.error(err.message || 'Erreur lors de l\'ajout du wallet');
    }
  };

  // Mettre à jour un wallet
  const handleUpdateWallet = async (walletId: string, updates: { name?: string; isPrimary?: boolean }) => {
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du wallet');
      }
      
      const data = await response.json();
      
      // Mise à jour de l'état local
      setWallets(prev => {
        // Si on définit ce wallet comme principal, on désactive les autres
        if (updates.isPrimary) {
          return prev.map(w => ({
            ...w,
            isPrimary: w.id === walletId,
            updatedAt: w.id === walletId ? new Date(data.wallet.updatedAt).toISOString() : w.updatedAt,
            name: w.id === walletId ? data.wallet.name : w.name
          }));
        }
        
        return prev.map(w => 
          w.id === walletId 
            ? {
                ...w, 
                ...updates, 
                updatedAt: new Date(data.wallet.updatedAt).toISOString()
              } 
            : w
        );
      });
      
      toast.success('Wallet mis à jour avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du wallet:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour du wallet');
    }
  };

  // Supprimer un wallet
  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce wallet ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du wallet');
      }
      
      // Mise à jour de l'état local
      setWallets(prev => prev.filter(w => w.id !== walletId));
      
      // Désélectionner le wallet si sélectionné
      setSelectedWallets(prev => prev.filter(id => id !== walletId));
      
      toast.success('Wallet supprimé avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la suppression du wallet:', err);
      toast.error(err.message || 'Erreur lors de la suppression du wallet');
    }
  };

  // Synchroniser les transactions d'un wallet
  const handleSyncWallet = async (walletId: string) => {
    try {
      setIsSyncing(true);
      setSyncingWalletId(walletId);
      
      // Mettre à jour le statut du wallet en local
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? {...w, status: 'syncing'} 
          : w
      ));
      
      const response = await fetch(`/api/wallet/sync?id=${walletId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la synchronisation du wallet');
      }
      
      const data = await response.json();
      
      // Mettre à jour le statut du wallet
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? {
              ...w, 
              status: 'synced',
              lastSynced: new Date().toISOString(),
              transactions: data.transactionCount || w.transactions,
              balance: data.balance || w.balance
            } 
          : w
      ));
      
      toast.success('Wallet synchronisé avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la synchronisation du wallet:', err);
      toast.error(err.message || 'Erreur lors de la synchronisation du wallet');
      
      // Mettre à jour le statut en erreur
      setWallets(prev => prev.map(w => 
        w.id === walletId 
          ? {...w, status: 'error'} 
          : w
      ));
      
    } finally {
      setIsSyncing(false);
      setSyncingWalletId(null);
    }
  };

  // Synchroniser tous les wallets sélectionnés
  const handleSyncSelectedWallets = async () => {
    if (selectedWallets.length === 0) {
      toast.error('Aucun wallet sélectionné');
      return;
    }
    
    try {
      setIsSyncing(true);
      
      // Mettre à jour le statut des wallets en local
      setWallets(prev => prev.map(w => 
        selectedWallets.includes(w.id) 
          ? {...w, status: 'syncing'} 
          : w
      ));
      
      for (const walletId of selectedWallets) {
        setSyncingWalletId(walletId);
        
        const response = await fetch(`/api/wallet/sync?id=${walletId}`, {
          method: 'POST',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la synchronisation du wallet');
        }
        
        const data = await response.json();
        
        // Mettre à jour le statut du wallet
        setWallets(prev => prev.map(w => 
          w.id === walletId 
            ? {
                ...w, 
                status: 'synced',
                lastSynced: new Date().toISOString(),
                transactions: data.transactionCount || w.transactions,
                balance: data.balance || w.balance
              } 
            : w
        ));
      }
      
      toast.success('Wallets synchronisés avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la synchronisation des wallets:', err);
      toast.error(err.message || 'Erreur lors de la synchronisation des wallets');
      
    } finally {
      setIsSyncing(false);
      setSyncingWalletId(null);
    }
  };

  // Gérer la sélection des wallets
  const handleSelectWallet = (walletId: string) => {
    setSelectedWallets(prev => 
      prev.includes(walletId)
        ? prev.filter(id => id !== walletId)
        : [...prev, walletId]
    );
  };

  // Sélectionner/désélectionner tous les wallets
  const handleSelectAllWallets = () => {
    if (selectedWallets.length === wallets.length) {
      // Tout désélectionner
      setSelectedWallets([]);
    } else {
      // Tout sélectionner
      setSelectedWallets(wallets.map(w => w.id));
    }
  };

  // Formatter la date "il y a X temps"
  const formatLastSynced = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: fr
    });
  };

  // Grouper les wallets par réseau
  const walletsByNetwork = wallets.reduce((acc, wallet) => {
    const network = wallet.network || 'unknown';
    if (!acc[network]) {
      acc[network] = [];
    }
    acc[network].push(wallet);
    return acc;
  }, {} as Record<string, Wallet[]>);

  // Tabs pour les différentes sections
  const tabs = [
    { name: 'Tous les wallets', count: wallets.length },
    { name: 'Wallets connectés', count: wallets.filter(w => w.status === 'synced').length },
    { name: 'En attente', count: wallets.filter(w => w.status === 'pending').length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des Wallets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Ajoutez, connectez et synchronisez vos wallets crypto pour analyser vos transactions sur différentes blockchains.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddWalletModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ajouter un wallet
          </button>
          
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn-outline flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 14L12 17M12 17L15 14M12 17V9M12 3V4M9.17157 5.17157L8.81802 4.81802M5.17157 9.17157L4.81802 8.81802M19.182 8.81802L18.8284 9.17157M19 12H20M15.182 5.82843L15.5355 5.47487" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19L20 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Importer depuis un exchange
          </button>
        </div>
      </div>

      {/* Section principale avec tabs et liste des wallets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tab.Group onChange={setSelectedTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700">
            <Tab.List className="flex overflow-x-auto p-1 border-b border-gray-200 dark:border-gray-700 sm:border-b-0">
              {tabs.map((tab, index) => (
                <Tab 
                  key={index}
                  className={({ selected }) =>
                    `px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                      selected 
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`
                  }
                >
                  {tab.name}
                  <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                </Tab>
              ))}
            </Tab.List>
            
            {/* Actions pour les wallets sélectionnés */}
            <div className="flex items-center p-2 border-t border-gray-200 dark:border-gray-700 sm:border-t-0">
              <button
                disabled={selectedWallets.length === 0 || isSyncing}
                onClick={handleSyncSelectedWallets}
                className={`mr-2 text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                  selectedWallets.length === 0 || isSyncing
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-800/40'
                }`}
              >
                {isSyncing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Synchronisation...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Synchroniser ({selectedWallets.length})</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleSelectAllWallets}
                className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg flex items-center gap-1.5"
              >
                {selectedWallets.length === wallets.length ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Désélectionner tout</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
                    </svg>
                    <span>Sélectionner tout</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          <Tab.Panels>
            {/* Panel pour tous les wallets */}
            <Tab.Panel>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Chargement des wallets...</p>
                  </div>
                </div>
              ) : wallets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun wallet ajouté</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                    Vous n'avez pas encore ajouté de wallet. Cliquez sur "Ajouter un wallet" pour commencer à tracker vos crypto-monnaies.
                  </p>
                  <button
                    onClick={() => setIsAddWalletModalOpen(true)}
                    className="mt-4 btn-primary"
                  >
                    Ajouter un wallet
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="w-10 px-3 py-3 text-left">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                            checked={selectedWallets.length === wallets.length && wallets.length > 0}
                            onChange={handleSelectAllWallets}
                          />
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Wallet
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Réseau
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Statut
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Dernière sync
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Transactions
                        </th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {wallets.map(wallet => (
                        <tr 
                          key={wallet.id} 
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                            syncingWalletId === wallet.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                              checked={selectedWallets.includes(wallet.id)}
                              onChange={() => handleSelectWallet(wallet.id)}
                            />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                wallet.isPrimary ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {wallet.isPrimary ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{wallet.name || 'Wallet sans nom'}</p>
                                  {wallet.isPrimary && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      Principal
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                  {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <NetworkIcon network={wallet.network as NetworkType} size={20} className="mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {SUPPORTED_NETWORKS[wallet.network as NetworkType]?.name || wallet.network}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <WalletStatusBadge status={wallet.status || 'pending'} />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatLastSynced(wallet.lastSynced)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {wallet.transactions || '–'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleSyncWallet(wallet.id)}
                              disabled={wallet.status === 'syncing' || isSyncing}
                              className={`p-1.5 rounded-lg ${
                                wallet.status === 'syncing' || isSyncing
                                  ? 'text-gray-400 cursor-not-allowed dark:text-gray-500'
                                  : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                              }`}
                              title="Synchroniser"
                            >
                              {wallet.status === 'syncing' ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                // Ouvrir modal d'édition
                                // Pour l'instant on fait juste un prompt
                                const newName = prompt("Nouveau nom pour ce wallet:", wallet.name || '');
                                if (newName !== null) {
                                  handleUpdateWallet(wallet.id, { name: newName });
                                }
                              }}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteWallet(wallet.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {!wallet.isPrimary && (
                              <button
                                onClick={() => handleUpdateWallet(wallet.id, { isPrimary: true })}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg"
                                title="Définir comme wallet principal"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
            
            {/* Panel pour les wallets connectés */}
            <Tab.Panel>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Chargement des wallets...</p>
                  </div>
                </div>
              ) : wallets.filter(w => w.status === 'synced').length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun wallet connecté</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                    Vous n'avez pas encore synchronisé de wallet. Synchronisez vos wallets pour voir leurs transactions ici.
                  </p>
                  {wallets.length > 0 && (
                    <button
                      onClick={() => setSelectedTab(0)}
                      className="mt-4 btn-primary"
                    >
                      Voir tous les wallets
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="w-10 px-3 py-3 text-left">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                            checked={selectedWallets.length === wallets.filter(w => w.status === 'synced').length && wallets.filter(w => w.status === 'synced').length > 0}
                            onChange={() => {
                              const syncedWalletIds = wallets.filter(w => w.status === 'synced').map(w => w.id);
                              if (selectedWallets.length === syncedWalletIds.length) {
                                setSelectedWallets(prev => prev.filter(id => !syncedWalletIds.includes(id)));
                              } else {
                                setSelectedWallets(prev => [...new Set([...prev, ...syncedWalletIds])]);
                              }
                            }}
                          />
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Wallet
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Réseau
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Statut
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Dernière sync
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Transactions
                        </th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {wallets.filter(w => w.status === 'synced').map(wallet => (
                        <tr 
                          key={wallet.id} 
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                            syncingWalletId === wallet.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                              checked={selectedWallets.includes(wallet.id)}
                              onChange={() => handleSelectWallet(wallet.id)}
                            />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                wallet.isPrimary ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {wallet.isPrimary ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{wallet.name || 'Wallet sans nom'}</p>
                                  {wallet.isPrimary && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      Principal
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                  {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <NetworkIcon network={wallet.network as NetworkType} size={20} className="mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {SUPPORTED_NETWORKS[wallet.network as NetworkType]?.name || wallet.network}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <WalletStatusBadge status={wallet.status || 'pending'} />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatLastSynced(wallet.lastSynced)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {wallet.transactions || '–'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleSyncWallet(wallet.id)}
                              disabled={wallet.status === 'syncing' || isSyncing}
                              className={`p-1.5 rounded-lg ${
                                wallet.status === 'syncing' || isSyncing
                                  ? 'text-gray-400 cursor-not-allowed dark:text-gray-500'
                                  : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                              }`}
                              title="Synchroniser"
                            >
                              {wallet.status === 'syncing' ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                // Ouvrir modal d'édition
                                // Pour l'instant on fait juste un prompt
                                const newName = prompt("Nouveau nom pour ce wallet:", wallet.name || '');
                                if (newName !== null) {
                                  handleUpdateWallet(wallet.id, { name: newName });
                                }
                              }}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteWallet(wallet.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {!wallet.isPrimary && (
                              <button
                                onClick={() => handleUpdateWallet(wallet.id, { isPrimary: true })}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg"
                                title="Définir comme wallet principal"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
            
            {/* Panel pour les wallets en attente */}
            <Tab.Panel>
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 dark:text-gray-400">Chargement des wallets...</p>
                  </div>
                </div>
              ) : wallets.filter(w => w.status === 'pending').length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun wallet en attente</h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
                    Tous vos wallets ont été synchronisés. Ajoutez de nouveaux wallets ou consultez vos wallets synchronisés.
                  </p>
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => setIsAddWalletModalOpen(true)}
                      className="btn-primary"
                    >
                      Ajouter un wallet
                    </button>
                    <button
                      onClick={() => setSelectedTab(1)}
                      className="btn-outline"
                    >
                      Voir les wallets connectés
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="w-10 px-3 py-3 text-left">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                            checked={selectedWallets.length === wallets.filter(w => w.status === 'pending').length && wallets.filter(w => w.status === 'pending').length > 0}
                            onChange={() => {
                              const pendingWalletIds = wallets.filter(w => w.status === 'pending').map(w => w.id);
                              if (selectedWallets.length === pendingWalletIds.length) {
                                setSelectedWallets(prev => prev.filter(id => !pendingWalletIds.includes(id)));
                              } else {
                                setSelectedWallets(prev => [...new Set([...prev, ...pendingWalletIds])]);
                              }
                            }}
                          />
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Wallet
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Réseau
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Statut
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Dernière sync
                        </th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Transactions
                        </th>
                        <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {wallets.filter(w => w.status === 'pending').map(wallet => (
                        <tr 
                          key={wallet.id} 
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                            syncingWalletId === wallet.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <td className="px-3 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                              checked={selectedWallets.includes(wallet.id)}
                              onChange={() => handleSelectWallet(wallet.id)}
                            />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                wallet.isPrimary ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                              }`}>
                                {wallet.isPrimary ? (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{wallet.name || 'Wallet sans nom'}</p>
                                  {wallet.isPrimary && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                      Principal
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                  {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <NetworkIcon network={wallet.network as NetworkType} size={20} className="mr-2" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {SUPPORTED_NETWORKS[wallet.network as NetworkType]?.name || wallet.network}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <WalletStatusBadge status={wallet.status || 'pending'} />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatLastSynced(wallet.lastSynced)}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {wallet.transactions || '–'}
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleSyncWallet(wallet.id)}
                              disabled={wallet.status === 'syncing' || isSyncing}
                              className={`p-1.5 rounded-lg ${
                                wallet.status === 'syncing' || isSyncing
                                  ? 'text-gray-400 cursor-not-allowed dark:text-gray-500'
                                  : 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                              }`}
                              title="Synchroniser"
                            >
                              {wallet.status === 'syncing' ? (
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                // Ouvrir modal d'édition
                                // Pour l'instant on fait juste un prompt
                                const newName = prompt("Nouveau nom pour ce wallet:", wallet.name || '');
                                if (newName !== null) {
                                  handleUpdateWallet(wallet.id, { name: newName });
                                }
                              }}
                              className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg"
                              title="Modifier"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteWallet(wallet.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                              title="Supprimer"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            {!wallet.isPrimary && (
                              <button
                                onClick={() => handleUpdateWallet(wallet.id, { isPrimary: true })}
                                className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg"
                                title="Définir comme wallet principal"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      
      {/* Modal pour ajouter un wallet */}
      {isAddWalletModalOpen && (
        <AddWalletModal 
          onAdd={handleAddWallet}
          onClose={() => setIsAddWalletModalOpen(false)}
          hasPrimaryWallet={wallets.some(w => w.isPrimary)}
        />
      )}
      
      {/* Modal pour importer depuis un exchange */}
      {isImportModalOpen && (
        <ImportFromExchangeModal 
          onImport={() => {}}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // S'assurer que l'utilisateur est authentifié
  const session = await requireAuth();
  
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  return {
    props: {},
  };
};