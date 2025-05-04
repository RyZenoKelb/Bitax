import React, { useState, useEffect, useMemo } from 'react';
import { TaxSummary, TaxableEvent, CalculationMethod, taxCalculator } from '@/utils/TaxCalculator';
import { downloadTaxCSV, generateTaxReport, generateExcelReport, generateCompleteReport } from '@/utils/TaxPdfGenerator';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface TaxDashboardProps {
  transactions: any[];
  isPremiumUser: boolean;
  walletAddress: string;
}

type YearOption = 'all' | string;
type CurrencyOption = 'eur' | 'usd';
type ReportView = 'summary' | 'transactions' | 'charts' | 'settings';

const TaxDashboard: React.FC<TaxDashboardProps> = ({ 
  transactions, 
  isPremiumUser,
  walletAddress
}) => {
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<YearOption>('all');
  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>('FIFO');
  const [currency, setCurrency] = useState<CurrencyOption>('eur');
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ReportView>('summary');
  const [showMethodInfo, setShowMethodInfo] = useState<boolean>(false);
  
  // Détection du thème
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Détecter le thème actuel
    const isDarkMode = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDarkMode ? 'dark' : 'light');
    
    // Observer les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setCurrentTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const currencySymbol = currency === 'eur' ? '€' : '$';

  // Calculer les taxes lorsque les transactions, la méthode ou la devise change
  useEffect(() => {
    if (transactions.length > 0) {
      calculateTaxes();
    }
  }, [transactions, calculationMethod, currency]);

  const calculateTaxes = async () => {
    if (transactions.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await taxCalculator.calculateTaxes(transactions, calculationMethod, currency);
      setTaxSummary(summary);
    } catch (err) {
      console.error('Erreur lors du calcul fiscal:', err);
      setError('Impossible de calculer les données fiscales. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Années disponibles pour le filtre
  const yearOptions = useMemo(() => {
    if (!taxSummary) return [{ value: 'all', label: 'Toutes les années' }];
    
    const years = Object.keys(taxSummary.taxableEventsByYear).sort((a, b) => b.localeCompare(a));
    
    return [
      { value: 'all', label: 'Toutes les années' },
      ...years.map(year => ({ value: year, label: year }))
    ];
  }, [taxSummary]);

  // Événements filtrés par année
  const filteredEvents = useMemo(() => {
    if (!taxSummary) return [];
    
    if (selectedYear === 'all') {
      return taxSummary.taxableEvents;
    }
    
    return taxSummary.taxableEventsByYear[selectedYear] || [];
  }, [taxSummary, selectedYear]);

  // Limiter le nombre d'événements pour les utilisateurs non premium
  const displayedEvents = useMemo(() => {
    return isPremiumUser ? filteredEvents : filteredEvents.slice(0, 5);
  }, [filteredEvents, isPremiumUser]);

  // Formater les montants selon la devise
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat(currency === 'eur' ? 'fr-FR' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Générer des données pour les graphiques
  const chartData = useMemo(() => {
    if (!taxSummary) return { monthlyData: [], tokenData: [], gainLossData: [] };
    
    // Données mensuelles
    const monthlyMap: Record<string, { month: string, gains: number, losses: number }> = {};
    
    filteredEvents.forEach(event => {
      const date = new Date(event.date);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthYear = `${monthName} ${date.getFullYear()}`;
      
      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { month: monthYear, gains: 0, losses: 0 };
      }
      
      if (event.gainOrLoss >= 0) {
        monthlyMap[monthYear].gains += event.gainOrLoss;
      } else {
        monthlyMap[monthYear].losses += Math.abs(event.gainOrLoss);
      }
    });
    
    const monthlyData = Object.values(monthlyMap)
      .sort((a, b) => {
        // Tri par date (approximatif en utilisant le nom du mois + année)
        const dateA = new Date(a.month.replace(/[a-zA-Z]{3}\s/, '01 '));
        const dateB = new Date(b.month.replace(/[a-zA-Z]{3}\s/, '01 '));
        return dateA.getTime() - dateB.getTime();
      })
      .map(item => ({
        ...item,
        net: item.gains - item.losses
      }));
    
    // Données par token
    const tokenMap: Record<string, number> = {};
    
    filteredEvents.forEach(event => {
      if (!tokenMap[event.token]) {
        tokenMap[event.token] = 0;
      }
      tokenMap[event.token] += event.gainOrLoss;
    });
    
    const tokenData = Object.entries(tokenMap)
      .map(([token, value]) => ({ token, value }))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 10);
    
    // Données de distribution des gains/pertes
    const gainLossData = [
      { name: 'Plus-values', value: taxSummary.totalGains, color: '#10B981' },
      { name: 'Moins-values', value: taxSummary.totalLosses, color: '#EF4444' }
    ];
    
    return { monthlyData, tokenData, gainLossData };
  }, [taxSummary, filteredEvents]);

  // Exportation des rapports
  const handleExportCSV = () => {
    if (!taxSummary) return;
    
    downloadTaxCSV(
      taxSummary, 
      currency,
      `bitax_rapport_fiscal_${selectedYear === 'all' ? 'complet' : selectedYear}.csv`
    );
  };
  
  const handleExportPDF = () => {
    if (!taxSummary) return;
    
    generateTaxReport(taxSummary, {
      isPremiumUser,
      year: selectedYear === 'all' ? 'Toutes les années' : selectedYear,
      currency: currency.toUpperCase() as 'EUR' | 'USD',
      walletAddress
    });
  };
  
  const handleExportExcel = async () => {
    if (!taxSummary) return;
    
    setIsExporting(true);
    try {
      await generateExcelReport(
        taxSummary,
        transactions,
        walletAddress,
        currency,
        isPremiumUser
      );
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      setError('Une erreur est survenue lors de la génération du rapport Excel.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleCompleteExport = async () => {
    if (!taxSummary) return;
    
    setIsExporting(true);
    try {
      await generateCompleteReport(
        taxSummary,
        transactions,
        walletAddress,
        selectedYear === 'all' ? 'Toutes les années' : selectedYear,
        currency,
        isPremiumUser
      );
    } catch (error) {
      console.error('Erreur lors de l\'export complet:', error);
      setError('Une erreur est survenue lors de la génération des rapports.');
    } finally {
      setIsExporting(false);
    }
  };

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="w-full mt-6 p-6 bg-transparent rounded-xl shadow-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 dark:border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="text-blue-600 dark:text-blue-400 font-medium">Calcul fiscal en cours...</p>
        </div>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="w-full mt-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl text-red-700 dark:text-red-300">
        <div className="flex items-start">
          <svg className="w-6 h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Pas de données disponibles
  if (!taxSummary) {
    return (
      <div className="w-full mt-6 p-6 bg-transparent rounded-xl shadow-md text-center text-gray-500 dark:text-gray-400">
        <p>Aucune donnée fiscale disponible. Veuillez scanner vos transactions.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 space-y-6">
      {/* En-tête avec titre et actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">
            Rapport Fiscal {selectedYear !== 'all' ? selectedYear : ''}
          </h2>
          <p className="text-gray-400 mt-1">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} • {calculationMethod} • {currency.toUpperCase()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {isPremiumUser && (
            <div className="relative">
              <button
                onClick={() => setIsExporting(!isExporting)}
                disabled={isExporting}
                className="btn px-3 py-2 bg-bitax-primary-600 hover:bg-bitax-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExporting && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-transparent border border-gray-700 z-10">
                  <div className="py-1">
                    <button
                      onClick={handleExportPDF}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </button>
                    <button
                      onClick={handleExportExcel}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Excel
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      CSV
                    </button>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleCompleteExport}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      Tous les formats
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Panneau de contrôle */}
      <div className="bg-transparent rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Navigation */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
              Visualisations
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveView('summary')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'summary' 
                    ? 'bg-bitax-primary-100 text-bitax-primary-700' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Aperçu général
              </button>
              <button
                onClick={() => setActiveView('transactions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'transactions' 
                    ? 'bg-bitax-primary-100 text-bitax-primary-700' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Événements taxables
              </button>
              <button
                onClick={() => setActiveView('charts')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'charts' 
                    ? 'bg-bitax-primary-100 text-bitax-primary-700' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Graphiques
              </button>
              <button
                onClick={() => setActiveView('settings')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeView === 'settings' 
                    ? 'bg-bitax-primary-100 text-bitax-primary-700' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Paramètres
              </button>
            </nav>
            
            {/* Filtres */}
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
                Filtres
              </h3>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Année fiscale
                </label>
                <select
                  id="year"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value as YearOption)}
                  className="w-full rounded-md border border-gray-700 py-2 px-3 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Contenu principal */}
          <div className="md:col-span-3">
            {/* Vue d'aperçu général */}
            {activeView === 'summary' && (
              <div className="space-y-6">
                {/* Métriques clés */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Plus-values</p>
                      <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-green-600">{formatAmount(taxSummary.totalGains)}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>Total des gains lors des cessions</span>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Moins-values</p>
                      <div className="bg-red-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-red-600">{formatAmount(taxSummary.totalLosses)}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>Total des pertes lors des cessions</span>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Résultat net</p>
                      <div className={`${
                        taxSummary.netGainOrLoss >= 0 
                          ? 'bg-blue-100' 
                          : 'bg-gray-700'
                        } rounded-full p-1`}>
                        <svg className={`w-4 h-4 ${
                          taxSummary.netGainOrLoss >= 0 
                            ? 'text-blue-600' 
                            : 'text-gray-600'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className={`mt-2 text-2xl font-bold ${
                      taxSummary.netGainOrLoss >= 0 
                        ? 'text-blue-600' 
                        : 'text-gray-600'
                      }`}>
                      {formatAmount(taxSummary.netGainOrLoss)}
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>Différence entre gains et pertes</span>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-500">Évènements</p>
                      <div className="bg-purple-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-purple-600">{filteredEvents.length}</p>
                    <div className="mt-1 flex items-center text-xs text-gray-500">
                      <span>Transactions taxables identifiées</span>
                    </div>
                  </div>
                </div>
                
                {/* Distribution des gains */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <h3 className="text-base font-medium text-white mb-4">Distribution des gains</h3>
                    
                    <div className="flex flex-col md:flex-row items-center md:space-x-6">
                      <div className="h-48 w-full md:w-1/2">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartData.gainLossData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {chartData.gainLossData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              formatter={(value) => [formatAmount(Number(value)), 'Montant']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-4 w-full md:w-1/2">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600 flex items-center">
                              <span className="block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                              Plus-values long terme
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              {formatAmount(taxSummary.longTermGains)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/70 rounded-full h-1.5">
                            <div 
                              className="bg-green-500 h-1.5 rounded-full" 
                              style={{ width: `${(taxSummary.longTermGains / (taxSummary.totalGains || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600 flex items-center">
                              <span className="block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                              Plus-values court terme
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              {formatAmount(taxSummary.shortTermGains)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/70 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full" 
                              style={{ width: `${(taxSummary.shortTermGains / (taxSummary.totalGains || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-600 flex items-center">
                              <span className="block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                              Moins-values totales
                            </span>
                            <span className="text-sm font-medium text-red-600">
                              {formatAmount(taxSummary.totalLosses)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700/70 rounded-full h-1.5">
                            <div 
                              className="bg-red-500 h-1.5 rounded-full" 
                              style={{ width: `${(taxSummary.totalLosses / (taxSummary.totalGains + taxSummary.totalLosses || 1)) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                    <h3 className="text-base font-medium text-white mb-4">Méthode de calcul</h3>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg mr-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-white">{calculationMethod}</h4>
                            <p className="text-sm text-gray-500">
                              {calculationMethod === 'FIFO' && 'Premier entré, premier sorti'}
                              {calculationMethod === 'LIFO' && 'Dernier entré, premier sorti'}
                              {calculationMethod === 'HIFO' && 'Prix d\'achat le plus élevé'}
                              {calculationMethod === 'WAC' && 'Prix moyen pondéré'}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setShowMethodInfo(!showMethodInfo)}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                      </div>
                      
                      {showMethodInfo && (
                        <div className="bg-gray-700/30 rounded-lg p-4 text-sm text-gray-300">
                          {calculationMethod === 'FIFO' && (
                            <>
                              <p className="mb-2">
                                <strong>FIFO (Premier entré, premier sorti) :</strong> Les actifs acquis en premier sont considérés comme vendus en premier.
                              </p>
                              <p>
                                Cette méthode est souvent privilégiée pour son approche chronologique et est acceptée par la plupart des administrations fiscales.
                              </p>
                            </>
                          )}
                          {calculationMethod === 'LIFO' && (
                            <>
                              <p className="mb-2">
                                <strong>LIFO (Dernier entré, premier sorti) :</strong> Les actifs acquis le plus récemment sont considérés comme vendus en premier.
                              </p>
                              <p>
                                Cette méthode peut être avantageuse dans un marché haussier mais n'est pas acceptée par toutes les administrations fiscales.
                              </p>
                            </>
                          )}
                          {calculationMethod === 'HIFO' && (
                            <>
                              <p className="mb-2">
                                <strong>HIFO (Prix d'achat le plus élevé) :</strong> Les actifs ayant le coût d'acquisition le plus élevé sont considérés comme vendus en premier.
                              </p>
                              <p>
                                Cette méthode peut optimiser fiscalement vos moins-values mais n'est pas acceptée par toutes les administrations fiscales.
                              </p>
                            </>
                          )}
                          {calculationMethod === 'WAC' && (
                            <>
                              <p className="mb-2">
                                <strong>WAC (Prix moyen pondéré) :</strong> Utilise un coût moyen pondéré de tous les actifs acquis.
                              </p>
                              <p>
                                Cette méthode simplifie le calcul mais peut ne pas refléter la réalité des transactions individuelles.
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Autres méthodes disponibles</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {['FIFO', 'LIFO', 'HIFO', 'WAC'].filter(method => method !== calculationMethod).map(method => (
                          <button
                            key={method}
                            onClick={() => setCalculationMethod(method as CalculationMethod)}
                            className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                          >
                            {method}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Transactions récentes */}
                <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
                    <h3 className="text-base font-medium text-white">Événements taxables récents</h3>
                    <button
                      onClick={() => setActiveView('transactions')}
                      className="text-sm text-blue-600 hover:text-blue-400"
                    >
                      Voir tout
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead className="bg-gray-800/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût d'acquisition</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit de cession</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Perte</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="bg-transparent divide-y divide-gray-700">
                        {displayedEvents.slice(0, 5).map((event, index) => (
                          <tr key={index} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {event.token}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatAmount(event.acquisitionCost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatAmount(event.proceeds)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${event.gainOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatAmount(event.gainOrLoss)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded-full text-xs ${event.isLongTerm ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                {event.isLongTerm ? 'Long terme' : 'Court terme'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {!isPremiumUser && filteredEvents.length > 5 && (
                    <div className="p-4 bg-gray-700/20 border-t border-gray-700 text-center">
                      <p className="text-sm text-gray-300">
                        {filteredEvents.length - 5} événements taxables supplémentaires disponibles avec Bitax Premium
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Vue des transactions détaillées */}
            {activeView === 'transactions' && (
              <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-700">
                  <h3 className="text-base font-medium text-white">Détail des événements taxables</h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Token</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coût d'acquisition</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit de cession</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Perte</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-gray-700">
                      {displayedEvents.map((event, index) => (
                        <tr key={index} className="hover:bg-gray-800/50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {event.token}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatAmount(event.acquisitionCost)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatAmount(event.proceeds)}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${event.gainOrLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatAmount(event.gainOrLoss)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${event.isLongTerm ? 'bg-blue-100' : 'bg-purple-100'}`}>
                              {event.isLongTerm ? 'Long terme' : 'Court terme'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <a 
                              href={`https://etherscan.io/tx/${event.transaction.hash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-400"
                            >
                              {event.transaction.hash.substring(0, 8)}...
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {!isPremiumUser && filteredEvents.length > 5 && (
                  <div className="p-4 bg-gray-700/20 border-t border-gray-700 text-center">
                    <p className="text-sm text-gray-300">
                      {filteredEvents.length - 5} événements taxables supplémentaires disponibles avec Bitax Premium
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Vue des graphiques */}
            {activeView === 'charts' && (
              <div className="space-y-6">
                {/* Graphique d'évolution mensuelle */}
                <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                  <h3 className="text-base font-medium text-white mb-4">Évolution mensuelle</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.monthlyData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          dataKey="month" 
                          tick={{ fill: currentTheme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                        />
                        <YAxis 
                          tick={{ fill: currentTheme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                          tickFormatter={(value) => `${currencySymbol}${Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                        />
                        <Tooltip 
                          formatter={(value) => [formatAmount(Number(value)), '']}
                          contentStyle={{ backgroundColor: currentTheme === 'dark' ? '#1F2937' : 'white', borderColor: currentTheme === 'dark' ? '#4B5563' : '#E5E7EB' }}
                          itemStyle={{ color: currentTheme === 'dark' ? '#D1D5DB' : 'inherit' }}
                          labelStyle={{ color: currentTheme === 'dark' ? 'white' : 'black' }}
                        />
                        <Legend />
                        <Bar dataKey="gains" name="Plus-values" fill="#10B981" />
                        <Bar dataKey="losses" name="Moins-values" fill="#EF4444" />
                        <Bar dataKey="net" name="Résultat net" fill="#6366F1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Distribution par token */}
                <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-4">
                  <h3 className="text-base font-medium text-white mb-4">Distribution par token</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData.tokenData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#374151' : '#e5e7eb'} />
                        <XAxis 
                          type="number" 
                          tick={{ fill: currentTheme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                          tickFormatter={(value) => `${currencySymbol}${Math.abs(value) >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                        />
                        <YAxis 
                          dataKey="token" 
                          type="category" 
                          tick={{ fill: currentTheme === 'dark' ? '#D1D5DB' : '#4B5563' }}
                        />
                        <Tooltip 
                          formatter={(value) => [formatAmount(Number(value)), 'Résultat net']}
                          contentStyle={{ backgroundColor: currentTheme === 'dark' ? '#1F2937' : 'white', borderColor: currentTheme === 'dark' ? '#4B5563' : '#E5E7EB' }}
                          itemStyle={{ color: currentTheme === 'dark' ? '#D1D5DB' : 'inherit' }}
                          labelStyle={{ color: currentTheme === 'dark' ? 'white' : 'black' }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Résultat par token"
                          fill="#3B82F6"
                          background={{ fill: currentTheme === 'dark' ? '#374151' : '#f3f4f6' }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {!isPremiumUser && (
                  <div className="p-4 bg-gray-700/20 border border-gray-700 rounded-xl text-center">
                    <p className="text-sm text-gray-300">
                      Débloquez des graphiques et analyses supplémentaires avec Bitax Premium
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Vue des paramètres */}
            {activeView === 'settings' && (
              <div className="bg-transparent rounded-xl border border-gray-700 shadow-sm p-6">
                <h3 className="text-base font-medium text-white mb-6">Paramètres du rapport</h3>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="calculation-method" className="block text-sm font-medium text-gray-700 mb-1">
                      Méthode de calcul
                    </label>
                    <select
                      id="calculation-method"
                      value={calculationMethod}
                      onChange={e => setCalculationMethod(e.target.value as CalculationMethod)}
                      className="w-full rounded-md border border-gray-700 py-2 px-3 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="FIFO">FIFO - Premier entré, premier sorti</option>
                      <option value="LIFO">LIFO - Dernier entré, premier sorti</option>
                      <option value="WAC">WAC - Prix moyen pondéré</option>
                      <option value="HIFO">HIFO - Prix d'achat le plus élevé</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      La méthode utilisée peut influencer significativement votre résultat fiscal.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Devise
                    </label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={e => setCurrency(e.target.value as CurrencyOption)}
                      className="w-full rounded-md border border-gray-700 py-2 px-3 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="eur">EUR - Euro</option>
                      <option value="usd">USD - Dollar américain</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Devise utilisée pour l'évaluation des plus et moins-values.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                      Année fiscale
                    </label>
                    <select
                      id="year"
                      value={selectedYear}
                      onChange={e => setSelectedYear(e.target.value as YearOption)}
                      className="w-full rounded-md border border-gray-700 py-2 px-3 text-sm bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {yearOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Filtrer les transactions par année pour votre déclaration fiscale.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-6 border-t border-gray-700">
                    <button
                      onClick={calculateTaxes}
                      className="w-full py-2 px-4 bg-bitax-primary-600 hover:bg-bitax-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Recalculer les données fiscales
                    </button>
                    <p className="mt-2 text-xs text-center text-gray-500">
                      Applique les nouveaux paramètres et recalcule toutes les plus/moins-values.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer avec lien premium si nécessaire */}
      {!isPremiumUser && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">🔒 Certaines fonctionnalités sont limitées.</span> Débloquez le rapport complet et toutes les fonctionnalités avec Bitax Premium.
          </p>
          <button
            className="mt-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow"
          >
            Passer à Bitax Premium
          </button>
        </div>
      )}
    </div>
  );
};

export default TaxDashboard;