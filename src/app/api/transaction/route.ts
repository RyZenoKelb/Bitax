// src/app/api/transaction/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour les transactions
const transactionSchema = z.object({
  hash: z.string().min(1, "Le hash de transaction est requis"),
  walletId: z.string().min(1, "L'ID du wallet est requis"),
  timestamp: z.string().or(z.date()), // Accepte un string ISO ou un objet Date
  amount: z.number(),
  tokenSymbol: z.string(),
  tokenName: z.string().optional(),
  tokenPrice: z.number().optional(),
  toAddress: z.string().optional(),
  fromAddress: z.string().optional(),
  type: z.string(), // "buy", "sell", "transfer", "swap", etc.
  fee: z.number().optional(),
  status: z.string().default("confirmed"),
});

// GET - Récupérer les transactions d'un utilisateur
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get('walletId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Essayer de récupérer les transactions
    try {
      // Construire la requête de base
      const whereClause: any = {
        userId: session.user.id,
      };
      
      // Si un walletId est fourni, filtrer par ce wallet
      if (walletId) {
        whereClause.walletId = walletId;
      }
      
      // Récupérer les transactions
      const transactions = await prisma.transaction.findMany({
        where: whereClause,
        orderBy: {
          timestamp: 'desc',
        },
        skip,
        take: limit,
      });
      
      // Compter le nombre total de transactions pour la pagination
      const totalTransactions = await prisma.transaction.count({
        where: whereClause,
      });
      
      return NextResponse.json({
        transactions,
        pagination: {
          total: totalTransactions,
          page,
          limit,
          pages: Math.ceil(totalTransactions / limit),
        },
      });
    } catch (error: any) {
      // Si l'erreur est due à un modèle inexistant, renvoyer un tableau vide
      console.error("Erreur lors de la récupération des transactions:", error);
      
      return NextResponse.json({
        transactions: [],
        pagination: {
          total: 0,
          page: 1,
          limit,
          pages: 0,
        },
        message: "Le modèle Transaction n'est pas encore disponible. Veuillez exécuter une migration Prisma."
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des transactions" },
      { status: 500 }
    );
  }
}

// POST - Ajouter une nouvelle transaction
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Valider les données
    const result = transactionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { hash, walletId, timestamp, amount, tokenSymbol, tokenName, tokenPrice, toAddress, fromAddress, type, fee, status } = body;
    
    // Vérifier que l'utilisateur est bien le propriétaire du wallet
    const wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });
    
    if (!wallet || wallet.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Wallet non trouvé ou non autorisé" },
        { status: 403 }
      );
    }
    
    try {
      // Vérifier si la transaction existe déjà
      const existingTransaction = await prisma.transaction.findUnique({
        where: {
          hash,
        },
      });
      
      if (existingTransaction) {
        return NextResponse.json(
          { error: "Cette transaction existe déjà" },
          { status: 400 }
        );
      }
      
      // Créer la transaction
      const transaction = await prisma.transaction.create({
        data: {
          hash,
          walletId,
          userId: session.user.id,
          timestamp: new Date(timestamp),
          amount,
          tokenSymbol,
          tokenName,
          tokenPrice,
          toAddress,
          fromAddress,
          type,
          fee,
          status,
        },
      });
      
      return NextResponse.json({
        success: true,
        transaction,
      });
    } catch (error: any) {
      // Si l'erreur est due à un modèle inexistant, renvoyer une réponse appropriée
      console.error("Erreur lors de l'ajout de la transaction:", error);
      
      return NextResponse.json(
        { 
          error: "Cette fonctionnalité n'est pas encore disponible. Veuillez exécuter une migration Prisma.",
          details: error.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'ajout de la transaction" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une transaction
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json(
        { error: "ID de transaction manquant" },
        { status: 400 }
      );
    }
    
    try {
      // Vérifier que la transaction appartient bien à l'utilisateur
      const transaction = await prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });
      
      if (!transaction || transaction.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Transaction non trouvée ou non autorisée" },
          { status: 403 }
        );
      }
      
      // Supprimer la transaction
      await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      });
      
      return NextResponse.json({ success: true });
    } catch (error: any) {
      // Si l'erreur est due à un modèle inexistant, renvoyer une réponse appropriée
      console.error("Erreur lors de la suppression de la transaction:", error);
      
      return NextResponse.json(
        { 
          error: "Cette fonctionnalité n'est pas encore disponible. Veuillez exécuter une migration Prisma.",
          details: error.message
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de la transaction:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression de la transaction" },
      { status: 500 }
    );
  }
}