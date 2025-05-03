// src/app/api/chat/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configuration de l'API OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Instructions pour le chatbot
const SYSTEM_PROMPT = `
Tu es l'assistant virtuel de Bitax, une plateforme de fiscalité pour les cryptomonnaies.
Ton rôle est d'aider les utilisateurs avec leurs questions sur la fiscalité crypto, la plateforme Bitax, et les fonctionnalités disponibles.

Informations importantes sur Bitax:
- Bitax permet de connecter des wallets crypto (Metamask, Coinbase Wallet, etc.)
- Bitax supporte plusieurs blockchains (Ethereum, Polygon, Arbitrum, Optimism, Base)
- Bitax génère des rapports fiscaux basés sur les plus-values/moins-values
- Bitax peut exporter ces rapports en PDF

Si tu ne connais pas la réponse à une question, suggère à l'utilisateur de contacter le support par email à support@bitax.com.
Sois toujours poli, concis et professionnel.
`;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ Clé API manquante !");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { message, history = [] } = body;

    if (!message || message.trim().length === 0) {
      console.warn("⚠️ Aucun message fourni");
      return NextResponse.json(
        { error: "Please provide a valid message" },
        { status: 400 }
      );
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history,
      { role: "user", content: message }
    ];

    console.log("✅ Messages envoyés à OpenAI:", JSON.stringify(messages, null, 2));

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const responseText = completion.choices[0].message?.content || "Désolé, je n'ai pas pu générer de réponse.";

    console.log("✅ Réponse de l'API OpenAI :", responseText);

    return NextResponse.json({ message: responseText });
  } catch (error: any) {
    console.error("❌ Erreur dans /api/chat:", error);
    return NextResponse.json(
      { error: "An error occurred during your request." },
      { status: 500 }
    );
  }
}
