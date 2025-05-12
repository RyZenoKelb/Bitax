"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requirePremium?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requirePremium = false 
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    // Si l'authentification est en cours, attendre
    if (status === "loading") {
      return;
    }

    // Si la page nécessite un abonnement premium et l'utilisateur n'en a pas
    if (requirePremium && !session?.user.isPremium) {
      router.push("/pricing");
      return;
    }

    // L'utilisateur est autorisé à voir le contenu
    setIsAuthorized(true);
  }, [status, session, router, requirePremium]);

  // Afficher un loader pendant la vérification
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;