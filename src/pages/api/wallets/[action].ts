// src/pages/api/wallets/[action].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour l'ajout d'un wallet
const walletAddSchema = z.object({
  address: z.string().min(1, "L'adresse du wallet est requise"),
  network: z.string().default("eth"),
  name: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// Schéma de validation pour la mise à jour d'un wallet
const walletUpdateSchema = z.object({
  address: z.string().min(1, "L'adresse du wallet est requise").optional(),
  network: z.string().optional(),
  name: z.string().optional(),
  isPrimary: z.boolean().optional(),
});

// Gestionnaire des routes
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  
  // Récupérer l'action demandée
  const { action } = req.query;
  
  switch (action) {
    case 'add':
      return handleAddWallet(req, res, session.user.id);
    case 'update':
      return handleUpdateWallet(req, res, session.user.id);
    case 'delete':
      return handleDeleteWallet(req, res, session.user.id);
    case 'list':
      return handleListWallets(req, res, session.user.id);
    case 'get':
      return handleGetWallet(req, res, session.user.id);
    default:
      return res.status(400).json({ error: "Action non valide" });
  }
}

// Ajouter un wallet
async function handleAddWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    const body = req.body;
    
    // Valider les données
    const result = walletAddSchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: result.error.errors
      });
    }
    
    const { address, network, name, isPrimary } = body;
    
    // Vérifier si le wallet existe déjà pour cet utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        address: address,
      },
    });
    
    if (existingWallet) {
      return res.status(400).json({
        error: "Ce wallet est déjà enregistré"
      });
    }
    
    // Si ce wallet est marqué comme principal, mettre à jour les autres
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });
    }
    
    // Créer le nouveau wallet
    const wallet = await prisma.wallet.create({
      data: {
        address,
        network,
        name,
        isPrimary,
        userId,
      },
    });
    
    return res.status(201).json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du wallet:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de l'ajout du wallet"
    });
  }
}

// Mettre à jour un wallet
async function handleUpdateWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: "ID de wallet manquant"
      });
    }
    
    const body = req.body;
    
    // Valider les données
    const result = walletUpdateSchema.safeParse(body);
    if (!result.success) {
      return res.status(400).json({
        error: "Données invalides",
        details: result.error.errors
      });
    }
    
    // Vérifier que le wallet appartient bien à l'utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!existingWallet) {
      return res.status(404).json({
        error: "Wallet non trouvé ou non autorisé"
      });
    }
    
    const { address, network, name, isPrimary } = body;
    
    // Si le wallet est marqué comme principal, mettre à jour les autres
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: { 
          userId,
          id: { not: id }
        },
        data: { isPrimary: false },
      });
    }
    
    // Mettre à jour le wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id },
      data: {
        ...(address && { address }),
        ...(network && { network }),
        ...(name !== undefined && { name }),
        ...(isPrimary !== undefined && { isPrimary }),
      },
    });
    
    return res.status(200).json({
      success: true,
      wallet: updatedWallet
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du wallet:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de la mise à jour du wallet"
    });
  }
}

// Supprimer un wallet
async function handleDeleteWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: "ID de wallet manquant"
      });
    }
    
    // Vérifier que le wallet appartient bien à l'utilisateur
    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!wallet) {
      return res.status(404).json({
        error: "Wallet non trouvé ou non autorisé"
      });
    }
    
    // Supprimer le wallet
    await prisma.wallet.delete({
      where: { id },
    });
    
    // Si c'était le wallet principal, définir un autre wallet comme principal
    if (wallet.isPrimary) {
      const otherWallet = await prisma.wallet.findFirst({
        where: { userId },
      });
      
      if (otherWallet) {
        await prisma.wallet.update({
          where: { id: otherWallet.id },
          data: { isPrimary: true },
        });
      }
    }
    
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du wallet:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de la suppression du wallet"
    });
  }
}

// Lister tous les wallets d'un utilisateur
async function handleListWallets(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    // Récupérer tous les wallets de l'utilisateur
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' }
      ],
    });
    
    return res.status(200).json({
      success: true,
      wallets
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des wallets:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des wallets"
    });
  }
}

// Récupérer un wallet spécifique
async function handleGetWallet(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: "ID de wallet manquant"
      });
    }
    
    // Récupérer le wallet
    const wallet = await prisma.wallet.findFirst({
      where: {
        id,
        userId,
      },
    });
    
    if (!wallet) {
      return res.status(404).json({
        error: "Wallet non trouvé ou non autorisé"
      });
    }
    
    return res.status(200).json({
      success: true,
      wallet
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du wallet:", error);
    return res.status(500).json({
      error: "Une erreur est survenue lors de la récupération du wallet"
    });
  }
}