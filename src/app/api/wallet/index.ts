// src/pages/api/wallet/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ethers } from 'ethers';
import { z } from 'zod';

// Schéma de validation pour la création d'un wallet
const createWalletSchema = z.object({
  address: z.string().min(1, "L'adresse du wallet est requise"),
  network: z.string().default("eth"),
  name: z.string().optional(),
  isPrimary: z.boolean().default(false),
  walletType: z.string().default("manual"),
});

// Schéma de validation pour la mise à jour d'un wallet
const updateWalletSchema = z.object({
  name: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(req, res, authOptions);
    
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Non autorisé' });
    }

    // Gestion des différentes méthodes HTTP
    switch (req.method) {
      case 'GET':
        return await getWallets(req, res, session.user.id);
      case 'POST':
        return await createWallet(req, res, session.user.id);
      case 'PUT':
        return await updateWallet(req, res, session.user.id);
      case 'DELETE':
        return await deleteWallet(req, res, session.user.id);
      default:
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur API wallet:', error);
    return res.status(500).json({ error: 'Une erreur interne est survenue' });
  }
}

// GET - Récupérer tous les wallets de l'utilisateur
async function getWallets(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const wallets = await prisma.wallet.findMany({
      where: {
        userId,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    return res.status(200).json({ wallets });
  } catch (error) {
    console.error('Erreur lors de la récupération des wallets:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des wallets' });
  }
}

// POST - Créer un nouveau wallet
async function createWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const body = req.body;
    
    // Valider les données
    const result = createWalletSchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Données invalides',
        details: result.error.errors,
      });
    }
    
    const { address, network, name, isPrimary, walletType } = result.data;
    
    // Valider l'adresse ethereum
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Adresse Ethereum invalide' });
    }
    
    // Vérifier si le wallet existe déjà pour cet utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        address: {
          equals: address,
          mode: 'insensitive',
        },
        network,
      },
    });
    
    if (existingWallet) {
      return res.status(400).json({ error: 'Ce wallet est déjà enregistré' });
    }
    
    // Désactiver tous les autres wallets principaux si celui-ci est principal
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: {
          userId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }
    
    // Créer le wallet
    const wallet = await prisma.wallet.create({
      data: {
        address,
        network,
        name: name || null,
        isPrimary,
        walletType: walletType || 'manual',
        status: 'pending',
        userId,
      },
    });
    
    return res.status(201).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Erreur lors de la création du wallet:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de la création du wallet' });
  }
}

// PUT - Mettre à jour un wallet
async function updateWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID de wallet manquant' });
    }
    
    // Valider les données
    const result = updateWalletSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: 'Données invalides',
        details: result.error.errors,
      });
    }
    
    const { name, isPrimary } = result.data;
    
    // Vérifier que le wallet appartient à l'utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingWallet) {
      return res.status(404).json({ error: 'Wallet non trouvé ou non autorisé' });
    }
    
    // Si le wallet devient principal, désactiver les autres wallets principaux
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: {
          userId,
          id: {
            not: id,
          },
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }
    
    // Mettre à jour le wallet
    const wallet = await prisma.wallet.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(isPrimary !== undefined && { isPrimary }),
      },
    });
    
    return res.status(200).json({
      success: true,
      wallet,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du wallet:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour du wallet' });
  }
}

// DELETE - Supprimer un wallet
async function deleteWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID de wallet manquant' });
    }
    
    // Vérifier que le wallet appartient à l'utilisateur
    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet non trouvé ou non autorisé' });
    }
    
    // Supprimer d'abord les transactions associées à ce wallet
    await prisma.transaction.deleteMany({
      where: {
        walletId: id,
      },
    });
    
    // Supprimer le wallet
    await prisma.wallet.delete({
      where: { id },
    });
    
    // Si le wallet était principal, définir un autre wallet comme principal
    if (wallet.isPrimary) {
      const otherWallet = await prisma.wallet.findFirst({
        where: {
          userId,
          id: {
            not: id,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
      
      if (otherWallet) {
        await prisma.wallet.update({
          where: { id: otherWallet.id },
          data: { isPrimary: true },
        });
      }
    }
    
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du wallet:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du wallet' });
  }
}