// src/components/Wallet/WalletsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { ethers } from 'ethers';
import { NetworkType, SUPPORTED_NETWORKS, NetworkConfig } from '@/utils/transactions';
import { Wallet } from '@prisma/client';
import WalletCard from './WalletCard';
import WalletConnectModal from './WalletConnectModal';
import NetworkIcon from '@/components/Visual/NetworkIcon';

interface WalletsDashboardProps {
  userId: string;
}

const WalletsDashboard: React.FC<WalletsDashboardProps> = ({ userId }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType>('eth');
  const [statusCounts, setStatusCounts] = useState({
    synced: 0,
    pending: 0,
    error: 0,
    total: 0
  });

  // Charger les wallets depuis l'API
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/wallet');
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des wallets');
        }
        
        const data = await response.json();
        setWallets(data.wallets || []);
        
        // Calculer les statistiques
        calculateStats(data.wallets || []);
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.message || 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWallets();
  }, [userId]);
  
  // Calculer les statistiques des wallets
  const calculateStats = (walletList: Wallet[]) => {
    const counts = {
      synced: 0,
      pending: 0,
      error: 0,
      total: walletList.length
    };
    
    walletList.forEach(wallet => {
      if (wallet.status === 'synced') counts.synced++;
      else if (wallet.status === 'pending') counts.pending++;
      else if (wallet.status === 'error') counts.error++;
    });
    
    setStatusCounts(counts);
  };
  
  // Ajouter un nouveau wallet
  const handleAddWallet = async (address: string, network: NetworkType, name?: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          network,
          name: name || `${network.toUpperCase()} Wallet`,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du wallet');
      }
      
      const data = await response.json();
      
      // Ajouter le nouveau wallet à la liste
      setWallets(prev => [...prev, data.wallet]);
      calculateStats([...wallets, data.wallet]);
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Erreur d\'ajout:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Supprimer un wallet
  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce wallet ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du wallet');
      }
      
      // Supprimer le wallet de la liste
      const updatedWallets = wallets.filter(w => w.id !== walletId);
      setWallets(updatedWallets);
      calculateStats(updatedWallets);
    } catch (err: any) {
      console.error('Erreur de suppression:', err);
      setError(err.message || 'Une erreur est survenue lors de la suppression du wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Marquer un wallet comme principal
  const handleSetPrimary = async (walletId: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/wallet?id=${walletId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPrimary: true }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du wallet');
      }
      
      // Mettre à jour la liste des wallets
      const updatedWallets = wallets.map(wallet => ({
        ...wallet,
        isPrimary: wallet.id === walletId,
      }));
      
      setWallets(updatedWallets);
    } catch (err: any) {
      console.error('Erreur de mise à jour:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Synchroniser un wallet
  const handleSyncWallet = async (walletId: string) => {
    try {
      setIsLoading(true);
      
      // Mettre à jour le statut du wallet en "pending"
      const updatedWallets = wallets.map(wallet => 
        wallet.id === walletId ? { ...wallet, status: 'pending' } : wallet
      );
      setWallets(updatedWallets);
      
      // TODO: Implémenter l'appel API pour synchroniser le wallet
      // Cette fonctionnalité sera implémentée plus tard
      
      // Simuler une synchronisation réussie après 2 secondes
      setTimeout(() => {
        const syncedWallets = wallets.map(wallet => 
          wallet.id === walletId ? { ...wallet, status: 'synced', lastSynced: new Date() } : wallet
        );
        setWallets(syncedWallets);
        calculateStats(syncedWallets);
        setIsLoading(false);
      }, 2000);
      
    } catch (err: any) {
      console.error('Erreur de synchronisation:', err);
      setError(err.message || 'Une erreur est survenue lors de la synchronisation du wallet');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec titre et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Vos <span className="text-gradient">wallets</span>
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Connectez vos wallets pour analyser automatiquement vos transactions et générer vos rapports fiscaux. 
            Bitax supporte les principales blockchains et wallets du marché.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary mt-4 sm:mt-0 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V15M9 12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ajouter un wallet
        </button>
      </div>
      
      {/* Statistiques des wallets */}
      {!isLoading && wallets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat-card flex items-center">
            <div className="mr-4 bg-blue-500/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
                <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="stat-title">Total wallets</p>
              <p className="stat-value">{statusCounts.total}</p>
            </div>
          </div>
          
          <div className="stat-card flex items-center">
            <div className="mr-4 bg-green-500/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="stat-title">Synchronisés</p>
              <p className="stat-value">{statusCounts.synced}</p>
            </div>
          </div>
          
          <div className="stat-card flex items-center">
            <div className="mr-4 bg-yellow-500/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-yellow-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="stat-title">En attente</p>
              <p className="stat-value">{statusCounts.pending}</p>
            </div>
          </div>
          
          <div className="stat-card flex items-center">
            <div className="mr-4 bg-red-500/20 p-3 rounded-xl">
              <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="stat-title">Erreurs</p>
              <p className="stat-value">{statusCounts.error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Message d'erreur */}
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
      
      {/* État de chargement */}
      {isLoading && !wallets.length && (
        <div className="card flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-primary-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-primary-400 font-medium">Chargement de vos wallets...</p>
          <p className="text-gray-400 text-sm mt-2">Veuillez patienter</p>
        </div>
      )}
      
      {/* Liste des wallets */}
      {!isLoading && wallets.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="none">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">Aucun wallet connecté</h3>
          <p className="text-gray-400 max-w-md mb-8">
            Ajoutez votre premier wallet pour commencer à analyser vos transactions et préparer votre déclaration fiscale.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary flex items-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V15M9 12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ajouter un wallet
          </button>
        </div>
      ) : (
        !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onDelete={() => handleDeleteWallet(wallet.id)}
                onSetPrimary={() => handleSetPrimary(wallet.id)}
                onSync={() => handleSyncWallet(wallet.id)}
              />
            ))}
          </div>
        )
      )}
      
      {/* Blocs d'informations supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card overflow-hidden">
          <div className="card-header flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-500" viewBox="0 0 24 24" fill="none">
              <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-lg font-semibold">Blockchains supportées</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(SUPPORTED_NETWORKS).map(([id, network]) => (
                <div key={id} className="flex items-center p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <NetworkIcon network={id as NetworkType} size={24} className="mr-3" />
                  <span className="font-medium">{network.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="card-header flex items-center">
            <svg className="w-5 h-5 mr-2 text-secondary-500" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="text-lg font-semibold">Wallets supportés</h3>
          </div>
          <div className="card-body">
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-orange-500/20 mr-3 flex items-center justify-center text-orange-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">MetaMask</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 mr-3 flex items-center justify-center text-blue-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">Coinbase Wallet</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-purple-500/20 mr-3 flex items-center justify-center text-purple-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">WalletConnect</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-500/20 mr-3 flex items-center justify-center text-green-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">Trust Wallet</span>
              </li>
              <li className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-500/20 mr-3 flex items-center justify-center text-gray-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6V12M12 12V18M12 12H18M12 12H6" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium text-gray-400">Et plus prochainement...</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Popup de connexion de wallet */}
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWallet={handleAddWallet}
        supportedNetworks={SUPPORTED_NETWORKS}
      />
    </div>
  );
};

export default WalletsDashboard;