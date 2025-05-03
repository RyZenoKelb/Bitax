'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  // État pour gérer les étoiles
  const [stars, setStars] = useState([]);
  
  // Créer les étoiles uniquement côté client (pour éviter les erreurs d'hydratation)
  useEffect(() => {
    // Créer des étoiles avec des positions fixes (pour éviter les problèmes d'hydratation)
    const generateStars = () => {
      // Nombre d'étoiles proportionnel à la taille de l'écran
      const starCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 3000), 200);
      
      // Créer les étoiles avec des positions fixes
      const newStars = Array.from({ length: starCount }).map((_, index) => {
        // Utiliser l'index comme graine pour générer des positions "aléatoires" mais déterministes
        const seed1 = Math.sin(index * 123.456) * 0.5 + 0.5;
        const seed2 = Math.cos(index * 789.012) * 0.5 + 0.5;
        
        return {
          id: index,
          x: seed1 * 100, // Position en pourcentage de l'écran
          y: seed2 * 100,
          size: (Math.sin(index * 45.678) * 0.5 + 0.5) * 2 + 0.5, // Taille entre 0.5 et 2.5px
          opacity: (Math.cos(index * 321.098) * 0.3 + 0.7), // Opacité entre 0.4 et 1
          animationDelay: `${(index % 10) * 0.5}s`, // Délai d'animation entre 0 et 4.5s
        };
      });
      
      setStars(newStars);
    };
    
    generateStars();
    
    // Regénérer les étoiles lors du redimensionnement de la fenêtre
    const handleResize = () => {
      generateStars();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div> className="min-h-screen overflow-hidden relative font-poppins">
      {/* Background élégant avec étoiles animées */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        {/* Gradient d'ambiance */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/10 rounded-full filter blur-[150px] animate-float"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600/10 rounded-full filter blur-[150px] animate-float-delayed"></div>
        </div>
        
        {/* Étoiles animées en CSS pur */}
        <div className="absolute inset-0 overflow-hidden">
          {stars.map(star => (
            <div 
              key={star.id}
              className="absolute rounded-full bg-white animate-twinkle" 
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: star.animationDelay,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Header premium avec glassmorphism */}
      <header className="fixed top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8 z-50 transition-all duration-300 bg-black/10 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="flex items-center">
                {/* Logo premium */}
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 tracking-tight">BITAX</h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">FISCALITÉ CRYPTO</p>
                  <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navbar ultra moderne */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Fonctionnalités', href: '/fonctionnalites' },
              { name: 'Tarifs', href: '/tarifs' },
              { name: 'Guide', href: '/guide' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="relative px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-8">
              <Link 
                href="/login" 
                className="relative px-6 py-2 overflow-hidden rounded-full bg-white/5 text-white/90 backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-glow-sm hover:scale-105 group"
              >
                <span className="relative z-10">Connexion</span>
              </Link>
              
              <Link 
                href="/register" 
                className="relative px-6 py-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 group"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute top-0 right-full w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 group-hover:right-0"></span>
              </Link>
            </div>
          </nav>

          {/* Bouton menu mobile avec animation */}
          <button className="md:hidden flex flex-col items-center justify-center w-10 h-10 relative group">
            <span className="w-6 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-indigo-400 group-hover:translate-y-1"></span>
            <span className="w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 group-hover:bg-indigo-400"></span>
            <span className="w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 group-hover:bg-indigo-400 group-hover:-translate-y-1"></span>
          </button>
        </div>
      </header>

      {/* Hero Section avec effet premium */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left pt-8 lg:pt-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-white">Votre fiscalité crypto, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">simplifiée</span>
            </h2>
            <p className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
              {/* Bouton principal avec animation avancée */}
              <Link href="/register" className="relative overflow-hidden group rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
                <div className="relative flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium overflow-hidden">
                  <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="relative z-10">Commencer gratuitement</span>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Effet de lumière au survol */}
                <div className="absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
              </Link>
              
              {/* Bouton secondaire glassmorphism */}
              <Link href="/guide" className="relative group rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative flex items-center justify-center space-x-2 px-8 py-3 text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Comment ça marche</span>
                </div>
              </Link>
            </div>
            
            {/* Badges de cryptomonnaies premium */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              {/* Ethereum */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <polygon className="crypto-svg-fill" fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                      <polygon className="crypto-svg-fill" fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                      <polygon className="crypto-svg-fill" fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                      <polygon className="crypto-svg-fill" fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                      <polygon className="crypto-svg-fill" fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                      <polygon className="crypto-svg-fill" fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33"/>
                    </g>
                  </svg>
                  <span className="text-sm font-medium">ETH</span>
                </div>
              </div>
              
              {/* Polygon/Matic */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                      c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                      c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                      c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                      L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                      c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                  </svg>
                  <span className="text-sm font-medium">MATIC</span>
                </div>
              </div>
              
              {/* Arbitrum */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#2D374B"/>
                    <path className="crypto-svg-fill" d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#28A0F0"/>
                    <path className="crypto-svg-fill" d="M672.2 499.1V619.8L568.3 680.1V559.4L672.2 499.1Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M568.3 680.1V559.4L466.5 498V618.7L568.3 680.1Z" fill="#96BEDC"/>
                    <path className="crypto-svg-fill" d="M672.2 378.5V499.1L568.3 559.4V438.8L672.2 378.5Z" fill="#96BEDC"/>
                    <path className="crypto-svg-fill" d="M568.3 438.8V559.4L466.5 498V377.3L568.3 438.8Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M466.5 618.7V498L357.8 434.3V555L466.5 618.7Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M466.5 377.3V498L357.8 434.3V313.7L466.5 377.3Z" fill="#96BEDC"/>
                  </svg>
                  <span className="text-sm font-medium">ARB</span>
                </div>
              </div>
              
              {/* Optimism */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#FF0420"/>
                    <path className="crypto-svg-fill" d="M9.08465 8.69519H12.6871C12.786 8.69519 12.8652 8.77448 12.8652 8.8933V11.5335C12.8652 11.6325 12.7859 11.7118 12.6871 11.7118H9.08465C8.98583 11.7118 8.90654 11.6325 8.90654 11.5335V8.8933C8.90654 8.77448 8.98583 8.69519 9.08465 8.69519Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 8.69519H17.2764C17.3752 8.69519 17.4545 8.77448 17.4545 8.8933V11.5335C17.4545 11.6325 17.3752 11.7118 17.2764 11.7118H13.6739C13.5751 11.7118 13.4958 11.6325 13.4958 11.5335V8.8933C13.4958 8.77448 13.5751 8.69519 13.6739 8.69519Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M9.08465 12.4812H12.6871C12.786 12.4812 12.8652 12.5605 12.8652 12.6593V15.2995C12.8652 15.3984 12.7859 15.4777 12.6871 15.4777H9.08465C8.98583 15.4777 8.90654 15.3984 8.90654 15.2995V12.6593C8.90654 12.5605 8.98583 12.4812 9.08465 12.4812Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 12.4812H17.2764C17.3752 12.4812 17.4545 12.5605 17.4545 12.6593V15.2995C17.4545 15.3984 17.3752 15.4777 17.2764 15.4777H13.6739C13.5751 15.4777 13.4958 15.3984 13.4958 15.2995V12.6593C13.4958 12.5605 13.5751 12.4812 13.6739 12.4812Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M9.08465 16.2674H12.6871C12.786 16.2674 12.8652 16.3467 12.8652 16.4455V19.0857C12.8652 19.1845 12.7859 19.2638 12.6871 19.2638H9.08465C8.98583 19.2638 8.90654 19.1845 8.90654 19.0857V16.4455C8.90654 16.3467 8.98583 16.2674 9.08465 16.2674Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 16.2674H17.2764C17.3752 16.2674 17.4545 16.3467 17.4545 16.4455V19.0857C17.4545 19.1845 17.3752 19.2638 17.2764 19.2638H13.6739C13.5751 19.2638 13.4958 19.1845 13.4958 19.0857V16.4455C13.4958 16.3467 13.5751 16.2674 13.6739 16.2674Z" fill="white"/>
                  </svg>
                  <span className="text-sm font-medium">OPT</span>
                </div>
              </div>
              
              {/* Base */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" fillRule="evenodd" clipRule="evenodd" d="M19 38C29.4934 38 38 29.4934 38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38ZM19.7146 7.60573L29.1945 22.8486C29.8464 23.8368 29.1278 25.1395 27.9506 25.1395H8.04937C6.87215 25.1395 6.15358 23.8368 6.8055 22.8486L16.2854 7.60573C16.9313 6.6249 18.0687 6.6249 18.7146 7.60573H19.7146Z" fill="#0052FF"/>
                  </svg>
                  <span className="text-sm font-medium">BASE</span>
                </div>
              </div>
              
              {/* Solana */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                    <linearGradient id="solGradientA" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientA)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                      c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                    <linearGradient id="solGradientB" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientB)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                      c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                    <linearGradient id="solGradientC" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientC)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                      c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                  </svg>
                  <span className="text-sm font-medium">SOL</span>
                </div>
              </div>
            </div>
          </div>
  
  return (
    <div className="min-h-screen overflow-hidden relative font-poppins">
      {/* Background avancé avec canvas de particules interactives */}
      <div className="absolute inset-0 -z-20">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
        
        {/* Mesh gradient effet 3D */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-violet-600/20 via-transparent to-transparent transform scale-150"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-blue-600/20 via-transparent to-transparent transform scale-150"></div>
        </div>
        
        {/* Canvas pour les particules animées */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full -z-10"
          style={{ opacity: 0.7 }}
        ></canvas>
        
        {/* Overlay de bruit pour ajouter de la texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Header premium avec glassmorphism */}
      <header className="fixed top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8 z-50 transition-all duration-300 bg-black/10 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="group">
              <div className="flex items-center">
                {/* Logo premium */}
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 tracking-tight">BITAX</h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">FISCALITÉ CRYPTO</p>
                  <div className="h-0.5 w-0 group-hover:w-full transition-all duration-300 ease-out bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navbar ultra moderne */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Fonctionnalités', href: '/fonctionnalites' },
              { name: 'Tarifs', href: '/tarifs' },
              { name: 'Guide', href: '/guide' }
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="relative px-3 py-1.5 text-sm font-medium text-white/90 hover:text-white transition-all duration-300 group"
              >
                <span>{item.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 ml-8">
              <Link 
                href="/login" 
                className="relative px-6 py-2 overflow-hidden rounded-full bg-white/5 text-white/90 backdrop-blur-md border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-glow-sm hover:scale-105 group"
              >
                <span className="relative z-10">Connexion</span>
              </Link>
              
              <Link 
                href="/register" 
                className="relative px-6 py-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 group"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute top-0 right-full w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 group-hover:right-0"></span>
              </Link>
            </div>
          </nav>

          {/* Bouton menu mobile avec animation */}
          <button className="md:hidden flex flex-col items-center justify-center w-10 h-10 relative group">
            <span className="w-6 h-0.5 bg-white rounded-full transition-all duration-300 group-hover:bg-indigo-400 group-hover:translate-y-1"></span>
            <span className="w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 group-hover:bg-indigo-400"></span>
            <span className="w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 group-hover:bg-indigo-400 group-hover:-translate-y-1"></span>
          </button>
        </div>
      </header>

      {/* Hero Section avec effet premium */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left pt-8 lg:pt-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="text-white">Votre fiscalité crypto, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">simplifiée</span>
            </h2>
            <p className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
              {/* Bouton principal avec animation avancée */}
              <Link href="/register" className="relative overflow-hidden group rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-0.5 shadow-xl hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105">
                <div className="relative flex items-center justify-center space-x-2 px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white font-medium overflow-hidden">
                  <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="relative z-10">Commencer gratuitement</span>
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Effet de lumière au survol */}
                <div className="absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
              </Link>
              
              {/* Bouton secondaire glassmorphism */}
              <Link href="/guide" className="relative group rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <div className="relative flex items-center justify-center space-x-2 px-8 py-3 text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Comment ça marche</span>
                </div>
              </Link>
            </div>
            
            {/* Badges de cryptomonnaies premium */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              {/* Ethereum */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                    <g>
                      <polygon className="crypto-svg-fill" fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                      <polygon className="crypto-svg-fill" fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                      <polygon className="crypto-svg-fill" fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                      <polygon className="crypto-svg-fill" fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                      <polygon className="crypto-svg-fill" fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                      <polygon className="crypto-svg-fill" fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33"/>
                    </g>
                  </svg>
                  <span className="text-sm font-medium">ETH</span>
                </div>
              </div>
              
              {/* Polygon/Matic */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                      c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                      c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                      c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                      L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                      c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                  </svg>
                  <span className="text-sm font-medium">MATIC</span>
                </div>
              </div>
              
              {/* Arbitrum */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#2D374B"/>
                    <path className="crypto-svg-fill" d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#28A0F0"/>
                    <path className="crypto-svg-fill" d="M672.2 499.1V619.8L568.3 680.1V559.4L672.2 499.1Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M568.3 680.1V559.4L466.5 498V618.7L568.3 680.1Z" fill="#96BEDC"/>
                    <path className="crypto-svg-fill" d="M672.2 378.5V499.1L568.3 559.4V438.8L672.2 378.5Z" fill="#96BEDC"/>
                    <path className="crypto-svg-fill" d="M568.3 438.8V559.4L466.5 498V377.3L568.3 438.8Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M466.5 618.7V498L357.8 434.3V555L466.5 618.7Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M466.5 377.3V498L357.8 434.3V313.7L466.5 377.3Z" fill="#96BEDC"/>
                  </svg>
                  <span className="text-sm font-medium">ARB</span>
                </div>
              </div>
              
              {/* Optimism */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#FF0420"/>
                    <path className="crypto-svg-fill" d="M9.08465 8.69519H12.6871C12.786 8.69519 12.8652 8.77448 12.8652 8.8933V11.5335C12.8652 11.6325 12.7859 11.7118 12.6871 11.7118H9.08465C8.98583 11.7118 8.90654 11.6325 8.90654 11.5335V8.8933C8.90654 8.77448 8.98583 8.69519 9.08465 8.69519Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 8.69519H17.2764C17.3752 8.69519 17.4545 8.77448 17.4545 8.8933V11.5335C17.4545 11.6325 17.3752 11.7118 17.2764 11.7118H13.6739C13.5751 11.7118 13.4958 11.6325 13.4958 11.5335V8.8933C13.4958 8.77448 13.5751 8.69519 13.6739 8.69519Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M9.08465 12.4812H12.6871C12.786 12.4812 12.8652 12.5605 12.8652 12.6593V15.2995C12.8652 15.3984 12.7859 15.4777 12.6871 15.4777H9.08465C8.98583 15.4777 8.90654 15.3984 8.90654 15.2995V12.6593C8.90654 12.5605 8.98583 12.4812 9.08465 12.4812Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 12.4812H17.2764C17.3752 12.4812 17.4545 12.5605 17.4545 12.6593V15.2995C17.4545 15.3984 17.3752 15.4777 17.2764 15.4777H13.6739C13.5751 15.4777 13.4958 15.3984 13.4958 15.2995V12.6593C13.4958 12.5605 13.5751 12.4812 13.6739 12.4812Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M9.08465 16.2674H12.6871C12.786 16.2674 12.8652 16.3467 12.8652 16.4455V19.0857C12.8652 19.1845 12.7859 19.2638 12.6871 19.2638H9.08465C8.98583 19.2638 8.90654 19.1845 8.90654 19.0857V16.4455C8.90654 16.3467 8.98583 16.2674 9.08465 16.2674Z" fill="white"/>
                    <path className="crypto-svg-fill" d="M13.6739 16.2674H17.2764C17.3752 16.2674 17.4545 16.3467 17.4545 16.4455V19.0857C17.4545 19.1845 17.3752 19.2638 17.2764 19.2638H13.6739C13.5751 19.2638 13.4958 19.1845 13.4958 19.0857V16.4455C13.4958 16.3467 13.5751 16.2674 13.6739 16.2674Z" fill="white"/>
                  </svg>
                  <span className="text-sm font-medium">OPT</span>
                </div>
              </div>
              
              {/* Base */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="crypto-svg-fill" fillRule="evenodd" clipRule="evenodd" d="M19 38C29.4934 38 38 29.4934 38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38ZM19.7146 7.60573L29.1945 22.8486C29.8464 23.8368 29.1278 25.1395 27.9506 25.1395H8.04937C6.87215 25.1395 6.15358 23.8368 6.8055 22.8486L16.2854 7.60573C16.9313 6.6249 18.0687 6.6249 18.7146 7.60573H19.7146Z" fill="#0052FF"/>
                  </svg>
                  <span className="text-sm font-medium">BASE</span>
                </div>
              </div>
              
              {/* Solana */}
              <div className="crypto-badge group">
                <div className="crypto-badge-inner">
                  <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                    <linearGradient id="solGradientA" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientA)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                      c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                    <linearGradient id="solGradientB" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientB)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                      c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                    <linearGradient id="solGradientC" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
                      <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                      <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                    </linearGradient>
                    <path className="crypto-svg-fill" fill="url(#solGradientC)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                      c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                  </svg>
                  <span className="text-sm font-medium">SOL</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dashboard 3D ultra moderne avec effet glassmorphism */}
          <div className="relative w-full h-[500px]">
            {/* Effet de glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            
            {/* Dashboard card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] perspective-1000">
              <div className="dashboard-card relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 hover:rotate-y-0 hover:scale-105 hover:shadow-glow-xl rotate-y-10">
                {/* Effet de reflet */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Barre de titre avec glassmorphism */}
                <div className="py-4 px-5 border-b border-white/10 bg-[rgba(8,8,19,0.7)] backdrop-blur-xl flex items-center justify-between">
                  {/* Boutons du navigateur */}
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  
                  {/* Titre avec badge pro */}
                  <div className="flex items-center">
                    <span className="text-sm text-white/80 font-medium">Tableau de bord</span>
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white">PRO</span>
                  </div>
                  
                  {/* Menu de navigation */}
                  <div className="flex space-x-4">
                    <div className="w-4 h-4 rounded-full bg-indigo-500/30"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-500/30"></div>
                  </div>
                </div>
                
                {/* Contenu du dashboard avec neumorphism */}
                <div className="bg-gradient-to-b from-[#080814] to-[#0c0c20] p-5 h-[calc(100%-60px)] flex flex-col gap-6">
                  {/* Header du dashboard */}
                  <div className="flex justify-between items-center">
                    <div className="dashboard-item-glow h-10 w-40 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-between px-3 shadow-inner-white">
                      <span className="text-xs text-white/70">Portfolio total</span>
                      <span className="text-sm font-bold text-white">24,586 €</span>
                    </div>
                    
                    <div className="dashboard-item-glow h-10 w-32 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-white/5 flex items-center justify-between px-3 shadow-inner-white">
                      <span className="text-xs text-white/70">Profit</span>
                      <span className="text-sm font-bold text-green-400">+12.4%</span>
                    </div>
                  </div>
                  
                  {/* Cartes de statistiques */}
                  <div className="grid grid-cols-3 gap-5">
                    {/* Carte statistique 1 */}
                    <div className="dashboard-item-glow h-28 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 p-4 flex flex-col justify-between shadow-inner-white">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/60">Bitcoin</span>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">₿</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">0.345 BTC</div>
                        <div className="text-xs text-white/60">≈ 12,584 €</div>
                      </div>
                    </div>
                    
                    {/* Carte statistique 2 */}
                    <div className="dashboard-item-glow h-28 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 p-4 flex flex-col justify-between shadow-inner-white animate-pulse-slow">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/60">Ethereum</span>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">Ξ</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">4.21 ETH</div>
                        <div className="text-xs text-white/60">≈ 8,420 €</div>
                      </div>
                    </div>
                    
                    {/* Carte statistique 3 */}
                    <div className="dashboard-item-glow h-28 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 p-4 flex flex-col justify-between shadow-inner-white">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/60">Solana</span>
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white">◎</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">56.8 SOL</div>
                        <div className="text-xs text-white/60">≈ 3,582 €</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Graphique avec effet néomorphique */}
                  <div className="flex-1 dashboard-item-glow rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-white/5 overflow-hidden shadow-inner-white">
                    <div className="h-8 px-4 flex items-center justify-between border-b border-white/5">
                      <span className="text-xs font-medium text-white/70">Évolution du portfolio</span>
                      <div className="flex space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-500/20 text-indigo-300 rounded-full">1M</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/60 rounded-full">3M</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-white/10 text-white/60 rounded-full">1Y</span>
                      </div>
                    </div>
                    
                    {/* Graphique interactif */}
                    <div className="p-4 h-[calc(100%-32px)] flex items-end">
                      <div className="h-full w-full flex items-end space-x-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          // Calculer une hauteur aléatoire mais semblant suivre une tendance
                          const height = 10 + Math.sin(i/3) * 30 + Math.random() * 20;
                          const isHighlighted = i === 22;
                          
                          return (
                            <div 
                              key={i} 
                              className={`w-full h-[${height}%] rounded-t-sm transition-all duration-300 hover:opacity-100 group relative ${
                                isHighlighted 
                                  ? 'bg-indigo-500' 
                                  : 'bg-indigo-500/30 hover:bg-indigo-500/50'
                              }`}
                              style={{ height: `${height}%` }}
                            >
                              {isHighlighted && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                  +2,345€
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
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