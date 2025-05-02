"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Gestionnaire de clic en dehors du dropdown pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour gérer la déconnexion
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Première lettre du nom de l'utilisateur pour l'avatar
  const getInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    if (session?.user?.email) {
      return session.user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center group">
            <div className="w-10 h-10 relative overflow-visible">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-70 group-hover:opacity-100 transition-all duration-300 animate-pulse-slow"></div>
              <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-bold text-2xl">B</span>
              </div>
            </div>
            <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-tight">
              BITAX
            </span>
          </div>
        </Link>

        {/* Navigation principale */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link 
            href="/dashboard" 
            className="nav-link nav-link-pulse"
          >
            Dashboard
          </Link>
          <Link 
            href="/fonctionnalites" 
            className="nav-link"
          >
            Fonctionnalités
          </Link>
          <Link 
            href="/tarifs" 
            className="nav-link"
          >
            Tarifs
          </Link>
          <Link 
            href="/support" 
            className="nav-link"
          >
            Support
          </Link>
        </nav>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Bouton thème */}
          <button 
            className="p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 focus:outline-none transition-colors duration-200"
            aria-label="Changer le thème"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          {/* Menu utilisateur */}
          {status === "authenticated" ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="user-profile-button"
              >
                {session.user.image ? (
                  <Image 
                    src={session.user.image} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="user-avatar">
                    {getInitial()}
                  </div>
                )}
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden backdrop-blur-xl bg-gray-900/90 border border-gray-700/50 shadow-xl z-50 py-1 dropdown-animation">
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm text-white font-medium">{session.user.name || 'Utilisateur'}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link 
                      href="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mon profil
                    </Link>
                    
                    <Link 
                      href="/dashboard" 
                      className="dropdown-item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      Tableau de bord
                    </Link>
                    
                    {session.user.isPremium ? (
                      <div className="dropdown-item text-yellow-400">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Compte Premium
                      </div>
                    ) : (
                      <Link 
                        href="/tarifs" 
                        className="dropdown-item text-blue-400"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Passer Premium
                      </Link>
                    )}
                  </div>
                  
                  <div className="py-1 border-t border-gray-800">
                    <button 
                      className="dropdown-item text-red-400 hover:text-red-300"
                      onClick={handleSignOut}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="nav-button-secondary"
              >
                Connexion
              </Link>
              <Link 
                href="/register" 
                className="nav-button-primary"
              >
                S'inscrire
              </Link>
            </div>
          )}

          {/* Menu mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 focus:outline-none transition-colors duration-200"
          >
            <span className="sr-only">Menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden backdrop-blur-xl bg-gray-900/90 border-b border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <Link 
              href="/dashboard"
              className="block px-3 py-2 rounded-lg text-white hover:bg-gray-800 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="/fonctionnalites"
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Fonctionnalités
            </Link>
            <Link 
              href="/tarifs"
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Tarifs
            </Link>
            <Link 
              href="/support"
              className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>

            {status !== "authenticated" && (
              <div className="pt-4 border-t border-gray-800 flex flex-col gap-2">
                <Link 
                  href="/login"
                  className="block px-3 py-2 rounded-lg text-center bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-500/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link 
                  href="/register"
                  className="block px-3 py-2 rounded-lg text-center bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Styles pour les composants */}
      <style jsx>{`
        .nav-link {
          position: relative;
          padding: 0.5rem 1rem;
          color: #e2e8f0;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0.25rem;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
          width: 60%;
        }
        
        .nav-link-pulse {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .nav-link-pulse::after {
          width: 60%;
        }
        
        .nav-button-primary {
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, #3b82f6, #4f46e5);
          color: white;
          font-weight: 500;
          border-radius: 0.5rem;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }
        
        .nav-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.6);
        }
        
        .nav-button-secondary {
          padding: 0.5rem 1.25rem;
          background: transparent;
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #60a5fa;
          font-weight: 500;
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }
        
        .nav-button-secondary:hover {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.5);
        }
        
        .user-profile-button {
          position: relative;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          transition: all 0.2s ease;
        }
        
        .user-profile-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6, #4f46e5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
        }
        
        .dropdown-animation {
          animation: dropdownFade 0.2s ease-out;
        }
        
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
};

export default Navbar;