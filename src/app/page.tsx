'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Head from "next/head";

// Définir l'interface pour les étoiles
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: string;
}

// Interface pour les fonctionnalités
interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Interface pour les avantages
interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Interface pour les témoignages
interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

// Interface pour FAQ
interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

// Interface pour les hexagones
interface Hexagon {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  opacity: number;
  speedX: number;
  speedY: number;
  pulseSpeed: number;
  pulseAmount: number;
  pulsePhase: number;
  rotation: number;
  rotationSpeed: number;
  isActive: boolean;
}

// Interface pour les connexions entre hexagones
interface Connection {
  from: number;
  to: number;
  opacity: number;
  active: boolean;
  lastPacketTime: number;
  packetInterval: number;
}

// Interface pour les particules
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}

// Interface pour les paquets de données
interface DataPacket {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  x: number;
  y: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
  from: number;
  to: number;
}

export default function Home() {
  // État pour gérer les étoiles avec le type correct
  const [stars, setStars] = useState<Star[]>([]);
  
  // Référence pour le canvas d'animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Référence pour contrôler le scroll
  const targetRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  
  // État pour savoir si la navbar est en mode scroll
  const [scrolled, setScrolled] = useState(false);
  
  // État pour le menu mobile
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Hook de scroll pour les effets parallaxe
  const { scrollY } = useScroll();
  
  // Transformations basées sur le scroll pour l'effet parallaxe
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);
  const opacity1 = useTransform(scrollY, [0, 100, 200], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollY, [0, 400, 500], [0, 0.5, 1]);
  const scale1 = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  // Effet pour l'animation des particules et des formes géométriques blockchain - version améliorée
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

    // Configuration des éléments du réseau blockchain
    const cryptoNodes = [];
    const connections = [];
    const dataPackets = [];
    const particles = [];
    
    // Symboles de crypto-monnaies pour les noeuds
    const cryptoSymbols = [
      { symbol: '₿', color: '#F7931A' }, // Bitcoin
      { symbol: 'Ξ', color: '#627EEA' }, // Ethereum
      { symbol: 'Ⓢ', color: '#2BD3E4' }, // Solana 
      { symbol: 'Ⓟ', color: '#8247E5' }, // Polygon
      { symbol: '◎', color: '#00E4AD' }, // Avalanche
      { symbol: '₳', color: '#0033AD' }, // Cardano
      { symbol: 'Ð', color: '#C2A633' }, // Dogecoin
      { symbol: 'Ł', color: '#345D9D' }, // Litecoin
      { symbol: 'Ȼ', color: '#F0B90B' }, // Binance Coin
    ];
    
    // Créer des noeuds blockchain (chaque noeud = une crypto)
    const createCryptoNodes = () => {
      const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 150000), 15);
      
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 20 + 25; // Taille des noeuds
        const opacity = Math.random() * 0.3 + 0.2;
        const speedX = (Math.random() - 0.5) * 0.4;
        const speedY = (Math.random() - 0.5) * 0.4;
        const pulseSpeed = Math.random() * 0.01 + 0.005;
        const pulseAmount = Math.random() * 0.2 + 0.1;
        const symbolIndex = Math.floor(Math.random() * cryptoSymbols.length);
        const isActive = Math.random() > 0.5; // Certains noeuds sont "actifs"
        
        cryptoNodes.push({ 
          x, y, size, opacity, speedX, speedY, 
          pulseSpeed, pulseAmount, pulsePhase: Math.random() * Math.PI * 2,
          symbolIndex, isActive
        });
      }
    };
    
    // Créer des connexions entre les noeuds (représente le réseau blockchain)
    const createConnections = () => {
      for (let i = 0; i < cryptoNodes.length; i++) {
        // Chaque noeud peut avoir jusqu'à 3 connexions
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          // Trouver un noeud cible aléatoire différent du noeud source
          let targetIndex;
          do {
            targetIndex = Math.floor(Math.random() * cryptoNodes.length);
          } while (targetIndex === i);
          
          connections.push({
            from: i,
            to: targetIndex,
            opacity: Math.random() * 0.2 + 0.05,
            active: false,
            lastPacketTime: 0,
            packetInterval: Math.random() * 5000 + 2000, // Intervalle entre les transactions
          });
        }
      }
    };
    
    // Créer particules d'arrière-plan (effet visuel)
    const createParticles = () => {
      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 80);
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.5;
        const color = `rgba(${Math.floor(Math.random() * 80 + 175)}, ${Math.floor(Math.random() * 80 + 175)}, ${Math.floor(Math.random() * 80 + 225)}, ${Math.random() * 0.4 + 0.2})`;

        particles.push({
          x, y, size, speedX, speedY, color
        });
      }
    };

    // Fonction pour créer une "transaction" entre deux noeuds
    const createTransaction = (from, to) => {
      const fromNode = cryptoNodes[from];
      const toNode = cryptoNodes[to];
      
        from,
        to
      });
    };

    createHexagons();
    createConnections();
    createParticles();

    // Dessiner un hexagone avec rotation
    const drawHexagon = (x: number, y: number, size: number, rotation: number, opacity: number, isActive: boolean) => {
      const sides = 6;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Hexagone principal
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const angle = i * 2 * Math.PI / sides;
        const pointX = size * Math.cos(angle);
        const pointY = size * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }
      
      // Style pour hexagone actif/inactif
      if (isActive) {
        // Hexagone actif - double style
        ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 1.5})`;
        ctx.fillStyle = `rgba(147, 51, 234, ${opacity * 0.15})`;
      } else {
        // Hexagone inactif
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.1})`;
      }
      
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fill();
      
      // Détail intérieur pour les hexagones actifs
      if (isActive) {
        ctx.beginPath();
        for (let i = 0; i <= sides; i++) {
          const angle = i * 2 * Math.PI / sides;
          const pointX = size * 0.7 * Math.cos(angle);
          const pointY = size * 0.7 * Math.sin(angle);
          
          if (i === 0) {
            ctx.moveTo(pointX, pointY);
          } else {
            ctx.lineTo(pointX, pointY);
          }
        }
        ctx.strokeStyle = `rgba(147, 51, 234, ${opacity * 0.8})`;
        ctx.stroke();
        
        // Point central pulsant
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${opacity * 2})`;
        ctx.fill();
      }
      
      ctx.restore();
    };

    // Dessiner un paquet de données
    const drawDataPacket = (packet: DataPacket) => {
      ctx.beginPath();
      ctx.arc(packet.x, packet.y, packet.size, 0, Math.PI * 2);
      ctx.fillStyle = packet.color;
      ctx.fill();
      
      // Effet de traînée
      ctx.beginPath();
      const trailLength = 15;
      ctx.moveTo(packet.x, packet.y);
      
      // Calculer point arrière basé sur la direction du mouvement
      const dx = packet.toX - packet.fromX;
      const dy = packet.toY - packet.fromY;
      const angle = Math.atan2(dy, dx);
      
      const trailX = packet.x - Math.cos(angle) * trailLength;
      const trailY = packet.y - Math.sin(angle) * trailLength;
      
      ctx.lineTo(trailX, trailY);
      ctx.strokeStyle = packet.color.replace('0.8', '0.3');
      ctx.lineWidth = packet.size * 0.7;
      ctx.stroke();
    };

    // Animation timestamp pour gestion du temps
    let lastTime = 0;
    
    // Animer tous les éléments avec timestamp
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Mettre à jour et dessiner les connexions
      connections.forEach((conn, index) => {
        const fromHex = hexagons[conn.from];
        const toHex = hexagons[conn.to];
        
        // Calculer la distance
        const distance = Math.sqrt(
          Math.pow(fromHex.x - toHex.x, 2) + 
          Math.pow(fromHex.y - toHex.y, 2)
        );
        
        // Ne dessiner la connexion que si les hexagones sont assez proches
        if (distance < 350) {
          ctx.beginPath();
          ctx.moveTo(fromHex.x, fromHex.y);
          ctx.lineTo(toHex.x, toHex.y);
          
          // Style de ligne basé sur l'activité
          if (conn.active) {
            ctx.strokeStyle = `rgba(147, 51, 234, ${conn.opacity * 2})`;
            ctx.lineWidth = 1.5;
            
            // Désactive la connexion après un certain temps
            if (timestamp - conn.lastPacketTime > 1500) {
              conn.active = false;
            }
          } else {
            ctx.strokeStyle = `rgba(99, 102, 241, ${conn.opacity})`;
            ctx.lineWidth = 0.8;
            
            // Créer un nouveau paquet à intervalle régulier
            if (timestamp - conn.lastPacketTime > conn.packetInterval) {
              conn.active = true;
              conn.lastPacketTime = timestamp;
              createDataPacket(conn.from, conn.to);
              
              // Augmente les chances d'activation connectée
              connections.forEach(otherConn => {
                // Si cette connexion partage un node avec la connexion active
                if (otherConn !== conn && 
                    (otherConn.from === conn.from || otherConn.from === conn.to ||
                     otherConn.to === conn.from || otherConn.to === conn.to)) {
                  if (Math.random() > 0.7) {
                    otherConn.active = true;
                    otherConn.lastPacketTime = timestamp;
                    createDataPacket(otherConn.from, otherConn.to);
                  }
                }
              });
            }
          }
          
          ctx.stroke();
        }
      });
      
      // Mettre à jour et dessiner les paquets de données
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i];
        packet.progress += packet.speed;
        
        // Mouvement le long de la ligne
        packet.x = packet.fromX + (packet.toX - packet.fromX) * packet.progress;
        packet.y = packet.fromY + (packet.toY - packet.fromY) * packet.progress;
        
        drawDataPacket(packet);
        
        // Supprimer le paquet s'il a atteint sa destination
        if (packet.progress >= 1) {
          // Activer brièvement l'hexagone de destination
          hexagons[packet.to].isActive = true;
          setTimeout(() => {
            if (hexagons[packet.to]) hexagons[packet.to].isActive = Math.random() > 0.7;
          }, 800);
          
          dataPackets.splice(i, 1);
        }
      }
      
      // Mettre à jour et dessiner les hexagones
      hexagons.forEach(hex => {
        hex.x += hex.speedX;
        hex.y += hex.speedY;
        hex.rotation += hex.rotationSpeed;
        
        // Effet de pulsation
        hex.size = hex.baseSize + Math.sin(timestamp * hex.pulseSpeed + hex.pulsePhase) * hex.baseSize * hex.pulseAmount;
        
        // Rebond sur les bords
        if (hex.x < 0 || hex.x > canvas.width) hex.speedX *= -1;
        if (hex.y < 0 || hex.y > canvas.height) hex.speedY *= -1;
        
        drawHexagon(hex.x, hex.y, hex.size, hex.rotation, hex.opacity, hex.isActive);
      });
      
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
    
    // Générer quelques connexions actives initialement
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        const connIndex = Math.floor(Math.random() * connections.length);
        connections[connIndex].active = true;
        connections[connIndex].lastPacketTime = performance.now();
        createDataPacket(connections[connIndex].from, connections[connIndex].to);
      }
    }, 500);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
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
  
  // Données pour les fonctionnalités
  const features: Feature[] = [
    {
      id: 1,
      title: "Connectez vos wallets",
      description: "Intégration sécurisée avec Metamask, Coinbase Wallet et autres portefeuilles populaires.",
      icon: (
        <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Scannez vos transactions",
      description: "Analyse automatique de vos transactions sur Ethereum, Polygon, Arbitrum, Optimism et Base.",
      icon: (
        <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Visualisez vos données",
      description: "Graphiques interactifs et tableaux de bord pour suivre l'évolution de votre portefeuille.",
      icon: (
        <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Générez vos rapports fiscaux",
      description: "Création automatique de rapports conformes à la législation fiscale française.",
      icon: (
        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];
  
  // Données pour les avantages
  const benefits: Benefit[] = [
    {
      id: 1,
      title: "Gain de temps considérable",
      description: "Automatisez votre déclaration fiscale et économisez des heures de calculs manuels.",
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Réduction des erreurs",
      description: "Éliminez les risques d'erreurs de calcul qui pourraient vous coûter cher.",
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Conformité fiscale garantie",
      description: "Respectez les obligations fiscales avec des rapports adaptés à la législation française.",
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Support multiplateforme",
      description: "Accédez à vos données depuis n'importe quel appareil, à tout moment.",
      icon: (
        <svg className="w-12 h-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];
  
  // Données pour les témoignages
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Thomas Dubois",
      role: "Investisseur crypto depuis 2017",
      content: "Bitax m'a fait gagner un temps précieux pendant la période de déclaration fiscale. Plus de tableurs compliqués, tout est automatisé!",
      avatar: "/avatars/user1.png"
    },
    {
      id: 2,
      name: "Sophie Martin",
      role: "Trader indépendante",
      content: "Je recommande vivement Bitax pour sa simplicité et sa précision. Le support client est également très réactif.",
      avatar: "/avatars/user2.png"
    },
    {
      id: 3,
      name: "Alexandre Petit",
      role: "Consultant blockchain",
      content: "En tant que professionnel, j'apprécie particulièrement les rapports détaillés et la prise en charge de multiples blockchains.",
      avatar: "/avatars/user3.png"
    }
  ];
  
  // Données pour la FAQ
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
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const toggleFaq = (id: number) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };
  
  return (
    <div className="min-h-screen overflow-x-hidden font-sans" ref={mainRef}>
      {/* Import de la police Inter directement */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Background moderne avec animation blockchain au lieu d'étoiles */}
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
        
        {/* Canvas pour les animations blockchain et particules */}
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 w-full h-full -z-10"
          style={{ opacity: 0.7 }}
        ></canvas>
      </div>

      {/* Header premium avec glassmorphism et effet de scroll */}
      <motion.header 
        className={`fixed top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/40 backdrop-blur-xl py-3 border-b border-white/10' 
            : 'bg-transparent py-5'
        }`}
      >
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

          {/* Navbar ultra moderne avec boutons en français */}
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
            
            {/* Boutons Connexion/S'inscrire en français */}
            <div className="flex items-center space-x-4 ml-8">
              <Link 
                href="/login" 
                className="relative px-6 py-2 overflow-hidden rounded-full border border-white/20 text-white font-medium transition-all duration-300 hover:border-white/40 hover:bg-white/5 group"
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
          <button 
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 relative group"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white rounded-full mt-1.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
        
        {/* Menu mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden container mx-auto mt-4 bg-black/60 backdrop-blur-lg rounded-lg overflow-hidden"
            >
              <div className="py-4 px-6 space-y-3">
                {[
                  { name: 'Fonctionnalités', href: '/fonctionnalites' },
                  { name: 'Tarifs', href: '/tarifs' },
                  { name: 'Guide', href: '/guide' }
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
                
                <div className="pt-4 border-t border-white/10 flex flex-col space-y-3">
                  <Link 
                    href="/login" 
                    className="w-full py-2.5 text-center text-white/80 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  
                  <Link 
                    href="/register" 
                    className="w-full py-2.5 text-center text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section avec effet premium et parallaxe */}
      <motion.section 
        className="min-h-screen flex items-center justify-center px-4 pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        ref={targetRef}
      >
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-center lg:text-left pt-8 lg:pt-0"
            style={{ y: y1 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-white">Votre fiscalité crypto, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">simplifiée</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              {/* Bouton principal avec animation avancée */}
              <Link 
                href="/register" 
                className="relative px-6 py-3 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                <span>Commencer gratuitement</span>
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
            </motion.div>
            
            {/* Badges de cryptomonnaies simplifiés et améliorés */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-8 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* Ethereum */}
              <motion.div 
                className="crypto-icon-badge" 
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                    <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                    <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                    <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                    <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                    <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33"/>
                  </g>
                </svg>
              </motion.div>
              
              {/* Polygon/Matic */}
              <motion.div 
                className="crypto-icon-badge"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                    c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                    c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                    c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                    L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                    c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                </svg>
              </motion.div>
              
              {/* Arbitrum */}
              <motion.div 
                className="crypto-icon-badge"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#2D374B"/>
                  <path d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#28A0F0"/>
                  <path d="M672.2 499.1V619.8L568.3 680.1V559.4L672.2 499.1Z" fill="white"/>
                  <path d="M568.3 680.1V559.4L466.5 498V618.7L568.3 680.1Z" fill="#96BEDC"/>
                  <path d="M672.2 378.5V499.1L568.3 559.4V438.8L672.2 378.5Z" fill="#96BEDC"/>
                  <path d="M568.3 438.8V559.4L466.5 498V377.3L568.3 438.8Z" fill="white"/>
                  <path d="M466.5 618.7V498L357.8 434.3V555L466.5 618.7Z" fill="white"/>
                  <path d="M466.5 377.3V498L357.8 434.3V313.7L466.5 377.3Z" fill="#96BEDC"/>
                </svg>
              </motion.div>
              
              {/* Optimism */}
              <motion.div 
                className="crypto-icon-badge"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#FF0420"/>
                  <path d="M9.08465 8.69519H12.6871C12.786 8.69519 12.8652 8.77448 12.8652 8.8933V11.5335C12.8652 11.6325 12.7859 11.7118 12.6871 11.7118H9.08465C8.98583 11.7118 8.90654 11.6325 8.90654 11.5335V8.8933C8.90654 8.77448 8.98583 8.69519 9.08465 8.69519Z" fill="white"/>
                  <path d="M13.6739 8.69519H17.2764C17.3752 8.69519 17.4545 8.77448 17.4545 8.8933V11.5335C17.4545 11.6325 17.3752 11.7118 17.2764 11.7118H13.6739C13.5751 11.7118 13.4958 11.6325 13.4958 11.5335V8.8933C13.4958 8.77448 13.5751 8.69519 13.6739 8.69519Z" fill="white"/>
                  <path d="M9.08465 12.4812H12.6871C12.786 12.4812 12.8652 12.5605 12.8652 12.6593V15.2995C12.8652 15.3984 12.7859 15.4777 12.6871 15.4777H9.08465C8.98583 15.4777 8.90654 15.3984 8.90654 15.2995V12.6593C8.90654 12.5605 8.98583 12.4812 9.08465 12.4812Z" fill="white"/>
                  <path d="M13.6739 12.4812H17.2764C17.3752 12.4812 17.4545 12.5605 17.4545 12.6593V15.2995C17.4545 15.3984 17.3752 15.4777 17.2764 15.4777H13.6739C13.5751 15.4777 13.4958 15.3984 13.4958 15.2995V12.6593C13.4958 12.5605 13.5751 12.4812 13.6739 12.4812Z" fill="white"/>
                  <path d="M9.08465 16.2674H12.6871C12.786 16.2674 12.8652 16.3467 12.8652 16.4455V19.0857C12.8652 19.1845 12.7859 19.2638 12.6871 19.2638H9.08465C8.98583 19.2638 8.90654 19.1845 8.90654 19.0857V16.4455C8.90654 16.3467 8.98583 16.2674 9.08465 16.2674Z" fill="white"/>
                  <path d="M13.6739 16.2674H17.2764C17.3752 16.2674 17.4545 16.3467 17.4545 16.4455V19.0857C17.4545 19.1845 17.3752 19.2638 17.2764 19.2638H13.6739C13.5751 19.2638 13.4958 19.1845 13.4958 19.0857V16.4455C13.4958 16.3467 13.5751 16.2674 13.6739 16.2674Z" fill="white"/>
                </svg>
              </motion.div>
              
              {/* Base */}
              <motion.div 
                className="crypto-icon-badge"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 38C29.4934 38 38 29.4934 38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38ZM19.7146 7.60573L29.1945 22.8486C29.8464 23.8368 29.1278 25.1395 27.9506 25.1395H8.04937C6.87215 25.1395 6.15358 23.8368 6.8055 22.8486L16.2854 7.60573C16.9313 6.6249 18.0687 6.6249 18.7146 7.60573H19.7146Z" fill="#0052FF"/>
                </svg>
              </motion.div>
              
              {/* Solana */}
              <motion.div 
                className="crypto-icon-badge"
                whileHover={{ scale: 1.15, y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-12 h-12" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                  <linearGradient id="solGradientA" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientA)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                  <linearGradient id="solGradientB" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientB)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                  <linearGradient id="solGradientC" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientC)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                    c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Dashboard 3D ultra moderne avec effet glassmorphism */}
          <motion.div 
            className="relative w-full h-[500px]"
            style={{ y: y2, scale: scale1 }}
          >
            {/* Effet de glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
            
            {/* Dashboard card - retour à l'original mais orienté fiscalité */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] perspective-1000">
              <motion.div 
                className="dashboard-card relative w-full h-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 hover:rotate-y-0 hover:scale-105 hover:shadow-glow-xl rotate-y-10"
                whileHover={{ 
                  rotateY: 0,
                  scale: 1.05,
                  transition: { duration: 0.5 }
                }}
                initial={{ rotateY: 15 }}
              >
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
                          const height = 10 + Math.sin(i / 3) * 30 + (Math.cos(i * 7.123) * 0.5 + 0.5) * 20;
                          const isHighlighted = i === 22;
                          
                          return (
                            <div 
                              key={i} 
                              className={`w-full rounded-t-sm transition-all duration-300 hover:opacity-100 group relative ${
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Section Fonctionnalités avec effet parallaxe */}
      <motion.section 
        className="py-20 relative"
        style={{ opacity: opacity2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Fonctionnalités puissantes
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
              Découvrez tout ce que Bitax peut faire pour simplifier votre fiscalité crypto.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <motion.div 
                key={feature.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * feature.id, duration: 0.5 }}
              >
                <div className="mb-4 rounded-lg p-3 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-blue-100/70 group-hover:text-blue-100/90 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Section Comment ça marche avec étapes */}
      <motion.section 
        className="py-20 relative"
        style={{ y: y3 }}
      >
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-[10%] -right-[5%] w-1/3 h-1/3 bg-indigo-600/10 rounded-full filter blur-[100px]"></div>
          <div className="absolute -bottom-[10%] -left-[5%] w-1/3 h-1/3 bg-purple-600/10 rounded-full filter blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Comment ça marche
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
              Bitax rend la fiscalité crypto simple et accessible à tous en quelques étapes faciles.
            </p>
          </div>
          
          <div className="relative">
            {/* Ligne de connexion */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-indigo-500/30 transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: 1,
                  title: "Connectez votre wallet",
                  description: "Liez en toute sécurité votre wallet crypto via Web3 sans partager vos clés privées.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  )
                },
                {
                  step: 2,
                  title: "Scannez vos transactions",
                  description: "Bitax récupère automatiquement l'historique de vos transactions sur plusieurs blockchains.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )
                },
                {
                  step: 3,
                  title: "Analysez vos données",
                  description: "Visualisez vos transactions et laissez notre algorithme calculer vos plus-values.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )
                },
                {
                  step: 4,
                  title: "Générez votre rapport",
                  description: "Obtenez un rapport fiscal complet prêt à être utilisé pour votre déclaration d'impôts.",
                  icon: (
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center text-center relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-0.5 mb-6 shadow-lg shadow-indigo-500/20">
                    <div className="bg-gray-900 rounded-full w-16 h-16 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">{item.step}</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                    <div className="mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-blue-100/70">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* Section Avantages avec effet parallaxe */}
      <motion.section 
        className="py-20 relative"
        style={{ y: y2 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Pourquoi choisir Bitax
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
              Optimisez votre gestion fiscale et gagnez du temps grâce à nos solutions spécialisées.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
            {benefits.map((benefit) => (
              <motion.div 
                key={benefit.id}
                className="flex gap-6"
                initial={{ opacity: 0, x: benefit.id % 2 === 0 ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * benefit.id, duration: 0.5 }}
              >
                <div className="shrink-0">
                  <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-lg p-3 w-16 h-16 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-blue-100/70">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Section Témoignages avec effet parallaxe - Placeholders à la place des témoignages réels */}
      <motion.section 
        className="py-20 relative"
        style={{ y: y3 }}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -bottom-[10%] -right-[5%] w-1/3 h-1/3 bg-indigo-600/10 rounded-full filter blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
              Nos premiers utilisateurs auront bientôt la parole ici.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((id) => (
              <motion.div 
                key={id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * id, duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {id}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-white">
                      Futur témoignage
                    </h3>
                    <p className="text-sm text-blue-100/70">
                      Utilisateur Bitax
                    </p>
                  </div>
                </div>
                <p className="text-blue-100/80 italic">
                  "Cette section sera bientôt remplie avec de vrais témoignages d'utilisateurs satisfaits de notre service de gestion fiscale crypto."
                </p>
                <div className="mt-4 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Section FAQ avec effet accordéon */}
      <motion.section 
        className="py-20 relative"
        style={{ y: y1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Questions fréquentes
            </h2>
            <p className="text-xl text-blue-100/80 max-w-3xl mx-auto">
              Tout ce que vous devez savoir sur Bitax et la fiscalité crypto.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item) => (
              <motion.div 
                key={item.id}
                className="mb-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * item.id, duration: 0.5 }}
              >
                <button 
                  className="w-full text-left py-4 px-6 flex justify-between items-center text-white font-medium"
                  onClick={() => toggleFaq(item.id)}
                >
                  <span>{item.question}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform duration-300 ${expandedFaq === item.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    expandedFaq === item.id ? 'max-h-72' : 'max-h-0'
                  }`}
                >
                  <div className="py-4 px-6 text-blue-100/80 border-t border-white/5">
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Intégration CTA dans le flux principal du site plutôt qu'une section séparée en bas */}
      <motion.section 
        className="py-16 mb-16 relative"
        style={{ y: y1 }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8 items-center">
          {/* Texte CTA */}
          <div>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-4 text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Simplifiez votre fiscalité crypto dès aujourd'hui
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100/80 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Rejoignez les milliers d'utilisateurs qui font confiance à Bitax pour gérer automatiquement leur déclaration fiscale en quelques clics.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link 
                href="/register" 
                className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                Créer un compte gratuitement
              </Link>
            </motion.div>
          </div>
          
          {/* Illustration ou statistiques */}
          <motion.div 
            className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="text-2xl font-bold text-indigo-400 mb-2">98%</h4>
                <p className="text-sm text-white/70">de précision dans les calculs fiscaux</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="text-2xl font-bold text-purple-400 mb-2">30min</h4>
                <p className="text-sm text-white/70">de temps gagné par déclaration</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="text-2xl font-bold text-blue-400 mb-2">5+</h4>
                <p className="text-sm text-white/70">blockchains prises en charge</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <h4 className="text-2xl font-bold text-emerald-400 mb-2">24/7</h4>
                <p className="text-sm text-white/70">de disponibilité de la plateforme</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Footer avec effet parallaxe */}
      <motion.footer 
        className="py-12 border-t border-white/10 relative"
        style={{ y: y1 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="group inline-block mb-6">
                <div className="flex items-center">
                  <div className="flex flex-col">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 tracking-tight">BITAX</h1>
                    <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase -mt-1">FISCALITÉ CRYPTO</p>
                  </div>
                </div>
              </Link>
              <p className="text-blue-100/70 mb-6 max-w-md">
                Simplifiez votre fiscalité crypto avec notre plateforme intuitive. Connectez vos wallets, analysez vos transactions et générez des rapports fiscaux en quelques clics.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-white/5 border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-blue-100/70 hover:bg-white/10 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="bg-white/5 border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-blue-100/70 hover:bg-white/10 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-white/5 border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-blue-100/70 hover:bg-white/10 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.44 3.06H5.56C4.15 3.06 3 4.21 3 5.62v12.88c0 1.41 1.15 2.56 2.56 2.56h12.88c1.41 0 2.56-1.15 2.56-2.56V5.62c0-1.41-1.15-2.56-2.56-2.56zm0 2.56v3.81h-2.73c-.25 0-.46.21-.46.46v1.33c0 .25.21.46.46.46h2.73v3.82h-2.73c-.25 0-.46.21-.46.46v1.33c0 .25.21.46.46.46h2.73v.99H5.56V5.62h12.88z" />
                  </svg>
                </a>
                <a href="#" className="bg-white/5 border border-white/10 rounded-full w-10 h-10 flex items-center justify-center text-blue-100/70 hover:bg-white/10 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.77 5.03l1.4 1.4L8.43 19.17l-5.6-5.6 1.4-1.4 4.2 4.2L19.77 5.03m0-2.83L8.43 13.54l-4.2-4.2L0 13.57 8.43 22 24 6.43 19.77 2.2z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Navigation</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Accueil', href: '/' },
                  { name: 'Fonctionnalités', href: '/fonctionnalites' },
                  { name: 'Tarifs', href: '/tarifs' },
                  { name: 'Guide', href: '/guide' },
                  { name: 'Support', href: '/support' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-blue-100/70 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Légal</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Conditions d\'utilisation', href: '/terms' },
                  { name: 'Politique de confidentialité', href: '/privacy' },
                  { name: 'Mentions légales', href: '/legal' },
                  { name: 'Cookies', href: '/cookies' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-blue-100/70 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-blue-100/70">
                    Contact à venir
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-blue-100/70">
                    En cours de mise en place
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-indigo-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-blue-100/70">
                    Adresse à venir
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100/50 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <Link href="/legal" className="text-blue-100/50 text-sm hover:text-white transition-colors duration-300">
                Mentions légales
              </Link>
              <Link href="/privacy" className="text-blue-100/50 text-sm hover:text-white transition-colors duration-300">
                Politique de confidentialité
              </Link>
              <Link href="/contact" className="text-blue-100/50 text-sm hover:text-white transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </motion.footer>
      
      {/* Ajoutez des styles CSS globaux pour les classes personnalisées */}
      <style jsx global>{`
        /* Police Inter pour tout le site */
        body, html {
          font-family: 'Inter', sans-serif !important;
        }

        /* Styles pour les badges de crypto simplifiés */
        .crypto-icon-badge {
          @apply flex items-center justify-center transition-all duration-300;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
        }
        
        .crypto-icon-badge svg {
          opacity: 0.9;
          transition: all 0.3s ease;
        }
        
        .crypto-icon-badge:hover svg {
          opacity: 1;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
        }
        
        /* Animation pour le pulse lent */
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
        
        /* Effet néomorphique pour les éléments du dashboard */
        .dashboard-item-glow {
          position: relative;
          overflow: hidden;
        }
        
        .dashboard-item-glow::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        .dashboard-item-glow:hover::before {
          opacity: 1;
        }
        
        /* Effet d'ombre interne pour les éléments du dashboard */
        .shadow-inner-white {
          box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        
        /* Transformation 3D */
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotate-y-10 {
          transform: rotateY(10deg);
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        /* Shadow glow */
        .shadow-glow-sm {
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.3);
        }
        
        .shadow-glow-xl {
          box-shadow: 0 0 30px rgba(79, 70, 229, 0.4);
        }
      `}</style>
    </div>
  );
}