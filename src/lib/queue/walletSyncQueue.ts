// src/lib/queue/walletSyncQueue.ts
import { prisma } from "@/lib/prisma";
import { NetworkType, getTransactions } from "@/utils/transactions";
import { filterSpamTransactions } from "@/utils/SpamFilter";

// Interface pour les tâches de synchronisation
export interface SyncJob {
  userId: string;
  walletId: string;
  address: string;
  network: NetworkType;
  fullSync: boolean;
}

// File d'attente simple pour les tâches de synchronisation
class SyncQueue {
  private queue: SyncJob[] = [];
  private isProcessing: boolean = false;
  
  // Ajouter une tâche à la file d'attente
  public async enqueue(job: SyncJob): Promise<string> {
    const jobId = `sync-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Stocker le job en base de données pour reprise sur erreur/redémarrage
    await prisma.syncJob.create({
      data: {
        id: jobId,
        userId: job.userId,
        walletId: job.walletId,
        address: job.address,
        network: job.network,
        fullSync: job.fullSync,
        status: 'PENDING',
        createdAt: new Date(),
      }
    });
    
    // Ajouter à la file d'attente en mémoire
    this.queue.push(job);
    
    // Démarrer le traitement si ce n'est pas déjà fait
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return jobId;
  }
  
  // Traiter les tâches en file d'attente
  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    // Récupérer la prochaine tâche de la file d'attente
    const job = this.queue.shift();
    
    if (job) {
      try {
        // Mettre à jour le statut du job en BDD
        const dbJob = await prisma.syncJob.findFirst({
          where: {
            userId: job.userId,
            walletId: job.walletId,
            status: 'PENDING',
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        
        if (dbJob) {
          await prisma.syncJob.update({
            where: { id: dbJob.id },
            data: { status: 'PROCESSING', startedAt: new Date() },
          });
        }
        
        // Mettre à jour le statut du wallet
        await prisma.wallet.update({
          where: { id: job.walletId },
          data: { syncStatus: 'SYNCING' },
        });
        
        // Exécuter la synchronisation
        await this.syncWallet(job);
        
        // Si le job est en BDD, marquer comme terminé
        if (dbJob) {
          await prisma.syncJob.update({
            where: { id: dbJob.id },
            data: { 
              status: 'COMPLETED', 
              completedAt: new Date(),
              error: null,
            },
          });
        }
        
        // Mettre à jour le wallet comme synchronisé
        await prisma.wallet.update({
          where: { id: job.walletId },
          data: { 
            syncStatus: 'COMPLETED',
            lastSync: new Date(),
          },
        });
      } catch (error) {
        console.error(`Erreur lors de la synchronisation du wallet ${job.walletId}:`, error);
        
        // Mettre à jour le statut du job en BDD en cas d'erreur
        const dbJob = await prisma.syncJob.findFirst({
          where: {
            userId: job.userId,
            walletId: job.walletId,
            status: 'PROCESSING',
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        
        if (dbJob) {
          await prisma.syncJob.update({
            where: { id: dbJob.id },
            data: { 
              status: 'FAILED', 
              completedAt: new Date(),
              error: error instanceof Error ? error.message : String(error),
            },
          });
        }
        
        // Mettre à jour le statut du wallet
        await prisma.wallet.update({
          where: { id: job.walletId },
          data: { syncStatus: 'FAILED' },
        });
      } finally {
        this.isProcessing = false;
        
        // Continuer à traiter la file d'attente s'il reste des tâches
        if (this.queue.length > 0) {
          this.processQueue();
        }
      }
    } else {
      this.isProcessing = false;
    }
  }
  
  // Exécuter la synchronisation d'un wallet
  private async syncWallet(job: SyncJob) {
    const { userId, walletId, address, network, fullSync } = job;
    
    // Si c'est une synchronisation complète, supprimer les transactions existantes
    if (fullSync) {
      await prisma.transaction.deleteMany({
        where: { walletId },
      });
    }
    
    // Récupérer les transactions depuis l'API Moralis
    let transactions = await getTransactions(address, network);
    
    // Filtrer les transactions spam
    transactions = filterSpamTransactions(transactions);
    
    // Obtenir la dernière date de synchronisation (s'il y en a une)
    let latestTxDate: Date | null = null;
    if (!fullSync) {
      const latestTx = await prisma.transaction.findFirst({
        where: { walletId },
        orderBy: { timestamp: 'desc' },
      });
      
      if (latestTx) {
        latestTxDate = latestTx.timestamp;
      }
    }
    
    // Ignorer les transactions déjà existantes si ce n'est pas une synchronisation complète
    if (latestTxDate && !fullSync) {
      transactions = transactions.filter(tx => {
        const txDate = new Date(tx.block_timestamp);
        return txDate > latestTxDate!;
      });
    }
    
    // Stocker les transactions en base de données
    const txCount = transactions.length;
    let balance = '0';

    // Traiter par lots pour ne pas surcharger la base de données
    const batchSize = 100;
    const batches = Math.ceil(transactions.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batch = transactions.slice(i * batchSize, (i + 1) * batchSize);
      
      await Promise.all(batch.map(async tx => {
        // Vérifier si la transaction existe déjà
        const existingTx = await prisma.transaction.findFirst({
          where: {
            walletId,
            hash: tx.hash,
          },
        });
        
        if (!existingTx) {
          await prisma.transaction.create({
            data: {
              walletId,
              hash: tx.hash,
              timestamp: new Date(tx.block_timestamp),
              value: tx.value || '0',
              fromAddress: tx.from_address,
              toAddress: tx.to_address,
              network,
              blockNumber: tx.block_number?.toString() || '0',
              type: tx.type || 'unknown',
              tokenSymbol: tx.tokenSymbol || null,
              tokenDecimals: tx.tokenDecimals || 18,
              valueInETH: tx.valueInETH?.toString() || null,
              input: tx.input || null,
            },
          });
        }
      }));
    }
    
    // Calculer et mettre à jour le solde du wallet en ETH
    try {
      // Utiliser l'API Moralis pour obtenir le solde
      const ethers = require('ethers');
      const provider = new ethers.JsonRpcProvider(`https://${network === 'eth' ? 'mainnet' : network}.infura.io/v3/${process.env.INFURA_API_KEY}`);
      const balanceWei = await provider.getBalance(address);
      balance = ethers.formatEther(balanceWei);
      
      await prisma.wallet.update({
        where: { id: walletId },
        data: { balance },
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du solde pour ${address}:`, error);
      // Ne pas échouer si la récupération du solde échoue
    }
    
    return {
      transactionCount: txCount,
      balance,
    };
  }
}

// Singleton de la file d'attente
const syncQueue = new SyncQueue();

// Fonction pour ajouter une tâche de synchronisation
export async function enqueueTransaction(job: SyncJob): Promise<string> {
  return syncQueue.enqueue(job);
}