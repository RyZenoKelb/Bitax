// src/pages/wallets.tsx
import { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { requireAuthSSR } from '@/lib/server-auth';
import WalletManager from '@/components/WalletManager';
import NetworkIcon from '@/components/NetworkIcon';
import { NetworkType } from '@/utils/transactions';

// Types
interface Wallet {
  id: string;
  address: string;
  network: string;
  name?: string;
  isPrimary: boolean;
}

export const getServerSideProps: GetServerSideProps = (context) =>
  requireAuthSSR(context);
  }
  
  return {
    props: {
      initialSession: session,
    },
  };
};

export default function WalletsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'securite' | 'transactions'>('general');
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  const handleWalletSelect = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    console.log(`Wallet ${wallet.name || formatAddress(wallet.address)} sélectionné`);
  };
  
  // Formatter une adresse pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des wallets</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Connectez et gérez vos wallets crypto pour analyser vos transactions.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="btn btn-outline"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gestionnaire de wallets */}
        <div className="lg:col-span-2">
          <WalletManager onWalletSelect={handleWalletSelect} />
          
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Astuces de sécurité</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Bitax ne stocke jamais vos clés privées</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Vos clés privées restent sur votre appareil et ne sont jamais partagées.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Méfiez-vous du phishing</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Ne partagez jamais votre phrase de récupération ou vos clés privées, même avec le support.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Utilisez WalletConnect pour plus de sécurité</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    WalletConnect permet une connexion sécurisée entre Bitax et votre wallet sans extension.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Informations détaillées */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">Informations</h2>
              
              {selectedWallet ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center mb-3">
                      <div className={`w-3 h-3 rounded-full bg-primary-500 animate-pulse mr-2`}></div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {selectedWallet.name || 'Wallet connecté'}
                      </h3>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg">
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Adresse</p>
                        <p className="font-mono text-sm break-all">{selectedWallet.address}</p>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Réseau par défaut</p>
                        <p className="flex items-center">
                          <NetworkIcon network={selectedWallet.network as NetworkType} size={18} className="mr-2" />
                          {selectedWallet.network.toUpperCase()}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                        <p className={`${selectedWallet.isPrimary ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`}>
                          {selectedWallet.isPrimary ? 'Wallet principal' : 'Wallet secondaire'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <ul className="flex border-b border-gray-200 dark:border-gray-700">
                      <li className="mr-2">
                        <button 
                          className={`inline-block p-2 border-b-2 rounded-t-lg ${
                            activeTab === 'general' 
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('general')}
                        >
                          Général
                        </button>
                      </li>
                      <li className="mr-2">
                        <button 
                          className={`inline-block p-2 border-b-2 rounded-t-lg ${
                            activeTab === 'transactions' 
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('transactions')}
                        >
                          Transactions
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`inline-block p-2 border-b-2 rounded-t-lg ${
                            activeTab === 'securite' 
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}
                          onClick={() => setActiveTab('securite')}
                        >
                          Sécurité
                        </button>
                      </li>
                    </ul>
                    
                    <div className="pt-4">
                      {activeTab === 'general' && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Ce wallet est utilisé pour analyser vos transactions crypto et générer des rapports fiscaux.
                          </p>
                          
                          <div className="mt-4">
                            <button
                              onClick={() => router.push(`/transactions?wallet=${selectedWallet.id}`)}
                              className="w-full btn btn-primary mb-2"
                            >
                              Analyser les transactions
                            </button>
                            <button
                              onClick={() => router.push(`/reports?wallet=${selectedWallet.id}`)}
                              className="w-full btn btn-outline"
                            >
                              Générer un rapport
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'transactions' && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            Résumé des dernières transactions de ce wallet.
                          </p>
                          
                          <div className="text-center py-6">
                            <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400">
                              Cliquez sur "Analyser les transactions" pour commencer.
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {activeTab === 'securite' && (
                        <div>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                            Conseils de sécurité pour ce wallet.
                          </p>
                          
                          <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">
                                Utilisez un hardware wallet pour plus de sécurité
                              </span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">
                                Vérifiez toujours les autorisations de connexion
                              </span>
                            </li>
                            <li className="flex items-start">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">
                                Déconnectez votre wallet après utilisation
                              </span>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucun wallet sélectionné</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Sélectionnez un wallet pour voir ses détails
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    Vous pouvez connecter plusieurs wallets et les gérer facilement ici
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}