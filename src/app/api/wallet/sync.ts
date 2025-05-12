// src/pages/api/wallet/sync.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import { ethers } from 'ethers';
import { WalletInfo } from '@/types/wallet';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    // Récupérer l'ID du wallet à synchroniser
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID de wallet manquant ou invalide' });
    }

    // Vérifier que le wallet appartient à l'utilisateur
    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet non trouvé ou non autorisé' });
    }

    // Mettre à jour le statut du wallet en "syncing"
    await prisma.wallet.update({
      where: { id },
      data: { 
        status: 'syncing' 
      },
    });

    // Récupérer les transactions
    const transactions = await getTransactions(wallet.address, wallet.network as NetworkType);
    const filteredTransactions = filterSpamTransactions(transactions);

    // Calculer le nombre de transactions et la balance
    const transactionCount = filteredTransactions.length;
    
    // Obtenir la balance (exemple simplifié)
    let balance = "0";
    try {
      if (wallet.network === 'eth' || wallet.network === 'polygon' || wallet.network === 'arbitrum' || wallet.network === 'optimism' || wallet.network === 'base') {
        // Pour les chaînes EVM, utiliser ethers.js pour récupérer la balance
        const provider = wallet.network === 'eth' 
          ? new ethers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/your-api-key')
          : wallet.network === 'polygon'
          ? new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/your-api-key')
          : wallet.network === 'arbitrum'
          ? new ethers.JsonRpcProvider('https://arb-mainnet.g.alchemy.com/v2/your-api-key')
          : wallet.network === 'optimism'
          ? new ethers.JsonRpcProvider('https://opt-mainnet.g.alchemy.com/v2/your-api-key')
          : new ethers.JsonRpcProvider('https://base-mainnet.g.alchemy.com/v2/your-api-key');
        
        // Récupérer la balance en ethers
        const balanceWei = await provider.getBalance(wallet.address);
        balance = ethers.formatEther(balanceWei);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la balance:', error);
      // Continuer même en cas d'erreur de récupération de la balance
    }

    // Sauvegarder les transactions dans la base de données
    // Pour chaque transaction, vérifier si elle existe déjà
    for (const tx of filteredTransactions) {
      const existingTx = await prisma.transaction.findUnique({
        where: { hash: tx.hash }
      });
      
      if (!existingTx) {
        // Créer une nouvelle transaction
        await prisma.transaction.create({
          data: {
            hash: tx.hash,
            walletId: wallet.id,
            userId: session.user.id,
            timestamp: new Date(tx.block_timestamp || Date.now()),
            amount: parseFloat(tx.value || '0'),
            tokenSymbol: tx.tokenSymbol || 'ETH',
            tokenName: tx.tokenName || 'Ethereum',
            tokenPrice: tx.priceUSD ? parseFloat(tx.priceUSD) : null,
            toAddress: tx.to_address,
            fromAddress: tx.from_address,
            type: tx.type || 'transfer',
            fee: tx.fee ? parseFloat(tx.fee) : null,
            status: 'confirmed',
          },
        });
      }
    }

    // Mettre à jour le wallet avec les informations de synchronisation
    const updatedWallet = await prisma.wallet.update({
      where: { id },
      data: {
        lastSynced: new Date(),
        status: 'synced',
        transactionCount,
        balance,
      },
    });

    return res.status(200).json({
      success: true,
      wallet: updatedWallet,
      transactionCount,
      balance,
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation du wallet:', error);
    
    // En cas d'erreur, mettre à jour le statut du wallet
    if (req.query.id && typeof req.query.id === 'string') {
      try {
        await prisma.wallet.update({
          where: { id: req.query.id },
          data: { status: 'error' },
        });
      } catch (updateError) {
        console.error('Erreur lors de la mise à jour du statut du wallet:', updateError);
      }
    }
    
    return res.status(500).json({
      error: 'Une erreur est survenue lors de la synchronisation du wallet'
    });
  }
}