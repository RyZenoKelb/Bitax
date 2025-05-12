// src/components/Wallet/WalletManager.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import WalletConnectModal from './WalletConnectModal';
import WalletListItem from './WalletListItem';
import { NetworkType } from '@/utils/transactions';
import { ethers } from 'ethers';

export interface Wallet {
  id: string;
  address: string;
  network: string;
  name: string | null;
  isPrimary: boolean;
  lastSync?: string;
  balance?: string;
}

interface WalletManagerProps {
  isPremium?: boolean;
  onWalletSelect?: (wallet: Wallet) => void;
  className?: string;
}

const WalletManager: React.FC<WalletManagerProps> = ({ 
  isPremium = false, 
  onWalletSelect,
  className = '' 
}) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});

  // Charger les wallets depuis l'API
  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/wallet');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des wallets');
      }
      const data = await response.json();
      setWallets(data.wallets || []);
      
      // Sélectionner le wallet primaire s'il existe
      const primaryWallet = data.wallets?.find((w: Wallet) => w.isPrimary);
      if (primaryWallet && onWalletSelect) {
        setSelectedWallet(primaryWallet);
        onWalletSelect(primaryWallet);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de charger vos wallets");
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un nouveau wallet (utilisé par le modal)
  const handleAddWallet = async (address: string, provider: ethers.BrowserProvider, network: NetworkType = 'eth', name?: string) => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          network,
          name: name || `Wallet ${wallets.length + 1}`,
          isPrimary: wallets.length === 0 // Premier wallet = primaire
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de l\'ajout du wallet');
      }

      const data = await response.json();
      toast.success("Wallet ajouté avec succès");
      
      // Recharger la liste complète pour s'assurer que tout est à jour
      fetchWallets();
      
      // Lancer immédiatement une synchronisation
      syncWallet(data.wallet.id, address, network);
      
      return data.wallet;
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || "Impossible d'ajouter le wallet");
      return null;
    }
  };

  // Supprimer un wallet
  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce wallet ?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du wallet');
      }

      toast.success("Wallet supprimé avec succès");
      
      // Mettre à jour la liste localement
      setWallets(prev => prev.filter(w => w.id !== walletId));
      
      // Si c'est le wallet sélectionné, réinitialiser
      if (selectedWallet?.id === walletId) {
        setSelectedWallet(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de supprimer le wallet");
    }
  };

  // Définir un wallet comme primaire
  const handleSetPrimary = async (walletId: string) => {
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrimary: true })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la définition du wallet primaire');
      }

      // Mettre à jour la liste localement
      setWallets(prev => prev.map(w => ({
        ...w,
        isPrimary: w.id === walletId
      })));
      
      // Mettre à jour le wallet sélectionné
      const newPrimary = wallets.find(w => w.id === walletId);
      if (newPrimary) {
        setSelectedWallet(newPrimary);
        if (onWalletSelect) onWalletSelect(newPrimary);
      }
      
      toast.success("Wallet défini comme principal");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de définir le wallet comme principal");
    }
  };

  // Modifier le nom d'un wallet
  const handleRenameWallet = async (walletId: string, newName: string) => {
    try {
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });

      if (!response.ok) {
        throw new Error('Erreur lors du renommage du wallet');
      }

      // Mettre à jour la liste localement
      setWallets(prev => prev.map(w => 
        w.id === walletId ? { ...w, name: newName } : w
      ));
      
      toast.success("Wallet renommé avec succès");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de renommer le wallet");
    }
  };

  // Synchroniser un wallet (récupérer les transactions)
  const syncWallet = async (walletId: string, address: string, network: string) => {
    // Marquer comme en cours de synchronisation
    setIsSyncing(prev => ({ ...prev, [walletId]: true }));
    
    try {
      const response = await fetch('/api/wallet/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletId,
          address,
          network,
          fullSync: true // Indique une synchronisation complète
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la synchronisation');
      }

      const data = await response.json();
      toast.success(`Synchronisation terminée: ${data.transactionCount} transactions`);
      
      // Mettre à jour les informations du wallet avec la dernière synchronisation
      setWallets(prev => prev.map(w => 
        w.id === walletId ? { 
          ...w, 
          lastSync: new Date().toISOString(),
          balance: data.balance || w.balance
        } : w
      ));
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.message || "Erreur lors de la synchronisation");
    } finally {
      // Fin de la synchronisation
      setIsSyncing(prev => ({ ...prev, [walletId]: false }));
    }
  };

  // Sélectionner un wallet
  const handleSelectWallet = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    if (onWalletSelect) onWalletSelect(wallet);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête et bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Mes wallets
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-sm btn-primary"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6v12m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Ajouter un wallet
        </button>
      </div>

      {/* Liste des wallets */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/40 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Aucun wallet</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ajoutez votre premier wallet crypto pour commencer
            </p>
            <div className="mt-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                Connecter un wallet
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {wallets.map((wallet) => (
              <WalletListItem
                key={wallet.id}
                wallet={wallet}
                isSelected={selectedWallet?.id === wallet.id}
                isSyncing={!!isSyncing[wallet.id]}
                isPremium={isPremium}
                onSelect={() => handleSelectWallet(wallet)}
                onDelete={() => handleDeleteWallet(wallet.id)}
                onRename={(newName) => handleRenameWallet(wallet.id, newName)}
                onSetPrimary={() => handleSetPrimary(wallet.id)}
                onSync={() => syncWallet(wallet.id, wallet.address, wallet.network)}
              />
            ))}
          </div>
        )}

        {/* Pour les utilisateurs premium: limite supérieure */}
        {!isPremium && wallets.length >= 3 && (
          <div className="mt-3 p-3 text-sm bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                Avec la version gratuite, vous êtes limité à 3 wallets. 
                <a href="/pricing" className="ml-1 text-primary-600 dark:text-primary-400 hover:underline">
                  Passez à Premium
                </a>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout de wallet */}
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onWalletConnect={handleAddWallet}
        existingWallets={wallets}
      />
    </div>
  );
};

export default WalletManager;