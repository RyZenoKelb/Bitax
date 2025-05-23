'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  
  const mainRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 1000], [0, -300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);
  
  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particules 3D
  useEffect(() => {
    const particlesContainer = document.querySelector('.particles-3d');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.style.animationDuration = `${15 + Math.random() * 10}s`;
      particlesContainer.appendChild(particle);
    }
  }, []);

  // Animation on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up, .scale-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      title: "Connectez vos wallets",
      description: "Intégration sécurisée avec Metamask, Coinbase Wallet et autres portefeuilles populaires.",
      icon: "🔗",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      title: "Scannez vos transactions",
      description: "Analyse automatique de vos transactions sur Ethereum, Polygon, Arbitrum, Optimism et Base.",
      icon: "🔍",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Visualisez vos données",
      description: "Graphiques interactifs et tableaux de bord pour suivre l'évolution de votre portefeuille.",
      icon: "📊",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "Générez vos rapports fiscaux",
      description: "Création automatique de rapports conformes à la législation fiscale française.",
      icon: "📄",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "2.5M", label: "Utilisateurs crypto en France", suffix: "" },
    { value: "98", label: "Précision des calculs", suffix: "%" },
    { value: "30", label: "Minutes gagnées par déclaration", suffix: "min" },
    { value: "5", label: "Blockchains supportées", suffix: "+" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0118] text-white overflow-x-hidden" ref={mainRef}>
      {/* Hero Gradient Mesh Background */}
      <div className="hero-gradient-mesh"></div>
      
      {/* Particules 3D */}
      <div className="particles-3d"></div>

      {/* Navbar Premium */}
      <motion.header 
        className={`navbar-premium fixed top-0 left-0 w-full z-50 ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="group">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9945ff] to-[#14f195] blur-lg opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <h1 className="relative text-3xl font-black tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                      BITAX
                    </span>
                  </h1>
                </div>
                <div className="hidden sm:block">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#9945ff] to-[#14f195] rounded-full text-white">
                    Beta
                  </span>
                </div>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Fonctionnalités', 'Tarifs', 'Guide'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="nav-link-premium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                </motion.a>
              ))}
              
              <motion.div 
                className="flex items-center space-x-4 ml-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/login" className="btn-neon btn-neon-secondary">
                  Connexion
                </Link>
                <Link href="/waitlist" className="btn-neon btn-neon-primary">
                  <span className="relative z-10">Accès Beta</span>
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-[#0a0118]/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-6 py-8 space-y-4">
                {['Fonctionnalités', 'Tarifs', 'Guide'].map((item) => (
                  <a
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    className="block py-3 text-lg font-medium hover:text-[#14f195] transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="pt-4 space-y-3">
                  <Link href="/login" className="block w-full text-center btn-neon btn-neon-secondary">
                    Connexion
                  </Link>
                  <Link href="/waitlist" className="block w-full text-center btn-neon btn-neon-primary">
                    Accès Beta
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative pt-20">
        <motion.div 
          className="container mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center"
          style={{ opacity, scale }}
        >
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge flottant */}
            <motion.div 
              className="floating-badge inline-flex mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-[#14f195] font-semibold">🇫🇷 Conforme à la fiscalité française</span>
            </motion.div>

            <h1 className="hero-title mb-6">
              <span className="block text-white">Votre fiscalité crypto,</span>
              <span className="block hero-title-gradient text-glow">simplifiée</span>
            </h1>

            <motion.p 
              className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/waitlist" className="btn-neon btn-neon-primary group">
                <span className="relative z-10 flex items-center">
                  Rejoindre la beta
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <button className="btn-neon btn-neon-secondary">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </span>
              </button>
            </motion.div>

            {/* Crypto Icons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {['ETH', 'MATIC', 'ARB', 'OP', 'BASE'].map((crypto, index) => (
                <motion.div
                  key={crypto}
                  className="crypto-icon-neon"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <span className="text-lg font-bold">{crypto}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Dashboard */}
          <motion.div 
            className="dashboard-3d-container hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: y1 }}
          >
            <div className="dashboard-3d-card p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-gray-400">Dashboard Pro</span>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-500/20 to-transparent p-4 rounded-xl border border-purple-500/20">
                    <p className="text-sm text-gray-400">Portfolio Total</p>
                    <p className="text-2xl font-bold">24,586 €</p>
                    <p className="text-sm text-green-400">+12.4%</p>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/20 to-transparent p-4 rounded-xl border border-cyan-500/20">
                    <p className="text-sm text-gray-400">Plus-values</p>
                    <p className="text-2xl font-bold">3,245 €</p>
                    <p className="text-sm text-green-400">+24.7%</p>
                  </div>
                </div>

                {/* Graph Visualization */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent p-6 rounded-xl border border-indigo-500/20">
                  <div className="flex items-end space-x-2 h-32">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-[#14f195] to-[#9945ff] rounded-t opacity-80 hover:opacity-100 transition-all duration-300"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transaction List */}
                <div className="space-y-2">
                  {['Bitcoin', 'Ethereum', 'Polygon'].map((coin, i) => (
                    <div key={coin} className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#9945ff] to-[#14f195] flex items-center justify-center text-xs font-bold">
                          {coin[0]}
                        </div>
                        <span className="font-medium">{coin}</span>
                      </div>
                      <span className="text-green-400 font-semibold">+{(Math.random() * 20).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card-cyber text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div 
                  className="text-4xl lg:text-5xl font-black mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                    {stat.value}{stat.suffix}
                  </span>
                </motion.div>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                Fonctionnalités puissantes
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Découvrez tout ce que Bitax peut faire pour simplifier votre fiscalité crypto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card-holographic fade-in-up"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`text-5xl mb-4`}>{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                Comment ça marche
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Bitax rend la fiscalité crypto simple et accessible à tous en quelques étapes faciles.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#9945ff] to-transparent transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { step: 1, title: "Connectez votre wallet", desc: "Liez en toute sécurité votre wallet crypto via Web3 sans partager vos clés privées." },
                { step: 2, title: "Scannez vos transactions", desc: "Bitax récupère automatiquement l'historique de vos transactions sur plusieurs blockchains." },
                { step: 3, title: "Analysez vos données", desc: "Visualisez vos transactions et laissez notre algorithme calculer vos plus-values." },
                { step: 4, title: "Générez votre rapport", desc: "Obtenez un rapport fiscal complet prêt à être utilisé pour votre déclaration d'impôts." }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  <motion.div 
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#9945ff] to-[#14f195] rounded-full flex items-center justify-center text-2xl font-black relative"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="relative z-10">{item.step}</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#9945ff] to-[#14f195] rounded-full blur-xl opacity-50"></div>
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                Pourquoi choisir Bitax
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Optimisez votre gestion fiscale et gagnez du temps grâce à nos solutions spécialisées.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { icon: "⏱️", title: "Gain de temps considérable", desc: "Automatisez votre déclaration fiscale et économisez des heures de calculs manuels." },
              { icon: "✅", title: "Réduction des erreurs", desc: "Éliminez les risques d'erreurs de calcul qui pourraient vous coûter cher." },
              { icon: "📋", title: "Conformité fiscale garantie", desc: "Respectez les obligations fiscales avec des rapports adaptés à la législation française." },
              { icon: "🖥️", title: "Support multiplateforme", desc: "Accédez à vos données depuis n'importe quel appareil, à tout moment." }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="flex gap-6 items-start"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                Ce que disent nos utilisateurs
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Nos premiers utilisateurs auront bientôt la parole ici.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="testimonial-aurora"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#9945ff] to-[#14f195] flex items-center justify-center font-bold">
                    {i}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Futur témoignage</h4>
                    <p className="text-sm text-gray-400">Utilisateur Bitax</p>
                  </div>
                </div>
                <p className="text-gray-400 italic">
                  "Cette section sera bientôt remplie avec de vrais témoignages d'utilisateurs satisfaits de notre service de gestion fiscale crypto."
                </p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                Questions fréquentes
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur Bitax et la fiscalité crypto.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: "Comment Bitax protège-t-il mes données personnelles?",
                a: "Bitax utilise un chiffrement de bout en bout et ne stocke jamais vos clés privées. Nous sommes conformes au RGPD et mettons en œuvre les meilleures pratiques de sécurité de l'industrie."
              },
              {
                q: "Quelles blockchains sont prises en charge?",
                a: "Actuellement, Bitax prend en charge Ethereum, Polygon, Arbitrum, Optimism et Base. Nous ajoutons régulièrement de nouvelles blockchains en fonction des demandes de notre communauté."
              },
              {
                q: "Les rapports générés sont-ils conformes à la législation française?",
                a: "Oui, nos rapports sont spécialement conçus pour respecter les exigences fiscales françaises concernant les crypto-actifs, y compris le régime d'imposition des plus-values."
              },
              {
                q: "Puis-je utiliser Bitax gratuitement?",
                a: "Bitax propose une version gratuite avec des fonctionnalités de base et une limite de transactions. Pour un usage professionnel ou un volume important de transactions, nous proposons des forfaits premium avec des fonctionnalités avancées."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="faq-item-modern"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <button className="w-full text-left p-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold pr-4">{item.q}</h3>
                  <svg className="w-5 h-5 text-[#14f195]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="px-6 pb-6 text-gray-400">
                  {item.a}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="relative bg-gradient-to-r from-[#9945ff] to-[#14f195] rounded-3xl p-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#0a0118] rounded-3xl p-12 lg:p-16 text-center">
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                <span className="glitch-text" data-text="Accédez à Bitax avant tout le monde">
                  Accédez à Bitax avant tout le monde
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoignez notre liste d'attente pour tester Bitax en avant-première et contribuez à façonner l'avenir de la fiscalité crypto en France.
              </p>
              <Link href="/waitlist" className="btn-neon btn-neon-primary inline-block">
                <span className="relative z-10 flex items-center">
                  Rejoindre la liste d'attente
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <p className="mt-6 text-sm text-gray-400">
                <span className="text-[#14f195]">🚀</span> Places limitées pour la phase beta
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h3 className="text-3xl font-black">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945ff] to-[#14f195]">
                    BITAX
                  </span>
                </h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Simplifiez votre fiscalité crypto avec notre plateforme intuitive. Connectez vos wallets, analysez vos transactions et générez des rapports fiscaux en quelques clics.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'github', 'discord', 'telegram'].map((social) => (
                  <a 
                    key={social}
                    href="#" 
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-[#14f195] transition-all"
                  >
                    <span className="text-xs font-bold uppercase">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                {['Accueil', 'Fonctionnalités', 'Tarifs', 'Guide', 'Support'].map((item) => (
                  <li key={item}>
                    <a href={`/${item.toLowerCase()}`} className="text-gray-400 hover:text-[#14f195] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                {['Conditions d\'utilisation', 'Politique de confidentialité', 'Mentions légales', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-[#14f195] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Bitax. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 text-sm hover:text-[#14f195] transition-colors">
                Mentions légales
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-[#14f195] transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-[#14f195] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}