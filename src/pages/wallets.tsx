// src/pages/wallets.tsx
import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import WalletManager from '@/components/Wallet/WalletManager';
import TransactionSummary from '@/components/Dashboard/TransactionSummary';
import TaxDashboard from '@/components/Dashboard/TaxDashboard';
import WalletDetails from '@/components/Wallet/WalletDetails';
import { useEffect as reactUseEffect } from 'react';

interface Wallet {
  id: string;
  address: string;
  name: string;
  network?: string;
  type: 'connected' | 'imported';
  balance?: string;
  lastSynced?: string;
  isPrimary?: boolean;
  tokens?: number;
}

const WalletsPage: NextPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Utiliser useEffect pour s'assurer que le code ne s'exécute que côté client
  useEffect(() => {
    setIsMounted(true);
    
    // Vérifier le statut premium
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    // Charger les wallets depuis le localStorage
    const savedWallets = localStorage.getItem('bitax-wallets');
    if (savedWallets) {
      try {
        const parsedWallets = JSON.parse(savedWallets);
        setWallets(parsedWallets);
        
        // Définir le wallet actif
        const primaryWallet = parsedWallets.find((w: Wallet) => w.isPrimary);
        if (primaryWallet) {
          setActiveWalletId(primaryWallet.id);
        } else if (parsedWallets.length > 0) {
          setActiveWalletId(parsedWallets[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du parsing des wallets:', error);
      }
    }
  }, []);

  // Gestionnaire pour les transactions chargées
  const handleTransactionsLoaded = (newTransactions: any[]) => {
    setTransactions(prevTransactions => {
      // Fusionner les nouvelles transactions avec les anciennes
      // en évitant les doublons (par hash de transaction)
      const txHashes = new Set(prevTransactions.map(tx => tx.hash));
      const uniqueNewTxs = newTransactions.filter(tx => !txHashes.has(tx.hash));
      
      return [...prevTransactions, ...uniqueNewTxs];
    });
  };

  // Gestionnaire pour les wallets mis à jour
  const handleWalletsUpdate = (updatedWallets: Wallet[]) => {
    setWallets(updatedWallets);
    
    // Mettre à jour le wallet actif si nécessaire
    const primaryWallet = updatedWallets.find(w => w.isPrimary);
    if (primaryWallet) {
      setActiveWalletId(primaryWallet.id);
    } else if (updatedWallets.length > 0 && !activeWalletId) {
      setActiveWalletId(updatedWallets[0].id);
    } else if (updatedWallets.length === 0) {
      setActiveWalletId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Gestion des Wallets | Bitax</title>
        <meta name="description" content="Gérez vos wallets crypto et analysez vos transactions pour optimiser votre fiscalité." />
      </Head>

      <div className="space-y-8">
        {/* En-tête */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestion des <span className="text-gradient">Wallets</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            Connectez et gérez vos wallets crypto pour analyser vos transactions sur différentes blockchains et préparer votre déclaration fiscale.
          </p>
        </div>

        {/* Gestionnaire de wallets et détails */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne latérale avec le gestionnaire de wallet */}
          <div className="lg:col-span-1 space-y-6" data-wallet-manager>
            {isMounted && (
              <WalletManager 
                onTransactionsLoaded={handleTransactionsLoaded}
                onWalletsUpdate={handleWalletsUpdate}
              />
            )}
            
            {/* Informations supplémentaires */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800/50 p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                À propos des wallets
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm">
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">Sécurité :</span> Bitax ne stocke jamais vos clés privées. Les connexions sont sécurisées et les données sont chiffrées.
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">Multi-blockchain :</span> Analysez vos transactions sur Ethereum, Polygon, Arbitrum, Optimism et Base.
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-white">Import manuel :</span> Vous pouvez ajouter manuellement des adresses sans connecter votre wallet.
                </p>
                
                {/* Légende des statuts */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Légende des statuts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Wallet connecté via Web3</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span>Wallet importé manuellement</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>Wallet principal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {isMounted && activeWalletId && wallets.length > 0 ? (
              <>
                {/* Détails du wallet actif */}
                {wallets.find(w => w.id === activeWalletId) && (
                  <WalletDetails 
                    address={wallets.find(w => w.id === activeWalletId)?.address || ''}
                    transactions={transactions}
                  />
                )}
                
                {/* Résumé des transactions */}
                {transactions.length > 0 && (
                  <TransactionSummary 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                  />
                )}
                
                {/* Tableau de bord fiscal */}
                {transactions.length > 0 && (
                  <TaxDashboard 
                    transactions={transactions}
                    isPremiumUser={isPremiumUser}
                    walletAddress={wallets.find(w => w.id === activeWalletId)?.address || ''}
                  />
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800/50 p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Aucun wallet connecté</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Connectez un wallet et synchronisez vos transactions pour visualiser vos données fiscales.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      // Faire défiler vers le gestionnaire de wallet
                      const walletManagerElement = document.querySelector('[data-wallet-manager]');
                      if (walletManagerElement) {
                        walletManagerElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Ajouter un wallet</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* Section d'aide et FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-800/50 overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Foire Aux Questions
                </h3>
              </div>
              <div className="p-4 divide-y divide-gray-200 dark:divide-gray-700">
                <div className="py-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    Comment connecter mon wallet MetaMask ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Cliquez sur "Ajouter" puis "Connecter avec MetaMask". Vous devrez autoriser la connexion dans l'extension MetaMask.
                  </p>
                </div>
                <div className="py-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    Quelles blockchains sont supportées ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Bitax supporte actuellement Ethereum, Polygon, Arbitrum, Optimism et Base. D'autres réseaux seront ajoutés prochainement.
                  </p>
                </div>
                <div className="py-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    Mes clés privées sont-elles sécurisées ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Oui, Bitax ne stocke jamais vos clés privées. Les connexions se font via l'API Web3 standard, et vos clés restent dans votre wallet.
                  </p>
                </div>
                <div className="py-3">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                    Pourquoi certaines transactions n'apparaissent pas ?
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Bitax filtre automatiquement les transactions de spam pour ne montrer que les transactions pertinentes. Vous pouvez désactiver ce filtre dans les paramètres.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function useEffect(callback: () => void, dependencies: any[]) {
    reactUseEffect(callback, dependencies);
}

export default WalletsPage;

function useEffect(arg0: () => void, arg1: never[]) {
    throw new Error('Function not implemented.');
}
