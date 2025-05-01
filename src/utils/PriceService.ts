import axios from 'axios';

interface PriceData {
  [date: string]: {
    [currency: string]: number;
  };
}

// Données mockées pour éviter les appels API en développement
const MOCK_PRICES: Record<string, Record<string, number>> = {
  'ethereum': {
    'eur': 2500,
    'usd': 2700
  },
  'bitcoin': {
    'eur': 48000,
    'usd': 52000
  },
  'tether': {
    'eur': 0.92,
    'usd': 1.00
  },
  'usd-coin': {
    'eur': 0.92,
    'usd': 1.00
  },
  'dai': {
    'eur': 0.92,
    'usd': 1.00
  },
  'bnb': {
    'eur': 350,
    'usd': 380
  },
  'xrp': {
    'eur': 0.45,
    'usd': 0.49
  },
  'cardano': {
    'eur': 0.35,
    'usd': 0.38
  },
  'solana': {
    'eur': 95,
    'usd': 103
  },
  'polygon': {
    'eur': 0.50,
    'usd': 0.54
  },
  'polkadot': {
    'eur': 5.80,
    'usd': 6.30
  },
  'litecoin': {
    'eur': 65,
    'usd': 70
  },
  'weth': {
    'eur': 2500,
    'usd': 2700
  },
  'wrapped-bitcoin': {
    'eur': 48000,
    'usd': 52000
  },
  'chainlink': {
    'eur': 13,
    'usd': 14
  },
  'uniswap': {
    'eur': 8,
    'usd': 8.7
  },
  'aave': {
    'eur': 75,
    'usd': 82
  },
  'curve-dao-token': {
    'eur': 0.42,
    'usd': 0.46
  },
  'synthetix-network-token': {
    'eur': 2.8,
    'usd': 3.0
  },
  'compound-governance-token': {
    'eur': 41,
    'usd': 45
  },
  'yearn-finance': {
    'eur': 7200,
    'usd': 7800
  },
  'maker': {
    'eur': 1350,
    'usd': 1460
  },
  'sushi': {
    'eur': 0.95,
    'usd': 1.03
  }
};

// Configuration de l'API
const COINGECKO_API_KEY = ''; // Ajoutez votre clé API CoinGecko ici si vous en avez une
const USE_MOCK_DATA = true; // Mettre à 'false' pour utiliser l'API réelle si vous avez une clé API
const API_TIMEOUT = 10000; // Timeout en ms
const RETRY_DELAY = 1000; // Délai entre les tentatives en ms
const MAX_RETRIES = 2; // Nombre max de tentatives

export class PriceService {
  private priceCache: PriceData = {};
  private readonly supportedCurrencies = ['eur', 'usd'];
  private requestCounter = 0;
  private lastRequestTime = 0;
  
  /**
   * Récupère le prix historique d'une crypto à une date donnée
   * @param coinId Identifiant de la crypto (ex: 'bitcoin', 'ethereum')
   * @param date Date au format YYYY-MM-DD
   * @param currency Devise (eur, usd)
   * @returns Prix à la date donnée
   */
  async getHistoricalPrice(
    coinId: string, 
    date: string, 
    currency: string = 'eur'
  ): Promise<number | null> {
    // Normaliser les paramètres
    coinId = coinId.toLowerCase();
    currency = currency.toLowerCase();
    
    // Vérifier si la devise est supportée
    if (!this.supportedCurrencies.includes(currency)) {
      console.error(`Devise ${currency} non supportée`);
      return null;
    }
    
    // Vérifier si le prix est déjà en cache
    if (this.priceCache[date]?.[coinId]) {
      return this.priceCache[date][coinId];
    }
    
    // Utiliser des données mockées si configuré ainsi
    if (USE_MOCK_DATA) {
      const mockPrice = MOCK_PRICES[coinId]?.[currency];
      if (mockPrice) {
        // Ajouter une petite variation aléatoire pour simuler des prix historiques différents
        const variation = (Math.random() * 0.2 - 0.1); // Entre -10% et +10%
        const price = mockPrice * (1 + variation);
        
        // Mettre en cache
        if (!this.priceCache[date]) {
          this.priceCache[date] = {};
        }
        this.priceCache[date][coinId] = price;
        
        return price;
      }
      
      // Fallback sur ethereum pour les tokens inconnus
      return MOCK_PRICES['ethereum']?.[currency] || 0;
    }
    
    // Utiliser l'API réelle avec gestion d'erreur et retry
    try {
      const result = await this.fetchWithRetry(async () => {
        try {
          // Respecter les limites de taux de l'API
          await this.throttleRequest();
          
          const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${coinId}/history`, 
            {
              params: {
                date: this.formatDateForCoinGecko(date),
                localization: 'false',
                ...(COINGECKO_API_KEY ? { x_cg_api_key: COINGECKO_API_KEY } : {})
              },
              timeout: API_TIMEOUT
            }
          );
          
          // Vérifier la réponse
          if (!response.data || !response.data.market_data?.current_price?.[currency]) {
            console.error(`Données de prix invalides pour ${coinId} à la date ${date}`);
            return null;
          }
          
          // Récupérer le prix et le mettre en cache
          const price = response.data.market_data.current_price[currency];
          
          // Initialiser la structure du cache si nécessaire
          if (!this.priceCache[date]) {
            this.priceCache[date] = {};
          }
          this.priceCache[date][coinId] = price;
          
          return price;
        } catch (error) {
          console.error(`Erreur lors de la récupération du prix pour ${coinId} à la date ${date}:`, error);
          
          // Essayer de trouver un prix dans le cache pour un jour proche si possible
          return this.findNearestCachedPrice(coinId, date, currency);
        }
      });
      
      return result || 0;
    } catch (error) {
      // Fallback en cas d'erreur complète
      return MOCK_PRICES[coinId]?.[currency] || 0;
    }
  }
  
  /**
   * Essaie de trouver un prix en cache pour une date proche
   */
  private findNearestCachedPrice(coinId: string, date: string, currency: string): number | null {
    // Vérifier si nous avons des prix pour cette crypto
    const cachedDates = Object.keys(this.priceCache)
      .filter(cachedDate => this.priceCache[cachedDate][coinId] !== undefined)
      .sort();
    
    if (cachedDates.length === 0) {
      // Aucun prix disponible en cache, utiliser les données mockées si possible
      return MOCK_PRICES[coinId]?.[currency] || null;
    }
    
    // Trouver la date la plus proche
    const targetDate = new Date(date);
    let closestDate = cachedDates[0];
    let minDiff = Math.abs(targetDate.getTime() - new Date(closestDate).getTime());
    
    for (let i = 1; i < cachedDates.length; i++) {
      const diff = Math.abs(targetDate.getTime() - new Date(cachedDates[i]).getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = cachedDates[i];
      }
    }
    
    return this.priceCache[closestDate][coinId];
  }
  
  /**
   * Fonction utilitaire pour retarder les requêtes et respecter les limites de l'API
   */
  private async throttleRequest(): Promise<void> {
    this.requestCounter++;
    
    // Respecter une limite de 10 requêtes par minute (pour API gratuite)
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (this.requestCounter > 10 && timeSinceLastRequest < 60000) {
      // Attendre jusqu'à la fin de la minute
      const waitTime = Math.max(0, 60000 - timeSinceLastRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCounter = 1; // Réinitialiser le compteur
    } else if (timeSinceLastRequest < 1000) {
      // Toujours attendre au moins 1 seconde entre les requêtes
      await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
  
  /**
   * Fonction utilitaire pour réessayer une requête en cas d'échec
   */
  private async fetchWithRetry<T>(fn: () => Promise<T | null>, retries = MAX_RETRIES): Promise<T | null> {
    try {
      return await fn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.fetchWithRetry(fn, retries - 1);
      }
      return null;
    }
  }
  
  /**
   * Récupère les prix actuels d'une liste de cryptos
   * @param coinIds Liste des identifiants de cryptos
   * @param currency Devise (eur, usd)
   * @returns Objet avec les prix
   */
  async getCurrentPrices(
    coinIds: string[], 
    currency: string = 'eur'
  ): Promise<Record<string, number>> {
    // Normaliser les paramètres
    const normalizedCoinIds = coinIds.map(id => id.toLowerCase());
    currency = currency.toLowerCase();
    
    // Vérifier si la devise est supportée
    if (!this.supportedCurrencies.includes(currency)) {
      console.error(`Devise ${currency} non supportée`);
      return {};
    }
    
    // Utiliser des données mockées si configuré ainsi
    if (USE_MOCK_DATA) {
      const prices: Record<string, number> = {};
      normalizedCoinIds.forEach(coinId => {
        prices[coinId] = MOCK_PRICES[coinId]?.[currency] || 0;
      });
      return prices;
    }
    
    // Utiliser l'API réelle avec gestion d'erreur et retry
    try {
      const result = await this.fetchWithRetry<Record<string, number>>(async () => {
        try {
          await this.throttleRequest();
          
          const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price',
            {
              params: {
                ids: normalizedCoinIds.join(','),
                vs_currencies: currency,
                ...(COINGECKO_API_KEY ? { x_cg_api_key: COINGECKO_API_KEY } : {})
              },
              timeout: API_TIMEOUT
            }
          );
          
          // Vérifier la réponse
          if (!response.data) {
            console.error('Données de prix actuels invalides');
            return {};
          }
          
          // Construire l'objet de résultat
          const prices: Record<string, number> = {};
          normalizedCoinIds.forEach(coinId => {
            if (response.data[coinId]?.[currency]) {
              prices[coinId] = response.data[coinId][currency];
            } else {
              // Fallback sur les données mockées si le prix n'est pas disponible
              prices[coinId] = MOCK_PRICES[coinId]?.[currency] || 0;
            }
          });
          
          return prices;
        } catch (error) {
          console.error('Erreur lors de la récupération des prix actuels:', error);
          
          // Fallback sur les données mockées
          const prices: Record<string, number> = {};
          normalizedCoinIds.forEach(coinId => {
            prices[coinId] = MOCK_PRICES[coinId]?.[currency] || 0;
          });
          return prices;
        }
      });
      
      // Utiliser un objet vide comme fallback si le résultat est null
      return result || {};
    } catch (error) {
      // Fallback final en cas d'erreur complète
      const prices: Record<string, number> = {};
      normalizedCoinIds.forEach(coinId => {
        prices[coinId] = MOCK_PRICES[coinId]?.[currency] || 0;
      });
      return prices;
    }
  }
  
  /**
   * Formate une date au format YYYY-MM-DD en DD-MM-YYYY pour CoinGecko
   * @param date Date au format YYYY-MM-DD
   * @returns Date au format DD-MM-YYYY
   */
  private formatDateForCoinGecko(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }
  
  /**
   * Convertit un timestamp Unix en date au format YYYY-MM-DD
   * @param timestamp Timestamp Unix en secondes
   * @returns Date au format YYYY-MM-DD
   */
  static timestampToDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toISOString().split('T')[0];
  }
  
  /**
   * Mappe un symbole de token à son identifiant CoinGecko
   * @param symbol Symbole du token (ex: 'ETH', 'BTC')
   * @returns Identifiant CoinGecko (ex: 'ethereum', 'bitcoin')
   */
  static mapSymbolToCoinGeckoId(symbol: string): string | null {
    if (!symbol) return null;
    
    const symbolMap: Record<string, string> = {
      'ETH': 'ethereum',
      'WETH': 'weth',
      'BTC': 'bitcoin',
      'WBTC': 'wrapped-bitcoin',
      'USDT': 'tether',
      'USDC': 'usd-coin',
      'DAI': 'dai',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'AAVE': 'aave',
      'CRV': 'curve-dao-token',
      'SNX': 'synthetix-network-token',
      'COMP': 'compound-governance-token',
      'YFI': 'yearn-finance',
      'MKR': 'maker',
      'SUSHI': 'sushi',
      'BNB': 'bnb',
      'ADA': 'cardano',
      'XRP': 'xrp',
      'SOL': 'solana',
      'DOT': 'polkadot',
      'DOGE': 'dogecoin',
      'MATIC': 'polygon',
      'LTC': 'litecoin',
      'AVAX': 'avalanche-2',
      // Ajoutez d'autres mappings au besoin
    };
    
    return symbolMap[symbol.toUpperCase()] || 
           // Fallback: si le symbole est long, c'est peut-être déjà un ID CoinGecko ou un spam
           (symbol.length > 5 ? 'ethereum' : null);
  }
}

// Exporter une instance unique pour toute l'application
export const priceService = new PriceService();