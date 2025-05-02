// src/app/dashboard/layout.tsx
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | Bitax",
  description: "Tableau de bord Bitax - Gérez votre fiscalité crypto",
};

// Logo SVG amélioré avec style futuriste
const BitaxLogo = () => {
  return (
    <div className="flex items-center">
      <div className="relative h-12 w-12 mr-3">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 opacity-80 blur-sm"></div>
        <div className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-white">
          BX
        </div>
      </div>
      <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400">
        BITAX
      </div>
    </div>
  );
};

// Composant du bouton de thème
const ThemeToggle = () => {
  return (
    <button
      className="relative overflow-hidden h-8 w-8 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors group"
      aria-label="Changer de thème"
    >
      {/* Icône soleil (mode clair) */}
      <div className="absolute inset-0 flex items-center justify-center text-yellow-400 opacity-100 group-hover:scale-110 transition-transform duration-200">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
    </button>
  );
};

// Menu utilisateur amélioré avec animation
const UserMenu = ({ user }: { user: any }) => {
  return (
    <div className="relative group" data-user-menu>
      <button
        className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl py-2 px-3 border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 focus:outline-none focus:ring-2 focus:ring-primary-500/40"
        data-user-menu-button
      >
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-inner shadow-white/10">
          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
        </div>
        <span className="hidden sm:inline text-white font-medium">
          {user.name || user.email}
        </span>
        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Menu déroulant (s'affiche au clic, pas au survol) */}
      <div 
        className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-700/60 p-3 opacity-0 invisible scale-95 origin-top-right transition-all duration-200 z-50 overflow-hidden"
        data-user-menu-dropdown
      >
        <div className="py-2 px-3 border-b border-gray-700/50 mb-2">
          <div className="text-sm font-normal text-gray-400">Connecté en tant que</div>
          <div className="font-medium text-white truncate">{user.name || user.email}</div>
        </div>
        
        <div className="space-y-1 py-1">
          <Link href="/profile" className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mon profil
          </Link>
          <Link href="/dashboard/wallets" className="flex items-center px-3 py-2 text-sm text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors">
            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Mes wallets
          </Link>
        </div>
        
        <div className="py-1 border-t border-gray-700/50 mt-1">
          <Link href="/api/auth/signout" className="flex items-center px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
            <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </Link>
        </div>
      </div>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900/30 to-gray-900">
      {/* Effets de fond */}
      <div className="absolute inset-0 -z-10 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <BitaxLogo />
            </Link>
          </div>
          
          {/* Navigation principale */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/dashboard" className="nav-link-dashboard px-3 py-2 rounded-lg text-white hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </div>
            </Link>
            <Link href="/guide" className="nav-link-dashboard px-3 py-2 rounded-lg text-white hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Guide d'utilisation
              </div>
            </Link>
            <Link href="/pricing" className="nav-link-dashboard px-3 py-2 rounded-lg text-white hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tarifs
              </div>
            </Link>
            <Link href="/support" className="nav-link-dashboard px-3 py-2 rounded-lg text-white hover:bg-gray-800/70 transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Support
              </div>
            </Link>
          </nav>
          
          {/* Menu utilisateur et thème */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserMenu user={session.user} />
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
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 backdrop-blur-xl bg-gray-900/80 border-t border-gray-800/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Bitax. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Accueil</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Tarifs</Link>
            <Link href="/guide" className="text-gray-400 hover:text-white transition-colors text-sm">Guide</Link>
            <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
          </div>
        </div>
      </footer>
      
      {/* Script pour gérer le menu utilisateur */}
      <script id="user-menu-script" dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const menuButton = document.querySelector('[data-user-menu-button]');
            const menuDropdown = document.querySelector('[data-user-menu-dropdown]');
            let isMenuOpen = false;
            
            if (menuButton && menuDropdown) {
              // Fonction pour ouvrir/fermer le menu
              function toggleMenu() {
                isMenuOpen = !isMenuOpen;
                
                if (isMenuOpen) {
                  menuDropdown.classList.remove('opacity-0', 'invisible', 'scale-95');
                  menuDropdown.classList.add('opacity-100', 'visible', 'scale-100');
                } else {
                  menuDropdown.classList.remove('opacity-100', 'visible', 'scale-100');
                  menuDropdown.classList.add('opacity-0', 'invisible', 'scale-95');
                }
              }
              
              // Gestionnaire de clic sur le bouton
              menuButton.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMenu();
              });
              
              // Fermer le menu si clic ailleurs
              document.addEventListener('click', function(e) {
                if (isMenuOpen && !menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
                  toggleMenu();
                }
              });
            }
          });
        `
      }} />
    </div>
  );
}