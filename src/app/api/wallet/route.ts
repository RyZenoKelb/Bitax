// src/app/api/wallet/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour l'ajout d'un wallet
const walletSchema = z.object({
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
    const result = walletSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { address, network, name, isPrimary } = body;
    
    // Vérifier si le wallet existe déjà pour cet utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId: session.user.id,
        address: address,
        network: network,
      },
    });
    
    if (existingWallet) {
      return NextResponse.json(
        { error: "Ce wallet est déjà enregistré" },
        { status: 400 }
      );
    }
    
    // Si ce wallet est marqué comme principal, mettre à jour les autres
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: { userId: session.user.id },
        data: { isPrimary: false },
      });
    }
    
    // Créer le nouveau wallet - Ne pas inclure walletType qui n'existe pas
    const wallet = await prisma.wallet.create({
      data: {
        address,
        network,
        name: name || `${network.toUpperCase()} Wallet`,
        isPrimary,
        userId: session.user.id,
        status: "pending", // Par défaut en attente
      },
    });
    
    return NextResponse.json({ success: true, wallet });
  } catch (error) {
    console.error("Erreur lors de l'ajout du wallet:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'ajout du wallet" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupérer tous les wallets de l'utilisateur
    const wallets = await prisma.wallet.findMany({
      where: { userId: session.user.id },
      orderBy: { isPrimary: 'desc' },
    });
    
    return NextResponse.json({ wallets });
  } catch (error) {
    console.error("Erreur lors de la récupération des wallets:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des wallets" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(req.url);
    const walletId = searchParams.get('id');
    
    if (!walletId) {
      return NextResponse.json(
        { error: "ID de wallet manquant" },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    // Valider les données
    const result = walletUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    // Vérifier que le wallet appartient bien à l'utilisateur
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id: walletId,
        userId: session.user.id,
      },
    });
    
    if (!existingWallet) {
      return NextResponse.json(
        { error: "Wallet non trouvé ou non autorisé" },
        { status: 404 }
      );
    }
    
    const { address, network, name, isPrimary } = body;
    
    // Si le wallet est marqué comme principal, mettre à jour les autres
    if (isPrimary) {
      await prisma.wallet.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: walletId }
        },
        data: { isPrimary: false },
      });
    }
    
    // Mettre à jour le wallet
    const updatedWallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        ...(address && { address }),
        ...(network && { network }),
        ...(name !== undefined && { name }),
        ...(isPrimary !== undefined && { isPrimary }),
      },
    });
    
    return NextResponse.json({ success: true, wallet: updatedWallet });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du wallet:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour du wallet" },
      { status: 500 }
    );
  }
}

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
    const walletId = searchParams.get('id');
    
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
    
    // Supprimer le wallet
    await prisma.wallet.delete({
      where: { id: walletId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du wallet:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression du wallet" },
      { status: 500 }
    );
  }
}