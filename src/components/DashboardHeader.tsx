// src/components/DashboardHeader.tsx
import React, { useState } from 'react';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import NetworkIcon from '@/components/NetworkIcon';

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

/**
 * En-tête amélioré pour le tableau de bord fiscal
 * Affiche les informations clés et les actions principales
 */
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
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  
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
  
  // Liste des réseaux principaux
  const mainNetworks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Tableau de bord fiscal
            </h1>
            
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                <span>{formatAddress(walletAddress)}</span>
              </div>
              
              {balance !== undefined && (
                <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{formatBalance(balance)}</span>
                </div>
              )}
              
              <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>{transactionCount} transactions</span>
              </div>
              
              {isPremiumUser && (
                <div className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span>Premium</span>
                </div>
              )}
              
              {lastUpdated && (
                <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Màj {lastUpdated.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Menu de sélection du réseau pour le scan */}
            {onScanRequest && (
              <div className="relative">
                <button 
                  onClick={() => setIsNetworkMenuOpen(!isNetworkMenuOpen)}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Scan en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Scanner</span>
                      <svg className="-mr-1 ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </>
                  )}
                </button>
                
                {isNetworkMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-1 max-h-96 overflow-y-auto" role="menu" aria-orientation="vertical">
                      <button
                        onClick={() => {
                          onScanRequest();
                          setIsNetworkMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Scan multi-blockchain automatique
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      {mainNetworks.map((network) => (
                        <button
                          key={network}
                          onClick={() => {
                            onScanRequest(network);
                            setIsNetworkMenuOpen(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          <div className="flex items-center">
                            <NetworkIcon network={network} size={20} className="mr-2" />
                            <span>Scanner {SUPPORTED_NETWORKS[network].name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Menu d'export */}
            {onExportReport && isPremiumUser && (
              <div className="relative">
                <button 
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200 dark:border-gray-700">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        onClick={() => {
                          onExportReport();
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span>Exporter en PDF</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onExportReport();
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Exporter en Excel</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          onExportReport();
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>Exporter en CSV</span>
                        </div>
                      </button>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={() => {
                          onExportReport();
                          setIsExportMenuOpen(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          <span>Rapport complet</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Barre de progression ou état */}
      {isLoading && (
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div className="h-1 bg-blue-600 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;