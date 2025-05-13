// src/components/Wallet/WalletCard.tsx
import React from 'react';
import { Wallet } from '@prisma/client';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';

interface WalletCardProps {
  wallet: Wallet;
  onDelete: () => void;
  onSetPrimary: () => void;
  onSync: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ wallet, onDelete, onSetPrimary, onSync }) => {
  // Formater l'adresse du wallet
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Formater la date de dernière synchronisation
  const formatLastSynced = (date: Date | null) => {
    if (!date) return 'Jamais';
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
  };
  
  // Déterminer le statut du wallet avec couleur et texte
  const getStatusInfo = () => {
    switch (wallet.status) {
      case 'synced':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          text: 'Synchronisé',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        };
      case 'pending':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20',
          text: 'En attente',
          icon: (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 3"/>
            </svg>
          ),
        };
      case 'error':
        return {
          color: 'text-red-500',
          bgColor: 'bg-red-500/20',
          text: 'Erreur',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        };
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/20',
          text: 'Non synchronisé',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ),
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className={`card relative overflow-hidden transition-all duration-300 hover:shadow-xl ${wallet.isPrimary ? 'border-primary-500/50' : ''}`}>
      {/* Badge "Principal" si le wallet est principal */}
      {wallet.isPrimary && (
        <div className="absolute top-3 right-3">
          <span className="badge badge-primary">Principal</span>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start">
          {/* Icône du réseau */}
          <div className="mr-4">
            <NetworkIcon network={wallet.network as NetworkType} size={48} />
          </div>
          
          {/* Informations du wallet */}
          <div className="flex-1">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold">{wallet.name || `Wallet ${wallet.network.toUpperCase()}`}</h3>
            </div>
            
            <div className="mt-1 flex items-center">
              <code className="text-sm bg-gray-800/50 px-2 py-1 rounded font-mono">
                {formatAddress(wallet.address)}
              </code>
              
              <button 
                onClick={() => navigator.clipboard.writeText(wallet.address)}
                className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
                title="Copier l'adresse"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M8 16H6C4.89543 16 4 15.1046 4 14V6C4 4.89543 4.89543 4 6 4H14C15.1046 4 16 4.89543 16 6V8M10 20H18C19.1046 20 20 19.1046 20 18V10C20 8.89543 19.1046 8 18 8H10C8.89543 8 8 8.89543 8 10V18C8 19.1046 8.89543 20 10 20Z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Statistiques */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Dernière synchronisation</p>
                <p className="text-sm font-medium">
                  {formatLastSynced(wallet.lastSynced)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Transactions</p>
                <p className="text-sm font-medium">
                  {wallet.transactionCount || 0}
                </p>
              </div>
            </div>
            
            {/* Statut */}
            <div className="mt-4 flex items-center">
              <div className={`${statusInfo.bgColor} p-1 rounded-md ${statusInfo.color} mr-2 flex items-center justify-center`}>
                {statusInfo.icon}
              </div>
              <span className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="border-t border-gray-800/40 p-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            onClick={onSync}
            disabled={wallet.status === 'pending'}
            className="btn btn-sm btn-outline flex items-center"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
              <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Synchroniser
          </button>
          
          {!wallet.isPrimary && (
            <button
              onClick={onSetPrimary}
              className="btn btn-sm btn-outline flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
                <path d="M5 3V7M3 5H7M6 17V21M4 19H8M13 3L15.2857 9.85714L21 12L15.2857 14.1429L13 21L10.7143 14.1429L5 12L10.7143 9.85714L13 3Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Définir par défaut
            </button>
          )}
        </div>
        
        <div>
          <button
            onClick={onDelete}
            className="btn btn-sm btn-outline-danger flex items-center"
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none">
              <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;