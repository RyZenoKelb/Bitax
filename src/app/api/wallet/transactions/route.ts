// src/app/api/wallet/transactions/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Get transactions for a specific wallet
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    if (!walletId) {
      return NextResponse.json(
        { error: "ID de wallet manquant" },
        { status: 400 }
      );
    }
    
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
    
    // Récupérer les transactions avec pagination
    const offset = (page - 1) * limit;
    
    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: { walletId },
        orderBy: { timestamp: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.transaction.count({
        where: { walletId },
      })
    ]);
    
    // Récupérer des statistiques de base sur les transactions
    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as totalTransactions,
        COUNT(DISTINCT "tokenSymbol") as uniqueTokens,
        SUM(CASE WHEN "fromAddress" = ${wallet.address.toLowerCase()} THEN 1 ELSE 0 END) as outgoing,
        SUM(CASE WHEN "toAddress" = ${wallet.address.toLowerCase()} THEN 1 ELSE 0 END) as incoming
      FROM "Transaction"
      WHERE "walletId" = ${walletId}
    `;
    
    // Préparer la réponse
    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      },
      stats: stats[0],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des transactions" },
      { status: 500 }
    );
  }
}

// Import transactions for a wallet (for manual import)
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
    const schema = z.object({
      walletId: z.string().min(1, "L'ID du wallet est requis"),
      transactions: z.array(z.object({
        hash: z.string().min(1, "Le hash est requis"),
        timestamp: z.string().min(1, "La date est requise"),
        fromAddress: z.string().min(1, "L'adresse source est requise"),
        toAddress: z.string().min(1, "L'adresse destination est requise"),
        value: z.string().min(1, "La valeur est requise"),
        network: z.string().min(1, "Le réseau est requis"),
        blockNumber: z.string().optional(),
        type: z.string().optional(),
        tokenSymbol: z.string().optional(),
        tokenDecimals: z.number().optional(),
        valueInETH: z.string().optional(),
        input: z.string().optional(),
      })).min(1, "Au moins une transaction est requise"),
    });
    
    const result = schema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { walletId, transactions } = body;
    
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
    
    // Traiter par lots pour ne pas surcharger la base de données
    const batchSize = 100;
    const batches = Math.ceil(transactions.length / batchSize);
    let importedCount = 0;
    let duplicateCount = 0;
    
    for (let i = 0; i < batches; i++) {
      const batch = transactions.slice(i * batchSize, (i + 1) * batchSize);
      
      for (const tx of batch) {
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
              timestamp: new Date(tx.timestamp),
              fromAddress: tx.fromAddress,
              toAddress: tx.toAddress,
              value: tx.value,
              network: tx.network,
              blockNumber: tx.blockNumber || '0',
              type: tx.type || 'unknown',
              tokenSymbol: tx.tokenSymbol || null,
              tokenDecimals: tx.tokenDecimals || 18,
              valueInETH: tx.valueInETH || null,
              input: tx.input || null,
            },
          });
          
          importedCount++;
        } else {
          duplicateCount++;
        }
      }
    }
    
    // Mettre à jour la date de dernière synchronisation du wallet
    await prisma.wallet.update({
      where: { id: walletId },
      data: { 
        lastSync: new Date(),
        syncStatus: 'COMPLETED',
      },
    });
    
    return NextResponse.json({
      success: true,
      importedCount,
      duplicateCount,
      totalCount: importedCount + duplicateCount,
    });
  } catch (error) {
    console.error("Erreur lors de l'importation des transactions:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'importation des transactions" },
      { status: 500 }
    );
  }
}