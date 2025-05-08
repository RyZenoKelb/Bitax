'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ClientLayout from '@/components/ClientLayout';

// Layout pour les pages de l'application (avec sidebar)
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ClientLayout>{children}</ClientLayout>
  );
}