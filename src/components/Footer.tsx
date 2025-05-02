"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  // Ne pas afficher le footer sur certaines pages (comme login ou register)
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Arrière-plan avec effets */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        {/* Formes géométriques floues en arrière-plan */}
        <div className="absolute top-20 right-[20%] w-72 h-72 rounded-full bg-blue-500/5 blur-3xl"></div>
        <div className="absolute bottom-10 left-[10%] w-56 h-56 rounded-full bg-indigo-500/5 blur-3xl"></div>
      </div>
      
      {/* Section principale du footer */}
      <div className="relative z-10 container mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl opacity-70"></div>
                <div className="absolute inset-1 bg-gray-900 rounded-lg flex items-center justify-center z-10">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 font-bold text-2xl">B</span>
                </div>
              </div>
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 tracking-tight">
                BITAX
              </span>
            </div>
            
            <p className="mt-4 text-gray-400 text-sm">
              Simplifiez votre fiscalité crypto avec Bitax. Notre plateforme innovante analyse vos transactions blockchain et génère des rapports fiscaux précis en quelques minutes.
            </p>
            
            <div className="mt-6 flex space-x-4">
              {/* Boutons sociaux */}
              <a href="#" className="social-button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
              <a href="#" className="social-button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="social-button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" className="social-button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Colonnes de liens */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg border-l-2 border-blue-500 pl-3">Navigation</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
                <li><Link href="/fonctionnalites" className="footer-link">Fonctionnalités</Link></li>
                <li><Link href="/tarifs" className="footer-link">Tarifs</Link></li>
                <li><Link href="/guide" className="footer-link">Guide</Link></li>
                <li><Link href="/support" className="footer-link">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg border-l-2 border-indigo-500 pl-3">Ressources</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="footer-link">Blog</Link></li>
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                <li><Link href="/api-docs" className="footer-link">Documentation API</Link></li>
                <li><a href="#" className="footer-link">Livre blanc</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg border-l-2 border-purple-500 pl-3">Légal</h3>
              <ul className="space-y-2">
                <li><Link href="/conditions" className="footer-link">Conditions d'utilisation</Link></li>
                <li><Link href="/privacy" className="footer-link">Politique de confidentialité</Link></li>
                <li><Link href="/cookies" className="footer-link">Cookies</Link></li>
                <li><Link href="/mentions-legales" className="footer-link">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Séparateur */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent my-8"></div>
        
        {/* Pied de page */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
          </p>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="tech-badge">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
              Blockchain
            </div>
            <div className="tech-badge">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              IA
            </div>
            <div className="tech-badge">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Fiscalité
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles pour le footer */}
      <style jsx>{`
        .footer-link {
          color: #9ca3af;
          transition: all 0.2s ease;
          font-size: 0.875rem;
          display: inline-block;
        }
        
        .footer-link:hover {
          color: #60a5fa;
          transform: translateX(3px);
        }
        
        .social-button {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .social-button:hover {
          color: white;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(79, 70, 229, 0.5));
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
        }
        
        .tech-badge {
          display: flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          transition: all 0.2s ease;
        }
        
        .tech-badge:hover {
          background: rgba(59, 130, 246, 0.15);
          transform: translateY(-1px);
        }
      `}</style>
    </footer>
  );
};

export default Footer;