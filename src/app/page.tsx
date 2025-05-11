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

// Interface pour les étapes
interface Step {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Interface pour les blocs blockchain
interface Block {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  isActive: boolean;
  hash: string;
  data: string;
  timestamp: number;
}

// Interface pour les transactions
interface Transaction {
  from: number;
  to: number;
  progress: number;
  speed: number;
  pathPoints: {x: number, y: number}[];
  currentPoint: number;
  color: string;
  timestamp: number;
  size: number;
}

// Interface pour les noeuds (miners/users)
interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  pulseSpeed: number;
  connections: number[];
  type: 'miner' | 'user';
  isActive: boolean;
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
  
  // État pour le formulaire d'Early Access
  const [email, setEmail] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook de scroll pour les effets parallaxe
  const { scrollY } = useScroll();
  
  // Transformations basées sur le scroll pour l'effet parallaxe
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);
  const opacity1 = useTransform(scrollY, [0, 100, 200], [1, 0.5, 0]);
  const opacity2 = useTransform(scrollY, [0, 400, 500], [0, 0.5, 1]);
  const scale1 = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  // Effet pour l'animation blockchain
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

    // Couleurs blockchain
    const blockchainColors = {
      mainBlock: 'rgba(79, 70, 229, 0.8)', // Indigo/violet
      altBlock: 'rgba(99, 102, 241, 0.7)', // Indigo plus clair
      lineColor: 'rgba(129, 140, 248, 0.3)', // Indigo pâle
      activeNode: 'rgba(139, 92, 246, 0.9)', // Violet
      inactiveNode: 'rgba(79, 70, 229, 0.5)', // Indigo tamisé
      transaction: {
        normal: 'rgba(139, 92, 246, 0.7)', // Violet
        success: 'rgba(52, 211, 153, 0.9)', // Vert
        pending: 'rgba(251, 191, 36, 0.8)' // Jaune
      },
      text: 'rgba(255, 255, 255, 0.7)'
    };

    // Configuration des éléments visuels blockchain
    const blocks: Block[] = [];
    const transactions: Transaction[] = [];
    const nodes: Node[] = [];
    
    // Créer des blocs (représentation visuelle de blocs blockchain)
    const createBlocks = () => {
      const blockCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 200000), 12);
      
      for (let i = 0; i < blockCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 20 + 35; // Taille plus uniforme
        const opacity = Math.random() * 0.3 + 0.3;
        const speedX = (Math.random() - 0.5) * 0.3;
        const speedY = (Math.random() - 0.5) * 0.3;
        const rotationSpeed = (Math.random() - 0.5) * 0.002;
        const rotation = Math.random() * Math.PI * 2;
        
        // Générer un hash aléatoire pour le bloc
        const hash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        
        blocks.push({
          id: i,
          x, 
          y, 
          size, 
          opacity, 
          speedX, 
          speedY,
          rotation, 
          rotationSpeed,
          color: Math.random() > 0.5 ? blockchainColors.mainBlock : blockchainColors.altBlock,
          isActive: Math.random() > 0.7,
          hash: '0x' + hash + '...',
          data: 'Tx: ' + Math.floor(Math.random() * 10 + 1),
          timestamp: Date.now()
        });
      }
    };
    
    // Créer des nœuds (représentant des utilisateurs/miners)
    const createNodes = () => {
      const nodeCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 250000), 10);
      
      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 5 + 8;
        const isMiner = Math.random() > 0.6;
        
        nodes.push({
          id: i,
          x,
          y,
          size,
          color: isMiner ? blockchainColors.activeNode : blockchainColors.inactiveNode,
          pulseSpeed: Math.random() * 0.003 + 0.001,
          connections: [],
          type: isMiner ? 'miner' : 'user',
          isActive: Math.random() > 0.5
        });
      }
      
      // Créer des connexions entre les nœuds
      for (let i = 0; i < nodes.length; i++) {
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        
        for (let j = 0; j < connectionCount; j++) {
          const targetIndex = Math.floor(Math.random() * nodes.length);
          
          if (targetIndex !== i && !nodes[i].connections.includes(targetIndex)) {
            nodes[i].connections.push(targetIndex);
          }
        }
      }
    };
    
    // Générer une transaction entre deux nœuds
    const createTransaction = (fromNodeIndex: number, toNodeIndex: number) => {
      const fromNode = nodes[fromNodeIndex];
      const toNode = nodes[toNodeIndex];
      
      // Créer des points intermédiaires pour une courbe de Bézier
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      
      // Décalage aléatoire pour courber le chemin
      const offset = Math.min(100, Math.sqrt(
        Math.pow(fromNode.x - toNode.x, 2) + 
        Math.pow(fromNode.y - toNode.y, 2)
      ) * 0.3);
      
      const controlX = midX + (Math.random() - 0.5) * offset;
      const controlY = midY + (Math.random() - 0.5) * offset;
      
      // Générer plusieurs points le long de la courbe de Bézier
      const pathPoints = [];
      const steps = 20;
      
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        
        // Equation de courbe de Bézier quadratique
        const x = Math.pow(1-t, 2) * fromNode.x + 
                 2 * (1-t) * t * controlX + 
                 Math.pow(t, 2) * toNode.x;
                 
        const y = Math.pow(1-t, 2) * fromNode.y + 
                 2 * (1-t) * t * controlY + 
                 Math.pow(t, 2) * toNode.y;
                 
        pathPoints.push({x, y});
      }
      
      transactions.push({
        from: fromNodeIndex,
        to: toNodeIndex,
        progress: 0,
        speed: Math.random() * 0.005 + 0.003,
        pathPoints,
        currentPoint: 0,
        color: Math.random() > 0.8 
          ? blockchainColors.transaction.success 
          : (Math.random() > 0.7 
            ? blockchainColors.transaction.pending 
            : blockchainColors.transaction.normal),
        timestamp: Date.now(),
        size: Math.random() * 2 + 3
      });
    };
    
    // Dessiner un bloc avec données
    const drawBlock = (block: Block) => {
      ctx.save();
      ctx.translate(block.x, block.y);
      ctx.rotate(block.rotation);
      
      // Bloc principal
      ctx.fillStyle = block.color;
      ctx.globalAlpha = block.opacity;
      
      // Dessiner un bloc stylisé (rectangulaire avec coins arrondis)
      roundedRect(ctx, -block.size/2, -block.size/2, block.size, block.size, 8);
      ctx.fill();
      
      // Effet de contour
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Dessiner des détails du bloc pour simuler des données
      ctx.fillStyle = blockchainColors.text;
      ctx.font = `${Math.max(block.size/10, 8)}px monospace`;
      ctx.textAlign = 'center';
      
      // Hash raccourci
      ctx.fillText(block.hash, 0, -block.size/4);
      
      // Séparateur
      ctx.fillRect(-block.size/3, -block.size/10, block.size*2/3, 1);
      
      // Données
      ctx.fillText(block.data, 0, block.size/6);
      
      // Symbole blockchain en bas
      ctx.fillText("₿", 0, block.size/3);
      
      ctx.restore();
    };
    
    // Dessiner un nœud
    const drawNode = (node: Node, timestamp: number) => {
      ctx.save();
      
      // Pulsation basée sur l'activité
      const pulseAmount = node.isActive ? Math.sin(timestamp * node.pulseSpeed) * 0.2 + 1 : 1;
      const displaySize = node.size * pulseAmount;
      
      // Nœud principal
      ctx.beginPath();
      ctx.arc(node.x, node.y, displaySize, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Aura pour les mineurs
      if (node.type === 'miner') {
        ctx.beginPath();
        ctx.arc(node.x, node.y, displaySize * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
        ctx.fill();
      }
      
      // Icône différente selon le type
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `${displaySize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Symbole selon le type
      const symbol = node.type === 'miner' ? "⛏" : "👤";
      // Ne pas dessiner les symboles s'ils sont trop petits
      if (displaySize > 10) {
        ctx.fillText(symbol, node.x, node.y);
      }
      
      ctx.restore();
    };
    
    // Dessiner une transaction
    const drawTransaction = (tx: Transaction) => {
      if (tx.currentPoint >= tx.pathPoints.length - 1) return;
      
      const point = tx.pathPoints[tx.currentPoint];
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, tx.size, 0, Math.PI * 2);
      ctx.fillStyle = tx.color;
      ctx.fill();
      
      // Traînée
      if (tx.currentPoint > 0) {
        const tailLength = Math.min(5, tx.currentPoint);
        
        for (let i = 1; i <= tailLength; i++) {
          const tailPoint = tx.pathPoints[tx.currentPoint - i];
          const alpha = (tailLength - i) / tailLength * 0.5;
          
          ctx.beginPath();
          ctx.arc(
            tailPoint.x, 
            tailPoint.y, 
            tx.size * (1 - i / (tailLength + 1)), 
            0, 
            Math.PI * 2
          );
          ctx.fillStyle = tx.color.replace(')', `, ${alpha})`).replace('rgba', 'rgba');
          ctx.fill();
        }
      }
    };
    
    // Fonction pour dessiner un rectangle avec coins arrondis
    function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
    
    // Initialiser le canvas
    createBlocks();
    createNodes();
    
    // Animation timestamp pour gestion du temps
    let lastTime = 0;
    let lastTxTime = 0;
    
    // Animer tous les éléments avec timestamp
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner les connexions entre les nœuds
      nodes.forEach((node, nodeIndex) => {
        node.connections.forEach(targetIndex => {
          const targetNode = nodes[targetIndex];
          
          // Calculer la distance
          const distance = Math.sqrt(
            Math.pow(node.x - targetNode.x, 2) + 
            Math.pow(node.y - targetNode.y, 2)
          );
          
          // Ne dessiner que si les nœuds sont assez proches
          if (distance < 300) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            
            // Style de ligne
            ctx.strokeStyle = blockchainColors.lineColor;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      });
      
      // Mettre à jour et dessiner les transactions
      for (let i = transactions.length - 1; i >= 0; i--) {
        const tx = transactions[i];
        
        // Mettre à jour la position actuelle
        tx.currentPoint += Math.ceil(tx.speed * 50);
        
        // Si la transaction est terminée
        if (tx.currentPoint >= tx.pathPoints.length - 1) {
          // Activer brièvement le nœud de destination
          nodes[tx.to].isActive = true;
          
          // Après un court moment, revenir à l'état normal
          setTimeout(() => {
            if (nodes[tx.to]) nodes[tx.to].isActive = Math.random() > 0.5;
          }, 300);
          
          // Supprimer la transaction
          transactions.splice(i, 1);
          
          // 30% de chance de créer un nouveau bloc
          if (Math.random() > 0.7 && blocks.length < 15) {
            const nodePos = nodes[tx.to];
            const newBlockX = nodePos.x + (Math.random() - 0.5) * 100;
            const newBlockY = nodePos.y + (Math.random() - 0.5) * 100;
            
            // Ajouter un nouveau bloc près du nœud
            const size = Math.random() * 20 + 35;
            const hash = [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
            
            blocks.push({
              id: blocks.length,
              x: newBlockX,
              y: newBlockY,
              size: size,
              opacity: 0.7,
              speedX: (Math.random() - 0.5) * 0.3,
              speedY: (Math.random() - 0.5) * 0.3,
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 0.002,
              color: blockchainColors.mainBlock, // Bloc "nouveau" toujours vif
              isActive: true,
              hash: '0x' + hash + '...',
              data: 'Tx: ' + Math.floor(Math.random() * 5 + 1),
              timestamp: Date.now()
            });
            
            // Animation de création de bloc: activation brève de tous les nœuds connectés
            nodes.forEach(node => {
              if (node.connections.includes(tx.to)) {
                node.isActive = true;
                setTimeout(() => {
                  node.isActive = Math.random() > 0.5;
                }, 500);
              }
            });
          }
          
          continue;
        }
        
        drawTransaction(tx);
      }
      
      // Mettre à jour et dessiner les blocs
      blocks.forEach(block => {
        block.x += block.speedX;
        block.y += block.speedY;
        block.rotation += block.rotationSpeed;
        
        // Rebond sur les bords
        if (block.x < 0 || block.x > canvas.width) block.speedX *= -1;
        if (block.y < 0 || block.y > canvas.height) block.speedY *= -1;
        
        drawBlock(block);
      });
      
      // Mettre à jour et dessiner les nœuds
      nodes.forEach(node => {
        drawNode(node, timestamp);
      });
      
      // Créer périodiquement de nouvelles transactions
      if (timestamp - lastTxTime > 2000) { // Toutes les 2 secondes
        lastTxTime = timestamp;
        
        // Sélectionner des nœuds aléatoires pour la transaction
        if (nodes.length > 1) {
          const fromIndex = Math.floor(Math.random() * nodes.length);
          let toIndex;
          
          // S'assurer que la destination est différente de l'origine
          do {
            toIndex = Math.floor(Math.random() * nodes.length);
          } while (toIndex === fromIndex);
          
          // Créer la transaction
          createTransaction(fromIndex, toIndex);
          
          // Activer brièvement le nœud émetteur
          nodes[fromIndex].isActive = true;
          setTimeout(() => {
            if (nodes[fromIndex]) nodes[fromIndex].isActive = Math.random() > 0.5;
          }, 300);
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    // Démarrer l'animation
    requestAnimationFrame(animate);
    
    // Générer quelques transactions initiales
    setTimeout(() => {
      if (nodes.length > 1) {
        for (let i = 0; i < Math.min(3, Math.floor(nodes.length / 2)); i++) {
          const fromIndex = Math.floor(Math.random() * nodes.length);
          let toIndex;
          
          do {
            toIndex = Math.floor(Math.random() * nodes.length);
          } while (toIndex === fromIndex);
          
          createTransaction(fromIndex, toIndex);
        }
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
  
  // Fonction de gestion du formulaire Early Access
  const handleEarlyAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi du formulaire avec un délai
    setTimeout(() => {
      if (email && email.includes('@')) {
        setSubmitSuccess(true);
        setSubmitError("");
        setEmail("");
      } else {
        setSubmitError("Veuillez entrer une adresse email valide");
        setSubmitSuccess(false);
      }
      setIsSubmitting(false);
    }, 800);
  };
  
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

  // Données pour les étapes
  const howItWorksSteps: Step[] = [
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
    },
    {
      id: 5,
      question: "Comment fonctionne le programme Early Access?",
      answer: "Notre programme Early Access vous donne un accès privilégié à Bitax avant son lancement officiel. En tant que testeur précoce, vous bénéficiez d'un accès gratuit à toutes les fonctionnalités premium, d'un support prioritaire et de la possibilité d'influencer directement le développement du produit."
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

      {/* Background moderne avec animation blockchain */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
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
        
        {/* Canvas pour les animations blockchain */}
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
              
              {/* Badge Early Access */}
              <div className="ml-3 hidden sm:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  Early Access
                </span>
              </div>
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
              
              {/* Boutons Connexion/S'inscrire en français - nouveau design */}
              <div className="flex items-center space-x-3 ml-6">
                <Link 
                  href="/login" 
                  className="px-6 py-2 rounded-lg border border-white/10 text-white/90 font-medium transition-all duration-300 hover:border-white/20 hover:bg-white/5"
                >
                  Connexion
                </Link>
                
                <Link 
                  href="/register" 
                  className="px-6 py-2 rounded-lg relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500"></span>
                  <span className="relative text-white font-medium">S'inscrire</span>
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
                
                {/* Badge Early Access dans le menu mobile */}
                <div className="py-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    Early Access
                  </span>
                </div>
                
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
                    className="block py-2.5 text-center text-white relative overflow-hidden"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg"></span>
                    <span className="relative">S'inscrire</span>
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
            {/* Badge Early Access */}
            <motion.div 
              className="mb-6 inline-flex"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 border border-white/10 shadow-lg shadow-indigo-500/20">
                <span className="px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-bold text-white mr-2">BETA</span>
                <span className="text-sm text-white font-medium">Early Access Program</span>
              </div>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="text-white">Votre fiscalité crypto, </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">simplifiée</span>
            </motion.h2>
            
            {/* Badge avec drapeau français */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="inline-flex items-center px-6 py-2 rounded-full bg-blue-900/20 border border-blue-800/30 backdrop-blur-sm">
                <svg className="w-6 h-5 mr-2" viewBox="0 0 9 6" xmlns="http://www.w3.org/2000/svg">
                  <rect width="9" height="6" fill="#FFFFFF"/>
                  <rect width="9" height="6" fill="#00209F"/>
                  <rect x="6" width="3" height="6" fill="#DE2910"/>
                  <rect x="3" width="3" height="6" fill="#FFFFFF"/>
                </svg>
                <span className="text-blue-200 font-medium">Conforme à la fiscalité française</span>
              </div>
            </motion.div>
            
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
              {/* Bouton principal avec design moderne */}
              <Link 
                href="/register" 
                className="relative px-8 py-3.5 rounded-lg overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600"></span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center justify-center text-white font-semibold">
                  <span>Participer à la beta</span>
                  <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
              
              {/* Bouton secondaire glassmorphism */}
              <Link 
                href="/guide" 
                className="relative px-8 py-3.5 rounded-lg overflow-hidden group"
              >
                <span className="absolute inset-0 w-full h-full border border-white/20 bg-white/5 backdrop-blur-sm group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-300"></span>
                <span className="relative flex items-center justify-center text-white">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Comment ça marche</span>
                </span>
              </Link>
            </motion.div>
            
            {/* Badges de cryptomonnaies avec logos corrigés et taille réduite */}
            <motion.div 
              className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {/* Ethereum */}
              <motion.div 
                className="crypto-icon-badge w-8 h-8 rounded-full bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 flex items-center justify-center" 
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                  <g fill="#627EEA">
                    <polygon fillOpacity=".6" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                    <polygon points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                    <polygon fillOpacity=".45" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                    <polygon fillOpacity=".8" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                    <polygon fillOpacity=".45" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                    <polygon fillOpacity=".6" points="0,650.54 392.07,882.29 392.07,472.33"/>
                  </g>
                </svg>
              </motion.div>
              
              {/* Polygon/Matic */}
              <motion.div 
                className="crypto-icon-badge w-8 h-8 rounded-full bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
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
                className="crypto-icon-badge w-8 h-8 rounded-full bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 2500 2500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1250 0C559.644 0 0 559.644 0 1250C0 1940.36 559.644 2500 1250 2500C1940.36 2500 2500 1940.36 2500 1250C2500 559.644 1940.36 0 1250 0Z" fill="#28A0F0"/>
                  <path d="M633.2 1250L1250 1866.8L1866.8 1250L1250 633.2L633.2 1250Z" fill="white"/>
                  <path d="M633.2 1250L1250 1866.8L1866.8 1250H633.2Z" fill="#0C1424"/>
                  <path d="M633.2 1250L1250 633.2L1866.8 1250H633.2Z" fill="#0C1424" fillOpacity="0.2"/>
                </svg>
              </motion.div>
              
              {/* Optimism */}
              <motion.div 
                className="crypto-icon-badge w-8 h-8 rounded-full bg-red-900/20 backdrop-blur-sm border border-red-800/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="250" cy="250" r="250" fill="#FF0420"/>
                  <path d="M168.5 200.5C168.5 177.9 186.4 160 209 160H291C313.6 160 331.5 177.9 331.5 200.5C331.5 223.1 313.6 241 291 241H209C186.4 241 168.5 223.1 168.5 200.5Z" fill="white"/>
                  <path d="M168.5 299.5C168.5 276.9 186.4 259 209 259H291C313.6 259 331.5 276.9 331.5 299.5C331.5 322.1 313.6 340 291 340H209C186.4 340 168.5 322.1 168.5 299.5Z" fill="white"/>
                </svg>
              </motion.div>
              
              {/* Base */}
              <motion.div 
                className="crypto-icon-badge w-8 h-8 rounded-full bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 2000 2000" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1000 2000C1552.28 2000 2000 1552.28 2000 1000C2000 447.715 1552.28 0 1000 0C447.715 0 0 447.715 0 1000C0 1552.28 447.715 2000 1000 2000ZM1041.2 400C1407.7 400 1631.9 612.2 1662.5 972.7C1690.1 1295 1535.6 1600 1000 1600C464.4 1600 309.9 1295 337.5 972.7C368.1 612.2 592.3 400 958.8 400H1041.2Z" fill="#0052FF"/>
                </svg>
              </motion.div>
              
              {/* Solana */}
              <motion.div 
                className="crypto-icon-badge w-8 h-8 rounded-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-800/30 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                  <linearGradient id="solGradientUse" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientUse)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                  <path fill="url(#solGradientUse)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                  <path fill="url(#solGradientUse)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
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
                
                {/* Badge Beta */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                    Beta
                  </span>
                </div>
                
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
                    <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-white">PRO</span>
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
                                  ? 'bg-violet-500' 
                                  : 'bg-indigo-500/30 hover:bg-indigo-500/50'
                              }`}
                              style={{ height: `${height}%` }}
                            >
                              {isHighlighted && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-violet-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
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

      {/* Section Early Access */}
      <motion.section 
        className="py-16 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-1 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/20">
            <div className="bg-slate-900 rounded-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Contenu Early Access */}
                <div className="p-8 md:p-10">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/20 text-violet-300 border border-violet-500/20 mb-6">
                    PROGRAMME EXCLUSIF
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    Rejoignez notre programme Early Access
                  </h2>
                  
                  <p className="text-blue-100/80 mb-6">
                    Soyez parmi les premiers à tester Bitax et bénéficiez d'avantages exclusifs :
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Accès gratuit à toutes les fonctionnalités premium",
                      "Support prioritaire et personnalisé",
                      "Influence sur le développement du produit",
                      "50% de réduction à vie sur l'abonnement"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-blue-100/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Formulaire d'Early Access */}
                  <form onSubmit={handleEarlyAccessSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">Email</label>
                      <div className="mt-1 relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Votre adresse email"
                          className="block w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 placeholder-slate-400 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    {submitError && (
                      <p className="text-red-400 text-sm">{submitError}</p>
                    )}
                    
                    {submitSuccess ? (
                      <div className="bg-green-900/30 border border-green-700/30 text-green-400 px-4 py-3 rounded-lg">
                        <div className="flex">
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p>Merci ! Votre demande a été envoyée avec succès.</p>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full relative overflow-hidden px-4 py-3 rounded-lg group"
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-500 group-hover:to-indigo-500 transition-all duration-300"></span>
                        <span className="relative flex items-center justify-center text-white font-medium">
                          {isSubmitting ? (
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : null}
                          Participer à la beta
                        </span>
                      </button>
                    )}
                    
                    <p className="text-xs text-blue-100/50 text-center">
                      Nombre de places limité. Premier arrivé, premier servi.
                    </p>
                  </form>
                </div>
                
                {/* Image Early Access */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 p-8 md:p-10 flex items-center justify-center relative overflow-hidden">
                  {/* Effets lumineux */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full filter blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl"></div>
                  
                  {/* Contenu */}
                  <div className="relative text-center z-10 max-w-xs">
                    <div className="inline-block mb-6 p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                      <svg className="w-12 h-12 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">
                      Influencez le futur de Bitax
                    </h3>
                    
                    <p className="text-blue-100/80 mb-6">
                      En tant que bêta-testeur, vos retours nous aideront à créer le meilleur outil de fiscalité crypto en France.
                    </p>
                    
                    <div className="inline-flex items-center space-x-1">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-violet-500"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 -ml-2 border-2 border-slate-900 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500"></div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-500 -ml-2 border-2 border-slate-900 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500"></div>
                      </div>
                      <span className="text-white/70 text-sm ml-2">+24 places restantes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <div className="absolute top-0