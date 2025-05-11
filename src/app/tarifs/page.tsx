'use client';

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  // État pour savoir si la navbar est en mode scroll
  const [scrolled, setScrolled] = useState(false);
  
  // État pour le menu mobile
  const [menuOpen, setMenuOpen] = useState(false);
  
  // État pour les FAQ
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Références pour les animations
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Hook de scroll pour les effets parallaxe
  const { scrollY } = useScroll();
  
  // Transformations basées sur le scroll pour l'effet parallaxe
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);
  
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
  
  // Fonction pour basculer l'état des FAQ
  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };
  
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
            <span className="text-white">Des tarifs </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">transparents</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-blue-100/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Choisissez le forfait qui correspond à vos besoins fiscaux en cryptomonnaies, sans surprise ni engagement.
          </motion.p>
        </div>
      </motion.section>
      
      {/* Section Plans de tarification - affichage immédiat avec animation subtile */}
      <motion.section 
        className="py-8 pb-24 relative mt-16"
        style={{ y: y2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Forfait gratuit */}
            <motion.div 
              className="relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-xl p-6 flex flex-col h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -10 }}
            >
              <h3 className="text-xl font-bold mb-2 text-white">Gratuit</h3>
              <p className="text-indigo-300 mb-4">Pour essayer Bitax</p>
              <div className="text-4xl font-bold my-6 text-white">0€</div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Jusqu'à 100 transactions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Support de 3 blockchains</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Visualisation des données de base</span>
                </li>
                <li className="flex items-start opacity-70">
                  <svg className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400">Export PDF limité</span>
                </li>
                <li className="flex items-start opacity-70">
                  <svg className="h-6 w-6 text-gray-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-gray-400">Support prioritaire</span>
                </li>
              </ul>
              <Link 
                href="/register" 
                className="mt-auto block text-center w-full py-3 px-4 border border-indigo-500/50 hover:border-indigo-400 rounded-lg font-medium transition-all hover:bg-indigo-500/10 text-white"
              >
                Commencer gratuitement
              </Link>
            </motion.div>
            
            {/* Forfait Premium */}
            <motion.div 
              className="relative bg-gradient-to-b from-indigo-900/40 to-purple-900/40 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl p-6 flex flex-col h-full transform md:-translate-y-4 z-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -14 }}
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-bl-xl text-sm font-medium">
                Populaire
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Premium</h3>
              <p className="text-indigo-300 mb-4">Pour les investisseurs actifs</p>
              <div className="flex items-baseline my-6">
                <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">9,99€</span>
                <span className="text-blue-200 ml-1">/mois</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Transactions illimitées</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Toutes les blockchains</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Exports PDF, CSV, Excel</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Support prioritaire</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-indigo-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Méthodes fiscales avancées</span>
                </li>
              </ul>
              <Link 
                href="/register" 
                className="mt-auto block text-center w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium shadow-xl transition-all hover:shadow-indigo-500/40 text-white"
              >
                Commencer l'essai
              </Link>
              
              {/* Badge essai gratuit */}
              <div className="text-center mt-3">
                <span className="text-xs text-blue-200">Essai gratuit de 14 jours</span>
              </div>
            </motion.div>
            
            {/* Forfait Entreprise */}
            <motion.div 
              className="relative bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-xl p-6 flex flex-col h-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -10 }}
            >
              <h3 className="text-xl font-bold mb-2 text-white">Entreprise</h3>
              <p className="text-indigo-300 mb-4">Pour les professionnels</p>
              <div className="flex items-baseline my-6">
                <span className="text-4xl font-bold text-white">29,99€</span>
                <span className="text-blue-200 ml-1">/mois</span>
              </div>
              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Tout le plan Premium</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Multi-comptes (jusqu'à 5)</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Support dédié</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">API dédiée</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-blue-100">Personnalisation des rapports</span>
                </li>
              </ul>
              <Link 
                href="/register" 
                className="mt-auto block text-center w-full py-3 px-4 border border-indigo-500/50 hover:border-indigo-400 rounded-lg font-medium transition-all hover:bg-indigo-500/10 text-white"
              >
                Contacter les ventes
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Section comparaison des plans */}
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
            Comparaison des fonctionnalités
          </motion.h2>
          
          <motion.div 
            className="overflow-x-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <table className="min-w-full bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
              <thead>
                <tr className="bg-indigo-900/30 text-left">
                  <th className="px-6 py-4 text-white font-semibold">Fonctionnalité</th>
                  <th className="px-6 py-4 text-indigo-300 font-semibold text-center">Gratuit</th>
                  <th className="px-6 py-4 text-purple-300 font-semibold text-center">Premium</th>
                  <th className="px-6 py-4 text-blue-300 font-semibold text-center">Entreprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { feature: "Nombre de transactions", free: "100", premium: "Illimité", enterprise: "Illimité" },
                  { feature: "Blockchains supportées", free: "3", premium: "Toutes", enterprise: "Toutes" },
                  { feature: "Export rapports", free: "PDF limité", premium: "PDF, CSV, Excel", enterprise: "Personnalisés" },
                  { feature: "Méthodes de calcul", free: "FIFO", premium: "FIFO, LIFO, etc.", enterprise: "Sur mesure" },
                  { feature: "Support client", free: "Email", premium: "Prioritaire", enterprise: "Dédié" },
                  { feature: "Comptes utilisateurs", free: "1", premium: "1", enterprise: "Jusqu'à 5" },
                  { feature: "API d'intégration", free: "-", premium: "-", enterprise: "✓" },
                  { feature: "Intégration comptable", free: "-", premium: "✓", enterprise: "✓" },
                ].map((row, index) => (
                  <motion.tr 
                    key={index} 
                    className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'} hover:bg-indigo-900/20 transition-colors`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                  >
                    <td className="px-6 py-4 text-white">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-blue-100">{row.free}</td>
                    <td className="px-6 py-4 text-center text-blue-100">{row.premium}</td>
                    <td className="px-6 py-4 text-center text-blue-100">{row.enterprise}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.section>

      {/* Section FAQ */}
      <motion.section className="py-16 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <motion.h2 
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Questions fréquentes
          </motion.h2>
          
          <div className="space-y-6">
            {[
              {
                id: 1,
                question: "Comment fonctionne la période d'essai ?",
                answer: "La période d'essai Premium dure 14 jours sans engagement. Vous pouvez annuler à tout moment pendant cette période sans être facturé. Toutes les fonctionnalités Premium sont disponibles pendant l'essai."
              },
              {
                id: 2,
                question: "Puis-je changer de forfait à tout moment ?",
                answer: "Oui, vous pouvez passer d'un forfait à l'autre à tout moment. La facturation sera ajustée au prorata si vous passez à un forfait supérieur. Si vous passez à un forfait inférieur, le changement prendra effet à la fin de votre période de facturation en cours."
              },
              {
                id: 3,
                question: "Quelles méthodes de paiement acceptez-vous ?",
                answer: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) ainsi que les paiements par virement bancaire pour les forfaits Entreprise. Nous n'acceptons pas encore les paiements en cryptomonnaies, mais cette fonctionnalité est prévue pour bientôt."
              },
              {
                id: 4,
                question: "Les informations de mon portefeuille sont-elles sécurisées ?",
                answer: "Absolument. Bitax ne stocke jamais vos clés privées. Nous utilisons uniquement des connexions en lecture seule à vos portefeuilles. Toutes les données sont chiffrées et sécurisées selon les standards les plus élevés de l'industrie."
              },
              {
                id: 5,
                question: "Puis-je obtenir un remboursement si je ne suis pas satisfait ?",
                answer: "Nous offrons une garantie de remboursement de 30 jours si vous n'êtes pas satisfait de nos services Premium ou Entreprise. Contactez notre support client pour traiter votre demande de remboursement."
              }
            ].map((item) => (
              <motion.div 
                key={item.id} 
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * item.id }}
              >
                <button 
                  className="w-full text-left py-5 px-6 flex justify-between items-center"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span className="text-lg font-medium text-white">{item.question}</span>
                  <svg 
                    className={`w-5 h-5 text-indigo-400 transition-transform duration-300 ${expandedFaq === item.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`transition-all duration-300 overflow-hidden ${
                    expandedFaq === item.id ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="py-4 px-6 text-blue-100 border-t border-white/10 bg-indigo-900/20">
                    {item.answer}
                  </div>
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
                Commencez gratuitement et découvrez comment Bitax peut vous faire gagner du temps et réduire le stress lié à vos déclarations fiscales.
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