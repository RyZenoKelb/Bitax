import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

// Validation schema
const UserSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

export async function POST(req: Request) {
  try {
    // Vérifier que la requête est bien au format JSON
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Le contenu doit être au format JSON" },
        { status: 400 }
      );
    }

    // Analyser le corps de la requête
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("Erreur lors du parsing JSON:", error);
      return NextResponse.json(
        { error: "Impossible de parser le corps de la requête en JSON" },
        { status: 400 }
      );
    }
    
    // Valider les données
    const result = UserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données d'inscription invalides", details: result.error.errors },
        { status: 400 }
      );
    }
    
    const { name, email, password } = body;
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await hash(password, 10);
    
    // Créer le nouvel utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
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
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'inscription" },
      { status: 500 }
    );
  }
}