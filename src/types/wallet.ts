// src/types/wallet.ts
export type WalletType = 
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'trustwallet'
  | 'ledger'
  | 'trezor'
  | 'manual'
  | 'imported';

export type Blockchain = 
  | 'ethereum'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'solana'
  | 'avalanche'
  | 'binance'
  | 'other';

export type SupportedNetwork = 
  | 'eth'
  | 'polygon'
  | 'arbitrum'
  | 'optimism'
  | 'base'
  | 'solana'
  | 'avax'
  | 'bnb';

export interface WalletInfo {
  id: string;
  name: string | null;
  address: string;
  network: string;
  isPrimary: boolean;
  walletType: WalletType;
  createdAt: string;
  updatedAt: string;
  lastSynced?: string;
  status?: 'synced' | 'syncing' | 'error' | 'pending';
  balance?: string;
  transactions?: number;
}

export interface NetworkInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  chainId?: number;
  explorerUrl?: string;
  currency?: string;
  rpcUrls?: string[];
}

export interface ExchangeInfo {
  id: string;
  name: string;
  logo: string;
  supportsAPI: boolean;
  supportsCSV: boolean;
  description?: string;
}