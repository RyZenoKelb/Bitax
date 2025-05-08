// lib/server-auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Vérifier si l'utilisateur est authentifié côté serveur
export async function getAuthSession() {
  const session = await getServerSession(authOptions);
  return session;
}

// Vérifier l'authentification et rediriger si non authentifié
export async function requireAuth() {
  const session = await getAuthSession();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session;
}

// Vérifier l'authentification et l'abonnement premium
export async function requirePremium() {
  const session = await requireAuth();
  
  // Si l'utilisateur n'a pas d'abonnement premium, rediriger vers la page d'abonnement
  if (!session.user.isPremium) {
    redirect("/pricing");
  }
  
  return session;
}

// Récupérer les informations détaillées de l'utilisateur
export async function getUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      wallets: true,
      fiscalProfile: true,
      subscription: true,
    },
  });
  
  return user;
}

// Vérifier si l'utilisateur est le propriétaire d'une ressource
export async function isOwner(userId: string, resourceType: 'wallet' | 'report', resourceId: string) {
  try {
    if (resourceType === 'wallet') {
      const wallet = await prisma.wallet.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });
      
      return wallet?.userId === userId;
    }
    
    if (resourceType === 'report') {
      const report = await prisma.report.findUnique({
        where: { id: resourceId },
        select: { userId: true },
      });
      
      return report?.userId === userId;
    }
    
    return false;
  } catch (error) {
    console.error(`Erreur lors de la vérification du propriétaire:`, error);
    return false;
  }
}

// Mettre à jour le statut premium d'un utilisateur dans la session
export async function updateSessionPremiumStatus(userId: string) {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: "premium",
        endDate: {
          gt: new Date(),
        },
      },
    });
    
    const isPremium = !!subscription;
    
    await prisma.user.update({
      where: { id: userId },
      data: { isPremium },
    });
    
    return isPremium;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut premium:", error);
    return false;
  }
}