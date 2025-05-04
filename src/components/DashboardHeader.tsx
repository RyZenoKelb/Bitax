// src/components/DashboardHeader.tsx
import React, { useState } from 'react';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';

interface DashboardHeaderProps {
  walletAddress: string;
  balance?: number;
  balanceCurrency?: string;
  transactionCount: number;
  isPremiumUser: boolean;
  onScanRequest?: (network?: NetworkType) => void;
  onExportReport?: () => void;
  isLoading?: boolean;
  lastUpdated?: Date;
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  walletAddress,
  balance,
  balanceCurrency = 'EUR',
  transactionCount,
  isPremiumUser,
  onScanRequest,
  onExportReport,
  isLoading = false,
  lastUpdated,
  className = '',
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  
  // Formater l'adresse du wallet pour l'affichage
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Formater le solde avec la devise
  const formatBalance = (amount?: number) => {
    if (amount === undefined) return '—';
    
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: balanceCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Formater la date de dernière mise à jour
  const formatLastUpdated = (date?: Date) => {
    if (!date) return '';
    return `Dernière maj. ${date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };
  
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-xl ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <span className="h-5 w-5 rounded-full bg-green-400 animate-pulse"></span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Tableau de Bord Fiscal
                </h1>
                <p className="text-blue-100 text-sm">
                  {formatAddress(walletAddress)}
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Solde */}
              {balance !== undefined && (
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-100">Solde du wallet</p>
                      <p className="text-lg font-semibold text-white">{formatBalance(balance)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Transactions */}
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-white/10 p-2.5">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-blue-100">Transactions</p>
                    <p className="text-lg font-semibold text-white">{transactionCount}</p>
                  </div>
                </div>
              </div>
              
              {/* Statut Premium */}
              {isPremiumUser && (
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 p-2.5">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-100">Statut</p>
                      <p className="text-lg font-semibold text-white">Premium</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dernière mise à jour */}
              {lastUpdated && (
                <div className="rounded-xl bg-white/10 backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-white/10 p-2.5">
                      <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-blue-100">Dernière maj.</p>
                      <p className="text-sm font-medium text-white">{formatLastUpdated(lastUpdated)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            {onScanRequest && (
              <button 
                onClick={() => onScanRequest()}
                disabled={isLoading}
                className="inline-flex items-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Synchronisation...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Synchroniser</span>
                  </>
                )}
              </button>
            )}
            
            {/* Export menu */}
            {onExportReport && isPremiumUser && (
              <div className="relative">
                <button 
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="inline-flex items-center rounded-xl bg-white px-6 py-2.5 text-sm font-medium text-blue-600 shadow-lg transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Exporter</span>
                  <svg className="-mr-1 ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                    <button
                      onClick={() => {
                        onExportReport();
                        setIsExportMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Exporter en PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        onExportReport();
                        setIsExportMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Exporter en Excel</span>
                    </button>
                    <button
                      onClick={() => {
                        onExportReport();
                        setIsExportMenuOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      <span>Exporter en CSV</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barre de chargement */}
      {isLoading && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <div className="h-full w-full bg-gradient-to-r from-white to-blue-200 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;