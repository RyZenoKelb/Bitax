// src/pages/dashboard.tsx
import React, { useState, useEffect, ReactElement } from 'react';
import { ethers } from 'ethers';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import WalletConnectButton from '@/components/WalletConnectButton';
import type { NextPageWithLayout } from '@/pages/_app.';

const Dashboard: NextPageWithLayout = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeNetwork, setActiveNetwork] = useState('eth');

  // Metrics data
  const metrics = [
    {
      label: 'Valeur totale du portefeuille',
      value: '€12,450.88',
      change: '+12.5%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Plus-values imposables',
      value: '€3,245.67',
      change: '+8.3%',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Transactions aujourd\'hui',
      value: '24',
      change: '+3',
      changeType: 'increase',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      label: 'Réseaux connectés',
      value: '5',
      change: '',
      changeType: 'neutral',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Network buttons
  const networks = [
    { id: 'eth', name: 'Ethereum', color: '#627EEA' },
    { id: 'polygon', name: 'Polygon', color: '#8247E5' },
    { id: 'arbitrum', name: 'Arbitrum', color: '#28A0F0' },
    { id: 'optimism', name: 'Optimism', color: '#FF0420' },
    { id: 'base', name: 'Base', color: '#0052FF' },
  ];

  // Recent transactions data
  const recentTransactions = [
    {
      id: 1,
      type: 'swap',
      from: 'USDC',
      to: 'ETH',
      amount: '1,000',
      value: '€850.23',
      timestamp: 'Il y a 2 min',
      status: 'completed',
      network: 'Ethereum',
    },
    {
      id: 2,
      type: 'transfer',
      from: 'ETH',
      to: null,
      amount: '0.5',
      value: '€425.12',
      timestamp: 'Il y a 1h',
      status: 'completed',
      network: 'Optimism',
    },
    {
      id: 3,
      type: 'receive',
      from: null,
      to: 'DAI',
      amount: '500',
      value: '€500.00',
      timestamp: 'Il y a 3h',
      status: 'pending',
      network: 'Polygon',
    },
  ];

  const handleWalletConnect = async (address: string, provider: ethers.BrowserProvider) => {
    setWalletAddress(address);
    setIsWalletConnected(true);
    // Simulate loading transactions
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setTransactions([]);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-5 h-5 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        );
      case 'transfer':
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'receive':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!isWalletConnected) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Hero section */}
        <div className="text-center py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 max-w-3xl mx-auto leading-tight">
            Bienvenue sur votre tableau de bord fiscal
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Connectez votre wallet pour accéder à une analyse complète de vos transactions crypto et générer vos rapports fiscaux.
          </p>

          {/* Connect wallet card */}
          <div className="bg-white dark:bg-dark-secondary rounded-2xl shadow-lg max-w-lg mx-auto overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Connectez votre wallet
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Connexion sécurisée via MetaMask, Coinbase ou WalletConnect
              </p>
              <WalletConnectButton
                onConnect={handleWalletConnect}
                variant="primary"
                fullWidth
                size="lg"
              />
            </div>
            <div className="px-8 py-4 bg-gray-50 dark:bg-dark/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Connexion sécurisée
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pas de stockage de clés
                </div>
              </div>
            </div>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: 'Analyse multi-blockchain',
                description: 'Connectez et analysez des transactions sur Ethereum, Polygon, Arbitrum et plus.',
                icon: (
                  <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                ),
              },
              {
                title: 'Calculs fiscaux automatisés',
                description: 'Générez automatiquement vos plus et moins-values selon la législation française.',
                icon: (
                  <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Rapports export PDF',
                description: 'Téléchargez vos rapports fiscaux prêts à l\'emploi pour votre déclaration.',
                icon: (
                  <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-dark-secondary rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/20">
                <span className="text-primary-500">{metric.icon}</span>
              </div>
              {metric.change && (
                <span
                  className={`text-sm font-medium ${
                    metric.changeType === 'increase'
                      ? 'text-green-500'
                      : metric.changeType === 'decrease'
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}
                >
                  {metric.change}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Network Scanner & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Network Scanner - Left column */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Scanner de réseaux</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Analysez vos transactions sur différentes blockchains
              </p>
            </div>
            <div className="p-6">
              {/* Network buttons */}
              <div className="space-y-3">
                {networks.map((network) => (
                  <button
                    key={network.id}
                    onClick={() => setActiveNetwork(network.id)}
                    className={`w-full flex items-center p-4 rounded-lg border-2 transition-all ${
                      activeNetwork === network.id
                        ? 'border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: network.color }}
                    >
                      {network.name.substring(0, 1)}
                    </div>
                    <span className="ml-4 font-medium text-gray-900 dark:text-white">{network.name}</span>
                    {isLoading && activeNetwork === network.id && (
                      <div className="ml-auto">
                        <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button className="w-full mt-6 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                Analyser {activeNetwork.charAt(0).toUpperCase() + activeNetwork.slice(1)}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
            <div className="p-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Statistiques rapides</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Transactions totales</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">1,243</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Dernière analyse</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Il y a 2 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gain/Perte total</span>
                  <span className="text-sm font-medium text-green-500">+€3,245.67</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Right column */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activité récente</h2>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                  Voir tout
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-6 hover:bg-gray-50 dark:hover:bg-dark/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {tx.type === 'swap' && `Swap ${tx.from} ⟷ ${tx.to}`}
                          {tx.type === 'transfer' && `Transfer ${tx.from}`}
                          {tx.type === 'receive' && `Receive ${tx.to}`}
                        </p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tx.network}</p>
                          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tx.timestamp}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{tx.amount} {tx.type === 'swap' ? tx.from : tx.type === 'transfer' ? tx.from : tx.to}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{tx.value}</p>
                      </div>
                      {getStatusIcon(tx.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tax Report Preview */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Aperçu du rapport fiscal</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyse fiscale complète pour l'année 2024</p>
            </div>
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm">
              Générer rapport complet
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: 'Plus-values réalisées',
                value: '€3,245.67',
                description: 'Gains imposables de l\'année',
                trend: '+8.3%',
              },
              {
                label: 'Moins-values',
                value: '€450.00',
                description: 'Pertes déductibles',
                trend: '-12.5%',
              },
              {
                label: 'Base imposable nette',
                value: '€2,795.67',
                description: 'Montant à déclarer (formulaire 2086)',
                trend: '+6.1%',
              },
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                  <span className={`text-sm font-medium ${
                    item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>{item.trend}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// NextPageWithLayout requires that we add a getLayout function
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dashboard;