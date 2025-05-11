import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Liste des emails administrateurs
const ADMIN_EMAILS = ['ryzenoking@gmail.com'];

/**
 * Vérifie si un utilisateur est administrateur
 */
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  
  // Vérifier l'authentification
  if (!session?.user) {
    return false;
  }
  
  // Vérifier si l'email est dans la liste des admins
  return ADMIN_EMAILS.includes(session.user.email as string);
}

/**
 * Middleware pour les routes qui nécessitent des droits d'administration
 * Redirige vers la page d'accueil si l'utilisateur n'est pas admin
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }
  
  if (!ADMIN_EMAILS.includes(session.user.email as string)) {
    redirect("/");
  }
  
  return session;
}