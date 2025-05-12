// src/app/wallets/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WalletManager, { Wallet } from '@/components/Wallet/WalletManager';
import TransactionSummary from '@/components/Dashboard/TransactionSummary';
import { toast } from 'react-toastify';

export default function WalletsPage() {
  const router = useRouter();
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isFetchingTransactions, setIsFetchingTransactions] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, string>>({});

  // Vérifier le statut premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setIsPremium(data.user?.isPremium || false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut premium:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, []);

  // Charger les transactions du wallet sélectionné
  useEffect(() => {
    if (selectedWallet) {
      fetchTransactions(selectedWallet.id);
      
      // Vérifier l'état de synchronisation toutes les 5 secondes
      const interval = setInterval(() => {
        checkSyncStatus(selectedWallet.id);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [selectedWallet]);

  // Récupérer les transactions d'un wallet
  const fetchTransactions = async (walletId: string) => {
    if (!walletId) return;
    
    setIsFetchingTransactions(true);
    try {
      const response = await fetch(`/api/wallet/transactions?walletId=${walletId}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des transactions");
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Impossible de charger les transactions");
    } finally {
      setIsFetchingTransactions(false);
    }
  };

  // Vérifier l'état de synchronisation d'un wallet
  const checkSyncStatus = async (walletId: string) => {
    try {
      const response = await fetch(`/api/wallet/sync?walletId=${walletId}`);
      if (!response.ok) {
        return;
      }
      
      const data = await response.json();
      
      setSyncStatus(prev => ({
        ...prev,
        [walletId]: data.syncStatus
      }));
      
      // Si la synchronisation vient de se terminer, recharger les transactions
      if (data.syncStatus === 'COMPLETED' && syncStatus[walletId] === 'SYNCING') {
        fetchTransactions(walletId);
        toast.success("Synchronisation terminée avec succès!");
      } else if (data.syncStatus === 'FAILED' && syncStatus[walletId] === 'SYNCING') {
        toast.error("La synchronisation a échoué");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de synchronisation:", error);
    }
  };

  // Gérer la sélection d'un wallet
  const handleWalletSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
  };

  // Synchroniser tous les wallets
  const syncAllWallets = async () => {
    // Cette fonction sera implémentée plus tard
    toast.info("Synchronisation de tous les wallets en cours...");
  };

  return (
    <div className="space-y-8">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des wallets
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ajoutez, gérez et synchronisez vos wallets crypto pour suivre vos actifs et vos transactions.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </Link>
          
          <button
            onClick={syncAllWallets}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tout synchroniser
          </button>
        </div>
      </div>
      
      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gestionnaire de wallets */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <WalletManager 
              isPremium={isPremium}
              onWalletSelect={handleWalletSelect}
            />
          </div>
        </div>
        
        {/* Détails du wallet sélectionné */}
        <div className="lg:col-span-2">
          {selectedWallet ? (
            <div className="space-y-6">
              {/* En-tête du wallet sélectionné */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      {selectedWallet.name || `Wallet ${selectedWallet.address.substring(0, 6)}...${selectedWallet.address.substring(selectedWallet.address.length - 4)}`}
                      {selectedWallet.isPrimary && (
                        <span className="ml-2 text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full">
                          Principal
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 font-mono mt-1">
                      {selectedWallet.address.substring(0, 10)}...{selectedWallet.address.substring(selectedWallet.address.length - 8)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                      syncStatus[selectedWallet.id] === 'SYNCING'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : syncStatus[selectedWallet.id] === 'COMPLETED'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : syncStatus[selectedWallet.id] === 'FAILED'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {syncStatus[selectedWallet.id] === 'SYNCING' && (
                        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {syncStatus[selectedWallet.id] === 'COMPLETED' && (
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {syncStatus[selectedWallet.id] === 'FAILED' && (
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {syncStatus[selectedWallet.id] || 'En attente'}
                    </div>
                    
                    <Link
                      href={`/transactions?wallet=${selectedWallet.id}`}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      Voir les transactions
                    </Link>
                  </div>
                </div>
                
                {selectedWallet.balance && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Balance:</span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedWallet.balance} {selectedWallet.network.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transactions du wallet */}
              {isFetchingTransactions ? (
                <div className="flex justify-center items-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  <p className="ml-4 text-gray-600 dark:text-gray-300">Chargement des transactions...</p>
                </div>
              ) : transactions.length > 0 ? (
                <>
                  <TransactionSummary 
                    transactions={transactions}
                    isPremiumUser={isPremium}
                  />
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Transactions récentes
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Montant
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              De
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              À
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {transactions.slice(0, 5).map((tx, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {new Date(tx.timestamp).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {tx.type || 'Transfer'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {tx.valueInETH || (Number(tx.value) / 1e18).toFixed(6)} {tx.tokenSymbol || selectedWallet.network.toUpperCase()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {tx.fromAddress.substring(0, 6)}...{tx.fromAddress.substring(tx.fromAddress.length - 4)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                {tx.toAddress.substring(0, 6)}...{tx.toAddress.substring(tx.toAddress.length - 4)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <Link
                        href={`/transactions?wallet=${selectedWallet.id}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium"
                      >
                        Voir toutes les transactions
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Aucune transaction trouvée</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Ce wallet n'a pas encore de transactions ou elles n'ont pas encore été synchronisées.
                  </p>
                  <button
                    onClick={() => fetchTransactions(selectedWallet.id)}
                    className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                  >
                    Synchroniser maintenant
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Sélectionnez un wallet</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Sélectionnez un wallet dans la liste pour voir ses détails et ses transactions, ou ajoutez-en un nouveau pour commencer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}