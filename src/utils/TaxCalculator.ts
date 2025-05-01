import { priceService, PriceService } from './PriceService';

// Types et interfaces
export type CalculationMethod = 'FIFO' | 'LIFO' | 'WAC' | 'HIFO';

export interface Transaction {
  hash: string;
  block_timestamp: string;
  value: string;
  from_address: string;
  to_address: string;
  tokenSymbol?: string;
  valueInETH?: number;
  type: string;
}

export interface CostBasis {
  amount: number;
  price: number;
  date: string;
  timestamp: number;
}

export interface TaxableEvent {
  transaction: Transaction;
  acquisitionCost: number;
  proceeds: number;
  gainOrLoss: number;
  isLongTerm: boolean; // Plus d'un an de détention
  date: string;
  token: string;
}

export interface TaxSummary {
  totalGains: number;
  totalLosses: number;
  netGainOrLoss: number;
  longTermGains: number;
  shortTermGains: number;
  taxableEvents: TaxableEvent[];
  taxableEventsByYear: Record<string, TaxableEvent[]>;
  taxableEventsByToken: Record<string, TaxableEvent[]>;
}

export class TaxCalculator {
  private nativeToken: string;
  private nativeCoinGeckoId: string;
  
  /**
   * Constructeur
   * @param nativeToken Symbole du token natif (ex: 'ETH' pour Ethereum)
   * @param nativeCoinGeckoId Identifiant CoinGecko pour le token natif (ex: 'ethereum')
   */
  constructor(nativeToken: string = 'ETH', nativeCoinGeckoId: string = 'ethereum') {
    this.nativeToken = nativeToken;
    this.nativeCoinGeckoId = nativeCoinGeckoId;
  }
  
  /**
   * Analyse les transactions pour calculer les plus/moins-values fiscales
   * @param transactions Liste des transactions
   * @param method Méthode de calcul (FIFO, LIFO, etc.)
   * @param currency Devise pour les calculs (eur, usd)
   * @returns Résumé fiscal
   */
  async calculateTaxes(
    transactions: Transaction[],
    method: CalculationMethod = 'FIFO',
    currency: string = 'eur'
  ): Promise<TaxSummary> {
    // Trier les transactions par date
    const sortedTransactions = [...transactions].sort((a, b) => {
      const dateA = new Date(a.block_timestamp).getTime();
      const dateB = new Date(b.block_timestamp).getTime();
      return dateA - dateB;
    });
    
    // Filtrer les transactions pertinentes pour le calcul fiscal
    const relevantTransactions = sortedTransactions.filter(tx => 
      tx.type === 'Native Transfer' || 
      tx.type === 'Token Transfer' || 
      tx.type === 'Swap'
    );
    
    // Inventaire des tokens par adresse
    const inventory: Record<string, CostBasis[]> = {};
    
    // Événements taxables
    const taxableEvents: TaxableEvent[] = [];
    
    // Analyser chaque transaction
    for (const tx of relevantTransactions) {
      await this.processTaxableTransaction(tx, inventory, taxableEvents, method, currency);
    }
    
    // Générer le résumé fiscal
    return this.generateTaxSummary(taxableEvents);
  }
  
  /**
   * Traite une transaction pour déterminer si elle est taxable
   * @param tx Transaction à analyser
   * @param inventory Inventaire actuel des tokens
   * @param taxableEvents Liste des événements taxables
   * @param method Méthode de calcul fiscal
   * @param currency Devise pour les calculs
   */
  private async processTaxableTransaction(
    tx: Transaction,
    inventory: Record<string, CostBasis[]>,
    taxableEvents: TaxableEvent[],
    method: CalculationMethod,
    currency: string
  ): Promise<void> {
    // Déterminer le type de transaction du point de vue fiscal
    const isSent = tx.from_address.toLowerCase() === tx.to_address.toLowerCase();
    const isReceived = !isSent;
    
    // Token concerné (native ou ERC20)
    const token = tx.tokenSymbol || this.nativeToken;
    
    // Montant de la transaction
    const amount = tx.valueInETH || Number(tx.value) / 1e18;
    
    // Timestamp et date
    const timestamp = new Date(tx.block_timestamp).getTime() / 1000;
    const date = tx.block_timestamp.split('T')[0];
    
    // Obtenir le prix du token à la date de la transaction
    let price = 0;
    const coinGeckoId = token === this.nativeToken 
      ? this.nativeCoinGeckoId 
      : PriceService.mapSymbolToCoinGeckoId(token);
    
    if (coinGeckoId) {
      price = await priceService.getHistoricalPrice(coinGeckoId, date, currency) || 0;
    }
    
    // Si c'est une réception de tokens, ajouter à l'inventaire
    if (isReceived) {
      if (!inventory[token]) {
        inventory[token] = [];
      }
      
      inventory[token].push({
        amount,
        price,
        date,
        timestamp
      });
      
      // Trier l'inventaire selon la méthode choisie
      this.sortInventory(inventory[token], method);
    }
    // Si c'est un envoi de tokens, calculer les plus/moins-values
    else if (isSent && inventory[token] && inventory[token].length > 0) {
      let remainingAmount = amount;
      let acquisitionCost = 0;
      
      // Calculer le coût d'acquisition selon la méthode choisie
      while (remainingAmount > 0 && inventory[token].length > 0) {
        const basis = method === 'LIFO' 
          ? inventory[token].pop()! 
          : inventory[token].shift()!;
        
        if (basis.amount <= remainingAmount) {
          // Utiliser tout le lot
          acquisitionCost += basis.amount * basis.price;
          remainingAmount -= basis.amount;
        } else {
          // Utiliser une partie du lot
          acquisitionCost += remainingAmount * basis.price;
          basis.amount -= remainingAmount;
          remainingAmount = 0;
          
          // Remettre le reste du lot dans l'inventaire
          if (method === 'LIFO') {
            inventory[token].push(basis);
          } else {
            inventory[token].unshift(basis);
          }
        }
      }
      
      // Calculer les proceeds (valeur de vente)
      const proceeds = amount * price;
      
      // Calculer le gain ou la perte
      const gainOrLoss = proceeds - acquisitionCost;
      
      // Déterminer si c'est une plus-value à long terme (> 1 an)
      const isLongTerm = timestamp - inventory[token][0]?.timestamp > 365 * 24 * 60 * 60;
      
      // Ajouter l'événement taxable
      taxableEvents.push({
        transaction: tx,
        acquisitionCost,
        proceeds,
        gainOrLoss,
        isLongTerm,
        date,
        token
      });
    }
  }
  
  /**
   * Trie l'inventaire selon la méthode de calcul fiscal
   * @param inventory Inventaire à trier
   * @param method Méthode de calcul
   */
  private sortInventory(inventory: CostBasis[], method: CalculationMethod): void {
    switch (method) {
      case 'FIFO':
        // First In, First Out - déjà trié par date
        inventory.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'LIFO':
        // Last In, First Out
        inventory.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'HIFO':
        // Highest In, First Out
        inventory.sort((a, b) => b.price - a.price);
        break;
      case 'WAC':
        // Weighted Average Cost - regrouper tous les lots en un seul
        if (inventory.length > 1) {
          const totalAmount = inventory.reduce((sum, basis) => sum + basis.amount, 0);
          const totalCost = inventory.reduce((sum, basis) => sum + basis.amount * basis.price, 0);
          const averagePrice = totalCost / totalAmount;
          const oldestTimestamp = Math.min(...inventory.map(basis => basis.timestamp));
          const oldestDate = inventory.find(basis => basis.timestamp === oldestTimestamp)?.date || inventory[0].date;
          
          inventory.length = 0; // Vider l'inventaire
          inventory.push({
            amount: totalAmount,
            price: averagePrice,
            date: oldestDate,
            timestamp: oldestTimestamp
          });
        }
        break;
    }
  }
  
  /**
   * Génère un résumé fiscal à partir des événements taxables
   * @param taxableEvents Liste des événements taxables
   * @returns Résumé fiscal
   */
  private generateTaxSummary(taxableEvents: TaxableEvent[]): TaxSummary {
    let totalGains = 0;
    let totalLosses = 0;
    let longTermGains = 0;
    let shortTermGains = 0;
    
    // Calculer les totaux
    taxableEvents.forEach(event => {
      if (event.gainOrLoss > 0) {
        totalGains += event.gainOrLoss;
        if (event.isLongTerm) {
          longTermGains += event.gainOrLoss;
        } else {
          shortTermGains += event.gainOrLoss;
        }
      } else {
        totalLosses += Math.abs(event.gainOrLoss);
      }
    });
    
    // Regrouper par année
    const taxableEventsByYear: Record<string, TaxableEvent[]> = {};
    taxableEvents.forEach(event => {
      const year = event.date.substring(0, 4);
      if (!taxableEventsByYear[year]) {
        taxableEventsByYear[year] = [];
      }
      taxableEventsByYear[year].push(event);
    });
    
    // Regrouper par token
    const taxableEventsByToken: Record<string, TaxableEvent[]> = {};
    taxableEvents.forEach(event => {
      if (!taxableEventsByToken[event.token]) {
        taxableEventsByToken[event.token] = [];
      }
      taxableEventsByToken[event.token].push(event);
    });
    
    return {
      totalGains,
      totalLosses,
      netGainOrLoss: totalGains - totalLosses,
      longTermGains,
      shortTermGains,
      taxableEvents,
      taxableEventsByYear,
      taxableEventsByToken
    };
  }
}

// Exporter une instance par défaut
export const taxCalculator = new TaxCalculator();