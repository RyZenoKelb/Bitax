import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // Changé de bcrypt à bcryptjs
import { z } from "zod";

// Validation schema - avec le champ inviteCode optionnel pour la beta
const UserSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
  inviteCode: z.string().optional(), // Code d'invitation pour la beta
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
    
    const { name, email, password, inviteCode } = body;
    logDebug(`Tentative d'inscription pour: ${email}`);
    
    // En phase beta: vérifier si un code d'invitation valide est fourni
    // sauf si l'invitation n'est pas requise (pour les administrateurs)
    const betaPhase = true; // Définir sur true pour activer la phase beta
    
    if (betaPhase) {
      logDebug('Phase beta active - vérification du code d\'invitation');
      
      // Si aucun code d'invitation n'est fourni
      if (!inviteCode) {
        logDebug('Pas de code d\'invitation fourni');
        return NextResponse.json(
          { error: "Un code d'invitation est requis pour créer un compte pendant la beta" },
          { status: 403 }
        );
      }
      
      // Vérifier si le code d'invitation est valide
      const invitation = await prisma.waitingList.findFirst({
        where: {
          inviteCode,
          invited: true,
          email: email // L'email doit correspondre à celui de l'invitation
        }
      });
      
      if (!invitation) {
        logDebug('Code d\'invitation invalide ou ne correspondant pas à l\'email');
        return NextResponse.json(
          { error: "Code d'invitation invalide ou expiré" },
          { status: 400 }
        );
      }
      
      logDebug('Code d\'invitation valide pour l\'email:', email);
    }
    
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
    
    // Si l'utilisateur s'est inscrit avec un code d'invitation, mettre à jour l'entrée de la waiting list
    if (inviteCode) {
      logDebug('Mise à jour de l\'entrée de waiting list avec l\'ID utilisateur');
      await prisma.WaitingList.update({
        where: { inviteCode },
        data: { userId: user.id }
      });
    }
    
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