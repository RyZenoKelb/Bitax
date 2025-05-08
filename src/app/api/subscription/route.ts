// src/app/api/subscription/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { updateSessionPremiumStatus } from "@/lib/server-auth";

// Schéma de validation pour l'abonnement
const subscriptionSchema = z.object({
  plan: z.enum(["free", "premium"]),
  startDate: z.string().or(z.date()).optional(), // Accepte un string ISO ou un objet Date
  endDate: z.string().or(z.date()).optional(),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

// GET - Récupérer l'abonnement de l'utilisateur
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupérer l'abonnement
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    if (!subscription) {
      // Retourner un abonnement par défaut (gratuit)
      return NextResponse.json({
        subscription: {
          plan: "free",
          startDate: new Date(),
          endDate: null,
          autoRenew: false,
        },
        isDefault: true,
      });
    }
    
    // Vérifier si l'abonnement premium est expiré
    if (subscription.plan === "premium" && subscription.endDate && new Date(subscription.endDate) < new Date()) {
      return NextResponse.json({
        subscription: {
          ...subscription,
          isExpired: true,
        },
      });
    }
    
    return NextResponse.json({ subscription, isDefault: false });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'abonnement:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de l'abonnement" },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour l'abonnement
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
    const result = subscriptionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { plan, startDate, endDate, paymentMethod, paymentId, autoRenew } = body;
    
    // Préparer les données à insérer
    const data = {
      plan,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      paymentMethod,
      paymentId,
      autoRenew,
    };
    
    // Vérifier si l'abonnement existe déjà
    const existingSubscription = await prisma.subscription.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    let subscription;
    
    if (existingSubscription) {
      // Mettre à jour l'abonnement existant
      subscription = await prisma.subscription.update({
        where: {
          userId: session.user.id,
        },
        data,
      });
    } else {
      // Créer un nouvel abonnement
      subscription = await prisma.subscription.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      });
    }
    
    // Mettre à jour le statut premium dans la base de données
    const isPremium = plan === "premium" && (!endDate || new Date(endDate) > new Date());
    await prisma.user.update({
      where: { id: session.user.id },
      data: { isPremium },
    });
    
    // Mettre à jour le statut dans la session
    await updateSessionPremiumStatus(session.user.id);
    
    return NextResponse.json({
      success: true,
      subscription,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}

// Simuler un webhook de paiement pour les tests
// Cette route serait normalement protégée par une vérification de signature
// du fournisseur de paiement (Stripe, etc.)
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: "ID utilisateur manquant" },
        { status: 400 }
      );
    }
    
    // Actions possibles : subscribe, cancel, renew
    if (action === 'subscribe') {
      // Créer un nouvel abonnement premium
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // Abonnement d'un an
      
      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: "premium",
          startDate: new Date(),
          endDate,
          autoRenew: true,
        },
        create: {
          userId,
          plan: "premium",
          startDate: new Date(),
          endDate,
          autoRenew: true,
        },
      });
      
      // Mettre à jour le statut premium de l'utilisateur
      await prisma.user.update({
        where: { id: userId },
        data: { isPremium: true },
      });
    } else if (action === 'cancel') {
      // Annuler l'abonnement (mais maintenir jusqu'à la fin de la période)
      await prisma.subscription.update({
        where: { userId },
        data: { autoRenew: false },
      });
    } else if (action === 'renew') {
      // Renouveler l'abonnement
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });
      
      if (subscription) {
        const newEndDate = new Date(subscription.endDate || new Date());
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        
        await prisma.subscription.update({
          where: { userId },
          data: { endDate: newEndDate },
        });
        
        // Mettre à jour le statut premium
        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true },
        });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement du webhook" },
      { status: 500 }
    );
  }
}