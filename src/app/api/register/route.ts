import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Changé de bcrypt à bcryptjs
import { z } from "zod";

// Validation schema
const UserSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

// Fonction helper pour le logging
function logDebug(message: string, data?: any) {
  console.log(`[API DEBUG] ${message}`, data ? JSON.stringify(data) : '');
}

export async function POST(req: Request) {
  logDebug('Début de la requête POST /api/register');
  
  try {
    // Vérifier que la requête est bien au format JSON
    const contentType = req.headers.get("content-type");
    logDebug(`Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes("application/json")) {
      logDebug('Erreur: Content-Type incorrect');
      return NextResponse.json(
        { error: "Le contenu doit être au format JSON" },
        { status: 400 }
      );
    }

    // Lire la requête brute pour le debug
    const rawText = await req.text();
    logDebug('Corps de la requête brut:', rawText);
    
    // Convertir en JSON
    let body;
    try {
      body = JSON.parse(rawText);
      logDebug('Corps de la requête parsé:', body);
    } catch (error) {
      logDebug('Erreur de parsing JSON:', error);
      return NextResponse.json(
        { error: "Impossible de parser le corps de la requête en JSON" },
        { status: 400 }
      );
    }
    
    // Valider les données
    const result = UserSchema.safeParse(body);
    if (!result.success) {
      logDebug('Validation échouée:', result.error);
      return NextResponse.json(
        { error: "Données d'inscription invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, password } = body;
    logDebug(`Tentative d'inscription pour: ${email}`);
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      logDebug('Utilisateur déjà existant');
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }
    
    // Hasher le mot de passe
    logDebug('Hachage du mot de passe');
    const hashedPassword = await hash(password, 10);
    
    // Créer le nouvel utilisateur
    logDebug('Création de l\'utilisateur');
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    logDebug('Utilisateur créé avec succès');
    
    // Retourner une réponse avec les informations non sensibles
    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    logDebug('Erreur non gérée:', error);
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}