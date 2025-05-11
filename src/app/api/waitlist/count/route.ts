import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API pour récupérer le nombre d'inscriptions à la waiting list
 * GET /api/waitlist/count
 */
export async function GET() {
  try {
    // Compter le nombre total d'inscriptions
    const count = await prisma.waitingList.count();
    
    // Retourner le résultat
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du comptage des inscriptions à la waiting list:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du comptage des inscriptions" },
      { status: 500 }
    );
  }
}