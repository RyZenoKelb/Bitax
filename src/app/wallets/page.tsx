// src/app/wallets/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { requireAuth } from '@/lib/server-auth';
import WalletsDashboard from '@/components/Wallet/WalletsDashboard';

export const metadata: Metadata = {
  title: 'Bitax | Gérer vos wallets',
  description: 'Connectez et gérez tous vos wallets crypto pour simplifier votre fiscalité.',
};

export default async function WalletsPage() {
  // S'assurer que l'utilisateur est connecté
  const session = await requireAuth();
  
  return (
    <div className="max-w-7xl mx-auto">
      <WalletsDashboard userId={session.user.id} />
    </div>
  );
}