// src/app/dashboard/layout.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Bitax",
  description: "Tableau de bord Bitax - Gérez votre fiscalité crypto",
};

// Dashboard Layout simplifié - n'ajoute pas de contenu supplémentaire
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Retourne uniquement les enfants sans ajouter de contenu supplémentaire
  return (
    <>
      {children}
    </>
  );
}