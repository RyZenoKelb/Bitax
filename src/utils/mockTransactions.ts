// src/utils/mockTransactions.ts
import { NetworkType, TransactionResult, SUPPORTED_NETWORKS } from './transactions';

/**
 * Vérifie si le mode dev est activé
 * @returns boolean
 */
export function isDevModeEnabled(): boolean {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bitax-dev-mode') === 'true';
  }
  return false;
}

/**
 * Génère un hash aléatoire pour une transaction
 * @returns string
 */
function generateRandomHash(): string {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Génère une adresse Ethereum aléatoire
 * @returns string
 */
function generateRandomEthAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

/**
 * Génère une adresse Solana aléatoire
 * @returns string
 */
function generateRandomSolanaAddress(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 44 }, () => 
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

/**
 * Génère une date timestamp aléatoire des 6 derniers mois
 * @returns string
 */
function generateRandomTimestamp(): string {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTimestamp = new Date(
    sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
  );
  
  return randomTimestamp.toISOString();
}

/**
 * Génère un montant aléatoire
 * @param min Montant minimum
 * @param max Montant maximum
 * @param decimals Nombre de décimales 
 * @returns number
 */
function generateRandomAmount(min: number = 0.001, max: number = 2.5, decimals: number = 6): number {
  const randomValue = min + Math.random() * (max - min);
  return parseFloat(randomValue.toFixed(decimals));
}

/**
 * Liste de noms de tokens pour la simulation
 */
const MOCK_TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', decimals: 18 },
  { symbol: 'BTC', name: 'Bitcoin (Wrapped)', decimals: 8 },
  { symbol: 'USDT', name: 'Tether USD', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  { symbol: 'MATIC', name: 'Polygon', decimals: 18 },
  { symbol: 'SOL', name: 'Solana', decimals: 9 },
  { symbol: 'AVAX', name: 'Avalanche', decimals: 18 },
  { symbol: 'LINK', name: 'Chainlink', decimals: 18 },
  { symbol: 'UNI', name: 'Uniswap', decimals: 18 },
  { symbol: 'AAVE', name: 'Aave', decimals: 18 },
  { symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18 },
  { symbol: 'SHIB', name: 'Shiba Inu', decimals: 18 }
];

/**
 * Types de transactions pour la simulation
 */
const TRANSACTION_TYPES = [
  'Native Transfer', 
  'Token Transfer', 
  'NFT Transfer', 
  'Swap', 
  'Token Approval',
  'Smart Contract Interaction'
];

/**
 * Génère un tableau de transactions simulées pour un réseau donné
 * @param network Type de réseau
 * @param count Nombre de transactions à générer
 * @param address Adresse à utiliser comme référence
 * @returns TransactionResult[]
 */
export function generateMockTransactions(network: NetworkType, count: number, address: string): TransactionResult[] {
  const networkConfig = SUPPORTED_NETWORKS[network];
  const transactions: TransactionResult[] = [];
  
  const isSolana = network === 'solana';
  const randomAddress = isSolana ? generateRandomSolanaAddress : generateRandomEthAddress;
  
  for (let i = 0; i < count; i++) {
    // Déterminer si c'est une transaction entrante ou sortante
    const isOutgoing = Math.random() > 0.5;
    const fromAddress = isOutgoing ? address : randomAddress();
    const toAddress = isOutgoing ? randomAddress() : address;
    
    // Choisir un type de transaction aléatoire
    const transactionType = TRANSACTION_TYPES[Math.floor(Math.random() * TRANSACTION_TYPES.length)];
    
    // Si c'est un transfert de token, choisir un token aléatoire
    let tokenSymbol = networkConfig.nativeTokenSymbol;
    let tokenName = networkConfig.name;
    let tokenDecimals = networkConfig.nativeTokenDecimals;
    let isNFT = false;
    let contractAddress = '';
    
    // 60% des transactions seront des jetons plutôt que la monnaie native
    if (Math.random() > 0.4 && transactionType !== 'Native Transfer') {
      const randomToken = MOCK_TOKENS[Math.floor(Math.random() * MOCK_TOKENS.length)];
      tokenSymbol = randomToken.symbol;
      tokenName = randomToken.name;
      tokenDecimals = randomToken.decimals;
      contractAddress = randomAddress();
    }
    
    // 10% des transactions seront des NFTs
    if (Math.random() > 0.9 || transactionType === 'NFT Transfer') {
      isNFT = true;
      tokenSymbol = 'NFT';
      tokenName = `NFT Collection #${Math.floor(Math.random() * 1000)}`;
    }
    
    // Générer un montant aléatoire
    const amount = isNFT ? 1 : generateRandomAmount();
    const valueInETH = isNFT ? 0 : amount;
    const value = isNFT ? '1' : (amount * Math.pow(10, tokenDecimals)).toString();
    
    // Créer la transaction simulée
    const transaction: TransactionResult = {
      hash: generateRandomHash(),
      block_timestamp: generateRandomTimestamp(),
      value,
      from_address: fromAddress,
      to_address: toAddress,
      input: transactionType !== 'Native Transfer' ? '0x' + Array(10).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('') : '0x',
      type: transactionType,
      tokenSymbol,
      tokenName,
      tokenDecimals,
      contractAddress: transactionType !== 'Native Transfer' ? contractAddress : '',
      valueInETH,
      network,
      success: Math.random() > 0.05, // 5% de transactions échouées
      fee: (generateRandomAmount(0.0001, 0.01, 8)).toString(),
      isNFT
    };
    
    // Ajouter la transaction à la liste
    transactions.push(transaction);
  }
  
  // Trier par timestamp (plus récent d'abord)
  return transactions.sort((a, b) => {
    const dateA = new Date(a.block_timestamp || 0).getTime();
    const dateB = new Date(b.block_timestamp || 0).getTime();
    return dateB - dateA;
  });
}

/**
 * Simule un délai pour imiter les temps de réponse API
 * @param min Délai minimum en ms
 * @param max Délai maximum en ms
 * @returns Promise<void>
 */
export function simulateDelay(min: number = 500, max: number = 2000): Promise<void> {
  const delay = Math.floor(min + Math.random() * (max - min));
  return new Promise(resolve => setTimeout(resolve, delay));
}