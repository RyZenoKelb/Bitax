'use client';

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Importations des logos de blockchain
const blockchainLogos = {
  ETH: "/images/blockchains/ethereum.svg", // À remplacer par vos chemins réels
  MATIC: "/images/blockchains/polygon.svg",
  ARB: "/images/blockchains/arbitrum.svg",
  OPT: "/images/blockchains/optimism.svg",
  BASE: "/images/blockchains/base.svg",
  SOL: "/images/blockchains/solana.svg"
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Rediriger vers le dashboard si l'utilisateur est connecté
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Effet de fond dynamique amélioré */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-gradient)" />
          </svg>
        </div>
        
        {/* Grille avec effet de profondeur */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
        
        {/* Formes géométriques flottantes */}
        <div className="absolute top-1/4 left-[15%] w-64 h-64 rounded-full bg-blue-600/10 animate-float-slow blur-3xl"></div>
        <div className="absolute bottom-1/3 right-[10%] w-72 h-72 rounded-full bg-indigo-500/10 animate-float-slow-reverse blur-3xl"></div>
        <div className="absolute top-[60%] left-[5%] w-48 h-48 rounded-full bg-purple-500/10 animate-float blur-3xl"></div>
      </div>

      {/* Particules/étoiles */}
      <div className="stars-container absolute inset-0 -z-5"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full py-6 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 p-2 rounded-xl shadow-glow-purple transform hover:scale-105 transition-all">
              BITAX
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/fonctionnalites" 
              className="nav-link-futuristic"
            >
              Fonctionnalités
            </Link>
            <Link 
              href="/tarifs" 
              className="nav-link-futuristic"
            >
              Tarifs
            </Link>
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="btn-holographic"
              >
                Connexion
              </Link>
              
              <Link 
                href="/register" 
                className="btn-neon-glow"
              >
                S'inscrire
              </Link>
            </div>
          </nav>
          <button className="md:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-tech mb-4 leading-tight tracking-tight">
              <span className="text-white font-light">Votre fiscalité crypto,</span>
              <br />
              <span className="cyber-gradient-text font-bold">simplifiée<span className="blink">_</span></span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics, avec précision et conformité légale.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start mb-12">
              <Link href="/register" className="btn-cyber-primary transform transition-all">
                <span className="relative z-10 flex items-center font-bold">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </Link>
              <Link href="/guide" className="btn-cyber-secondary transform transition-all">
                <span className="relative z-10 flex items-center font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </span>
              </Link>
            </div>
            
            {/* Network Tags - avec de vraies images */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {Object.entries(blockchainLogos).map(([network, logoPath], i) => (
                <div key={i} className="blockchain-tag">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 p-1.5 flex items-center justify-center mr-2 border border-gray-700 shadow-glow-sm">
                    {/* Utilisation temporaire d'un div coloré avant l'intégration des vraies images */}
                    <div 
                      className="w-full h-full rounded-full" 
                      style={{ 
                        background: network === 'ETH' ? '#627EEA' : 
                                  network === 'MATIC' ? '#8247E5' :
                                  network === 'ARB' ? '#28A0F0' :
                                  network === 'OPT' ? '#FF0420' :
                                  network === 'BASE' ? '#0052FF' : '#14F195'
                      }}
                    >
                      {/* Ici, vous utiliserez l'Image lorsque vous aurez les fichiers */}
                      {/* <Image 
                        src={logoPath} 
                        alt={network} 
                        width={24} 
                        height={24} 
                        className="w-full h-full object-contain"
                      /> */}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-white">{network}</span>
                </div>
              ))}
            </div>
            
            {/* Tags de confiance */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              <div className="trust-badge">
                <svg className="w-4 h-4 mr-1 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Sécurisé
              </div>
              <div className="trust-badge">
                <svg className="w-4 h-4 mr-1 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Conforme
              </div>
              <div className="trust-badge">
                <svg className="w-4 h-4 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Rapide
              </div>
            </div>
          </div>
          
          {/* 3D Hero Image améliorée */}
          <div className="relative w-full h-[500px] transform translate-x-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl opacity-30 -z-10 animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="dashboard-preview bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-700 w-[90%] h-[90%] hover:scale-105">
                {/* Effet de lueur sur les bords */}
                <div className="absolute inset-0 rounded-2xl border border-indigo-500/20 shadow-glow-lg pointer-events-none"></div>
                
                <div className="p-3 border-b border-gray-800/50 flex items-center bg-gradient-to-r from-gray-900 to-gray-800">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-center flex-1 text-gray-400 font-mono">Tableau de bord Bitax</div>
                </div>
                
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="h-8 w-32 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-20 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-lg animate-pulse"></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-inner transition-all hover:border-blue-500/30 hover:shadow-glow-sm duration-300"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-inner animate-pulse-slow transition-all hover:border-purple-500/30 hover:shadow-glow-sm duration-300"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-inner transition-all hover:border-indigo-500/30 hover:shadow-glow-sm duration-300"></div>
                  </div>
                  
                  <div className="h-32 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-inner">
                    <div className="h-6 w-32 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-t-lg"></div>
                    <div className="p-3 flex items-end space-x-2 h-[calc(100%-24px)]">
                      {[10, 30, 20, 60, 40, 70, 50, 80, 60, 30, 50, 20].map((height, index) => (
                        <div 
                          key={index}
                          className={`w-1/12 bg-gradient-to-t from-blue-500/50 to-indigo-500/50 rounded-t-sm transition-all duration-700 hover:from-blue-400/70 hover:to-indigo-400/70 hover:shadow-glow-sm
                                      ${index === 3 || index === 7 ? 'animate-pulse-slow' : ''}`} 
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Effet de réflexion/lueur */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/5 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            {/* Particules et éléments de décoration supplémentaires */}
            <div className="absolute -right-4 top-1/4 w-12 h-12 rounded-full bg-blue-500/20 animate-float-slow blur-xl"></div>
            <div className="absolute -left-8 bottom-1/3 w-16 h-16 rounded-full bg-purple-500/20 animate-float-slow-reverse blur-xl"></div>
            <div className="absolute right-1/4 bottom-1/4 w-8 h-8 rounded-full bg-indigo-500/20 animate-float blur-xl"></div>
          </div>
        </div>
      </main>
      
      {/* Sections caractéristiques et avantages */}
      <section className="py-16 bg-gray-900/70">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Simplifiez votre fiscalité crypto en 3 étapes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🔌",
                title: "Connectez votre wallet",
                description: "Connectez-vous de façon sécurisée sans jamais partager vos clés privées"
              },
              {
                icon: "🧠",
                title: "Analysez vos transactions",
                description: "Notre algorithme identifie automatiquement vos plus et moins-values"
              },
              {
                icon: "📊",
                title: "Générez votre rapport",
                description: "Exportez un rapport fiscal complet prêt pour votre déclaration"
              }
            ].map((step, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50 flex flex-col items-center text-center transform transition-all hover:-translate-y-2 duration-300">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-900/70 to-purple-900/70 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Prêt à simplifier votre fiscalité crypto?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Commencez gratuitement et générez votre premier rapport fiscal en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-white text-indigo-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Essayer gratuitement
            </Link>
            <Link href="/dashboard" className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-indigo-800/30 font-bold rounded-xl transition-all duration-300">
              Accéder au dashboard
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer simple */}
      <footer className="py-8 bg-gray-900/80 border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Bitax. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</Link>
            <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
      
      {/* Styles supplémentaires pour cette page spécifique */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        
        /* Police tech futuriste pour les titres */
        .font-tech {
          font-family: 'Orbitron', sans-serif;
        }
        
        /* Animation de clignotement pour le curseur */
        .blink {
          animation: blink 1.2s infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        /* Gradient cyberpunk pour le texte */
        .cyber-gradient-text {
          background: linear-gradient(to right, #ffffff, #4facfe 30%, #00f2fe 60%, #ffffff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: textShine 5s linear infinite;
          text-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
        }
        
        @keyframes textShine {
          to {
            background-position: 200% center;
          }
        }
        
        /* Boutons futuristes */
        .btn-cyber-primary {
          position: relative;
          padding: 0.8rem 2rem;
          background: linear-gradient(45deg, #0b78ff, #5000ff);
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          letter-spacing: 0.05em;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(80, 0, 255, 0.5);
          transition: all 0.3s ease;
        }
        
        .btn-cyber-primary:before {
          content: '';
          position: absolute;
          top: 2px;
          left: 2px;
          right: 2px;
          height: 40%;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 0.25rem;
          pointer-events: none;
        }
        
        .btn-cyber-primary:after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(11, 120, 255, 0.5), rgba(80, 0, 255, 0.5));
          border-radius: 0.4rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .btn-cyber-primary:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 0 35px rgba(80, 0, 255, 0.7);
        }
        
        .btn-cyber-primary:hover:after {
          opacity: 1;
        }
        
        .btn-cyber-primary:active {
          transform: translateY(1px);
        }
        
        .btn-cyber-secondary {
          position: relative;
          padding: 0.8rem 2rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: white;
          font-weight: 500;
          letter-spacing: 0.05em;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .btn-cyber-secondary:before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
          border-radius: 0.4rem;
        }
        
        .btn-cyber-secondary:hover {
          border-color: rgba(80, 0, 255, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 0 20px rgba(80, 0, 255, 0.3);
          background: rgba(80, 0, 255, 0.1);
        }
        
        .btn-cyber-secondary:active {
          transform: translateY(1px);
        }
        
        /* Liens de navigation */
        .nav-link-futuristic {
          position: relative;
          color: rgba(255, 255, 255, 0.8);
          padding: 0.5rem 1rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          border-radius: 0.5rem;
        }
        
        .nav-link-futuristic:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(to right, #4facfe, #00f2fe);
          transform: translateX(-50%);
          transition: width 0.3s ease;
        }
        
        .nav-link-futuristic:hover {
          color: white;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .nav-link-futuristic:hover:after {
          width: 80%;
        }
        
        /* Buttons de connexion/inscription */
        .btn-holographic {
          position: relative;
          padding: 0.6rem 1.5rem;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
          overflow: hidden;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .btn-holographic:before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, 
            rgba(255, 255, 255, 0) 30%, 
            rgba(255, 255, 255, 0.1) 50%, 
            rgba(255, 255, 255, 0) 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .btn-holographic:hover {
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }
        
        .btn-holographic:hover:before {
          opacity: 1;
          animation: holographicShine 1.5s infinite;
        }
        
        @keyframes holographicShine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .btn-neon-glow {
          position: relative;
          padding: 0.6rem 1.5rem;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          border-radius: 0.5rem;
          color: white;
          font-weight: 600;
          letter-spacing: 0.05em;
          box-shadow: 0 0 15px rgba(0, 242, 254, 0.5);
          transition: all 0.3s ease;
        }
        
        .btn-neon-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(0, 242, 254, 0.7);
        }
        
        /* Blockchain tags améliorés */
        .blockchain-tag {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: 100px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .blockchain-tag:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        /* Trust badges */
        .trust-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.3rem 0.8rem;
          border-radius: 100px;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }
        
        .trust-badge:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }
        
        /* Animations supplémentaires */
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-slow-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slow-reverse {
          animation: float-slow-reverse 12s ease-in-out infinite;
        }
        
        /* Ombres stylisées */
        .shadow-glow-sm {
          box-shadow: 0 0 10px rgba(79, 172, 254, 0.2);
        }
        
        .shadow-glow-lg {
          box-shadow: 0 0 30px rgba(79, 172, 254, 0.2);
        }
        
        .shadow-glow-purple {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
        }
        
        /* Animation de pulsation lente */
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}