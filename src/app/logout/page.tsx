'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LogoutPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // Déconnecter l'utilisateur dès le chargement de la page
    signOut({ redirect: false });
    
    // Configurer le compte à rebours et la redirection
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
      <div className="text-center px-6 py-12 max-w-md mx-auto backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
        <div className="w-20 h-20 bg-green-500/10 rounded-full mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-3">Déconnexion réussie</h1>
        <p className="text-blue-100/70 mb-8">
          Vous avez été déconnecté avec succès. Merci d'avoir utilisé Bitax.
        </p>
        
        <p className="text-blue-100/50 text-sm mb-6">
          Redirection automatique dans <span className="text-indigo-400 font-medium">{countdown}</span> secondes...
        </p>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}