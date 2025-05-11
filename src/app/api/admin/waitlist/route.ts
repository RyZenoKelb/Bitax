import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-auth";

// GET - Récupérer la liste des inscriptions (filtrée par status)
export async function GET(req: Request) {
  // Vérifier les droits d'administration
  if (!await isAdmin()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }
  
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "pending";
  
  try {
    const waitingList = await prisma.waitingList.findMany({
      where: {
        invited: status === "invited" ? true : false
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    return NextResponse.json(waitingList, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la waiting list:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des données" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle inscription (administrateur)
export async function POST(req: Request) {
  // Vérifier les droits d'administration
  if (!await isAdmin()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }
  
  try {
    const body = await req.json();
    const { name, email, motivation, skills } = body;
    
    // Vérifier si l'email existe déjà
    const existingEntry = await prisma.waitingList.findUnique({
      where: { email },
    });
    
    if (existingEntry) {
      return NextResponse.json(
        { error: "Cet email est déjà inscrit" },
        { status: 400 }
      );
    }
    
    // Créer l'entrée dans la waiting list
    const waitingListEntry = await prisma.waitingList.create({
      data: {
        name,
        email,
        motivation,
        skills: Array.isArray(skills) ? skills.join(",") : skills,
      },
    });
    
    return NextResponse.json(waitingListEntry, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création d'une inscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la demande" },
      { status: 500 }
    );
  }
}