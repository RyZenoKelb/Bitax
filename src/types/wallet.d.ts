// src/types/wallet.d.ts
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
  name: string | undefined;
  address: string;
  network: string;
  isPrimary?: boolean;
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

export interface WalletConnectButtonProps {
  onConnect?: (address: string, provider: any) => void;
  className?: string;
  variant?: 'default' | 'primary' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showIcon?: boolean;
  showAddress?: boolean;
  isLoading?: boolean;
}

export interface WalletTransaction {
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
  priceUSD?: string; // Ajouté pour résoudre l'erreur
  network?: string;
  fee?: string;
}

export interface IntrinsicAttributes {
  onConnect?: (address: string, walletProvider: any) => Promise<void>;
}