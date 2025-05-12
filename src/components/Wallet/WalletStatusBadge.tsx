// src/components/Wallet/WalletStatusBadge.tsx
import React from 'react';

type WalletStatus = 'synced' | 'syncing' | 'error' | 'pending';

interface WalletStatusBadgeProps {
  status: WalletStatus;
  className?: string;
}

const WalletStatusBadge: React.FC<WalletStatusBadgeProps> = ({ status, className = '' }) => {
  let style = '';
  
  switch (status) {
    case 'synced':
      style = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      break;
    case 'syncing':
      style = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      break;
    case 'error':
      style = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      break;
    case 'pending':
    default:
      style = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      break;
  }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>
      {status === 'syncing' && (
        <svg className="w-3 h-3 mr-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {status === 'synced' && 'Synchronisé'}
      {status === 'syncing' && 'Synchronisation...'}
      {status === 'error' && 'Erreur'}
      {status === 'pending' && 'En attente'}
    </span>
  );
};

export default WalletStatusBadge;