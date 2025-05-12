import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart, ComposedChart
} from 'recharts';

interface Transaction {
  value: string;
  type?: string;
  block_timestamp?: string;
  tokenSymbol?: string;
  valueInETH?: number;
}

interface TransactionSummaryProps {
  transactions: Transaction[];
  isPremiumUser?: boolean;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({ 
  transactions,
  isPremiumUser = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'tokens'>('overview');
  const [timeRange, setTimeRange] = useState<'all' | '30d' | '90d' | '1y'>('all');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  
  // Détection du thème
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDarkMode ? 'dark' : 'light');
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setCurrentTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  
  if (transactions.length === 0) {
    return null;
  }

  // Calculer les valeurs totales
  const totalValue = transactions.reduce((sum, tx) => {
    const ethValue = tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0);
    return sum + ethValue;
  }, 0);

  const averageValue = totalValue / transactions.length;

  // Compter les types de transactions
  const typeCounts: Record<string, number> = {};
  transactions.forEach(tx => {
    const type = tx.type || 'Unknown';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  // Calculer les pourcentages par type
  const typePercentages = Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: (count / transactions.length) * 100
  }));

  // Trier par nombre décroissant
  typePercentages.sort((a, b) => b.count - a.count);

  // Préparer les données pour le graphique en camembert
  const pieChartData = typePercentages.map(item => ({
    name: item.type,
    value: item.count
  }));

  // Définir les couleurs pour le graphique en fonction des types
  const getTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'Token Transfer': '#3b82f6', // blue
      'Simple Transfer': '#06b6d4', // cyan
      'Smart Contract Interaction': '#6366f1', // indigo
      'Token Approval': '#f59e0b', // amber
      'Swap': '#8b5cf6', // violet
      'Native Transfer': '#2563eb', // blue-600
      'NFT Marketplace': '#9333ea', // purple-600
      'Unknown': '#9ca3af', // gray-400
      'DEX Interaction': '#ec4899', // pink-500
      'Deposit': '#10b981', // emerald-500
      'Withdrawal': '#f43f5e' // rose-500
    };
    
    return colorMap[type] || '#9ca3af';
  };

  // Préparer les données pour l'activité mensuelle
  const monthlyActivity: Record<string, number> = {};
  let oldestDate = new Date();
  let newestDate = new Date(0);
  
  transactions.forEach(tx => {
    if (tx.block_timestamp) {
      const date = new Date(tx.block_timestamp);
      if (date < oldestDate) oldestDate = date;
      if (date > newestDate) newestDate = date;
      
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      monthlyActivity[monthYear] = (monthlyActivity[monthYear] || 0) + 1;
    }
  });
  
  // Convertir en tableau pour le graphique
  const activityData = Object.entries(monthlyActivity)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const [monthA, yearA] = a.month.split('/').map(Number);
      const [monthB, yearB] = b.month.split('/').map(Number);
      
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    })
    .map((entry, index, array) => {
      // Ajouter la valeur précédente pour l'aire cumulée
      const prevValue = index > 0 ? array[index - 1].count : 0;
      return {
        ...entry,
        cumulative: prevValue + entry.count
      };
    });
  
  // Trouver le mois avec le plus de transactions
  let mostActiveMonth = '';
  let maxActivity = 0;
  
  Object.entries(monthlyActivity).forEach(([month, count]) => {
    if (count > maxActivity) {
      mostActiveMonth = month;
      maxActivity = count;
    }
  });

  // Compter les tokens uniques
  const uniqueTokens = new Set(
    transactions
      .filter(tx => tx.tokenSymbol)
      .map(tx => tx.tokenSymbol)
  );

  // Calculer la répartition par token
  const tokenDistribution: Record<string, number> = {};
  transactions.forEach(tx => {
    if (tx.tokenSymbol) {
      const value = tx.valueInETH || 0;
      tokenDistribution[tx.tokenSymbol] = (tokenDistribution[tx.tokenSymbol] || 0) + value;
    } else if (tx.type === 'Native Transfer') {
      const value = Number(tx.value) / 1e18;
      tokenDistribution['ETH'] = (tokenDistribution['ETH'] || 0) + value;
    }
  });

  // Convertir en tableau pour le graphique
  const tokenData = Object.entries(tokenDistribution)
    .map(([token, value]) => ({ token, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 tokens
  
  // Calculer la période d'activité en jours
  const activityPeriod = Math.ceil((newestDate.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Données de valeur journalière pour le graphique en ligne
  const dailyValueData: Record<string, number> = {};
  transactions.forEach(tx => {
    if (tx.block_timestamp) {
      const date = new Date(tx.block_timestamp);
      const dateString = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
      const value = tx.valueInETH || (tx.value ? Number(tx.value) / 1e18 : 0);
      dailyValueData[dateString] = (dailyValueData[dateString] || 0) + value;
    }
  });

  // Convertir en tableau pour le graphique
  const valueChartData = Object.entries(dailyValueData)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Générer des couleurs pour les tokens
  const tokenColors = [
    '#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b',
    '#6366f1', '#ec4899', '#14b8a6', '#f97316', '#a855f7'
  ];

  // Format du montant pour l'affichage
  const formatAmount = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  // Formater la date pour meilleure affichage
  const formatMonthYear = (monthYear: string): string => {
    const [month, year] = monthYear.split('/');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
  };
  
  const chartBackground = currentTheme === 'dark' ? '#111827' : '#ffffff';
  const chartTextColor = currentTheme === 'dark' ? '#d1d5db' : '#4b5563';
  const chartGridColor = currentTheme === 'dark' ? '#374151' : '#e5e7eb';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex flex-wrap items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Aperçu du portefeuille</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Analyse basée sur {transactions.length} transactions sur <span className="text-blue-600 dark:text-blue-400">{activityPeriod} jours</span>
          </p>
        </div>
        
        {/* Sélecteur d'onglets */}
        <div className="flex space-x-1 p-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-4 sm:mt-0">
          {[
            { id: 'overview', label: 'Vue d\'ensemble' },
            { id: 'activity', label: 'Activité' },
            { id: 'tokens', label: 'Tokens' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 transition-all duration-300 border border-blue-100 dark:border-blue-800/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3">Volume total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatAmount(totalValue)} <span className="text-sm text-gray-500 dark:text-gray-400">ETH</span></p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-800/60 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={getTypeColor(entry.name)} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} transactions`, 'Quantité']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Barres verticales */}
                    <div className="space-y-3">
                      {typePercentages.slice(0, 5).map(({ type, count, percentage }) => (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{type}</span>
                            <span>{count} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full`}
                              style={{ width: `${percentage}%`, backgroundColor: getTypeColor(type) }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'activity' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-500">Activité par mois</h4>
                    <div className="flex space-x-2">
                      <button 
                        className={`px-2 py-1 text-xs rounded-md ${timeRange === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setTimeRange('all')}
                      >
                        Tout
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded-md ${timeRange === '1y' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setTimeRange('1y')}
                      >
                        1 an
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded-md ${timeRange === '90d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setTimeRange('90d')}
                      >
                        90j
                      </button>
                      <button 
                        className={`px-2 py-1 text-xs rounded-md ${timeRange === '30d' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                        onClick={() => setTimeRange('30d')}
                      >
                        30j
                      </button>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} transactions`, 'Nombre']}
                          labelFormatter={(label) => `Mois: ${label}`}
                        />
                        <Bar dataKey="count" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {isPremiumUser && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Évolution des valeurs transférées</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={valueChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${Number(value).toFixed(4)} ETH`, 'Valeur']}
                              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                            />
                            <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'tokens' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Répartition par token (Top 10)</h4>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={tokenData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="token" />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toFixed(4)} ETH`, 'Valeur']}
                        />
                        <Bar dataKey="value" name="Valeur">
                          {tokenData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={tokenColors[index % tokenColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {isPremiumUser && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Token le plus transféré</h5>
                        {tokenData.length > 0 && (
                          <>
                            <div className="text-2xl font-semibold text-gray-900">{tokenData[0].token}</div>
                            <div className="text-sm text-gray-500">{tokenData[0].value.toFixed(4)} ETH de valeur</div>
                          </>
                        )}
                      </div>
                      
                      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-500 mb-2">Diversité de portefeuille</h5>
                        <div className="text-2xl font-semibold text-gray-900">{uniqueTokens.size} tokens</div>
                        <div className="text-sm text-gray-500">
                          {uniqueTokens.size > 5 ? 'Portefeuille diversifié' : 'Portefeuille concentré'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Légende du graphique */}
            {activeTab === 'overview' && (
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(typeCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6)
                    .map(([type, _]) => (
                      <div key={type} className="flex items-center text-xs">
                        <span 
                          className="inline-block w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: getTypeColor(type) }}
                        ></span>
                        <span className="truncate">{type}</span>
                      </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {!isPremiumUser && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">🔒 Premium:</span> Débloquez toutes les visualisations et analyses avancées avec Bitax Premium.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;