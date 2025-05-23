'use client';

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Interfaces
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function ModernHome() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 1000], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const featuresY = useTransform(scrollY, [0, 1000], [0, -100]);

  // Detect scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Generate particles
  const generateParticles = () => {
    return Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className="particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
        }}
      />
    ));
  };

  const features: Feature[] = [
    {
      id: 1,
      title: "Connectez vos wallets",
      description: "Intégration sécurisée avec Metamask, Coinbase Wallet et autres portefeuilles populaires.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Scannez vos transactions",
      description: "Analyse automatique de vos transactions sur Ethereum, Polygon, Arbitrum, Optimism et Base.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Visualisez vos données",
      description: "Graphiques interactifs et tableaux de bord pour suivre l'évolution de votre portefeuille.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Générez vos rapports fiscaux",
      description: "Création automatique de rapports conformes à la législation fiscale française.",
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const faqItems: FaqItem[] = [
    {
      id: 1,
      question: "Comment Bitax protège-t-il mes données personnelles?",
      answer: "Bitax utilise un chiffrement de bout en bout et ne stocke jamais vos clés privées. Nous sommes conformes au RGPD et mettons en œuvre les meilleures pratiques de sécurité de l'industrie."
    },
    {
      id: 2,
      question: "Quelles blockchains sont prises en charge?",
      answer: "Actuellement, Bitax prend en charge Ethereum, Polygon, Arbitrum, Optimism et Base. Nous ajoutons régulièrement de nouvelles blockchains en fonction des demandes de notre communauté."
    },
    {
      id: 3,
      question: "Les rapports générés sont-ils conformes à la législation française?",
      answer: "Oui, nos rapports sont spécialement conçus pour respecter les exigences fiscales françaises concernant les crypto-actifs, y compris le régime d'imposition des plus-values."
    },
    {
      id: 4,
      question: "Puis-je utiliser Bitax gratuitement?",
      answer: "Bitax propose une version gratuite avec des fonctionnalités de base et une limite de transactions. Pour un usage professionnel ou un volume important de transactions, nous proposons des forfaits premium avec des fonctionnalités avancées."
    }
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Import du CSS personnalisé */}
      <style jsx global>{`
        @import url('/styles/landing.css');
      `}</style>

      {/* Background animé moderne */}
      <div className="landing-background">
        <div className="floating-particles">
          {generateParticles()}
        </div>
      </div>

      {/* Header moderne avec glassmorphism */}
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="landing-logo">
              BITAX
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link href="/fonctionnalites" className="landing-nav-link">
                Fonctionnalités
              </Link>
              <Link href="/tarifs" className="landing-nav-link">
                Tarifs
              </Link>
            </nav>

            {/* Boutons CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="btn-modern-secondary">
                Connexion
              </Link>
              <Link href="/waitlist" className="btn-modern-primary">
                Rejoindre la beta
              </Link>
            </div>

            {/* Menu mobile */}
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/80 backdrop-blur-lg border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-3">
                <Link href="/fonctionnalites" className="block py-2 text-white/80 hover:text-white">
                  Fonctionnalités
                </Link>
                <Link href="/tarifs" className="block py-2 text-white/80 hover:text-white">
                  Tarifs
                </Link>
                <div className="pt-2 space-y-2">
                  <Link href="/login" className="block w-full text-center py-2 bg-white/10 rounded-lg hover:bg-white/20">
                    Connexion
                  </Link>
                  <Link href="/waitlist" className="block w-full text-center py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    Rejoindre la beta
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section Ultra-Moderne */}
      <motion.section 
        ref={heroRef}
        className="hero-modern"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="hero-content">
          {/* Badge de présentation */}
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
              <rect width="9" height="6" fill="#FFFFFF"/>
              <rect width="9" height="6" fill="#00209F"/>
              <rect x="6" width="3" height="6" fill="#DE2910"/>
              <rect x="3" width="3" height="6" fill="#FFFFFF"/>
            </svg>
            <span>Conforme à la fiscalité française</span>
          </motion.div>

          {/* Titre principal */}
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Votre fiscalité crypto,{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              simplifiée
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
          </motion.p>

          {/* Boutons CTA */}
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link href="/waitlist" className="btn-modern-primary">
              <span>Participer à la beta</span>
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </Link>
            
            <button className="btn-modern-secondary">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 000-5H9v5zm0 0H7.5a2.5 2.5 0 000 5H9v-5z" />
              </svg>
              Comment ça marche
            </button>
          </motion.div>

          {/* Badges des cryptomonnaies */}
          <motion.div 
            className="crypto-badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {/* Ethereum */}
            <div className="crypto-badge">
              <svg viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                <g fill="#627EEA">
                  <polygon fillOpacity=".6" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                  <polygon points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                  <polygon fillOpacity=".45" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                  <polygon fillOpacity=".8" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                  <polygon fillOpacity=".45" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                  <polygon fillOpacity=".6" points="0,650.54 392.07,882.29 392.07,472.33"/>
                </g>
              </svg>
            </div>

            {/* Polygon */}
            <div className="crypto-badge">
              <svg viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
                <path fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                  c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                  c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                  c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                  L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                  c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
              </svg>
            </div>

            {/* Arbitrum */}
            <div className="crypto-badge">
              <svg viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1250 0C559.644 0 0 559.644 0 1250C0 1940.36 559.644 2500 1250 2500C1940.36 2500 2500 1940.36 2500 1250C2500 559.644 1940.36 0 1250 0Z" fill="#28A0F0"/>
                <path d="M633.2 1250L1250 1866.8L1866.8 1250L1250 633.2L633.2 1250Z" fill="white"/>
              </svg>
            </div>

            {/* Optimism */}
            <div className="crypto-badge">
              <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="250" cy="250" r="250" fill="#FF0420"/>
                <path d="M168.5 200.5C168.5 177.9 186.4 160 209 160H291C313.6 160 331.5 177.9 331.5 200.5C331.5 223.1 313.6 241 291 241H209C186.4 241 168.5 223.1 168.5 200.5Z" fill="white"/>
                <path d="M168.5 299.5C168.5 276.9 186.4 259 209 259H291C313.6 259 331.5 276.9 331.5 299.5C331.5 322.1 313.6 340 291 340H209C186.4 340 168.5 322.1 168.5 299.5Z" fill="white"/>
              </svg>
            </div>

            {/* Base */}
            <div className="crypto-badge">
              <svg viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M1000 2000C1552.28 2000 2000 1552.28 2000 1000C2000 447.715 1552.28 0 1000 0C447.715 0 0 447.715 0 1000C0 1552.28 447.715 2000 1000 2000ZM1041.2 400C1407.7 400 1631.9 612.2 1662.5 972.7C1690.1 1295 1535.6 1600 1000 1600C464.4 1600 309.9 1295 337.5 972.7C368.1 612.2 592.3 400 958.8 400H1041.2Z" fill="#0052FF"/>
              </svg>
            </div>

            {/* Solana */}
            <div className="crypto-badge">
              <svg viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="solGradient" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                </defs>
                <path fill="url(#solGradient)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                  c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                <path fill="url(#solGradient)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                  c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                <path fill="url(#solGradient)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                  c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Dashboard 3D Showcase */}
        <motion.div 
          className="dashboard-showcase"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="dashboard-card-modern">
            <div className="dashboard-header">
              <div className="window-controls">
                <div className="window-control red"></div>
                <div className="window-control yellow"></div>
                <div className="window-control green"></div>
              </div>
              <div className="dashboard-title">Tableau de bord Bitax</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Live</span>
              </div>
            </div>
            
            <div className="dashboard-body">
              <div className="dashboard-stats">
                <div className="stat-card-modern">
                  <div className="stat-label">Portfolio Total</div>
                  <div className="stat-value">€24,586</div>
                  <div className="stat-change">+12.4% ce mois</div>
                </div>
                <div className="stat-card-modern">
                  <div className="stat-label">Plus-values</div>
                  <div className="stat-value">€3,247</div>
                  <div className="stat-change">+8.2% ce mois</div>
                </div>
                <div className="stat-card-modern">
                  <div className="stat-label">Transactions</div>
                  <div className="stat-value">1,234</div>
                  <div className="stat-change">+15 cette semaine</div>
                </div>
              </div>
              
              <div className="dashboard-chart">
                <h4 className="text-white font-semibold mb-4">Évolution du portefeuille</h4>
                <div className="chart-bars">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div 
                      key={i}
                      className="chart-bar"
                      style={{ 
                        height: `${20 + Math.sin(i * 0.5) * 40 + Math.random() * 30}%`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Section Fonctionnalités */}
      <motion.section 
        className="section-modern scroll-reveal"
        style={{ y: featuresY }}
        id="features"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="section-header">
            <h2 className="section-title">
              Fonctionnalités puissantes
            </h2>
            <p className="section-subtitle">
              Découvrez tout ce que Bitax peut faire pour simplifier votre fiscalité crypto.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.id}
                className={`feature-card-modern scroll-reveal ${visibleElements.has('features') ? 'revealed' : ''}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section Comment ça marche */}
      <section className="section-modern scroll-reveal" id="how-it-works">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="section-header">
            <h2 className="section-title">
              Comment ça marche
            </h2>
            <p className="section-subtitle">
              Bitax rend la fiscalité crypto simple et accessible à tous en quelques étapes faciles.
            </p>
          </div>

          <div className="steps-container">
            <div className="steps-line"></div>
            <div className="steps-grid">
              {[
                {
                  title: "Connectez votre wallet",
                  description: "Liez en toute sécurité votre wallet crypto via Web3 sans partager vos clés privées."
                },
                {
                  title: "Scannez vos transactions", 
                  description: "Bitax récupère automatiquement l'historique de vos transactions sur plusieurs blockchains."
                },
                {
                  title: "Analysez vos données",
                  description: "Visualisez vos transactions et laissez notre algorithme calculer vos plus-values."
                },
                {
                  title: "Générez votre rapport",
                  description: "Obtenez un rapport fiscal complet prêt à être utilisé pour votre déclaration d'impôts."
                }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  className="step-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ */}
      <section className="section-modern scroll-reveal" id="faq">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="section-header">
            <h2 className="section-title">
              Questions fréquentes
            </h2>
            <p className="section-subtitle">
              Tout ce que vous devez savoir sur Bitax et la fiscalité crypto.
            </p>
          </div>

          <div className="faq-container">
            {faqItems.map((item) => (
              <motion.div 
                key={item.id}
                className={`faq-item ${expandedFaq === item.id ? 'open' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: item.id * 0.1 }}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span>{item.question}</span>
                  <svg 
                    className="faq-icon" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-content">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="container mx-auto px-6 lg:px-8">
        <motion.div 
          className="cta-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="cta-title">
            Accédez à Bitax avant tout le monde
          </h2>
          <p className="cta-description">
            Rejoignez notre liste d'attente pour tester Bitax en avant-première et contribuez à façonner l'avenir de la fiscalité crypto en France.
          </p>
          <div className="hero-cta">
            <Link href="/waitlist" className="btn-modern-primary">
              Rejoindre la liste d'attente
            </Link>
            <div className="flex items-center text-sm text-white/60">
              <svg className="w-4 h-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Places limitées pour la phase beta
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer moderne */}
      <footer className="footer-modern">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="footer-content">
            <div className="footer-section">
              <Link href="/" className="landing-logo block mb-4">
                BITAX
              </Link>
              <p className="text-white/70 mb-6 max-width: 300px">
                Simplifiez votre fiscalité crypto avec notre plateforme intuitive. Connectez vos wallets, analysez vos transactions et générez des rapports fiscaux en quelques clics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Navigation</h3>
              <ul>
                <li><Link href="/">Accueil</Link></li>
                <li><Link href="/fonctionnalites">Fonctionnalités</Link></li>
                <li><Link href="/tarifs">Tarifs</Link></li>
                <li><Link href="/support">Support</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Légal</h3>
              <ul>
                <li><Link href="/terms">Conditions d'utilisation</Link></li>
                <li><Link href="/privacy">Politique de confidentialité</Link></li>
                <li><Link href="/legal">Mentions légales</Link></li>
                <li><Link href="/cookies">Cookies</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact</h3>
              <ul>
                <li>
                  <span className="text-white/60">Email: contact@bitax.fr</span>
                </li>
                <li>
                  <span className="text-white/60">Support: support@bitax.fr</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Bitax. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}