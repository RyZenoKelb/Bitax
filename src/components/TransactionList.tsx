// src/components/TransactionList.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { evaluateTransactionRisk } from '@/utils/SpamFilter';

interface Transaction {
  hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  input?: string;
  type: 'in' | 'out' | 'internal';
  tokenSymbol?: string;
  tokenDecimals?: number;
  valueInETH?: number;
  network: NetworkType;
}

interface TransactionListProps {
  transactions: Transaction[];
  isPremiumUser: boolean;
  className?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isPremiumUser,
  className = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [filterNetwork, setFilterNetwork] = useState<NetworkType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'value'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const transactionsPerPage = 10;
  
  // Formater l'adresse pour l'affichage
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Filtrer et trier les transactions
  const filteredAndSortedTransactions = transactions
    .filter(tx => {
      // Filtre de recherche
      if (searchTerm && !tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tx.from_address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tx.to_address.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(tx.tokenSymbol && tx.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }
      
      // Filtre par type
      if (filterType !== 'all' && tx.type !== filterType) {
        return false;
      }
      
      // Filtre par réseau
      if (filterNetwork !== 'all' && tx.network !== filterNetwork) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc'
          ? new Date(b.block_timestamp).getTime() - new Date(a.block_timestamp).getTime()
          : new Date(a.block_timestamp).getTime() - new Date(b.block_timestamp).getTime();
      } else {
        // Tri par valeur
        const valueA = a.valueInETH || 0;
        const valueB = b.valueInETH || 0;
        return sortOrder === 'desc' ? valueB - valueA : valueA - valueB;
      }
    });
  
  // Paginer les transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / transactionsPerPage);
  
  // Générer les numéros de page à afficher
  const pageNumbers = [];
  const maxPageNumbersToShow = 5;
  
  if (totalPages <= maxPageNumbersToShow) {
    // Afficher toutes les pages si elles sont peu nombreuses
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Sinon, afficher une sélection de pages avec les ellipses
    if (currentPage <= 3) {
      // Proche du début
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Proche de la fin
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Au milieu
      pageNumbers.push(1);
      pageNumbers.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('ellipsis');
      pageNumbers.push(totalPages);
    }
  }
  
  return (
    <div className={`bg-gray-800 rounded-xl border border-gray-700 shadow-md overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-white">Transactions</h3>
      </div>
      
      {/* Filtres et options de tri */}
      <div className="p-4 border-b border-gray-700 bg-gray-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full md:w-auto"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'in' | 'out')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="in">Entrées</option>
              <option value="out">Sorties</option>
            </select>
            
            <select
              value={filterNetwork}
              onChange={(e) => setFilterNetwork(e.target.value as NetworkType | 'all')}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">Tous les réseaux</option>
              {Object.entries(SUPPORTED_NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy as 'date' | 'value');
                setSortOrder(newSortOrder as 'asc' | 'desc');
              }}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date-desc">Date (récent d'abord)</option>
              <option value="date-asc">Date (ancien d'abord)</option>
              <option value="value-desc">Valeur (élevée d'abord)</option>
              <option value="value-asc">Valeur (faible d'abord)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tableau des transactions */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transaction</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">De</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vers</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Montant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Réseau</th>
              {isPremiumUser && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Risque</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
            {currentTransactions.length > 0 ? (
              currentTransactions.map((tx, index) => {
                // Calculer le score de risque
                const riskScore = evaluateTransactionRisk(tx);
                
                return (
                  <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(tx.block_timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                          tx.type === 'in' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                        } mr-2`}>
                          {tx.type === 'in' ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          )}
                        </span>
                        <a 
                          href={`${SUPPORTED_NETWORKS[tx.network].blockExplorer}/tx/${tx.hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {formatAddress(tx.hash)}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <a 
                        href={`${SUPPORTED_NETWORKS[tx.network].blockExplorer}/address/${tx.from_address}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 hover:underline"
                      >
                        {formatAddress(tx.from_address)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <a 
                        href={`${SUPPORTED_NETWORKS[tx.network].blockExplorer}/address/${tx.to_address}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 hover:underline"
                      >
                        {formatAddress(tx.to_address)}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={tx.type === 'in' ? 'text-green-400' : 'text-red-400'}>
                        {tx.type === 'in' ? '+' : '-'}{tx.valueInETH?.toFixed(6) || '0'} {tx.tokenSymbol || SUPPORTED_NETWORKS[tx.network].currencySymbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 uppercase">
                        {tx.network}
                      </span>
                    </td>
                    {isPremiumUser && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full" 
                              style={{ 
                                width: `${riskScore}%`,
                                backgroundColor: riskScore < 20 ? '#10B981' : riskScore < 50 ? '#F59E0B' : '#EF4444'
                              }}
                            ></div>
                          </div>
                          <span 
                            className={
                              riskScore < 20 ? 'text-green-400' : 
                              riskScore < 50 ? 'text-yellow-400' : 
                              'text-red-400'
                            }
                          >
                            {riskScore < 20 ? 'Faible' : riskScore < 50 ? 'Moyen' : 'Elevé'}
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={isPremiumUser ? 7 : 6} className="px-6 py-12 text-center text-gray-400">
                  {searchTerm || filterType !== 'all' || filterNetwork !== 'all' ? (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p>Aucune transaction ne correspond à vos critères de recherche.</p>
                      <button 
                        onClick={() => {
                          setSearchTerm('');
                          setFilterType('all');
                          setFilterNetwork('all');
                        }}
                        className="mt-3 text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p>Aucune transaction trouvée.</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {filteredAndSortedTransactions.length > 0 && (
        <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Affichage de <span className="font-medium text-white">{indexOfFirstTransaction + 1}</span>
            {' '}à{' '}
            <span className="font-medium text-white">
              {Math.min(indexOfLastTransaction, filteredAndSortedTransactions.length)}
            </span>
            {' '}sur{' '}
            <span className="font-medium text-white">{filteredAndSortedTransactions.length}</span> transactions
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-2 py-1 rounded ${
                currentPage === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="flex space-x-1">
              {pageNumbers.map((page, index) => (
                page === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${page}`}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-2 py-1 rounded ${
                currentPage === totalPages
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;