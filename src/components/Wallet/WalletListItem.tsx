// src/components/Wallet/WalletListItem.tsx
import React, { useState, useRef } from 'react';
import { Wallet } from './WalletManager';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface WalletListItemProps {
  wallet: Wallet;
  isSelected: boolean;
  isSyncing: boolean;
  isPremium: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onSetPrimary: () => void;
  onSync: () => void;
}

const NetworkIcon = ({ network }: { network: string }) => {
  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'eth': return '#627EEA';
      case 'polygon': return '#8247E5';
      case 'arbitrum': return '#28A0F0';
      case 'optimism': return '#FF0420';
      case 'base': return '#0052FF';
      default: return '#627EEA';
    }
  };

  const getNetworkName = (network: string) => {
    switch (network) {
      case 'eth': return 'Ethereum';
      case 'polygon': return 'Polygon';
      case 'arbitrum': return 'Arbitrum';
      case 'optimism': return 'Optimism';
      case 'base': return 'Base';
      default: return network;
    }
  };

  return (
    <div 
      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium"
      style={{ backgroundColor: getNetworkColor(network) }}
      title={getNetworkName(network)}
    >
      {network.substring(0, 1).toUpperCase()}
    </div>
  );
};

const WalletListItem: React.FC<WalletListItemProps> = ({
  wallet,
  isSelected,
  isSyncing,
  isPremium,
  onSelect,
  onDelete,
  onRename,
  onSetPrimary,
  onSync
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newName, setNewName] = useState(wallet.name || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Formater l'adresse du wallet pour l'affichage
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Gérer l'édition du nom
  const handleEditStart = () => {
    setIsEditing(true);
    setNewName(wallet.name || '');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleEditSave = () => {
    if (newName.trim() && newName !== wallet.name) {
      onRename(newName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  // Formatage de la date de dernière synchronisation
  const formatLastSync = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    
    try {
      const date = new Date(dateString);
      return `Il y a ${formatDistanceToNow(date, { locale: fr, addSuffix: false })}`;
    } catch (e) {
      return 'Date inconnue';
    }
  };

  // Fermer le menu lorsqu'on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`relative p-4 rounded-lg border-2 transition-all ${
        isSelected 
          ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 dark:border-primary-600' 
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3" onClick={onSelect}>
          {/* Icône du réseau */}
          <NetworkIcon network={wallet.network} />
          
          {/* Nom et adresse */}
          <div>
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleEditSave}
                onKeyDown={handleKeyDown}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nom du wallet"
              />
            ) : (
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                {wallet.name || `Wallet ${formatAddress(wallet.address)}`}
                {wallet.isPrimary && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded">
                    Principal
                  </span>
                )}
              </h3>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{formatAddress(wallet.address)}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Bouton de synchronisation */}
          <button
            onClick={onSync}
            disabled={isSyncing}
            className={`p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isSyncing ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            title="Synchroniser les transactions"
          >
            {isSyncing ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
          
          {/* Menu des actions */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      handleEditStart();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="inline-block w-4 h-4 mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Renommer
                  </button>
                  
                  {!wallet.isPrimary && (
                    <button
                      onClick={() => {
                        onSetPrimary();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="inline-block w-4 h-4 mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Définir comme principal
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      onDelete();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <svg className="inline-block w-4 h-4 mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Informations supplémentaires */}
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
        <span>
          Dernière synchronisation: {formatLastSync(wallet.lastSync)}
        </span>
        {wallet.balance && (
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {wallet.balance} {wallet.network.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default WalletListItem;