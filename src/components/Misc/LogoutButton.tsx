// src/components/LogoutButton.tsx
"use client";

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LogoutButtonProps {
  className?: string;
  onLogout?: () => void;
  variant?: 'link' | 'icon' | 'button';
  children?: React.ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  className = "", 
  onLogout,
  variant = 'button',
  children 
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    }
    // Au lieu de rediriger vers /login, on redirige vers notre page de déconnexion
    router.push('/logout');
  };

  // Le reste du composant reste identique
  if (variant === 'icon') {
    return (
      <button 
        onClick={handleLogout}
        className={className}
        aria-label="Déconnexion"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleLogout}
        className={`text-red-400 hover:text-red-300 dark:text-red-400 dark:hover:text-red-300 transition-colors ${className}`}
      >
        {children || (
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300 light:text-red-600 light:hover:bg-gray-100 light:hover:text-red-700 flex items-center ${className}`}
    >
      {children || (
        <>
          <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </>
      )}
    </button>
  );
};

export default LogoutButton;