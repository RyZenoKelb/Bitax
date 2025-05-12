// src/app/api/wallet/sync/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { enqueueTransaction } from "@/lib/queue/walletSyncQueue";
import { NetworkType } from "@/utils/transactions";

// Schéma de validation pour la synchronisation d'un wallet
const walletSyncSchema = z.object({
  walletId: z.string().min(1, "L'ID du wallet est requis"),
  address: z.string().min(1, "L'adresse du wallet est requise"),
  network: z.string().min(1, "Le réseau est requis"),
  fullSync: z.boolean().optional().default(false),
});

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
    const result = walletSyncSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { walletId, address, network, fullSync } = body;
    
    // Vérifier que le wallet appartient bien à l'utilisateur
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: session.user.id,
      },
    });
    
    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet non trouvé ou non autorisé" },
        { status: 404 }
      );
    }

    // Créer un job de synchronisation
    const jobId = await enqueueTransaction({
      userId: session.user.id,
      walletId,
      address,
      network: network as NetworkType,
      fullSync,
    });
    
    // Mettre à jour le statut de synchronisation du wallet
    await prisma.wallet.update({
      where: { id: walletId },
      data: { 
        syncStatus: 'PENDING',
        lastSyncAttempt: new Date(),
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Synchronisation en cours",
      jobId,
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation du wallet:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la synchronisation du wallet" },
      { status: 500 }
    );
  }
}

// Récupérer le statut de synchronisation
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 401 }
    );
  }
  
  const { searchParams } = new URL(req.url);
  const walletId = searchParams.get('walletId');
  
  if (!walletId) {
    return NextResponse.json(
      { error: "ID de wallet manquant" },
      { status: 400 }
    );
  }
  
  try {
    // Vérifier que le wallet appartient bien à l'utilisateur
    const wallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: session.user.id,
      },
    });
    
    if (!wallet) {
      return NextResponse.json(
        { error: "Wallet non trouvé ou non autorisé" },
        { status: 404 }
      );
    }
    
    // Récupérer les dernières transactions du wallet (10 plus récentes)
    const recentTransactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { timestamp: 'desc' },
      take: 10,
    });
    
    // Calculer le nombre total de transactions
    const transactionCount = await prisma.transaction.count({
      where: { walletId },
    });
    
    return NextResponse.json({
      syncStatus: wallet.syncStatus,
      lastSync: wallet.lastSync,
      lastSyncAttempt: wallet.lastSyncAttempt,
      transactionCount,
      recentTransactions,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du statut de synchronisation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du statut" },
      { status: 500 }
    );
  }
}