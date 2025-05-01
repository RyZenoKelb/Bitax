import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Tenter une requête simple à la base de données
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Connexion à la base de données établie avec succès",
      userCount
    });
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    
    return NextResponse.json({
      status: "error",
      message: "Échec de la connexion à la base de données",
      error: error instanceof Error ? error.message : String(error)
    }, {
      status: 500
    });
  }
}