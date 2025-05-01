// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Effet de fond dynamique */}
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
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
      </div>

      {/* Particules/étoiles */}
      <div className="stars-container absolute inset-0 -z-5"></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full py-6 px-4 sm:px-6 lg:px-8 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 p-1 rounded-lg shadow-glow-purple transform hover:scale-105 transition-all">
              BITAX
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="/features" className="text-white hover:text-blue-400 transition-colors">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="text-white hover:text-blue-400 transition-colors">
              Tarifs
            </Link>
            <Link href="/login" className="text-white hover:text-blue-400 transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all transform hover:scale-105 hover:shadow-glow-blue">
              S'inscrire
            </Link>
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="text-white">Votre fiscalité crypto, </span>
              <span className="text-gradient-enhanced">simplifiée</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/register" className="btn-hero-primary">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </Link>
              <Link href="/guide" className="btn-hero-secondary">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </span>
              </Link>
            </div>
            
            {/* Network Tags */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              {['ETH', 'MATIC', 'ARB', 'OPT', 'BASE', 'SOL'].map((network, i) => (
                <div key={i} className="network-tag">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {network.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-white">{network}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* 3D Hero Image */}
          <div className="relative w-full h-[400px] transform translate-x-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="dashboard-preview bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-all duration-700 w-[90%] h-[90%]">
                <div className="p-3 border-b border-gray-800/50 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-center flex-1 text-gray-400">Tableau de bord Bitax</div>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="h-8 w-32 bg-blue-600/30 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-20 bg-purple-600/30 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50 animate-pulse-slow"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                  </div>
                  <div className="h-32 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="h-6 w-32 bg-blue-600/20 rounded-t-lg"></div>
                    <div className="p-3 flex items-end space-x-2 h-[calc(100%-24px)]">
                      <div className="w-1/12 h-[10%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[30%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[20%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[60%] bg-blue-500/50 rounded-t-sm animate-pulse-slow"></div>
                      <div className="w-1/12 h-[40%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[70%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[50%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[80%] bg-blue-500/50 rounded-t-sm animate-pulse-slow"></div>
                      <div className="w-1/12 h-[60%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[30%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[50%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[20%] bg-blue-500/50 rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}