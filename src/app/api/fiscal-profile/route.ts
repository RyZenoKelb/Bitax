// src/app/api/fiscal-profile/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Schéma de validation pour le profil fiscal
const fiscalProfileSchema = z.object({
  calculationMethod: z.string().default("FIFO"), // FIFO, LIFO, etc.
  taxCountry: z.string().default("France"),
  taxIdentifier: z.string().optional(),
  lastDeclarationYear: z.number().optional(),
});

// GET - Récupérer le profil fiscal de l'utilisateur
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupérer le profil fiscal
    const fiscalProfile = await prisma.fiscalProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    if (!fiscalProfile) {
      return NextResponse.json({
        fiscalProfile: {
          calculationMethod: "FIFO", // Valeurs par défaut
          taxCountry: "France",
          taxIdentifier: null,
          lastDeclarationYear: null,
        },
        isDefault: true, // Indique que c'est un profil par défaut
      });
    }
    
    return NextResponse.json({ fiscalProfile, isDefault: false });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil fiscal:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du profil fiscal" },
      { status: 500 }
    );
  }
}

// POST/PUT - Créer ou mettre à jour le profil fiscal
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
    const result = fiscalProfileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { calculationMethod, taxCountry, taxIdentifier, lastDeclarationYear } = body;
    
    // Vérifier si le profil fiscal existe déjà
    const existingProfile = await prisma.fiscalProfile.findUnique({
      where: {
        userId: session.user.id,
      },
    });
    
    let fiscalProfile;
    
    if (existingProfile) {
      // Mettre à jour le profil existant
      fiscalProfile = await prisma.fiscalProfile.update({
        where: {
          userId: session.user.id,
        },
        data: {
          calculationMethod,
          taxCountry,
          taxIdentifier,
          lastDeclarationYear,
        },
      });
    } else {
      // Créer un nouveau profil
      fiscalProfile = await prisma.fiscalProfile.create({
        data: {
          userId: session.user.id,
          calculationMethod,
          taxCountry,
          taxIdentifier,
          lastDeclarationYear,
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      fiscalProfile,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil fiscal:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour du profil fiscal" },
      { status: 500 }
    );
  }
}

// Pour la cohérence de l'API, nous supportons aussi PUT
export async function PUT(req: Request) {
  return POST(req);
}