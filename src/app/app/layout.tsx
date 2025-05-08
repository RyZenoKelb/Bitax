'use client';

import { ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { DevModeProvider } from '@/context/DevModeContext';
import ClientLayout from '@/components/ClientLayout';
import { redirect } from 'next/navigation';

// Layout pour les pages authentifiées (avec sidebar)
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  
  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Afficher le layout complet avec sidebar uniquement pour les utilisateurs authentifiés
  return (
    <DevModeProvider>
      <ClientLayout>{children}</ClientLayout>
    </DevModeProvider>
  );
}