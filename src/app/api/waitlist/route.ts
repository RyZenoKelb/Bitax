import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// Schéma de validation pour l'inscription à la waiting list
const waitingListSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  motivation: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    // Récupérer les données du corps de la requête
    const body = await req.json();
    
    // Valider les données
    const validation = waitingListSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Données invalides", 
          details: validation.error.format() 
        }, 
        { status: 400 }
      );
    }
    
    const { name, email, motivation, skills } = validation.data;
    
    // Vérifier si l'email existe déjà dans la waiting list
    const existingEntry = await prisma.waitingList.findUnique({
      where: { email },
    });
    
    if (existingEntry) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit à la liste d'attente" },
        { status: 400 }
      );
    }
    
    // Créer un code d'invitation unique (mais pas encore activé)
    const inviteCode = randomBytes(16).toString("hex");
    
    // Enregistrer l'inscription dans la base de données
    const waitingListEntry = await prisma.waitingList.create({
      data: {
        name,
        email,
        motivation,
        skills: skills ? skills.join(",") : "",
        inviteCode,
      },
    });
    
    // Envoyer un email de confirmation (à implémenter avec un service email)
    // sendConfirmationEmail(email, name);
    
    return NextResponse.json(
      { success: true, message: "Inscription à la liste d'attente réussie" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription à la waiting list:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de votre demande" },
      { status: 500 }
    );
  }
}

// Route pour récupérer le nombre d'inscrits sur la waiting list (utilisée par la page d'accueil)
export async function GET() {
  try {
    const count = await prisma.waitingList.count();
    
    return NextResponse.json(
      { count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération du nombre d'inscrits:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des données" },
      { status: 500 }
    );
  }
}