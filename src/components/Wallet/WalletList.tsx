// src/components/Wallet/WalletList.tsx
import React, { useState } from 'react';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import WalletStatusBadge from './WalletStatusBadge';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

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

interface WalletListProps {
  wallets: Wallet[];
  onSync: (walletId: string) => void;
  onEdit: (walletId: string, updates: { name?: string; isPrimary?: boolean }) => void;
  onDelete: (walletId: string) => void;
  onSelect?: (walletId: string, selected: boolean) => void;
  selectedWallets?: string[];
  isSyncing?: boolean;
  syncingWalletId?: string | null;
}

const WalletList: React.FC<WalletListProps> = ({
  wallets,
  onSync,
  onEdit,
  onDelete,
  onSelect,
  selectedWallets = [],
  isSyncing = false,
  syncingWalletId = null,
}) => {
  const [showEditModal, setShowEditModal] = useState<string | null>(null);

  // Formatter la date "il y a X temps"
  const formatLastSynced = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true,
      locale: fr
    });
  };

  // Formater une adresse ethereum pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Ouvrir le modal d'édition
  const handleEdit = (walletId: string) => {
    const wallet = wallets.find(w => w.id === walletId);
    if (!wallet) return;
    
    const newName = prompt("Nouveau nom pour ce wallet:", wallet.name || '');
    if (newName !== null) {
      onEdit(walletId, { name: newName });
    }
  };

  // Confirmer la suppression d'un wallet
  const handleDelete = (walletId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce wallet ? Toutes les transactions associées seront également supprimées.')) {
      onDelete(walletId);
    }
  };

  return (
    <div className="overflow-x-auto">
      {wallets.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Aucun wallet trouvé</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
            Aucun wallet n'a été trouvé dans cette catégorie. Ajoutez des wallets pour commencer à suivre vos transactions crypto.
          </p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {onSelect && (
                <th scope="col" className="w-10 px-3 py-3 text-left">
                  <span className="sr-only">Sélectionner</span>
                </th>
              )}
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
                {onSelect && (
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
                      checked={selectedWallets.includes(wallet.id)}
                      onChange={(e) => onSelect(wallet.id, e.target.checked)}
                    />
                  </td>
                )}
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
                        {formatAddress(wallet.address)}
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
                    onClick={() => onSync(wallet.id)}
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
                    onClick={() => handleEdit(wallet.id)}
                    className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg"
                    title="Modifier"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  {!wallet.isPrimary && (
                    <button
                      onClick={() => onEdit(wallet.id, { isPrimary: true })}
                      className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg"
                      title="Définir comme wallet principal"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WalletList;