'use client';

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function FeaturesPage() {
  // État pour savoir si la navbar est en mode scroll
  const [scrolled, setScrolled] = useState(false);
  
  // État pour le menu mobile
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Références pour les animations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Hook de scroll pour les effets parallaxe
  const { scrollY } = useScroll();
  
  // Transformations basées sur le scroll pour l'effet parallaxe
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);
  const opacity1 = useTransform(scrollY, [0, 100, 200], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollY, [0, 400, 500], [0, 0.5, 1]);
  
  // Effet pour détecter le scroll et changer le style de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Effet pour l'animation de particules en arrière-plan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuster la taille du canvas à la fenêtre
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particules simples
    const particles: any[] = [];
    
    // Créer particules
    const createParticles = () => {
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 60);
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.6;
        const speedY = (Math.random() - 0.5) * 0.6;
        const color = `rgba(${Math.floor(Math.random() * 80 + 175)}, ${Math.floor(Math.random() * 80 + 175)}, ${Math.floor(Math.random() * 80 + 225)}, ${Math.random() * 0.5 + 0.3})`;

        particles.push({
          x,
          y,
          size,
          speedX,
          speedY,
          color
        });
      }
    };

    createParticles();

    // Animation timestamp pour gestion du temps
    let lastTime = 0;
    
    // Animer tous les éléments avec timestamp
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour et dessiner les particules
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Rebond sur les bords
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        // Dessiner particule
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    // Démarrer l'animation initiale
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      {/* Background moderne avec animation de particules */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        {/* Gradient d'ambiance */}
        <motion.div className="absolute top-0 left-0 w-full h-full">
          <motion.div 
            className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/10 rounded-full filter blur-[150px]"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 30,
              ease: "easeInOut" 
            }}
          ></motion.div>
          <motion.div 
            className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600/10 rounded-full filter blur-[150px]"
            animate={{ 
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 35,
              ease: "easeInOut",
              delay: 5
            }}
          ></motion.div>
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-600/10 rounded-full filter blur-[150px]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "easeInOut",
              delay: 10
            }}
          ></motion.div>
        </motion.div>
        
        {/* Canvas pour les animations de particules */}
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 w-full h-full -z-10"
          style={{ opacity: 0.7 }}
        ></canvas>
      </div>

      {/* Header premium avec glassmorphism et effet de scroll */}
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-900/70 backdrop-blur-lg border-b border-white/5' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="group">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 tracking-tight">BITAX</h1>
                  <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">FISCALITÉ CRYPTO</p>
                </div>
              </Link>
            </div>

            {/* Navbar avec boutons en français */}
            <nav className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Fonctionnalités', href: '/fonctionnalites' },
                { name: 'Tarifs', href: '/tarifs' },
              ].map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/5"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Boutons Connexion/S'inscrire en français */}
              <div className="flex items-center space-x-3 ml-6">
                <Link 
                  href="/login" 
                  className="px-6 py-2 rounded-lg border border-white/10 text-white/90 font-medium transition-all duration-300 hover:border-white/20 hover:bg-white/5"
                >
                  Connexion
                </Link>
                
                <Link 
                  href="/register" 
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-500/40"
                >
                  S'inscrire
                </Link>
              </div>
            </nav>

            {/* Bouton menu mobile */}
            <button 
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className={`block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white rounded-full mt-1 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-white rounded-full mt-1 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>
        
        {/* Menu mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-900/80 backdrop-blur-lg border-b border-white/5"
            >
              <div className="px-6 py-4 space-y-3">
                {[
                  { name: 'Fonctionnalités', href: '/fonctionnalites' },
                  { name: 'Tarifs', href: '/tarifs' },
                ].map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className="block py-2 text-white/80 hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-2 space-y-2">
                  <Link 
                    href="/login" 
                    className="block py-2.5 text-center text-white/80 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  
                  <Link 
                    href="/register" 
                    className="block py-2.5 text-center text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-16 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="text-white">Des fonctionnalités </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">puissantes</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-blue-100/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Découvrez tout ce que Bitax propose pour simplifier votre fiscalité crypto et gagner du temps sur vos déclarations.
          </motion.p>
        </div>
      </motion.section>
      
      {/* Section fonctionnalités principales avec motion */}
      <motion.section 
        className="py-16 relative"
        style={{ y: y2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Multi-Wallets",
                description: "Connectez vos wallets en toute sécurité et analysez vos transactions sur différentes blockchains sans partager vos clés privées."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Calcul Automatisé",
                description: "Notre algorithme analyse vos transactions, identifie les plus-values/moins-values et calcule vos obligations fiscales selon la méthode de votre choix."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Rapports Complets",
                description: "Générez des rapports fiscaux détaillés en PDF, CSV ou Excel, prêts à être utilisés pour votre déclaration d'impôts ou à partager avec votre comptable."
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl hover:shadow-indigo-500/10 transform transition-all hover:-translate-y-2 duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="w-16 h-16 rounded-xl bg-indigo-900/50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section blockchain supportées avec animation */}
      <motion.section 
        className="py-16 relative"
        style={{ y: y3 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Blockchains Supportées
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Solana'].map((network, index) => (
              <motion.div 
                key={index} 
                className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 flex flex-col items-center justify-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.2)" }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {network.charAt(0)}
                </div>
                <span className="text-lg font-medium text-white">{network}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section avantages avec comparaison */}
      <motion.section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Pourquoi choisir Bitax?
          </motion.h2>
          
          <motion.div 
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-3 bg-gray-800/50 p-4 border-b border-gray-700/50">
              <div className="col-span-1 font-medium text-white">Comparaison</div>
              <div className="text-center font-bold text-gray-400">Solutions manuelles</div>
              <div className="text-center font-bold text-indigo-400">Bitax</div>
            </div>
            
            {[
              {
                feature: "Temps requis",
                manual: "Des heures, voire des jours",
                bitax: "Quelques minutes"
              },
              {
                feature: "Erreurs de calcul",
                manual: "Fréquentes",
                bitax: "Algorithme précis"
              },
              {
                feature: "Support multi-chaînes",
                manual: "Complexe",
                bitax: "Intégré et automatisé"
              },
              {
                feature: "Méthodes de calcul",
                manual: "Limitées",
                bitax: "Multiples options"
              },
              {
                feature: "Mise à jour des prix",
                manual: "Manuelle",
                bitax: "Automatique et précise"
              }
            ].map((item, index) => (
              <motion.div 
                key={index} 
                className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? 'bg-gray-800/20' : ''} border-b border-gray-700/50 text-sm md:text-base`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="font-medium text-white">{item.feature}</div>
                <div className="text-center text-gray-400">{item.manual}</div>
                <div className="text-center text-indigo-300">{item.bitax}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section fonctionnalités détaillées */}
      <motion.section 
        className="py-16 relative" 
        style={{ y: y1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-16 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Fonctionnalités Détaillées
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                title: "Analyse Multi-Blockchains",
                description: "Bitax prend en charge plusieurs blockchains populaires, permettant d'analyser automatiquement vos transactions sur Ethereum, Polygon, Arbitrum, Optimism, Base et Solana en un seul endroit.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              },
              {
                title: "Calcul des Plus-Values",
                description: "Notre algorithme calcule automatiquement vos plus-values et moins-values selon différentes méthodes (FIFO, LIFO, etc.) conformément à la réglementation fiscale française.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Suivi des Performances",
                description: "Visualisez l'évolution de votre portefeuille grâce à des graphiques interactifs et des tableaux de bord personnalisables montrant la performance de vos investissements.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )
              },
              {
                title: "Rapports Fiscaux Complets",
                description: "Générez des rapports fiscaux détaillés prêts à être utilisés pour votre déclaration d'impôts, conformes au formulaire 2086 et à la législation fiscale française.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: "Exportation Multiple",
                description: "Exportez vos données et rapports en plusieurs formats (PDF, CSV, Excel) pour une utilisation facile et un partage avec votre comptable ou conseiller fiscal.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )
              },
              {
                title: "Interface Intuitive",
                description: "Profitez d'une interface utilisateur moderne et intuitive conçue pour simplifier la navigation et l'accès aux informations importantes de votre portefeuille.",
                icon: (
                  <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex gap-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <div className="mt-1 shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-900/30 border border-indigo-800/30 flex items-center justify-center">
                    {feature.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section CTA */}
      <motion.section 
        className="py-16 my-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-3xl p-12 backdrop-blur-md border border-indigo-800/30 shadow-xl">
            <div className="text-center">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Prêt à simplifier votre fiscalité crypto?
              </motion.h2>
              <motion.p 
                className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Commencez gratuitement et générez votre premier rapport fiscal en quelques minutes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link 
                  href="/register" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span>Essayer gratuitement</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer moderne */}
      <footer className="py-12 border-t border-gray-800/30 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Link href="/" className="inline-block">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">BITAX</span>
                  <span className="text-xs text-gray-400 -mt-1">FISCALITÉ CRYPTO</span>
                </div>
              </Link>
              <p className="text-gray-400 mt-2 max-w-md">
                Simplifiez votre fiscalité crypto avec notre plateforme intuitive et conforme à la législation française.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <h3 className="text-white font-semibold mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Accueil</Link></li>
                  <li><Link href="/fonctionnalites" className="text-gray-400 hover:text-white transition-colors">Fonctionnalités</Link></li>
                  <li><Link href="/tarifs" className="text-gray-400 hover:text-white transition-colors">Tarifs</Link></li>
                </ul>
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-white font-semibold mb-4">Légal</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Mentions légales</Link></li>
                </ul>
              </div>
              
              <div className="text-center md:text-left col-span-2 md:col-span-1">
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">Contact à venir</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800/30 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Ajoutez des styles CSS pour les animations et les gradients */}
      <style jsx global>{`
        @keyframes floating {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .premium-gradient-text {
          @apply bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500;
          filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.3));
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}