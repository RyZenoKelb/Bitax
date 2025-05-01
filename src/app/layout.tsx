import { ReactNode } from 'react';
import AuthProvider from '@/components/AuthProvider';
import '../styles/globals.css';

export const metadata = {
  title: 'Bitax - Fiscalité crypto simplifiée',
  description: 'Gérez facilement votre fiscalité crypto avec Bitax',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}