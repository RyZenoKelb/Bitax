import axios from 'axios';
import { filterSpamTransactions } from './SpamFilter';

// ⚠️ Pour la production, ces clés devraient être stockées dans les variables d'environnement
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY || 'votre_clé_api';
const SOLANA_API_KEY = process.env.NEXT_PUBLIC_SOLANA_API_KEY || 'votre_clé_solana';
const SOLSCAN_API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY || '';

// Configuration des réseaux supportés
export type NetworkType = 'eth' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'solana' | 'avalanche' | 'bsc';

export interface NetworkConfig {
  name: string;
  icon: string;
  color: string;
  nativeToken: string;
  nativeTokenDecimals: number;
  nativeTokenSymbol: string;
  explorerUrl: string;
  apiEndpoint?: string;
}

export const SUPPORTED_NETWORKS: Record<NetworkType, NetworkConfig> = {
  eth: {
    name: 'Ethereum',
    icon: '🔷',
    color: '#627EEA',
    nativeToken: 'ethereum',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'ETH',
    explorerUrl: 'https://etherscan.io/tx/'
  },
  polygon: {
    name: 'Polygon',
    icon: '🟣',
    color: '#8247E5',
    nativeToken: 'matic-network',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'MATIC',
    explorerUrl: 'https://polygonscan.com/tx/'
  },
  arbitrum: {
    name: 'Arbitrum',
    icon: '🔵',
    color: '#28A0F0',
    nativeToken: 'ethereum',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'ETH',
    explorerUrl: 'https://arbiscan.io/tx/'
  },
  optimism: {
    name: 'Optimism',
    icon: '🔴',
    color: '#FF0420',
    nativeToken: 'ethereum',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'ETH',
    explorerUrl: 'https://optimistic.etherscan.io/tx/'
  },
  base: {
    name: 'Base',
    icon: '🟢',
    color: '#0052FF',
    nativeToken: 'ethereum',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'ETH',
    explorerUrl: 'https://basescan.org/tx/'
  },
  solana: {
    name: 'Solana',
    icon: '🟪',
    color: '#9945FF',
    nativeToken: 'solana',
    nativeTokenDecimals: 9,
    nativeTokenSymbol: 'SOL',
    explorerUrl: 'https://solscan.io/tx/',
    apiEndpoint: 'https://api.solscan.io/account/transaction'
  },
  avalanche: {
    name: 'Avalanche',
    icon: '❄️',
    color: '#E84142',
    nativeToken: 'avalanche-2',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'AVAX',
    explorerUrl: 'https://snowtrace.io/tx/'
  },
  bsc: {
    name: 'BNB Chain',
    icon: '🟡',
    color: '#F0B90B',
    nativeToken: 'binancecoin',
    nativeTokenDecimals: 18,
    nativeTokenSymbol: 'BNB',
    explorerUrl: 'https://bscscan.com/tx/'
  }
};

interface TransactionData {
  transaction_hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  input?: string;
  token_decimals?: string; // Pour les tokens ERC20
  token_symbol?: string;   // Pour les tokens ERC20
  token_name?: string;     // Pour les tokens ERC20
  contract_address?: string; // Adresse du contrat du token
  [key: string]: any;
}

// Interface commune pour standardiser les transactions à travers différentes blockchains
export interface TransactionResult {
  hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  input?: string;
  type: string;
  tokenSymbol?: string;
  tokenName?: string;
  tokenDecimals?: number;
  contractAddress?: string;
  valueInETH?: number;
  network: NetworkType; // Nouvelle propriété pour identifier le réseau
  success?: boolean;    // Pour indiquer si la transaction a réussi
  fee?: string;         // Frais de transaction
  nftId?: string;       // ID du NFT si applicable
  isNFT?: boolean;      // Indique si c'est une transaction NFT
}

/**
 * Récupère les transactions natives (ETH/MATIC/etc.) pour un compte sur une blockchain spécifique
 * @param account L'adresse du wallet à scanner
 * @param chain La blockchain à scanner
 * @returns Liste des transactions formatées
 */
export async function getNativeTransactions(account: string, chain: NetworkType): Promise<TransactionResult[]> {
  try {
    if (!account || !chain) {
      console.error('Paramètres invalides pour getNativeTransactions', { account, chain });
      return [];
    }

    // Cas spécial pour Solana
    if (chain === 'solana') {
      return getSolanaTransactions(account);
    }

    // Endpoint pour les transactions natives (ETH/MATIC/etc.)
    const url = `https://deep-index.moralis.io/api/v2.2/${account}?chain=${chain}&limit=100`;
    
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      },
    });

    if (!response.data || !response.data.result || !Array.isArray(response.data.result)) {
      console.error('Format de réponse Moralis invalide', response.data);
      return [];
    }

    const networkConfig = SUPPORTED_NETWORKS[chain];
    const decimals = networkConfig.nativeTokenDecimals;

    const mappedTransactions = response.data.result.map((tx: any) => ({
      hash: tx.hash || '',
      block_timestamp: tx.block_timestamp || '',
      value: tx.value || '0',
      from_address: tx.from_address || '',
      to_address: tx.to_address || '',
      input: tx.input,
      type: 'Native Transfer',
      valueInETH: Number(tx.value) / Math.pow(10, decimals),
      network: chain,
      tokenSymbol: networkConfig.nativeTokenSymbol,
      success: tx.receipt_status === '1' || tx.receipt_status === 1,
      fee: tx.gas_price ? (Number(tx.gas_price) * Number(tx.gas) / Math.pow(10, decimals)).toFixed(6) : undefined
    }));

    return mappedTransactions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erreur Axios lors de la récupération des transactions natives sur ${chain}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });
    } else {
      console.error(`Erreur lors de la récupération des transactions natives sur ${chain}:`, error);
    }
    return [];
  }
}

/**
 * Récupère les transactions ERC20 pour un compte sur une blockchain spécifique
 * @param account L'adresse du wallet à scanner
 * @param chain La blockchain à scanner
 * @returns Liste des transactions formatées
 */
export async function getERC20Transactions(account: string, chain: NetworkType): Promise<TransactionResult[]> {
  try {
    if (!account || !chain) {
      console.error('Paramètres invalides pour getERC20Transactions', { account, chain });
      return [];
    }

    // Cas spécial pour Solana (SPL tokens)
    if (chain === 'solana') {
      return getSolanaSPLTransactions(account);
    }

    // Endpoint pour les transferts de tokens ERC20
    const url = `https://deep-index.moralis.io/api/v2.2/${account}/erc20/transfers?chain=${chain}&limit=100`;
    
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      },
    });

    if (!response.data || !response.data.result || !Array.isArray(response.data.result)) {
      console.error('Format de réponse Moralis invalide', response.data);
      return [];
    }

    const mappedTransactions = response.data.result.map((tx: TransactionData) => {
      const decimals = tx.token_decimals ? parseInt(tx.token_decimals) : 18;
      const valueWithDecimals = tx.value ? Number(tx.value) / Math.pow(10, decimals) : 0;
      
      return {
        hash: tx.transaction_hash || '',
        block_timestamp: tx.block_timestamp || '',
        value: tx.value || '0',
        from_address: tx.from_address || '',
        to_address: tx.to_address || '',
        input: tx.input,
        type: 'Token Transfer',
        tokenSymbol: tx.token_symbol || 'UNKNOWN',
        tokenName: tx.token_name || '',
        contractAddress: tx.contract_address || '',
        tokenDecimals: decimals,
        valueInETH: valueWithDecimals,
        network: chain
      };
    });

    return mappedTransactions;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erreur Axios lors de la récupération des transactions ERC20 sur ${chain}:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });
    } else {
      console.error(`Erreur lors de la récupération des transactions ERC20 sur ${chain}:`, error);
    }
    return [];
  }
}

/**
 * Récupère les transactions NFT (ERC721) pour un compte
 * @param account L'adresse du wallet à scanner
 * @param chain La blockchain à scanner
 * @returns Liste des transactions NFT formatées
 */
export async function getNFTTransactions(account: string, chain: NetworkType): Promise<TransactionResult[]> {
  try {
    if (!account || !chain || chain === 'solana') {
      // Pour Solana, les NFTs sont déjà inclus dans les transactions SPL
      if (chain === 'solana') return [];
      
      console.error('Paramètres invalides pour getNFTTransactions', { account, chain });
      return [];
    }

    const url = `https://deep-index.moralis.io/api/v2.2/${account}/nft/transfers?chain=${chain}&limit=100`;
    
    const response = await axios.get(url, {
      headers: {
        'accept': 'application/json',
        'X-API-Key': MORALIS_API_KEY,
      },
    });

    if (!response.data || !response.data.result || !Array.isArray(response.data.result)) {
      console.error('Format de réponse Moralis invalide', response.data);
      return [];
    }

    const mappedTransactions = response.data.result.map((tx: any) => ({
      hash: tx.transaction_hash || '',
      block_timestamp: tx.block_timestamp || '',
      value: '0',  // Les NFTs n'ont pas de "valeur" numérique traditionnelle
      from_address: tx.from_address || '',
      to_address: tx.to_address || '',
      type: 'NFT Transfer',
      tokenSymbol: tx.contract_symbol || 'NFT',
      tokenName: tx.contract_name || 'Unknown NFT',
      contractAddress: tx.contract_address || '',
      network: chain,
      nftId: tx.token_id || '',
      isNFT: true
    }));

    return mappedTransactions;
  } catch (error) {
    console.error(`Erreur lors de la récupération des transactions NFT sur ${chain}:`, error);
    return [];
  }
}

/**
 * Récupère les transactions Solana pour un compte
 * @param account L'adresse du wallet Solana
 * @returns Liste des transactions formatées
 */
export async function getSolanaTransactions(account: string): Promise<TransactionResult[]> {
  try {
    if (!account) {
      console.error('Adresse invalide pour getSolanaTransactions', { account });
      return [];
    }

    // Utiliser SolScan API pour récupérer les transactions
    const url = `https://api.solscan.io/account/transaction`;
    const params = {
      account: account,
      limit: 100
    };
    
    const headers: Record<string, string> = {
      'accept': 'application/json'
    };
    
    if (SOLSCAN_API_KEY) {
      headers['token'] = SOLSCAN_API_KEY;
    }
    
    const response = await axios.get(url, {
      params,
      headers
    });

    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error('Format de réponse SolScan invalide', response.data);
      return [];
    }

    const transactions = response.data.data;
    
    const mappedTransactions = transactions.map((tx: any) => {
      // Déterminer le type de transaction
      let type = 'SOL Transfer';
      if (tx.parsedInstruction && tx.parsedInstruction.length > 0) {
        const instructions = tx.parsedInstruction;
        if (instructions.some((instr: any) => instr.type === 'spl-transfer')) {
          type = 'Token Transfer';
        } else if (instructions.some((instr: any) => instr.type === 'nft-transfer')) {
          type = 'NFT Transfer';
        }
      }
      
      // Parser la valeur transférée
      let value = '0';
      let valueInETH = 0;
      let tokenSymbol = 'SOL';
      
      if (tx.parsedInstruction && tx.parsedInstruction.length > 0) {
        const solTransfer = tx.parsedInstruction.find((instr: any) => 
          instr.type === 'sol-transfer' || instr.type === 'system-transfer'
        );
        
        if (solTransfer && solTransfer.data) {
          value = String(solTransfer.data.amount || 0);
          valueInETH = Number(value) / 1e9; // 9 décimales pour SOL
        }
        
        const tokenTransfer = tx.parsedInstruction.find((instr: any) => 
          instr.type === 'spl-transfer'
        );
        
        if (tokenTransfer && tokenTransfer.data) {
          value = String(tokenTransfer.data.amount || 0);
          valueInETH = Number(value) / Math.pow(10, tokenTransfer.data.decimals || 9);
          tokenSymbol = tokenTransfer.data.symbol || 'Unknown';
        }
      }
      
      return {
        hash: tx.txHash || '',
        block_timestamp: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : '',
        value: value,
        from_address: tx.signer && tx.signer.length > 0 ? tx.signer[0] : '',
        to_address: '', // Solana transactions don't have a direct "to" address
        type: type,
        tokenSymbol: tokenSymbol,
        valueInETH: valueInETH,
        network: 'solana' as NetworkType,
        success: tx.status === 'Success',
        fee: tx.fee ? (Number(tx.fee) / 1e9).toFixed(6) : undefined // SOL lamports to SOL
      };
    });

    return mappedTransactions;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions Solana:', error);
    return [];
  }
}

/**
 * Récupère les transactions de tokens SPL (Solana Program Library) pour un compte Solana
 * @param account L'adresse du wallet Solana
 * @returns Liste des transactions de tokens SPL formatées
 */
export async function getSolanaSPLTransactions(account: string): Promise<TransactionResult[]> {
  try {
    if (!account) {
      console.error('Adresse invalide pour getSolanaSPLTransactions', { account });
      return [];
    }

    // Utiliser SolScan API pour récupérer les tokens SPL
    const url = `https://api.solscan.io/account/tokens`;
    const params = {
      account: account
    };
    
    const headers: Record<string, string> = {
      'accept': 'application/json'
    };
    
    if (SOLSCAN_API_KEY) {
      headers['token'] = SOLSCAN_API_KEY;
    }
    
    const response = await axios.get(url, {
      params,
      headers
    });

    if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
      console.error('Format de réponse SolScan invalide pour les tokens SPL', response.data);
      return [];
    }

    // Pour chaque token SPL, récupérer les transferts
    const tokensList = response.data.data;
    let allTransactions: TransactionResult[] = [];
    
    // Limiter le nombre de requêtes parallèles pour éviter les limites d'API
    const batchSize = 5;
    for (let i = 0; i < tokensList.length; i += batchSize) {
      const batch = tokensList.slice(i, i + batchSize);
      const batchPromises = batch.map(async (token: any) => {
        try {
          const tokenUrl = `https://api.solscan.io/account/token/txs`;
          const tokenParams = {
            account: account,
            token: token.tokenAddress
          };
          
          const tokenResponse = await axios.get(tokenUrl, {
            params: tokenParams,
            headers
          });
          
          if (!tokenResponse.data || !tokenResponse.data.data || !Array.isArray(tokenResponse.data.data)) {
            return [];
          }
          
          return tokenResponse.data.data.map((tx: any) => ({
            hash: tx.txHash || '',
            block_timestamp: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : '',
            value: tx.amount ? String(tx.amount) : '0',
            from_address: tx.src || '',
            to_address: tx.dst || '',
            type: 'Token Transfer',
            tokenSymbol: token.symbol || 'Unknown',
            tokenName: token.name || '',
            contractAddress: token.tokenAddress || '',
            tokenDecimals: token.decimals || 0,
            valueInETH: tx.amount ? Number(tx.amount) / Math.pow(10, token.decimals || 0) : 0,
            network: 'solana' as NetworkType,
            isNFT: token.tokenType === 'nft'
          }));
        } catch (error) {
          console.error(`Erreur lors de la récupération des transactions du token ${token.symbol}:`, error);
          return [];
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      allTransactions = [...allTransactions, ...batchResults.flat()];
      
      // Pause entre les lots pour éviter les limites de taux d'API
      if (i + batchSize < tokensList.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return allTransactions;
  } catch (error) {
    console.error('Erreur lors de la récupération des transactions SPL Solana:', error);
    return [];
  }
}

/**
 * Récupère tous types de transactions pour un compte
 * @param account L'adresse du wallet à scanner
 * @param chain La blockchain à scanner
 * @returns Toutes les transactions combinées
 */
export async function getTransactions(account: string, chain: NetworkType): Promise<TransactionResult[]> {
  try {
    // Normaliser l'adresse du compte
    const normalizedAccount = normalizeAddress(account, chain);
    
    if (!normalizedAccount) {
      console.error('Adresse de wallet invalide pour ' + chain);
      return [];
    }
    
    let nativeTxs: TransactionResult[] = [];
    let erc20Txs: TransactionResult[] = [];
    let nftTxs: TransactionResult[] = [];
    
    // Récupérer les différents types de transactions en fonction de la blockchain
    if (chain === 'solana') {
      // Pour Solana, une seule API couvre les transferts natifs et les tokens
      [nativeTxs, erc20Txs] = await Promise.all([
        getSolanaTransactions(normalizedAccount),
        getSolanaSPLTransactions(normalizedAccount)
      ]);
    } else {
      // Pour les blockchains EVM (Ethereum, Polygon, etc.)
      [nativeTxs, erc20Txs, nftTxs] = await Promise.all([
        getNativeTransactions(normalizedAccount, chain),
        getERC20Transactions(normalizedAccount, chain),
        getNFTTransactions(normalizedAccount, chain)
      ]);
    }
    
    // Filtrer les transactions spam/scam
    const filteredERC20Txs = filterSpamTransactions(erc20Txs);
    
    // Fusionner et trier par timestamp
    const allTransactions = [...nativeTxs, ...filteredERC20Txs, ...nftTxs]
      .filter(tx => tx) // Exclure les valeurs null/undefined
      .sort((a, b) => {
        const dateA = new Date(a.block_timestamp || 0).getTime();
        const dateB = new Date(b.block_timestamp || 0).getTime();
        return dateB - dateA; // Tri par ordre décroissant (plus récent d'abord)
      });
    
    return allTransactions;
  } catch (error) {
    console.error(`Erreur lors de la récupération de toutes les transactions sur ${chain}:`, error);
    return [];
  }
}

/**
 * Adapte les adresses de wallet au format attendu par chaque blockchain
 * @param address Adresse du wallet
 * @param network Type de réseau
 * @returns Adresse normalisée
 */
function normalizeAddress(address: string, network: NetworkType): string {
  if (!address) return '';
  
  // Solana utilise des adresses au format Base58, ne pas modifier
  if (network === 'solana') {
    return address;
  }
  
  // Pour les blockchains EVM, normaliser l'adresse en minuscules
  return address.toLowerCase();
}

/**
 * Classifie une transaction en fonction de ses caractéristiques
 * @param tx Données de la transaction
 * @returns Type de transaction identifié
 */
export function classifyTransaction(tx: TransactionResult): string {
  // Si le type est déjà défini et spécifique
  if (tx.type === 'NFT Transfer' || tx.isNFT) {
    return "NFT Transfer";
  }
  
  // Si c'est une blockchain spécifique comme Solana
  if (tx.network === 'solana') {
    if (tx.tokenSymbol && tx.tokenSymbol !== 'SOL') {
      return "SPL Token Transfer";
    }
    return "SOL Transfer";
  }
  
  // Si l'adresse de destination n'existe pas
  if (!tx.to_address) return "Unknown";

  const to = tx.to_address.toLowerCase();
  const from = tx.from_address?.toLowerCase() || '';

  // Identification des échanges DEX courants
  if (to.includes('uniswap') || to.includes('sushiswap') || to.includes('pancakeswap') || 
      to.includes('quickswap') || to.includes('curve') || to.includes('balancer') ||
      to.includes('serum') || to.includes('raydium')) {
    return "Swap";
  }

  // Identification des plateformes NFT
  if (to.includes('opensea') || to.includes('rarible') || to.includes('looksrare') ||
      to.includes('magiceden') || to.includes('solanart')) {
    return "NFT Marketplace";
  }

  // Analyse des données d'entrée (input data)
  if (tx.input && tx.input !== "0x") {
    // Méthode transfer ERC20 (signature standard)
    if (tx.input.startsWith("0xa9059cbb")) {
      return "Token Transfer";
    }
    // Méthode approve ERC20 (signature standard)
    else if (tx.input.startsWith("0x095ea7b3")) {
      return "Token Approval";
    }
    // Autre interaction avec contrat intelligent
    else {
      return "Smart Contract Interaction";
    }
  }

  // Transfert simple (sans données d'entrée)
  if (!tx.input || tx.input === "0x") {
    if (tx.tokenSymbol && tx.tokenSymbol !== 'ETH' && tx.tokenSymbol !== 'MATIC' &&
        tx.tokenSymbol !== 'BNB' && tx.tokenSymbol !== 'AVAX' && tx.tokenSymbol !== 'SOL') {
      return "Token Transfer";
    }
    return "Native Transfer";
  }

  // Si aucun des cas ci-dessus ne correspond
  return "Unknown";
}

/**
 * Récupère la configuration d'un réseau
 * @param network Le type de réseau
 * @returns La configuration du réseau
 */
export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return SUPPORTED_NETWORKS[network];
}

/**
 * Génère un lien vers l'explorateur de blockchain pour une transaction
 * @param hash Hash de la transaction
 * @param network Réseau de la transaction
 * @returns URL de l'explorateur
 */
export function getExplorerLink(hash: string, network: NetworkType): string {
  const config = SUPPORTED_NETWORKS[network];
  return `${config.explorerUrl}${hash}`;
}