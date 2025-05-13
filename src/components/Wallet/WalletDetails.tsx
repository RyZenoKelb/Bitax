// src/components/Wallet/WalletDetails.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { ArrowRightIcon, ArrowsRightLeftIcon, ClockIcon, TagIcon } from '@heroicons/react/24/outline';

interface WalletDetailsProps {
  address: string;
  transactions: any[];
  className?: string;
}

interface TokenBalance {
  symbol: string;
  name?: string;
  balance: string;
  value?: string;
  logo?: string;
}

const WalletDetails: React.FC<WalletDetailsProps> = ({
  address,
  transactions,
  className = '',
}) => {
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [ethBalance, setEthBalance] = useState<string>('0');
  const [networkStats, setNetworkStats] = useState<Record<string, { txCount: number, lastActivity?: string }>>({});
  
  // Formater les montants avec un nombre fixe de décimales
  const formatAmount = (amount: string | number, decimals: number = 4): string => {
    return Number(amount).toFixed(decimals);
  };
  
  // Formater les adresses (raccourcir)
  const formatAddress = (addr: string): string => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  // Formater les dates
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Récupérer le solde ETH et les statistiques par réseau
  useEffect(() => {
    const getEthBalance = async () => {
      try {
        if (address && window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const balance = await provider.getBalance(address);
          setEthBalance(ethers.formatEther(balance));
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du solde ETH:', error);
      }
    };
    
    const generateNetworkStats = () => {
      if (!transactions || transactions.length === 0) return;
      
      // Grouper les transactions par réseau
      const stats: Record<string, { txCount: number, lastActivity?: string }> = {};
      
      transactions.forEach(tx => {
        const network = tx.network || 'eth';
        
        if (!stats[network]) {
          stats[network] = { txCount: 0 };
        }
        
        stats[network].txCount += 1;
        
        // Mettre à jour la dernière activité
        const txDate = new Date(tx.block_timestamp || 0);
        const currentLastActivity = stats[network].lastActivity 
          ? new Date(stats[network].lastActivity) 
          : null;
        
        if (!currentLastActivity || txDate > currentLastActivity) {
          stats[network].lastActivity = txDate.toISOString();
        }
      });
      
      setNetworkStats(stats);
    };
    
    const analyzeTokens = () => {
      // Simuler des balances de tokens (dans une vraie app, vous récupéreriez ces données depuis une API comme Moralis)
      // Ici, nous allons extraire les tokens des transactions pour simuler
      
      const tokens: Record<string, TokenBalance> = {};
      
      // Commencer avec ETH
      tokens['ETH'] = {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: ethBalance,
        value: (parseFloat(ethBalance) * 2500).toFixed(2), // Prix simulé
        logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
      };
      
      // Analyser les transactions pour trouver les tokens
      transactions.forEach(tx => {
        if (tx.tokenSymbol && !tokens[tx.tokenSymbol]) {
          // Simuler des données de token
          tokens[tx.tokenSymbol] = {
            symbol: tx.tokenSymbol,
            name: tx.tokenName || tx.tokenSymbol,
            balance: (Math.random() * 100).toFixed(4), // Solde simulé
            value: (Math.random() * 1000).toFixed(2), // Valeur simulée
          };
        }
      });
      
      // Transformer l'objet en tableau
      const tokensList = Object.values(tokens);
      
      // Calculer la valeur totale
      const total = tokensList.reduce((sum, token) => {
        return sum + (parseFloat(token.value || '0'));
      }, 0);
      
      setTokenBalances(tokensList);
      setTotalValue(total.toFixed(2));
      setIsLoading(false);
    };
    
    getEthBalance();
    generateNetworkStats();
    
    // Utiliser un délai pour simuler le chargement des données
    const timer = setTimeout(() => {
      analyzeTokens();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [address, transactions, ethBalance]);
  
  // Obtenir les 5 dernières transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.block_timestamp || 0).getTime() - new Date(a.block_timestamp || 0).getTime())
    .slice(0, 5);
  
  return (
    <div className={`rounded-xl border border-gray-800/50 overflow-hidden bg-gray-900/20 ${className}`}>
      {/* En-tête */}
      <div className="bg-gray-800/30 border-b border-gray-800/50 p-4">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <span>Détails du wallet</span>
          <span className="ml-auto text-sm font-normal text-gray-400">{formatAddress(address)}</span>
        </h2>
      </div>
      
      {/* Contenu */}
      <div className="p-4 space-y-6">
        {/* Valeur totale */}
        <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
          <div className="text-sm text-gray-400 mb-1">Valeur totale estimée</div>
          <div className="text-2xl font-semibold text-white">
            {isLoading ? (
              <div className="animate-pulse h-8 w-32 bg-gray-700 rounded"></div>
            ) : (
              `$${totalValue}`
            )}
          </div>
        </div>
        
        {/* Activité par réseau */}
        <div>
          <h3 className="text-md font-medium text-white mb-3">Activité par réseau</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center p-3 bg-gray-800/30 rounded-lg">
                  <div className="rounded-full h-8 w-8 bg-gray-700 mr-3"></div>
                  <div className="flex-grow">
                    <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(networkStats).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(networkStats).map(([network, stats]) => (
                <div key={network} className="flex items-center p-3 bg-gray-800/30 rounded-lg">
                  <div className="mr-3">
                    <NetworkIcon network={network as NetworkType} size={24} />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {SUPPORTED_NETWORKS[network as NetworkType]?.name || network}
                    </div>
                    <div className="text-sm text-gray-400 flex items-center">
                      <ArrowsRightLeftIcon className="w-3 h-3 mr-1" />
                      {stats.txCount} transactions
                      {stats.lastActivity && (
                        <>
                          <span className="mx-1">•</span>
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Dernière activité: {formatDate(stats.lastActivity)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-400">
              Aucune activité détectée sur ce wallet
            </div>
          )}
        </div>
        
        {/* Tokens */}
        <div>
          <h3 className="text-md font-medium text-white mb-3">Tokens</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="rounded-full h-8 w-8 bg-gray-700 mr-3"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-700 rounded mb-2"></div>
                      <div className="h-3 w-16 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div>
                    <div className="h-4 w-20 bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 w-16 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : tokenBalances.length > 0 ? (
            <div className="space-y-2">
              {tokenBalances.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      {token.logo ? (
                        <img src={token.logo} alt={token.symbol} className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-medium">{token.symbol.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-white">{token.symbol}</div>
                      {token.name && token.name !== token.symbol && (
                        <div className="text-xs text-gray-400">{token.name}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white">{formatAmount(token.balance)}</div>
                    {token.value && (
                      <div className="text-xs text-gray-400">${formatAmount(token.value, 2)}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-gray-400">
              Aucun token détecté sur ce wallet
            </div>
          )}
        </div>
        
        {/* Transactions récentes */}
        <div>
          <h3 className="text-md font-medium text-white mb-3">Transactions récentes</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="h-4 w-16 bg-gray-700 rounded"></div>
                    <div className="h-4 w-24 bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-32 bg-gray-700 rounded"></div>
                    <div className="h-3 w-20 bg-gray-700 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <TagIcon className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm font-medium text-white">
                        {tx.tokenSymbol || 'ETH'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDate(tx.block_timestamp)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400">
                      <span>{formatAddress(tx.from_address)}</span>
                      <ArrowRightIcon className="w-3 h-3 mx-1" />
                      <span>{formatAddress(tx.to_address)}</span>
                    </div>
                    <div 
                      className={`text-xs font-medium ${
                        tx.from_address.toLowerCase() === address.toLowerCase()
                          ? 'text-red-400'
                          : 'text-green-400'
                      }`}
                    >
                      {tx.from_address.toLowerCase() === address.toLowerCase() ? '-' : '+'}
                      {formatAmount(tx.valueInETH || ethers.formatEther(tx.value || '0'))}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full py-2 mt-2 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                Afficher toutes les transactions
              </button>
            </div>
          ) : (
            <div className="text-center p-4 text-gray-400">
              Aucune transaction trouvée
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletDetails;