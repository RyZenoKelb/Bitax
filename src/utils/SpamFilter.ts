/**
 * Utilitaire pour filtrer les transactions spam/scam
 */

// Liste de mots-clés associés aux scams/spams courants
const SPAM_KEYWORDS = [
    'claim', 'airdrop', 'free', 'reward', 'bonus', 'promo',
    'join', 'win', 'giveaway', 'prize', 'gift', 'limited',
    'presale', 'pre-sale', 'whitelist', 'mint', 'access',
    'exclusive', 'launch', 'invest', 'sale', 'discount',
    'yield', 'farm', 'pool', 'staking', 'mining', 'token',
    'binance', 'approve', 'dao', 'governance', 'vote', 
    'nft', 'opensea', 'rarible', 'foundation', 'superrare',
    'lido', 'eth2', 'steth', 'asia', 'dog', 'inu'
  ];
  
  // Liste de domaines suspects
  const SUSPICIOUS_DOMAINS = [
    '.com/?claim', '.live/?claim', '.dog', '.finance', '.asia',
    '.eth', '.xyz', '.io/?', '.org/?', '.net/?', '.app/?',
    'ethena', 'uniswap', 'aave', 'lido', 'compound', 'maker',
    'sushi', 'pancake', 'curve', '1inch', 'balancer', 'synthetix'
  ];
  
  // Montants suspects (trop élevés)
  const SUSPICIOUS_AMOUNT_THRESHOLD = 10000; // 10,000 tokens
  
  /**
   * Vérifie si un token semble être un spam/scam
   * @param tokenSymbol Symbole du token
   * @param tokenValue Valeur de la transaction
   * @returns true si le token est probablement un spam
   */
  export function isSpamToken(tokenSymbol?: string, tokenValue?: number): boolean {
    if (!tokenSymbol) return false;
    
    // Convertir en minuscules pour la comparaison
    const symbol = tokenSymbol.toLowerCase();
    
    // 1. Vérifier si le montant est anormalement élevé
    if (tokenValue && tokenValue > SUSPICIOUS_AMOUNT_THRESHOLD) {
      return true;
    }
    
    // 2. Vérifier la longueur du symbole (les spams ont souvent des noms longs)
    if (symbol.length > 10) {
      return true;
    }
    
    // 3. Vérifier si le symbole contient des mots-clés de spam
    for (const keyword of SPAM_KEYWORDS) {
      if (symbol.includes(keyword.toLowerCase())) {
        return true;
      }
    }
    
    // 4. Vérifier si le symbole contient des domaines suspects
    for (const domain of SUSPICIOUS_DOMAINS) {
      if (symbol.includes(domain.toLowerCase())) {
        return true;
      }
    }
    
    // 5. Vérifier les formats typiques des spams
    if (
      symbol.includes('[') || 
      symbol.includes(']') || 
      symbol.includes('://') ||
      symbol.includes('www.') ||
      symbol.includes('http')
    ) {
      return true;
    }
    
    return false;
  }
  
  /**
   * Liste des tokens légitimes les plus courants
   * Cette liste blanche a priorité sur la liste noire
   */
  export const LEGITIMATE_TOKENS = new Set([
    'ETH', 'WETH', 'USDT', 'USDC', 'DAI', 'WBTC', 'LINK', 'UNI', 'AAVE', 
    'CRV', 'SNX', 'COMP', 'YFI', 'MKR', 'SUSHI', 'GRT', 'BAT', 'MATIC',
    '1INCH', 'LDO', 'RPL', 'ENS', 'APE', 'DYDX', 'FXS', 'LRC', 'SAND',
    'MANA', 'AXS', 'SHIB', 'BNB', 'AVAX', 'SOL', 'DOGE', 'ATOM', 'DOT'
  ]);
  
  /**
   * Vérifie si un token est légitime
   * @param tokenSymbol Symbole du token
   * @returns true si le token est dans la liste blanche
   */
  export function isLegitimateToken(tokenSymbol?: string): boolean {
    if (!tokenSymbol) return false;
    return LEGITIMATE_TOKENS.has(tokenSymbol.toUpperCase());
  }
  
  /**
   * Filtre les transactions spam/scam d'une liste de transactions
   * @param transactions Liste des transactions à filtrer
   * @returns Liste des transactions filtrées
   */
  export function filterSpamTransactions<T extends {
    tokenSymbol?: string;
    valueInETH?: number;
    type?: string;
  }>(transactions: T[]): T[] {
    return transactions.filter(tx => {
      // 1. Toujours garder les transactions natives (ETH)
      if (tx.type === 'Native Transfer') {
        return true;
      }
      
      // 2. Garder les tokens de la liste blanche
      if (isLegitimateToken(tx.tokenSymbol)) {
        return true;
      }
      
      // 3. Filtrer les tokens spam
      return !isSpamToken(tx.tokenSymbol, tx.valueInETH);
    });
  }