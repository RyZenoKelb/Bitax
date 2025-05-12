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
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-blue-200/50 dark:bg-blue-800/30 h-1 rounded-full">
                    <div className="bg-blue-600 dark:bg-blue-400 h-1 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-xl p-4 transition-all duration-300 border border-purple-100 dark:border-purple-800/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-3">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length} <span className="text-sm text-gray-500 dark:text-gray-400">tx</span></p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-800/60 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-purple-200/50 dark:bg-purple-800/30 h-1 rounded-full">
                    <div className="bg-purple-600 dark:bg-purple-400 h-1 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-xl p-4 transition-all duration-300 border border-cyan-100 dark:border-cyan-800/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-cyan-800 dark:text-cyan-300 mb-3">Montant moyen</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatAmount(averageValue)} <span className="text-sm text-gray-500 dark:text-gray-400">ETH</span></p>
                  </div>
                  <div className="bg-cyan-100 dark:bg-cyan-800/60 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-cyan-200/50 dark:bg-cyan-800/30 h-1 rounded-full">
                    <div className="bg-cyan-600 dark:bg-cyan-400 h-1 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 transition-all duration-300 border border-amber-100 dark:border-amber-800/30">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-3">Tokens uniques</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueTokens.size} <span className="text-sm text-gray-500 dark:text-gray-400">tokens</span></p>
                  </div>
                  <div className="bg-amber-100 dark:bg-amber-800/60 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-amber-200/50 dark:bg-amber-800/30 h-1 rounded-full">
                    <div className="bg-amber-600 dark:bg-amber-400 h-1 rounded-full" style={{ width: `${(uniqueTokens.size / 10) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graphique principal */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden lg:col-span-2">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">Distribution des transactions</h4>
                </div>
                <div className="p-5">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={getTypeColor(entry.name)} 
                              stroke={currentTheme === 'dark' ? '#1f2937' : '#ffffff'}
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} transactions`, 'Nombre']}
                          contentStyle={{ 
                            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                          }}
                          labelStyle={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              {/* Top types de transactions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">Types principaux</h4>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {typePercentages.slice(0, 5).map(({ type, count, percentage }) => (
                      <div key={type} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 p-2 rounded-lg transition-colors duration-200">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getTypeColor(type) }}></div>
                            <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{type}</span>
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{count}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500 group-hover:opacity-90"
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: getTypeColor(type) 
                            }}
                          ></div>
                        </div>
                        <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Aperçu chronologique */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h4 className="font-medium text-gray-900 dark:text-white">Chronologie d'activité</h4>
                <div className="flex space-x-1">
                  {['all', '1y', '90d', '30d'].map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range as any)}
                      className={`px-2 py-1 text-xs rounded-md transition-colors duration-200 ${
                        timeRange === range 
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {range === 'all' ? 'Tout' : range.replace('d', 'j')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={activityData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={chartGridColor}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fill: chartTextColor }} 
                        tickFormatter={formatMonthYear}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                      />
                      <YAxis 
                        tick={{ fill: chartTextColor }}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value} transactions`, 'Nombre']}
                        labelFormatter={(label) => `Période: ${formatMonthYear(label)}`}
                        contentStyle={{ 
                          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                        }}
                        labelStyle={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulative" 
                        stroke="#3b82f6" 
                        strokeWidth={0} 
                        fillOpacity={1} 
                        fill="url(#colorActivity)" 
                        name="Cumul"
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]} 
                        name="Transactions"
                        barSize={20}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* Vue d'activité */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Période d'activité</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{activityPeriod} jours</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {oldestDate.toLocaleDateString()} - {newestDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"></div>
                <div className="flex items-center space-x-4">
                  <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mois le plus actif</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMonthYear(mostActiveMonth)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {maxActivity} transactions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Moyenne mensuelle</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatAmount(transactions.length / (activityPeriod / 30))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      transactions par mois
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Graphique d'activité avancé */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"></div>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">Évolution du volume de transactions</h4>
              </div>
              <div className="p-5">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={valueChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: chartTextColor }}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        }}
                      />
                      <YAxis 
                        tick={{ fill: chartTextColor }}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                        tickFormatter={(value) => formatAmount(value)}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${formatAmount(value)} ETH`, 'Volume']}
                        labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                        contentStyle={{ 
                          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                        }}
                        labelStyle={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#6366f1" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {isPremiumUser && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"></div>
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">Analyse avancée du volume</h4>
                </div>
                <div className="p-5">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activityData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      ></BarChart>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: chartTextColor }}
                          axisLine={{ stroke: chartGridColor }}
                          tickLine={{ stroke: chartGridColor }}
                          tickFormatter={formatMonthYear}
                        />
                        <YAxis 
                          tick={{ fill: chartTextColor }}
                          axisLine={{ stroke: chartGridColor }}
                          tickLine={{ stroke: chartGridColor }}
                        />
                        <Tooltip
                          formatter={(value: number) => [`${value}`, 'Transactions']}
                          labelFormatter={(label) => `Période: ${formatMonthYear(label)}`}
                          contentStyle={{ 
                            backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                            borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                          }}
                          labelStyle={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#8b5cf6"
                          radius={[4, 4, 0, 0]}
                          barSize={30}
                          name="Transactions"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cumulative" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: "#f59e0b", strokeWidth: 1 }}
                          activeDot={{ r: 6, fill: "#f59e0b", strokeWidth: 0 }}
                          name="Cumul"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            {/* Vue des tokens */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"></div>
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white">Distribution des tokens (Top 10)</h4>
              </div>
              <div className="p-5">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={tokenData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                    ></BarChart>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} horizontal={true} vertical={false} />
                      <XAxis 
                        type="number"
                        tick={{ fill: chartTextColor }}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                        tickFormatter={(value) => formatAmount(value)}
                      />
                      <YAxis 
                        dataKey="token" 
                        type="category"
                        tick={{ fill: chartTextColor }}
                        axisLine={{ stroke: chartGridColor }}
                        tickLine={{ stroke: chartGridColor }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${formatAmount(value)} ETH`, 'Valeur']}
                        contentStyle={{ 
                          backgroundColor: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
                          borderColor: currentTheme === 'dark' ? '#374151' : '#e5e7eb'
                        }}
                        labelStyle={{ color: currentTheme === 'dark' ? '#f9fafb' : '#111827' }}
                      />
                      <Bar dataKey="value" name="Valeur en ETH">
                        {tokenData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={tokenColors[index % tokenColors.length]} 
                            radius={[0, 4, 4, 0]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Informations sur les tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tokenData.slice(0, 4).map((token, index) => (
                <div 
                  key={token.token}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-300"
                ></div>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: tokenColors[index % tokenColors.length] }}
                    >
                      {token.token.substring(0, 2)}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="font-medium text-gray-900 dark:text-white">{token.token}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatAmount(token.value)} ETH</p>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${(token.value / tokenData[0].value) * 100}%`,
                        backgroundColor: tokenColors[index % tokenColors.length]
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-right text-gray-500 dark:text-gray-400">
                    {((token.value / tokenData.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}% du total
                  </div>
                </div>
              ))}
            </div>
            
            {isPremiumUser && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"></div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Analyse de diversité</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Diversification du portefeuille</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueTokens.size} tokens</p>
                    <div className="mt-2 flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-green-500 dark:bg-green-400" 
                          style={{ width: `${Math.min((uniqueTokens.size / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        {uniqueTokens.size > 5 ? 'Élevée' : uniqueTokens.size > 2 ? 'Moyenne' : 'Faible'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Concentration</p>
                    {tokenData.length > 0 && (
                      <>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {tokenData[0].token}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Représente {((tokenData[0].value / tokenData.reduce((sum, t) => sum + t.value, 0)) * 100).toFixed(1)}% de votre activité
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!isPremiumUser && (
          <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
            <div className="flex items-center justify-between">