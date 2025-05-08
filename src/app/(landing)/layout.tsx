'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Layout simple pour la landing page (sans sidebar)
export default function LandingLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête de la landing page */}
      <header className="bg-transparent py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/bitaxlogo.png" alt="Bitax Logo" className="h-10 w-auto" />
            </Link>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/guide" className="text-gray-300 hover:text-white transition-colors">
                Guide
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
                Tarifs
              </Link>
              <Link href="/guide" className="text-gray-300 hover:text-white transition-colors">
                Fonctionnalités
              </Link>
            </nav>
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Contenu principal */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Pied de page simple */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img src="/bitaxlogo.png" alt="Bitax Logo" className="h-8 w-auto mb-2" />
              <p className="text-sm">© {new Date().getFullYear()} Bitax. Tous droits réservés.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm hover:text-white transition-colors">
                Conditions d'utilisation
              </Link>
              <Link href="/privacy" className="text-sm hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/support" className="text-sm hover:text-white transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}