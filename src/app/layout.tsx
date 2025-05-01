import { ReactNode } from 'react';
import AuthProvider from '@/components/AuthProvider';
import '../styles/globals.css';

export const metadata = {
  title: 'Bitax - Fiscalité crypto simplifiée',
  description: 'Gérez facilement votre fiscalité crypto avec Bitax',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Ajout des polices Google */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}