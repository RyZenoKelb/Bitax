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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Métriques clés */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Activité globale</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Période d'activité</span>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">{activityPeriod} <span className="text-lg">jours</span></div>
                  <div className="mt-1 text-sm text-gray-500">
                    {oldestDate.toLocaleDateString()} - {newestDate.toLocaleDateString()}
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Tokens uniques</span>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">{uniqueTokens.size}</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {uniqueTokens.size > 0 
                      ? `Dont ${Array.from(uniqueTokens).slice(0, 2).join(', ')}...` 
                      : 'Aucun token ERC20 détecté'}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Montants transférés</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Volume total</span>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">{totalValue.toFixed(4)}</div>
                  <div className="mt-1 text-sm text-gray-500">ETH (ou équivalent)</div>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Montant moyen</span>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">{averageValue.toFixed(4)}</div>
                  <div className="mt-1 text-sm text-gray-500">par transaction</div>
                </div>
              </div>
            </div>
            
            {mostActiveMonth && (
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <span className="text-sm font-medium text-gray-500">Mois le plus actif</span>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mostActiveMonth}</div>
                <div className="mt-1 text-sm text-gray-500">{maxActivity} transactions</div>
              </div>
            )}
          </div>
          
          {/* Onglets de visualisation */}
          <div className="md:col-span-8 flex flex-col">
            {/* Sélecteur d'onglets */}
            <div className="flex border-b border-gray-200 mb-4">
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('overview')}
              >
                Vue d'ensemble
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('activity')}
              >
                Activité
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'tokens' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('tokens')}
              >
                Tokens
              </button>
            </div>
            
            {/* Contenu des onglets */}
            <div className="flex-grow">
              {activeTab === 'overview' && (
                <div className="h-64">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Répartition par type de transaction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    {/* Graphique en camembert */}
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
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