import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "API fonctionne correctement" });
}

export async function POST(req: Request) {
  try {
    // Tentative de parsing du body
    const body = await req.json();
    
    // Retourner le body tel quel
    return NextResponse.json({ 
      message: "POST reçu correctement", 
      receivedData: body 
    });
  } catch (error) {
    console.error("Erreur lors du traitement du POST:", error);
    
    // Renvoyer une erreur formatée en JSON (pas en HTML)
    return NextResponse.json({ 
      error: "Erreur lors du traitement de la requête",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 400 });
  }
}