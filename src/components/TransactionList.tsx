import React, { useState, useEffect, useMemo } from 'react';

interface Transaction {
  hash: string;
  block_timestamp: string;
  value: string;
  type: string;
  from_address?: string;
  to_address?: string;
  tokenSymbol?: string;
  valueInETH?: number;
}

interface TransactionListProps {
  transactions: Transaction[];
  isPremiumUser: boolean;
  onExportCSV?: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  isPremiumUser,
  onExportCSV 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('block_timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<{start: string, end: string}>({
    start: '',
    end: ''
  });
  const [valueRangeFilter, setValueRangeFilter] = useState<{min: string, max: string}>({
    min: '',
    max: ''
  });
  const [tokenFilter, setTokenFilter] = useState<string>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const itemsPerPage = 10;
  
  if (transactions.length === 0) {
    return null;
  }
  
  // Calculer toutes les valeurs uniques pour les filtres
  const uniqueTypes = useMemo(() => {
    return ['all', ...Array.from(new Set(transactions.map(tx => tx.type)))];
  }, [transactions]);
  
  const uniqueTokens = useMemo(() => {
    const tokens = new Set(transactions
      .filter(tx => tx.tokenSymbol)
      .map(tx => tx.tokenSymbol)
    );
    return ['all', 'ETH', ...Array.from(tokens)];
  }, [transactions]);
  
  // Calculer les dates min/max pour le sélecteur de plage
  const dateRange = useMemo(() => {
    const dates = transactions
      .filter(tx => tx.block_timestamp)
      .map(tx => new Date(tx.block_timestamp).getTime());
    
    if (dates.length === 0) return { min: '', max: '' };
    
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    return {
      min: minDate.toISOString().split('T')[0],
      max: maxDate.toISOString().split('T')[0]
    };
  }, [transactions]);
  
  // Effet pour réinitialiser la page lors du changement de filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, dateRangeFilter, valueRangeFilter, tokenFilter]);
  
  // Gérer la sélection de toutes les transactions visibles
  useEffect(() => {
    if (selectAll) {
      const visibleTxHashes = filteredTransactions.map(tx => tx.hash);
      setSelectedTransactions(new Set(visibleTxHashes));
    } else {
      setSelectedTransactions(new Set());
    }
  }, [selectAll]);

  // Filtrer les transactions en fonction de tous les critères
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Filtre de recherche
      const matchesSearch = searchTerm === '' || 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.tokenSymbol && tx.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
        tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.from_address && tx.from_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.to_address && tx.to_address.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtre par type
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      
      // Filtre par token
      const matchesToken = tokenFilter === 'all' || 
        (tokenFilter === 'ETH' && (!tx.tokenSymbol || tx.tokenSymbol === 'ETH')) ||
        (tx.tokenSymbol === tokenFilter);
      
      // Filtre par plage de dates
      const txDate = tx.block_timestamp ? new Date(tx.block_timestamp) : null;
      const matchesDateRange = !txDate ? true : (
        (dateRangeFilter.start === '' || txDate >= new Date(dateRangeFilter.start)) &&
        (dateRangeFilter.end === '' || txDate <= new Date(dateRangeFilter.end + 'T23:59:59'))
      );
      
      // Filtre par plage de valeurs
      const txValue = tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0);
      const minValue = valueRangeFilter.min === '' ? -Infinity : parseFloat(valueRangeFilter.min);
      const maxValue = valueRangeFilter.max === '' ? Infinity : parseFloat(valueRangeFilter.max);
      const matchesValueRange = txValue >= minValue && txValue <= maxValue;
      
      return matchesSearch && matchesType && matchesToken && matchesDateRange && matchesValueRange;
    });
  }, [
    transactions, 
    searchTerm, 
    typeFilter, 
    tokenFilter, 
    dateRangeFilter, 
    valueRangeFilter
  ]);
  
  // Trier les transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const fieldA = sortField === 'block_timestamp' ? new Date(a.block_timestamp || 0).getTime() : 
        sortField === 'value' ? (a.valueInETH || Number(a.value) / 1e18) : 
        a[sortField as keyof Transaction];
      
      const fieldB = sortField === 'block_timestamp' ? new Date(b.block_timestamp || 0).getTime() : 
        sortField === 'value' ? (b.valueInETH || Number(b.value) / 1e18) : 
        b[sortField as keyof Transaction];
        
      if (sortDirection === 'asc') {
        return String(fieldA).localeCompare(String(fieldB), undefined, {numeric: true});
      } else {
        return String(fieldB).localeCompare(String(fieldA), undefined, {numeric: true});
      }
    });
  }, [filteredTransactions, sortField, sortDirection]);
  
  // Pagination
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  // Calculer le nombre de transactions à afficher selon le statut premium
  const displayLimit = isPremiumUser ? sortedTransactions.length : Math.min(itemsPerPage, sortedTransactions.length);
  
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + displayLimit);
  
  // Fonction d'aide pour le tri
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Toggle sélection d'une transaction
  const toggleTransactionSelection = (hash: string) => {
    const newSelection = new Set(selectedTransactions);
    if (newSelection.has(hash)) {
      newSelection.delete(hash);
    } else {
      newSelection.add(hash);
    }
    setSelectedTransactions(newSelection);
    
    // Mettre à jour l'état selectAll
    if (newSelection.size === filteredTransactions.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };
  
  // Exporter les transactions sélectionnées
  const exportSelected = () => {
    if (selectedTransactions.size === 0) return;
    
    const selectedTxs = transactions.filter(tx => selectedTransactions.has(tx.hash));
    if (selectedTxs.length === 0) return;
    
    const headers = [
      'Hash',
      'Date',
      'Type',
      'Token',
      'Montant',
      'De',
      'À'
    ].join(',');
    
    const rows = selectedTxs.map(tx => [
      tx.hash,
      tx.block_timestamp ? new Date(tx.block_timestamp).toLocaleDateString() : '',
      tx.type || 'Inconnu',
      tx.tokenSymbol || 'ETH',
      tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0),
      tx.from_address || '',
      tx.to_address || ''
    ].join(','));
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
    const encodedUri = encodeURI(csvContent);
    
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions_selectionnees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Couleur de badge en fonction du type
  const getTypeColor = (type: string | undefined): string => {
    switch (type) {
      case 'Swap':
        return 'bg-blue-100 text-blue-800';
      case 'Token Transfer':
        return 'bg-green-100 text-green-800';
      case 'Native Transfer':
        return 'bg-purple-100 text-purple-800';
      case 'Smart Contract Interaction':
        return 'bg-purple-100 text-purple-800';
      case 'Simple Transfer':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format de lien en fonction du réseau
  const getExplorerLink = (hash: string) => {
    return `https://etherscan.io/tx/${hash}`;
  };

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Rechercher hash, token, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full md:w-80 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous les types' : type}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showAdvancedFilters ? 'Masquer' : 'Filtres avancés'} 
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showAdvancedFilters ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">
              {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
            </div>
            
            {isPremiumUser && (
              <div className="flex gap-2">
                <button
                  onClick={exportSelected}
                  disabled={selectedTransactions.size === 0}
                  className={`px-3 py-2 text-sm font-medium rounded-lg flex items-center gap-1 ${
                    selectedTransactions.size === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exporter ({selectedTransactions.size})
                </button>
                
                {onExportCSV && (
                  <button
                    onClick={onExportCSV}
                    className="px-3 py-2 text-sm font-medium rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Tout exporter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Filtres avancés */}
        {showAdvancedFilters && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
              <select
                value={tokenFilter}
                onChange={(e) => setTokenFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {uniqueTokens.map(token => (
                  <option key={token} value={token}>
                    {token === 'all' ? 'Tous les tokens' : token}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plage de dates</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRangeFilter.start}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => setDateRangeFilter({...dateRangeFilter, start: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="date"
                  value={dateRangeFilter.end}
                  min={dateRange.min}
                  max={dateRange.max}
                  onChange={(e) => setDateRangeFilter({...dateRangeFilter, end: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plage de montants</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  step="0.001"
                  value={valueRangeFilter.min}
                  onChange={(e) => setValueRangeFilter({...valueRangeFilter, min: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  step="0.001"
                  value={valueRangeFilter.max}
                  onChange={(e) => setValueRangeFilter({...valueRangeFilter, max: e.target.value})}
                  className="flex-1 border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="md:col-span-3 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setTokenFilter('all');
                  setDateRangeFilter({start: '', end: ''});
                  setValueRangeFilter({min: '', max: ''});
                  setSearchTerm('');
                }}
                className="px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                Appliquer
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Tableau des transactions */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {isPremiumUser && (
                <th className="px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={() => setSelectAll(!selectAll)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('hash')}
              >
                <div className="flex items-center">
                  Hash
                  {sortField === 'hash' && (
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('block_timestamp')}
              >
                <div className="flex items-center">
                  Date
                  {sortField === 'block_timestamp' && (
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center">
                  Montant
                  {sortField === 'value' && (
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center">
                  Type
                  {sortField === 'type' && (
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  )}
                </div>
              </th>
              {isPremiumUser && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx, index) => (
                <tr key={tx.hash || index} className="hover:bg-gray-100">
                  {isPremiumUser && (
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.has(tx.hash)}
                        onChange={() => toggleTransactionSelection(tx.hash)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={getExplorerLink(tx.hash)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                      {tx.hash ? `${tx.hash.slice(0, 10)}...` : 'Inconnu'}
                      <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {tx.block_timestamp ? (
                      <div className="flex flex-col">
                        <span>{new Date(tx.block_timestamp).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{new Date(tx.block_timestamp).toLocaleTimeString()}</span>
                      </div>
                    ) : 'Non disponible'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">
                      {tx.valueInETH !== undefined 
                        ? `${tx.valueInETH.toFixed(4)} ${tx.tokenSymbol || 'ETH'}`
                        : (tx.value ? (Number(tx.value) / 1e18).toFixed(4) + ' ETH' : '0.0000')}
                    </div>
                    {tx.from_address && tx.to_address && (
                      <div className="text-xs text-gray-500 mt-1">
                        {tx.from_address.substring(0, 6)}...{tx.from_address.substring(tx.from_address.length - 4)} → {tx.to_address.substring(0, 6)}...{tx.to_address.substring(tx.to_address.length - 4)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
                      {tx.type || 'Inconnu'}
                    </span>
                  </td>
                  {isPremiumUser && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button 
                          className="text-gray-400 hover:text-blue-600"
                          title="Voir les détails"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <a 
                          href={getExplorerLink(tx.hash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600"
                          title="Voir sur Etherscan"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isPremiumUser ? 6 : 4} className="px-6 py-10 text-center text-gray-500">
                  Aucune transaction ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && isPremiumUser && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-md ${
              currentPage === 1 
                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Précédent
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logique pour afficher les boutons de page autour de la page actuelle
              let pageToShow;
              if (totalPages <= 5) {
                pageToShow = i + 1;
              } else if (currentPage <= 3) {
                pageToShow = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageToShow = totalPages - 4 + i;
              } else {
                pageToShow = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageToShow}
                  onClick={() => setCurrentPage(pageToShow)}
                  className={`px-3 py-1 border rounded-md ${
                    currentPage === pageToShow
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageToShow}
                </button>
              );
            })}
            
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="px-3 py-1 border rounded-md text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-md ${
              currentPage === totalPages 
                ? 'text-gray-400 border-gray-200 cursor-not-allowed' 
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Suivant
          </button>
        </div>
      )}
      
      {/* Message Premium */}
      {!isPremiumUser && filteredTransactions.length > 10 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 text-center rounded-lg">
          <p className="text-yellow-700">
            <span className="font-medium">{filteredTransactions.length - 10}</span> transactions supplémentaires disponibles avec <span className="font-semibold">Bitax Premium</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;