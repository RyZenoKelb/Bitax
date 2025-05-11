import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin-auth";
import { randomBytes } from "crypto";

// POST - Envoyer une invitation à un utilisateur en waiting list
export async function POST(req: Request) {
  // Vérifier les droits d'administration
  if (!await isAdmin()) {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }
  
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "L'identifiant de l'utilisateur est requis" },
        { status: 400 }
      );
    }
    
    // Vérifier si l'entrée existe
    const waitingListEntry = await prisma.waitingList.findUnique({
      where: { id },
    });
    
    if (!waitingListEntry) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé dans la liste d'attente" },
        { status: 404 }
      );
    }
    
    // Vérifier si l'utilisateur a déjà été invité
    if (waitingListEntry.invited) {
      return NextResponse.json(
        { error: "Cet utilisateur a déjà été invité" },
        { status: 400 }
      );
    }
    
    // Générer un code d'invitation unique si nécessaire
    let inviteCode = waitingListEntry.inviteCode;
    if (!inviteCode) {
      inviteCode = randomBytes(16).toString("hex");
    }
    
    // Mettre à jour l'entrée avec le statut invité et la date d'invitation
    const updatedEntry = await prisma.waitingList.update({
      where: { id },
      data: {
        invited: true,
        inviteCode,
        invitedAt: new Date(),
      },
    });
    
    // Ici, vous pourriez envoyer un email à l'utilisateur avec le lien d'invitation
    // Exemple: sendInvitationEmail(waitingListEntry.email, waitingListEntry.name, inviteCode);
    
    return NextResponse.json({
      success: true,
      message: "Invitation envoyée avec succès",
      entry: updatedEntry,
      inviteUrl: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/invite/${inviteCode}`
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'invitation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement de la demande" },
      { status: 500 }
    );
  }
}

// GET - Vérifier le statut d'invitation d'un utilisateur par code
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  
  if (!code) {
    return NextResponse.json(
      { error: "Le code d'invitation est requis" },
      { status: 400 }
    );
  }
  
  try {
    const waitingListEntry = await prisma.waitingList.findFirst({
      where: {
        inviteCode: code,
        invited: true,
      },
    });
    
    if (!waitingListEntry) {
      return NextResponse.json(
        { error: "Code d'invitation invalide ou expiré" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      email: waitingListEntry.email,
      name: waitingListEntry.name,
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la vérification du code d'invitation:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la vérification du code" },
      { status: 500 }
    );
  }
}