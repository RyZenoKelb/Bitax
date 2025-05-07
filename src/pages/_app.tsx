// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CustomStyles from '@/components/CustomStyles';
import AuthProvider from '@/components/AuthProvider';

// Type pour les éléments d'enfants React
declare module 'react' {
  interface CSSProperties {
    '--tw-gradient-from'?: string;
    '--tw-gradient-to'?: string;
    '--tw-gradient-stops'?: string;
  }
}

// Logo moderne et animé - texte Bitax réinventé
const BitaxLogo = ({ collapsed = false }) => {
  return (
    <Link href="/" className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} group cursor-pointer`}>
      <div className="relative">
        {/* Fond du logo */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-900/30 to-purple-900/30 blur-sm"></div>
        
        {/* Logo principal modernisé */}
        <div className="relative z-10">
          {/* Le 'B' stylisé avec un élément hexagonal pour rappeler la blockchain */}
          <div className="relative inline-flex">
            <span className={`${collapsed ? 'text-xl' : 'text-2xl'} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 tracking-tight`}>
              B
            </span>
            {/* Hexagone blockchain stylisé autour du B */}
            <div className="absolute -inset-1 border border-indigo-500/50 rounded-lg rotate-45 animate-pulse-slow"></div>
          </div>
          
          {/* Le reste du texte avec une animation de couleur ondulante */}
          <span className={`${collapsed ? 'text-xl' : 'text-2xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 animate-gradient-x ml-0.5 tracking-tight`}>
            itax
          </span>
          
          {/* Points lumineux qui symbolisent la connexion blockchain */}
          <div className="absolute -right-1 top-0 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-slow opacity-80"></div>
          <div className="absolute -left-1 bottom-0 w-1 h-1 rounded-full bg-purple-500 animate-pulse-slow opacity-70 delay-300"></div>
          
          {/* Effet de brillance qui se déplace */}
          <div className="absolute -inset-1 w-1/4 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-30 group-hover:animate-shine"></div>
        </div>
      </div>
    </Link>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  // Utilisation de couleurs modernes (thème cyberpunk/crypto)
  const COLORS = {
    cyan: {
      light: '#0FF4C6',
      main: '#0CCEA3',
      dark: '#0A9A7B'
    },
    purple: {
      light: '#A47EF6',
      main: '#8456F0',
      dark: '#6039DD'
    },
    indigo: {
      light: '#8EA2FF',
      main: '#5E77FF',
      dark: '#3A54F2'
    },
    accent: {
      light: '#FF65B6',
      main: '#FF3A9D',
      dark: '#DB1E7C'
    },
    bg: {
      dark: '#0F172A',
      darker: '#091125', 
      light: '#F8FAFC',
      lighter: '#FFFFFF'
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  // Navigation links avec icônes modernisées et animation
  const navLinks = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="8" height="8" rx="1.5" className="fill-current opacity-80" />
          <rect x="13" y="3" width="8" height="8" rx="1.5" className="fill-current opacity-90" />
          <rect x="3" y="13" width="8" height="8" rx="1.5" className="fill-current opacity-90" />
          <rect x="13" y="13" width="8" height="8" rx="1.5" className="fill-current opacity-80" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.indigo.main}, ${COLORS.indigo.light})`
    },
    { 
      name: 'Transactions', 
      href: '/transactions', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Icône plus représentative des transactions financières/crypto */}
          <path d="M3 12h4l2-4 3 8 2-10 3 8 1-2h3" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17h20" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4" cy="17" r="1" className="fill-current" />
          <circle cx="9" cy="17" r="1" className="fill-current" />
          <circle cx="15" cy="17" r="1" className="fill-current" />
          <circle cx="20" cy="17" r="1" className="fill-current" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.purple.main}, ${COLORS.purple.light})`
    },
    { 
      name: 'Rapports', 
      href: '/reports', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2V8H20" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 13H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 9H9H8" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.cyan.main}, ${COLORS.cyan.light})`
    },
    { 
      name: 'Guide', 
      href: '/guide', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.indigo.dark}, ${COLORS.indigo.main})`
    },
    { 
      name: 'Tarifs', 
      href: '/pricing', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 1V23" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.accent.dark}, ${COLORS.accent.main})`
    },
    { 
      name: 'Support', 
      href: '/support', 
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Icône plus représentative du support client */}
          <circle cx="12" cy="12" r="9" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17h.01" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 10a3 3 0 015.12-2.12A3 3 0 0115 10c0 1.3-1 2-1.5 2.5-.5.5-.5 1-.5 1.5" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      gradient: `linear-gradient(45deg, ${COLORS.purple.dark}, ${COLORS.purple.main})`
    }
  ];

  // Toggle du thème (light/dark)
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
    // Initialiser avec un délai pour éviter le flash lors du chargement
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Vérifier si la sidebar était réduite précédemment
    const collapsedState = localStorage.getItem('bitax-sidebar-collapsed');
    if (collapsedState) {
      setSidebarCollapsed(collapsedState === 'true');
    }
    
    // Vérifier si on est sur mobile pour adapter l'interface
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Animation des étoiles en arrière-plan - initialisation
    initStarryBackground();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fonction pour initialiser le fond étoilé
  const initStarryBackground = () => {
    if (typeof window !== 'undefined') {
      // Création d'un canvas pour les étoiles si nécessaire
      const existingCanvas = document.getElementById('starry-background');
      if (!existingCanvas) {
        const canvas = document.createElement('canvas');
        canvas.id = 'starry-background';
        canvas.className = 'fixed inset-0 -z-10 pointer-events-none';
        document.body.appendChild(canvas);
        
        // Initialisation de l'animation des étoiles
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Configuration et animation des étoiles ici
            interface Star {
            x: number;
            y: number;
            radius: number;
            brightness: number;
            color: string;
            speed: number;
            }

            const stars: Star[] = [];
            interface ShootingStar {
            x: number;
            y: number;
            length: number;
            speed: number;
            angle: number;
            life: number;
            }

            const shootingStars: ShootingStar[] = [];
          let width = window.innerWidth;
          let height = window.innerHeight;
          
          // Redimensionner le canvas quand la fenêtre change de taille
          window.addEventListener('resize', () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
          });
          
          // Initialiser le canvas
          canvas.width = width;
          canvas.height = height;
          
          // Créer des étoiles initiales
          for (let i = 0; i < 150; i++) {
            stars.push({
              x: Math.random() * width,
              y: Math.random() * height,
              radius: Math.random() * 1.5,
              brightness: Math.random() * 0.5 + 0.5,
              color: i % 20 === 0 ? 
                `rgb(${Math.floor(Math.random()*100 + 155)}, ${Math.floor(Math.random()*100 + 155)}, ${Math.floor(Math.random()*255)})` :
                'rgba(255, 255, 255, 0.8)',
              speed: Math.random() * 0.05
            });
          }
          
          // Animation des étoiles
          function animate() {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);
            
            // Dessiner les étoiles
            stars.forEach(star => {
              star.y += star.speed;
              if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
              }
              
              ctx.beginPath();
              if (!ctx) return;
              ctx.beginPath();
              ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
              ctx.fillStyle = star.color;
              ctx.globalAlpha = star.brightness * (0.5 + Math.sin(Date.now() * 0.001) * 0.5);
              ctx.fill();
            
            // Occasionnellement ajouter une étoile filante
            if (Math.random() < 0.01 && shootingStars.length < 3) {
              shootingStars.push({
                x: Math.random() * width,
                y: Math.random() * height / 3,
                length: Math.random() * 80 + 50,
                speed: Math.random() * 10 + 10,
                angle: Math.random() * Math.PI / 4 - Math.PI / 8,
                life: 100
              });
            }
            
            // Dessiner les étoiles filantes
            shootingStars.forEach((star, index) => {
              if (!ctx) return;
              ctx.beginPath();
              ctx.moveTo(star.x, star.y);
              
              const endX = star.x + Math.cos(star.angle) * star.length;
              const endY = star.y + Math.sin(star.angle) * star.length;
              
              ctx.lineTo(endX, endY);
              
              const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
              gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
              gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 2;
              ctx.globalAlpha = star.life / 100;
              ctx.stroke();
              
              // Mettre à jour la position
              star.x += Math.cos(star.angle) * star.speed;
              star.y += Math.sin(star.angle) * star.speed;
              star.life -= 1;
              
              // Supprimer si hors écran ou fin de vie
              if (star.x > width || star.y > height || star.life <= 0) {
                shootingStars.splice(index, 1);
              }
            });
            
            requestAnimationFrame(animate);
          });

          }
          animate();
        }
      }
    }
  };

  // Appliquer le thème au document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  // Fonction pour gérer le collapse de la sidebar
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('bitax-sidebar-collapsed', String(newState));
      return newState;
    });
  };

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  return (
    <AuthProvider>
      <Head>
        <title>Bitax | Fiscalité crypto redéfinie</title>
        <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta name="twitter:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:title" content="Bitax | Fiscalité crypto redéfinie" />
        <meta property="og:description" content="Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
        <meta property="og:type" content="website" />
        
        {/* Ajout des polices explicitement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      
      {/* Inclusion du composant CustomStyles qui injectera nos styles prioritaires */}
      <CustomStyles />
      
      <div className={`min-h-screen flex ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
        {/* SIDEBAR - Version ultra moderne avec effets néon et glassmorphism */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out backdrop-blur-xl
            ${sidebarCollapsed ? 'w-20' : 'w-72'} 
            bg-gradient-to-b from-bg-darker via-bg-dark to-bg-darker border-r border-indigo-900/40
            overflow-hidden`}
          style={{
            boxShadow: '0 0 20px rgba(46, 86, 255, 0.2)',
          }}
        >
          {/* Effets lumineux interactifs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-indigo-500/0 via-indigo-500/30 to-indigo-500/0"></div>
            <div className="absolute -bottom-5 -left-5 w-40 h-40 rounded-full bg-purple-600/20 blur-3xl"></div>
          </div>
          
          {/* Logo et toggle sidebar avec animation */}
          <div className="relative flex items-center justify-between py-6 px-5">
            <BitaxLogo collapsed={sidebarCollapsed} />
            
            {/* Bouton toggle sidebar réactivé et stylisé */}
            <button 
              onClick={toggleSidebar}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-900/30 text-indigo-300 hover:text-white hover:bg-indigo-800/50 transition-colors duration-300"
              aria-label="Toggle Sidebar"
            >
              <svg 
                className="w-5 h-5 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                style={{ transform: sidebarCollapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M5 12h15" : "M13 12h8"} />
              </svg>
            </button>
          </div>
          
          {/* Navigation links modernisés et animés */}
          <nav className="flex-1 py-8 overflow-y-auto scrollbar-none">
            <div className={`px-3 space-y-2 ${sidebarCollapsed ? 'items-center' : ''}`}>
              {navLinks.map((link, index) => {
                const isActive = router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/');
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className={`sidebar-link group relative flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-[1.02]
                      ${isActive 
                        ? 'text-white' 
                        : 'text-indigo-100/70 hover:text-white'}`}
                    style={{
                      background: isActive ? link.gradient : 'rgba(13, 18, 36, 0.6)',
                      boxShadow: isActive ? '0 0 15px rgba(46, 86, 255, 0.3)' : 'none',
                    }}
                  >
                    {/* Effet de brillance animé sur hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer pointer-events-none"></div>
                    
                    {/* Icône avec animation */}
                    <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'} transition-all duration-300 hover:animate-pulse`}>
                      {link.icon}
                    </div>
                    
                    {/* Texte qui s'affiche/disparait selon l'état de la sidebar */}
                    {!sidebarCollapsed && (
                      <span className="ml-3 transition-all duration-500">{link.name}</span>
                    )}
                    
                    {/* Point lumineux indicateur si actif */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    )}
                    
                    {/* Tooltip au survol quand sidebar réduite */}
                    {sidebarCollapsed && (
                      <div className="sidebar-tooltip absolute left-full ml-4 px-3 py-2 min-w-max rounded-lg opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 pointer-events-none transition-all duration-300 text-white z-50"
                        style={{
                          background: link.gradient,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        {link.name}
                        {/* Flèche de tooltip */}
                        <div className="absolute -left-1 top-1/2 -mt-1 w-2 h-2 rotate-45" style={{ background: isActive ? COLORS.indigo.main : COLORS.indigo.dark }}></div>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
          
          {/* User profile section */}
          <div className={`p-4 border-t border-gray-800/30 dark:border-gray-800/30 light:border-gray-200/30 flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="relative group flex items-center focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {!sidebarCollapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
              )}
              
              {sidebarCollapsed && (
                <span className="absolute left-full ml-6 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap min:w-max">
                  John Doe<br/>john@example.com
                </span>
              )}
            </button>
            
            {!sidebarCollapsed && (
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </aside>
        
        {/* Menu user dropdown */}
        <Transition
          show={isUserMenuOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className={`fixed bottom-4 ${sidebarCollapsed ? 'left-16' : 'left-64'} z-50 mt-2 w-56 rounded-xl overflow-hidden shadow-lg py-1
            bg-gray-800 border border-gray-700
            dark:bg-gray-800 dark:border-gray-700
            light:bg-white light:border-gray-200`}
          >
            <div className="border-b border-gray-700 dark:border-gray-700 light:border-gray-200 pb-2 pt-2 px-4 mb-1">
              <p className="text-sm font-medium text-white dark:text-white light:text-gray-900">Mon compte Bitax</p>
              <p className="text-xs text-gray-400">john.doe@example.com</p>
            </div>
            <Link 
              href="/profile" 
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mon profil
            </Link>
            <Link 
              href="/settings" 
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white light:text-gray-700 light:hover:bg-gray-100 light:hover:text-gray-900 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Paramètres
            </Link>
            <div className="border-t border-gray-700 dark:border-gray-700 light:border-gray-200 my-1"></div>
            <Link 
              href="/logout" 
              className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 dark:text-red-400 dark:hover:bg-gray-700 dark:hover:text-red-300 light:text-red-600 light:hover:bg-gray-100 light:hover:text-red-700 flex items-center"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </Link>
          </div>
        </Transition>
        
        {/* Mobile menu button */}
        <div className="fixed top-4 right-4 md:hidden z-50">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-900/90 text-gray-400 hover:text-white focus:outline-none"
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        
        {/* Mobile menu overlay */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        </Transition>
        
        {/* Mobile sidebar */}
        <Transition
          show={isMobileMenuOpen}
          enter="transition duration-300 ease-out transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-200 ease-in transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 overflow-hidden md:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <BitaxLogo collapsed={false} />
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="px-2 pt-5 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    router.pathname === link.href || (link.href === '/dashboard' && router.pathname === '/') 
                      ? 'bg-primary-900/50 text-white border-l-2 border-primary-500' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className={`${router.pathname === link.href ? 'text-primary-400' : 'text-gray-400'}`}>
                    {link.icon}
                  </div>
                  <span className="ml-3">{link.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">John Doe</p>
                  <p className="text-xs text-gray-400">john@example.com</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="ml-auto p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </aside>
        </Transition>
        
        {/* Main content */}
        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
          {/* Background effects améliorés */}
          <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
            {/* Gradient orbs animés */}
            <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-to-b from-primary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-t from-secondary-900/10 via-transparent to-transparent animate-float opacity-20 blur-3xl"></div>
            
            {/* Grille stylisée */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-[0.02]"></div>
            
            {/* Particules/étoiles - remplacé par le canvas JS */}
            <div id="starry-background-container" className="absolute inset-0"></div>
            
            {/* Vagues subtiles animées en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path 
                  d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                  className="fill-primary-800/10 dark:fill-primary-400/5 light:fill-primary-900/5"
                ></path>
                <path 
                  d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                  className="fill-secondary-800/10 dark:fill-secondary-400/5 light:fill-secondary-900/5" 
                  style={{ animationDelay: '-2s' }}
                ></path>
              </svg>
            </div>
          </div>
          
          {/* Contenu principal avec animation d'entrée */}
          <main className="flex-grow py-6 px-4 sm:px-6 md:px-8 transition-all duration-300 relative">
            <div className="max-w-7xl mx-auto relative z-10">
              {isLoaded ? (
                <div className="transition-all duration-700 ease-out transform translate-y-0 opacity-100">
                  <Component {...pageProps} />
                </div>
              ) : (
                <div className="opacity-0 translate-y-10">
                  <Component {...pageProps} />
                </div>
              )}
            </div>
          </main>
          
          {/* Footer compact modernisé */}
          <footer className="relative z-10 backdrop-blur-xl bg-bg-darker/60 border-t border-indigo-900/20">
            <div className="max-w-7xl mx-auto py-4 px-6 flex flex-wrap justify-between items-center">
              {/* Logo et copyright minimaliste */}
              <div className="flex items-center space-x-3">
                <BitaxLogo collapsed={true} />
                <p className="text-xs text-indigo-300/70">
                  &copy; {new Date().getFullYear()} Bitax
                </p>
              </div>
              
              {/* Links minimalistes */}
              <div className="flex items-center mt-4 md:mt-0">
                <div className="flex space-x-4 mr-6">
                  {/* Social media icons avec effets hover */}
                  {[
                    { 
                      name: 'Twitter', 
                      icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>,
                      gradient: `linear-gradient(135deg, ${COLORS.cyan.main}, ${COLORS.indigo.main})`
                    },
                    { 
                      name: 'Discord', 
                      icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>,
                      gradient: `linear-gradient(135deg, ${COLORS.indigo.main}, ${COLORS.purple.main})`
                    },
                  ].map((item, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="social-btn relative w-8 h-8 flex items-center justify-center rounded-full bg-indigo-950/30 text-indigo-300 hover:text-white transition-all duration-300 hover:scale-110 group"
                      aria-label={item.name}
                      style={{
                        boxShadow: '0 0 10px rgba(116, 116, 255, 0.1)'
                      }}
                    >
                      {/* Overlay de brillance en hover */}
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ 
                          background: item.gradient,
                          boxShadow: '0 0 15px rgba(116, 116, 255, 0.4)'
                        }}
                      ></div>
                      <div className="relative z-10">{item.icon}</div>
                    </a>
                  ))}
                </div>
                
                {/* Lien légaux simples */}
                <div className="flex space-x-4 text-xs">
                  {[
                    { name: "CGU", href: "#" },
                    { name: "Confidentialité", href: "#" },
                  ].map((item, index) => (
                    <a 
                      key={index} 
                      href={item.href}
                      className="text-indigo-300/70 hover:text-white transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  {/* Toggle thème compact */}
                  <button
                    onClick={toggleTheme}
                    className="text-indigo-300/70 hover:text-white transition-colors duration-300 flex items-center"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 2V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 20V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4.93 4.93L6.34 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.66 17.66L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.34 17.66L4.93 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.07 4.93L17.66 6.34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </AuthProvider>
  );
}