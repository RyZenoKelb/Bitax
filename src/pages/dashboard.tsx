// src/pages/dashboard.tsx
import { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import WalletConnectButton from '@/components/WalletConnectButton';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { NetworkType, getTransactions } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// Composant pour les cartes statistiques animées
const StatCard = ({ title, value, icon, change, changeType = 'positive', bgClass = 'from-primary-900/20 to-primary-800/10' }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${bgClass} backdrop-blur-md border border-gray-800/30 dark:border-gray-700/20 p-6 transition-all hover:shadow-lg`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-white">{value}</h3>
          
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' 
                ? 'text-green-400 dark:text-green-400' 
                : 'text-red-400 dark:text-red-400'
            }`}>
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={changeType === 'positive' ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} 
                />
              </svg>
              <span>{change}</span>
            </div>
          )}
        </div>
        
        <div className="text-primary-300 dark:text-primary-300">
          {icon}
        </div>
      </div>
      
      {/* Éléments décoratifs */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-primary-500/10 blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

// Composant pour la sélection de réseau
const NetworkSelector = ({ networks, activeNetwork, onSelect, theme }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {networks.map((network) => (
        <button
          key={network.id}
          onClick={() => onSelect(network.id)}
          className={`relative flex flex-col items-center justify-center px-3 py-3 rounded-lg transition-all duration-200 ${
            activeNetwork === network.id 
              ? 'bg-primary-900/50 border-2 border-primary-500/50 shadow-lg shadow-primary-500/20' 
              : theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600/50'
                : 'bg-gray-100/80 border border-gray-200/80 hover:bg-gray-200/50 hover:border-gray-300/50'
          }`}
        >
          <div 
            className="w-10 h-10 rounded-full mb-2 flex items-center justify-center" 
            style={{ backgroundColor: network.color }}
          >
            <span className="text-white font-medium text-lg">{network.symbol}</span>
          </div>
          <span className={`text-xs ${
            activeNetwork === network.id 
              ? 'text-white font-medium' 
              : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {network.name}
          </span>
          
          {activeNetwork === network.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-500"></div>
          )}
        </button>
      ))}
    </div>
  );
};

// Composant pour la section de connexion du wallet
const WalletConnectSection = ({ onConnect, theme }) => {
  return (
    <div className={`rounded-xl overflow-hidden backdrop-blur-md ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-800/40' 
        : 'bg-white/90 border border-gray-200/40'
    } shadow-lg`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-primary-900/50' : 'bg-primary-100'
          } mr-4`}>
            <svg className={`w-7 h-7 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Connectez votre wallet
            </h2>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Pour commencer, connectez votre wallet crypto pour analyser vos transactions.
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <WalletConnectButton 
            onConnect={onConnect}
            variant="primary"
            fullWidth
            size="lg"
          />
          
          <div className={`text-xs text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            By connecting, you agree to the <Link href="/terms" className={theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}>Terms of Service</Link> and <Link href="/privacy" className={theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}>Privacy Policy</Link>
          </div>
        </div>
      </div>
      
      <div className={`px-6 py-4 ${theme === 'dark' ? 'bg-gray-800/50 border-t border-gray-700/30' : 'bg-gray-50 border-t border-gray-200/40'}`}>
        <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Supports multiples blockchains:
        </p>
        <div className="flex space-x-2">
          {[
            { name: "Ethereum", color: "#627EEA" },
            { name: "Polygon", color: "#8247E5" },
            { name: "Arbitrum", color: "#28A0F0" },
            { name: "Optimism", color: "#FF0420" },
            { name: "Base", color: "#0052FF" }
          ].map((network, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
              style={{ backgroundColor: network.color }}
              title={network.name}
            >
              {network.name.substring(0, 1)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tableau des dernières transactions
const RecentTransactionsTable = ({ transactions, isPremiumUser, theme }) => {
  // Limiter à 5 transactions pour la version gratuite
  const displayedTransactions = isPremiumUser ? transactions.slice(0, 10) : transactions.slice(0, 5);
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-10 ${
        theme === 'dark' 
          ? 'bg-gray-800/30 text-gray-400' 
          : 'bg-gray-100/50 text-gray-500'
      } rounded-lg border ${theme === 'dark' ? 'border-gray-700/30' : 'border-gray-200/50'}`}>
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-center mb-2">Aucune transaction trouvée</p>
        <p className="text-center text-sm opacity-70">Connectez votre wallet et scannez vos transactions pour commencer.</p>
      </div>
    );
  }
  
  return (
    <div className={`overflow-hidden rounded-xl ${
      theme === 'dark' 
        ? 'bg-gray-900/50 border border-gray-800/40' 
        : 'bg-white border border-gray-200/70'
    }`}>
      <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-800/40' : 'border-gray-200/70'}`}>
        <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Transactions récentes</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800/30 dark:divide-gray-700/30">
          <thead className={theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50/80'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Hash</th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Type</th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Valeur</th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>Réseau</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800/30' : 'divide-gray-200/70'}`}>
            {displayedTransactions.map((tx, index) => (
              <tr key={index} className={`${theme === 'dark' ? 'hover:bg-gray-800/20' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  <a 
                    href={`https://etherscan.io/tx/${tx.hash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`font-mono ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 6)}
                  </a>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  {new Date(tx.timestamp * 1000).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    tx.type === 'receive' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {tx.type === 'receive' ? 'Réception' : 'Envoi'}
                  </span>
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  tx.type === 'receive' 
                    ? 'text-green-500 dark:text-green-400' 
                    : 'text-red-500 dark:text-red-400'
                }`}>
                  {tx.type === 'receive' ? '+' : '-'}{tx.value} {tx.token || 'ETH'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
                  <div className="flex items-center">
                    <div 
                      className="w-5 h-5 rounded-full mr-2"
                      style={{ 
                        backgroundColor: 
                          tx.network === 'eth' ? '#627EEA' : 
                          tx.network === 'polygon' ? '#8247E5' : 
                          tx.network === 'arbitrum' ? '#28A0F0' : 
                          tx.network === 'optimism' ? '#FF0420' : 
                          tx.network === 'base' ? '#0052FF' : '#999999' 
                      }}
                    ></div>
                    {tx.network === 'eth' ? 'Ethereum' : 
                     tx.network === 'polygon' ? 'Polygon' : 
                     tx.network === 'arbitrum' ? 'Arbitrum' : 
                     tx.network === 'optimism' ? 'Optimism' : 
                     tx.network === 'base' ? 'Base' : tx.network}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!isPremiumUser && transactions.length > 5 && (
        <div className={`p-4 ${theme === 'dark' ? 'bg-yellow-900/20 border-t border-yellow-800/30' : 'bg-yellow-50 border-t border-yellow-100'} text-center`}>
          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
            <span className="inline-block mr-1">
              <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            {transactions.length - 5} transactions supplémentaires disponibles avec Bitax Premium
          </p>
        </div>
      )}
      
      <div className={`px-6 py-4 ${theme === 'dark' ? 'border-t border-gray-800/40' : 'border-t border-gray-200/70'}`}>
        <Link 
          href="/transactions" 
          className={`text-sm font-medium ${theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'} flex items-center`}
        >
          Voir toutes les transactions
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

// Composant pour la carte d'analyse fiscale
const TaxAnalysisCard = ({ isPremiumUser, isConnected, onScan, theme }) => {
  return (
    <div className={`rounded-xl overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900/60 via-gray-800/60 to-gray-900/60 border border-gray-800/40' 
        : 'bg-white border border-gray-200/70'
    } shadow-md`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-primary-900/50' : 'bg-primary-100'
          } mr-3`}>
            <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Analyse Fiscale
          </h3>
        </div>
        
        {!isConnected ? (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-600'} mb-6`}>
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Connectez votre wallet pour accéder à l'analyse fiscale
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`rounded-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800/40' : 'bg-gray-100/70'}`}>
              <div className={`h-2 ${theme === 'dark' ? 'bg-primary-600' : 'bg-primary-500'} rounded-full w-3/4`}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 text-center ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700/30' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200/70'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  +2 168 €
                </div>
                <div className="text-xs">Plus-values</div>
              </div>
              <div className={`rounded-lg p-4 text-center ${
                theme === 'dark' 
                  ? 'bg-gray-800/50 text-gray-300 border border-gray-700/30' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200/70'
              }`}>
                <div className={`text-2xl font-bold mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                  -875 €
                </div>
                <div className="text-xs">Moins-values</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={onScan}
            disabled={!isConnected}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center ${
              isConnected 
                ? theme === 'dark'
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors duration-200`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Générer rapport fiscal
          </button>
        </div>
      </div>
      
      {!isPremiumUser && (
        <div className={`px-6 py-4 ${theme === 'dark' ? 'bg-yellow-900/20 border-t border-yellow-800/30' : 'bg-yellow-50 border-t border-yellow-100'}`}>
          <div className="flex items-start">
            <svg className={`w-5 h-5 mr-2 flex-shrink-0 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                Version limitée
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-yellow-200/70' : 'text-yellow-600/90'}`}>
                Passez à Premium pour accéder au rapport fiscal complet et aux fonctionnalités avancées.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant pour la carte d'aperçu du portfolio
const PortfolioOverviewCard = ({ isConnected, theme }) => {
  const chartCanvasRef = useRef(null);

  // Fonction pour créer un graphique simple (simulé)
  useEffect(() => {
    if (chartCanvasRef.current && isConnected) {
      // Ceci est juste une démonstration visuelle - normalement vous utiliseriez une bibliothèque de graphiques
      const canvas = chartCanvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      
      // Effacer le canvas
      ctx.clearRect(0, 0, width, height);
      
      // Définir les couleurs selon le thème
      const primaryColor = theme === 'dark' ? 'rgba(123, 63, 228, 0.7)' : 'rgba(79, 70, 229, 0.7)';
      const secondaryColor = theme === 'dark' ? 'rgba(14, 234, 255, 0.7)' : 'rgba(14, 165, 233, 0.7)';
      const lineColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      
      // Dessiner les lignes de grille
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      
      for (let i = 0; i <= 5; i++) {
        const y = height * (i / 5);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Dessiner une "courbe" avec gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      // Points pour la courbe (simulée)
      const points = [
        { x: 0, y: height * 0.7 },
        { x: width * 0.2, y: height * 0.8 },
        { x: width * 0.4, y: height * 0.5 },
        { x: width * 0.6, y: height * 0.3 },
        { x: width * 0.8, y: height * 0.4 },
        { x: width, y: height * 0.2 }
      ];
      
      // Dessiner la ligne
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Dessiner l'aire sous la courbe
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Ajouter des points de données
      ctx.fillStyle = primaryColor;
      for (const point of points) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.fillStyle = primaryColor;
      }
    }
  }, [chartCanvasRef, isConnected, theme]);

  return (
    <div className={`rounded-xl overflow-hidden ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900/60 via-gray-800/60 to-gray-900/60 border border-gray-800/40' 
        : 'bg-white border border-gray-200/70'
    } shadow-md h-full`}>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
          } mr-3`}>
            <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Aperçu du Portefeuille
          </h3>
        </div>
        
        {!isConnected ? (
          <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50 text-gray-300' : 'bg-gray-100 text-gray-600'} mb-6`}>
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Connectez votre wallet pour voir l'aperçu de votre portefeuille
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Valeur totale du portefeuille</div>
                <div className="text-2xl font-bold text-white dark:text-white">13 578,45 €</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                theme === 'dark' 
                  ? 'bg-green-900/30 text-green-400 border border-green-800/30' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                +8.2%
              </div>
            </div>
            
            <div className="h-40 relative">
              <canvas 
                ref={chartCanvasRef} 
                width="400" 
                height="160" 
                className="w-full h-full"
              ></canvas>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "ETH", amount: "2.45", value: "4 680 €", change: "+3.2%" },
                { name: "BTC", amount: "0.12", value: "5 243 €", change: "+5.7%" },
                { name: "MATIC", amount: "1,230", value: "1 845 €", change: "-2.1%" },
                { name: "LINK", amount: "42", value: "1 022 €", change: "+4.8%" }
              ].map((token, index) => (
                <div key={index} className={`rounded-lg p-3 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border border-gray-700/30' 
                    : 'bg-gray-100/70 border border-gray-200/40'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{token.name}</div>
                    <div className={`text-xs ${
                      token.change.startsWith('+') 
                        ? theme === 'dark' ? 'text-green-400' : 'text-green-600' 
                        : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {token.change}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{token.amount}</div>
                    <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{token.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal du dashboard
export default function Dashboard() {
  // État du wallet et des transactions
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  
  // État du thème
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Détection du thème
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà une préférence de thème
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Observer les changements de classe sur le document pour détecter les changements de thème
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDarkMode = document.documentElement.classList.contains('dark');
          setTheme(isDarkMode ? 'dark' : 'light');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Vérifier le statut premium (simulé ici)
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Données des réseaux supportés
  const networks = [
    { id: 'eth', name: 'Ethereum', symbol: 'ETH', color: '#627EEA' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', symbol: 'ARB', color: '#28A0F0' },
    { id: 'optimism', name: 'Optimism', symbol: 'OP', color: '#FF0420' },
    { id: 'base', name: 'Base', symbol: 'BASE', color: '#0052FF' }
  ];
  
  // Connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions après connexion
      await fetchTransactions(address, activeNetwork);
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };
  
  // Récupération des transactions
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      // Données d'exemple pour la démo
      if (filteredTxs.length === 0) {
        const demoTxs = createDemoTransactions(network);
        setTransactions(demoTxs);
      } else {
        setTransactions(filteredTxs);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
      
      // Données d'exemple pour la démo en cas d'erreur
      const demoTxs = createDemoTransactions(activeNetwork);
      setTransactions(demoTxs);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Création de transactions de démonstration
  const createDemoTransactions = (network: NetworkType) => {
    const networkTokens = {
      eth: 'ETH',
      polygon: 'MATIC',
      arbitrum: 'ARB',
      optimism: 'OP',
      base: 'BASE'
    };
    
    const now = Date.now() / 1000;
    const demoTxs = [];
    
    // Créer quelques transactions fictives pour la démo
    for (let i = 0; i < 10; i++) {
      const timestamp = now - (i * 86400); // Une transaction par jour
      const hash = '0x' + Math.random().toString(16).substring(2, 16) + Math.random().toString(16).substring(2, 16);
      const type = Math.random() > 0.5 ? 'send' : 'receive';
      const token = networkTokens[network] || 'ETH';
      const value = (Math.random() * 2).toFixed(4);
      
      demoTxs.push({
        hash,
        timestamp,
        type,
        token,
        value,
        network
      });
    }
    
    return demoTxs;
  };
  
  // Gestion de la sélection de réseau
  const handleNetworkSelect = (networkId: string) => {
    setActiveNetwork(networkId as NetworkType);
    if (isWalletConnected && walletAddress) {
      fetchTransactions(walletAddress, networkId as NetworkType);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête avec titre et actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-white mb-1">
              Dashboard
            </h1>
            <p className="text-gray-400 dark:text-gray-400">
              {isWalletConnected ? (
                <span>
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)} • {activeNetwork.toUpperCase()}
                </span>
              ) : (
                <span>Connectez votre wallet pour commencer</span>
              )}
            </p>
          </div>
          
          {isWalletConnected && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchTransactions(walletAddress, activeNetwork)}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Actualiser
              </button>
            </div>
          )}
        </div>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className={`p-4 rounded-xl ${
            theme === 'dark' 
              ? 'bg-red-900/20 border border-red-800/30 text-red-300' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Carte Premium pour utilisateurs non premium (afficher uniquement si non premium) */}
        {!isPremiumUser && (
          <div className={`relative overflow-hidden rounded-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-primary-900/30 to-secondary-900/30 backdrop-blur-md border border-primary-800/30' 
              : 'bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200/50'
          } p-6`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Passez à Bitax Premium</h3>
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Obtenez un accès illimité aux rapports fiscaux détaillés, aux analyses avancées et bien plus encore.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    "Transactions illimitées", 
                    "Rapports fiscaux complets", 
                    "Méthodes de calcul avancées", 
                    "Analyse multi-blockchain"
                  ].map((feature, index) => (
                    <span key={index} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      theme === 'dark' 
                        ? 'bg-primary-900/40 text-primary-300 border border-primary-800/40' 
                        : 'bg-primary-100 text-primary-800 border border-primary-200'
                    }`}>
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0">
                <button className={`px-5 py-2.5 rounded-lg font-medium text-white shadow-lg transition-all ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500 shadow-primary-900/20' 
                    : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-primary-500/20'
                } hover:shadow-xl hover:scale-105 transform transition-all`}>
                  Débloquer Premium
                </button>
              </div>
            </div>
            
            {/* Éléments décoratifs */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-secondary-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl"></div>
          </div>
        )}
        
        {/* Section principale qui change selon l'état de connexion */}
        {!isWalletConnected ? (
          // Vue non connectée
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className={`rounded-xl overflow-hidden backdrop-blur-md ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-800/30' 
                  : 'bg-white border border-gray-200/50'
              } shadow-lg p-8`}>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                    theme === 'dark' 
                      ? 'bg-primary-900/50' 
                      : 'bg-primary-100'
                  }`}>
                    <svg className={`w-10 h-10 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  
                  <h2 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Bienvenue sur Bitax
                  </h2>
                  <p className={`text-center max-w-md mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    La solution complète pour gérer votre fiscalité crypto en toute simplicité. Analysez vos transactions, calculez vos plus-values et générez des rapports fiscaux conformes.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => {
                        // Simuler une connexion pour la démo
                        const randomAddress = '0x' + Math.random().toString(16).substring(2, 42);
                        setWalletAddress(randomAddress);
                        setIsWalletConnected(true);
                        
                        // Charger des données de démo
                        const demoTxs = createDemoTransactions(activeNetwork);
                        setTransactions(demoTxs);
                      }}
                      className={`px-5 py-3 rounded-lg font-medium text-white shadow-md transition-all flex items-center justify-center ${
                        theme === 'dark' 
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500' 
                          : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
                      } hover:shadow-lg`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      Connecter un wallet
                    </button>
                    <Link 
                      href="/guide"
                      className={`px-5 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
                        theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Guide d'utilisation
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <WalletConnectSection 
                onConnect={handleWalletConnect}
                theme={theme}
              />
            </div>
          </div>
        ) : (
          // Vue connectée
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Section principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cartes statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Solde Total" 
                  value="13 578,45 €" 
                  change="+8.2% (7j)" 
                  changeType="positive" 
                  icon={
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  bgClass="from-blue-900/20 via-blue-800/15 to-blue-900/10"
                />
                <StatCard 
                  title="Transactions" 
                  value={`${transactions.length}`} 
                  icon={
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  }
                  bgClass="from-purple-900/20 via-purple-800/15 to-purple-900/10"
                />
                <StatCard 
                  title="Résultat Fiscal" 
                  value="1 293,45 €" 
                  change="-12.5% (2023)" 
                  changeType="negative" 
                  icon={
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  bgClass="from-emerald-900/20 via-emerald-800/15 to-emerald-900/10"
                />
              </div>
              
              {/* Sélecteur de réseaux */}
              <div className={`p-4 rounded-xl ${
                theme === 'dark' 
                  ? 'bg-gray-900/60 border border-gray-800/40' 
                  : 'bg-white border border-gray-200/70'
              }`}>
                <h3 className={`text-base font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Réseaux supportés
                </h3>
                <NetworkSelector 
                  networks={networks}
                  activeNetwork={activeNetwork}
                  onSelect={handleNetworkSelect}
                  theme={theme}
                />
              </div>
              
              {/* Tableau des transactions récentes */}
              <RecentTransactionsTable 
                transactions={transactions}
                isPremiumUser={isPremiumUser}
                theme={theme}
              />
            </div>
            
            {/* Sidebar droite */}
            <div className="lg:col-span-1 space-y-6">
              {/* Carte d'analyse fiscale */}
              <TaxAnalysisCard 
                isPremiumUser={isPremiumUser}
                isConnected={isWalletConnected}
                onScan={() => fetchTransactions(walletAddress, activeNetwork)}
                theme={theme}
              />
              
              {/* Aperçu du portefeuille */}
              <PortfolioOverviewCard 
                isConnected={isWalletConnected}
                theme={theme}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}