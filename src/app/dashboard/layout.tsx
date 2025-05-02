// src/app/dashboard/layout.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Dashboard | Bitax",
  description: "Tableau de bord Bitax - Gérez votre fiscalité crypto",
};

// Logo SVG simplifié pour le header
const BitaxLogo = () => {
  return (
    <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 p-2 rounded-xl shadow-glow-purple">
      BITAX
    </div>
  );
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BitaxLogo />
            </Link>
          </div>
          
          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="nav-link-active">
              Dashboard
            </Link>
            <Link href="/dashboard/transactions" className="nav-link">
              Transactions
            </Link>
            <Link href="/dashboard/rapports" className="nav-link">
              Rapports fiscaux
            </Link>
            <Link href="/dashboard/settings" className="nav-link">
              Paramètres
            </Link>
          </nav>
          
          {/* Menu utilisateur */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <button className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg py-2 px-3 border border-gray-700/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
                <span className="hidden sm:inline text-white">
                  {session.user.name || session.user.email}
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-2 hidden group-hover:block z-50">
                <Link href="/profile" className="block px-4 py-2 text-white hover:bg-gray-700 rounded-md">
                  Mon profil
                </Link>
                <Link href="/dashboard/wallets" className="block px-4 py-2 text-white hover:bg-gray-700 rounded-md">
                  Mes wallets
                </Link>
                <div className="border-t border-gray-700 my-2"></div>
                <Link href="/api/auth/signout" className="block px-4 py-2 text-red-400 hover:bg-gray-700 rounded-md">
                  Déconnexion
                </Link>
              </div>
            </div>
          </div>
          
          {/* Menu hamburger mobile */}
          <button className="md:hidden text-white p-2 rounded-md hover:bg-gray-800/50">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 bg-gray-900/80 border-t border-gray-800/50">
        <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Bitax. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}