"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    // Vérifier si l'utilisateur est admin
    if (session?.user?.email !== "ryzenoking@gmail.com") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Afficher un indicateur de chargement pendant la vérification
  if (status === "loading" || (status === "authenticated" && session?.user?.email !== "ryzenoking@gmail.com")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Vérification des droits d'administration...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}