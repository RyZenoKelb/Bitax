// src/app/api/subscription/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour l'abonnement
const subscriptionSchema = z.object({
  plan: z.enum(["free", "premium"]),
  startDate: z.string().or(z.date()).optional(),
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
    
    // Vérifier si le modèle Subscription existe déjà dans le schéma
    // Si ce n'est pas le cas, renvoyer un abonnement par défaut
    let subscription;
    try {
      subscription = await prisma.subscription.findUnique({
        where: {
          userId: session.user.id,
        },
      });
    } catch (error: any) {
      // Si l'erreur est due à un modèle inexistant, renvoyer un abonnement par défaut
      console.error("Erreur lors de la récupération de l'abonnement:", error);
      
      return NextResponse.json({
        subscription: {
          plan: session.user.isPremium ? "premium" : "free",
          startDate: new Date(),
          endDate: session.user.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          autoRenew: false,
        },
        isDefault: true,
      });
    }
    
    if (!subscription) {
      return NextResponse.json({
        subscription: {
          plan: session.user.isPremium ? "premium" : "free",
          startDate: new Date(),
          endDate: session.user.isPremium ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
          autoRenew: false,
        },
        isDefault: true,
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
    
    try {
      // Préparer les données à insérer
      const { plan, startDate, endDate, paymentMethod, paymentId, autoRenew } = body;
      
      const data = {
        plan,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        paymentMethod,
        paymentId,
        autoRenew,
      };
      
      // Mettre à jour le statut premium dans la base de données
      const isPremium = plan === "premium" && (!endDate || new Date(endDate) > new Date());
      
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isPremium },
      });
      
      // Vérifier si l'abonnement existe déjà
      let subscription;
      const existingSubscription = await prisma.subscription.findUnique({
        where: {
          userId: session.user.id,
        },
      });
      
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
      
      return NextResponse.json({
        success: true,
        subscription,
      });
    } catch (error: any) {
      // Si l'erreur est due à un modèle inexistant, renvoyer une réponse appropriée
      console.error("Erreur lors de la mise à jour de l'abonnement:", error);
      
      // Mise à jour de l'utilisateur avec le statut premium malgré l'erreur
      const isPremium = body.plan === "premium";
      await prisma.user.update({
        where: { id: session.user.id },
        data: { isPremium },
      });
      
      return NextResponse.json(
        { 
          success: true,
          warning: "Le modèle Subscription n'est pas encore disponible. Seul le statut premium a été mis à jour.",
          details: error.message,
          subscription: {
            plan: body.plan,
            startDate: body.startDate || new Date(),
            endDate: body.endDate || null,
            autoRenew: body.autoRenew || false,
            paymentMethod: body.paymentMethod,
            paymentId: body.paymentId,
          }
        }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de l'abonnement" },
      { status: 500 }
    );
  }
}