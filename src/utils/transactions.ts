// src/utils/transactions.ts
import { NetworkType } from '@/types';

// Interface pour les informations réseau
export interface NetworkInfo {
  name: string;
  nativeTokenSymbol: string;
  color: string;
  icon: string;
  chainId?: number;
  rpcUrl?: string;
  explorerUrl?: string;
}

// Configuration des réseaux supportés
export const SUPPORTED_NETWORKS: Record<NetworkType, NetworkInfo> = {
  eth: {
    name: 'Ethereum',
    nativeTokenSymbol: 'ETH',
    color: '#627EEA',
    icon: '🔷',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    explorerUrl: 'https://etherscan.io'
  },
  polygon: {
    name: 'Polygon',
    nativeTokenSymbol: 'MATIC',
    color: '#8247E5',
    icon: '🟣',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorerUrl: 'https://polygonscan.com'
  },
  arbitrum: {
    name: 'Arbitrum',
    nativeTokenSymbol: 'ETH',
    color: '#28A0F0',
    icon: '🔵',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io'
  },
  optimism: {
    name: 'Optimism',
    nativeTokenSymbol: 'ETH',
    color: '#FF0420',
    icon: '🔴',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    explorerUrl: 'https://optimistic.etherscan.io'
  },
  base: {
    name: 'Base',
    nativeTokenSymbol: 'ETH',
    color: '#0052FF',
    icon: '🟢',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    explorerUrl: 'https://basescan.org'
  },
  solana: {
    name: 'Solana',
    nativeTokenSymbol: 'SOL',
    color: '#9945FF',
    icon: '🟪',
    explorerUrl: 'https://explorer.solana.com'
  },
  avalanche: {
    name: 'Avalanche',
    nativeTokenSymbol: 'AVAX',
    color: '#E84142',
    icon: '❄️',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io'
  },
  bsc: {
    name: 'BNB Chain',
    nativeTokenSymbol: 'BNB',
    color: '#F0B90B',
    icon: '🟡',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    explorerUrl: 'https://bscscan.com'
  }
};

// Interface pour les transactions
export interface Transaction {
  hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  input?: string;
  type: string;
  tokenSymbol?: string;
  tokenDecimals?: number;
  valueInETH?: number;
  network: NetworkType;
}

// Fonction pour récupérer les transactions (stub pour l'exemple)
export async function getTransactions(address: string, network: NetworkType): Promise<Transaction[]> {
  // Simulation de données pour l'exemple
  // Dans une implémentation réelle, vous feriez un appel API ici
  console.log(`Fetching transactions for ${address} on ${network}...`);
  
  // Simuler un délai de réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Retourner quelques transactions d'exemple
  return [
    {
      hash: `0x${Math.random().toString(16).slice(2)}`,
      block_timestamp: new Date().toISOString(),
      value: '1000000000000000000', // 1 ETH en wei
      from_address: address,
      to_address: `0x${Math.random().toString(16).slice(2)}`,
      type: 'Transfer',
      network
    },
    {
      hash: `0x${Math.random().toString(16).slice(2)}`,
      block_timestamp: new Date(Date.now() - 86400000).toISOString(), // Hier
      value: '500000000000000000', // 0.5 ETH en wei
      from_address: `0x${Math.random().toString(16).slice(2)}`,
      to_address: address,
      type: 'Receive',
      network
    }
  ];
}