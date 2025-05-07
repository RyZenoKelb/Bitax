// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import CustomStyles from '@/components/CustomStyles';
import AuthProvider from '@/components/AuthProvider';

// Ajout d'un type pour les pages avec un layout personnalisé
type NextPageWithLayout = {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// Logos SVG des cryptomonnaies
const CryptoLogos = {
  BTC: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#F7931A"/>
      <path d="M16.053 10.568C16.207 9.12 15.095 8.383 13.599 7.908L14.022 6.208L13.028 5.958L12.618 7.606C12.349 7.539 12.07 7.477 11.794 7.416L12.209 5.75L11.215 5.5L10.792 7.198C10.569 7.149 10.35 7.1 10.138 7.049L10.14 7.041L8.753 6.7L8.481 7.764C8.481 7.764 9.216 7.931 9.199 7.945C9.639 8.056 9.719 8.356 9.706 8.595L9.221 10.543C9.252 10.551 9.293 10.563 9.338 10.581L9.219 10.551L8.558 13.198C8.504 13.343 8.361 13.555 8.054 13.478C8.066 13.496 7.336 13.298 7.336 13.298L6.833 14.445L8.146 14.764C8.396 14.826 8.64 14.891 8.878 14.952L8.45 16.678L9.443 16.928L9.866 15.227C10.145 15.302 10.416 15.369 10.68 15.433L10.258 17.122L11.252 17.372L11.68 15.65C13.674 16.009 15.146 15.869 15.77 14.067C16.268 12.626 15.701 11.788 14.678 11.241C15.418 11.067 15.973 10.618 16.053 10.568ZM13.857 13.347C13.5 14.788 11.104 13.954 10.374 13.767L10.945 11.483C11.675 11.671 14.23 11.842 13.857 13.347ZM14.215 9.126C13.888 10.435 11.869 9.723 11.262 9.568L11.78 7.506C12.387 7.661 14.555 7.754 14.215 9.126Z" fill="white"/>
    </svg>
  ),
  ETH: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#627EEA"/>
      <path d="M12.3735 3V9.6525L17.9957 12.165L12.3735 3Z" fill="white" fillOpacity="0.602"/>
      <path d="M12.3735 3L6.75 12.165L12.3735 9.6525V3Z" fill="white"/>
      <path d="M12.3735 16.476V20.9963L18 13.212L12.3735 16.476Z" fill="white" fillOpacity="0.602"/>
      <path d="M12.3735 20.9963V16.476L6.75 13.212L12.3735 20.9963Z" fill="white"/>
      <path d="M12.3735 15.4298L17.9957 12.165L12.3735 9.6543V15.4298Z" fill="white" fillOpacity="0.2"/>
      <path d="M6.75 12.165L12.3735 15.4298V9.6543L6.75 12.165Z" fill="white" fillOpacity="0.602"/>
    </svg>
  ),
  SOL: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#000000"/>
      <path d="M6.998 14.7507C7.1233 14.6254 7.2983 14.552 7.4827 14.552H18.8648C19.1522 14.552 19.2961 14.9027 19.0869 15.1119L17.0024 17.1965C16.8771 17.3217 16.7021 17.3951 16.5177 17.3951H5.1356C4.84818 17.3951 4.70432 17.0444 4.91348 16.8352L6.998 14.7507Z" fill="url(#paint0_linear_1_11)"/>
      <path d="M6.998 6.80345C7.1296 6.6782 7.3046 6.60482 7.4889 6.60482H18.871C19.1585 6.60482 19.3023 6.9555 19.0932 7.16466L17.0087 9.24917C16.8834 9.37443 16.7084 9.44781 16.524 9.44781H5.14186C4.85444 9.44781 4.71058 9.09713 4.91974 8.88796L6.998 6.80345Z" fill="url(#paint1_linear_1_11)"/>
      <path d="M17.0024 10.7615C16.8771 10.6363 16.7021 10.5629 16.5177 10.5629H5.1356C4.84818 10.5629 4.70432 10.9136 4.91348 11.1228L6.998 13.2073C7.1233 13.3325 7.2983 13.4059 7.4827 13.4059H18.8648C19.1522 13.4059 19.2961 13.0553 19.0869 12.8461L17.0024 10.7615Z" fill="url(#paint2_linear_1_11)"/>
      <defs>
        <linearGradient id="paint0_linear_1_11" x1="17.1554" y1="4.15699" x2="8.79693" y2="19.5953" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1_11" x1="13.7742" y1="2.3999" x2="5.41569" y2="17.8382" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
        <linearGradient id="paint2_linear_1_11" x1="15.4548" y1="3.27295" x2="7.09635" y2="18.7113" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3"/>
          <stop offset="1" stopColor="#DC1FFF"/>
        </linearGradient>
      </defs>
    </svg>
  ),
  MATIC: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#8247E5"/>
      <path d="M15.9 9.7L12.4 7.7C12.2 7.6 11.9 7.6 11.6 7.7L8.1 9.7C7.9 9.8 7.7 10.1 7.7 10.3V14.3C7.7 14.6 7.9 14.8 8.1 14.9L11.6 16.9C11.8 17 12.1 17 12.3 16.9L15.8 14.9C16 14.8 16.2 14.5 16.2 14.3V10.3C16.3 10.1 16.1 9.8 15.9 9.7ZM12 11.8L10.8 12.4L9.7 11.8L12 10.4L14.3 11.8L13.2 12.4L12 11.8ZM11.8 15.3L9.7 14V12.5L11.8 13.8V15.3ZM13.7 13.8L12.2 12.9L13.4 12.3L14.8 13.1V14.1L13.7 14.7V13.8Z" fill="white"/>
    </svg>
  ),
  ARB: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#2D374B"/>
      <path d="M12.2479 16.2001L9.40869 11.4521L12.0128 7.0123H11.9871L9.38282 11.4521L6.54358 16.2001H7.99127L9.40869 13.8127L10.8001 16.2001H12.2479Z" fill="#28A0F0"/>
      <path d="M10.8004 16.2001L9.40936 13.8127L8.00167 16.2001H6.55396L9.39317 11.4521L8.00167 9.10273H9.44939L14.4976 16.2001H13.0238L10.8004 16.2001Z" fill="#28A0F0"/>
      <path d="M14.622 16.2001L9.45022 9.10273H11.7512L16.921 16.2001H14.622Z" fill="#FFFFFF"/>
    </svg>
  ),
  OP: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FF0420"/>
      <path d="M7.5 7.5V16.5H16.5V7.5H7.5ZM13.5675 14.0175H10.4325V9.9825H13.5675V14.0175Z" fill="white"/>
    </svg>
  )
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: {price: number, change24h: number}}>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Récupérer les prix des cryptos depuis CoinGecko
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polygon,arbitrum,optimism&vs_currencies=eur&include_24h_change=true');
      const data = await response.json();
      
      const formattedData: {[key: string]: {price: number, change24h: number}} = {
        BTC: { 
          price: data.bitcoin.eur, 
          change24h: data.bitcoin.eur_24h_change 
        },
        ETH: { 
          price: data.ethereum.eur, 
          change24h: data.ethereum.eur_24h_change 
        },
        SOL: { 
          price: data.solana.eur, 
          change24h: data.solana.eur_24h_change 
        },
        ARB: { 
          price: data.arbitrum.eur, 
          change24h: data.arbitrum.eur_24h_change 
        },
        OP: { 
          price: data.optimism.eur, 
          change24h: data.optimism.eur_24h_change 
        }
      };
      
      setCryptoPrices(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des prix crypto:', error);
      // Valeurs par défaut en cas d'erreur
      setCryptoPrices({
        BTC: { price: 61243.75, change24h: 1.2 },
        ETH: { price: 3829.16, change24h: -0.5 },
        SOL: { price: 154.50, change24h: 4.7 },
        MATIC: { price: 0.65, change24h: 2.3 },
        ARB: { price: 1.28, change24h: 5.1 },
        OP: { price: 2.45, change24h: -1.8 }
      });
    }
  };

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
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Récupérer les prix crypto
    fetchCryptoPrices();
    
    // Actualiser les prix toutes les 60 secondes
    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

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

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    setSidebarOpen(false);
  }, [router.pathname]);

  // Logo Bitax amélioré
  const BitaxLogo = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
    const scale = size === 'small' ? 0.8 : size === 'large' ? 1.2 : 1;
    
    return (
      <div className={`relative ${size === 'small' ? 'w-10 h-10' : size === 'large' ? 'w-14 h-14' : 'w-12 h-12'}`}>
        {/* Logo background avec animation de rotation */}
        <motion.div 
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600"
          initial={{ rotate: 0, scale: 1 }}
          animate={{ 
            rotate: 360,
            scale: [1, 1.03, 1], 
            background: [
              "linear-gradient(135deg, #4f46e5, #8b5cf6, #c026d3)",
              "linear-gradient(225deg, #4f46e5, #8b5cf6, #c026d3)",
              "linear-gradient(315deg, #4f46e5, #8b5cf6, #c026d3)"
            ]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" }, 
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            background: { duration: 5, repeat: Infinity }
          }}
        />
        
        {/* Effet de lumière qui tourne */}
        <motion.div 
          className="absolute inset-0 rounded-xl opacity-60 blur-sm"
          style={{ background: "linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.5) 45%, transparent 50%)" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Overlay légèrement transparent */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-600/90 via-violet-600/90 to-purple-600/90 backdrop-blur-sm" />
        
        {/* Lettre B avec effet 3D */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative transform-gpu">
            {/* Ombre portée */}
            <div className="absolute text-3xl font-black text-white/10 blur-sm transform translate-x-0.5 translate-y-0.5 scale-110">
              B
            </div>
            {/* Lettre B principale */}
            <motion.span 
              className="relative text-3xl font-black text-white"
              animate={{ 
                textShadow: [
                  "0 0 5px rgba(255,255,255,0.5)",
                  "0 0 15px rgba(255,255,255,0.5)",
                  "0 0 5px rgba(255,255,255,0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              B
            </motion.span>
          </div>
        </div>
        
        {/* Particules brillantes */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-70"
              initial={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                scale: 0
              }}
              animate={{ 
                x: Math.random() * 100 - 50, 
                y: Math.random() * 100 - 50,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  // Format numérique pour les prix et pourcentages
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };
  
  const formatPercentage = (percentage: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'always'
    }).format(percentage / 100);
  };

  // Vérifier si nous sommes sur une page avec un layout personnalisé (comme dashboard)
  const hasCustomLayout = Component.getLayout || router.pathname === '/dashboard';

  // Si la page a un layout personnalisé, utiliser ce layout
  if (hasCustomLayout && Component.getLayout) {
    return (
      <AuthProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </AuthProvider>
    );
  }

  // Si c'est une page dashboard mais sans custom layout, renvoyer directement
  if (router.pathname === '/dashboard') {
    return (
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    );
  }

  // Navigation links avec icônes améliorées
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { name: 'Guide', href: '/guide', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { name: 'Tarifs', href: '/pricing', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { name: 'Support', href: '/support', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    )}
  ];

  // Appliquer le layout commun à toutes les autres pages
  return (
    <AuthProvider>
      <div className="h-screen flex overflow-hidden">
        <Head>
          <title>Bitax | Fiscalité crypto redéfinie</title>
          <meta name="description" content="Bitax - Révolutionnez votre fiscalité crypto avec notre plateforme IA de pointe. Analyses en temps réel, rapports automatisés." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        
        {/* Styles globaux */}
        <style jsx global>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradientFlow 8s ease infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          .pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
          
          @keyframes grid-move {
            0% { background-position: 0px 0px; }
            100% { background-position: 40px 40px; }
          }
          
          .animated-grid {
            background-size: 40px 40px;
            background-image: 
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            animation: grid-move 15s linear infinite;
          }
          
          .animated-particles {
            position: relative;
          }
          
          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 4px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(156, 163, 175, 0.5);
            border-radius: 10px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: rgba(156, 163, 175, 0.7);
          }
        `}</style>
        
        {/* Inclusion du composant CustomStyles */}
        <CustomStyles />
        
        {/* Overlay pour la sidebar mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div 
              className="fixed inset-0 z-20 bg-black/50 lg:hidden backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
        
        {/* Sidebar moderne avec design amélioré */}
        <motion.div 
          className={`fixed inset-y-0 left-0 z-30 ${sidebarCollapsed ? 'w-20' : 'w-72'} transform transition-all duration-300 ease-in-out lg:static lg:translate-x-0 backdrop-blur-xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          initial={{ x: -20, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background animé de la sidebar */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-indigo-950/95 to-gray-900/95 animated-grid overflow-hidden">
            {/* Particules/étoiles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3 + 0.1
                }}
                animate={{
                  opacity: [
                    Math.random() * 0.2 + 0.1,
                    Math.random() * 0.5 + 0.3,
                    Math.random() * 0.2 + 0.1
                  ]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Orbes lumineux et flous */}
            <div className="absolute top-1/4 right-1/3 w-40 h-40 rounded-full bg-indigo-600/20 blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/3 left-1/4 w-60 h-60 rounded-full bg-purple-600/10 blur-3xl animate-pulse-slow"></div>
          </div>
          
          {/* Contenu de la sidebar avec effet de verre */}
          <div className="relative h-full z-10 flex flex-col">
            {/* Logo et branding */}
            <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
              <Link href="/" className="flex items-center space-x-3">
                <BitaxLogo />
                {!sidebarCollapsed && (
                  <motion.div 
                    className="flex flex-col"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <span className="text-xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 tracking-tight">
                      BITAX
                    </span>
                    <span className="text-xs text-gray-400 -mt-1 font-medium tracking-wide">
                      FISCALITÉ CRYPTO
                    </span>
                  </motion.div>
                )}
              </Link>
              
              {/* Bouton de fermeture sur mobile */}
              <div className="flex items-center space-x-2">
                <button 
                  className="hidden p-2 text-gray-400 hover:text-white lg:block hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7M19 19l-7-7 7-7"} />
                  </svg>
                </button>
                <button 
                  className="p-2 text-gray-400 hover:text-white lg:hidden hover:bg-white/5 rounded-lg"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Navigation links avec animation */}
            <div className={`px-3 py-6 flex-1 overflow-y-auto ${sidebarCollapsed ? 'overflow-x-hidden' : ''}`}>
              <div className="space-y-1 mb-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link 
                      href={link.href}
                      className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        router.pathname === link.href 
                          ? "bg-gradient-to-r from-indigo-600/40 to-purple-600/40 text-white border-l-2 border-indigo-500"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className={`${
                        router.pathname === link.href 
                          ? "text-white" 
                          : "text-gray-400 group-hover:text-gray-300"
                      }`}>
                        {link.icon}
                      </span>
                      {!sidebarCollapsed && <span className="ml-3">{link.name}</span>}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Crypto Prices Widget amélioré */}
              {!sidebarCollapsed && (
                <motion.div 
                  className="mb-6 rounded-xl p-4 bg-white/5 border border-white/10 backdrop-blur-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Cours Crypto
                  </h3>
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-2">
                    {Object.entries(cryptoPrices).map(([symbol, data], index) => (
                      <motion.div 
                        key={symbol}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors border border-white/5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-black/20 backdrop-blur-sm">
                            {CryptoLogos[symbol as keyof typeof CryptoLogos]}
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">{symbol}</div>
                            <div className="text-sm font-medium text-white">{formatPrice(data.price)}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-md ${data.change24h >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                          {formatPercentage(data.change24h)}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Raccourcis ou widgets supplémentaires */}
              {!sidebarCollapsed && (
                <div className="space-y-3">
                  <motion.div
                    className="p-4 rounded-xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border border-indigo-500/20 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <h3 className="text-sm font-medium text-white mb-2">Premium</h3>
                    <p className="text-xs text-gray-300 mb-3">
                      Débloquez l'accès à toutes les fonctionnalités avancées.
                    </p>
                    <button className="w-full px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Débloquer Premium
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Footer de la sidebar */}
            <div className="p-4 border-t border-white/5">
              <div className={`flex ${sidebarCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                
                {!sidebarCollapsed && (
                  <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Header pour mobile */}
          <motion.div 
            className="relative z-10 flex items-center justify-between h-16 bg-gray-900/95 border-b border-gray-800/50 px-4 lg:hidden backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="p-2 text-gray-400 hover:text-white focus:outline-none rounded-lg hover:bg-white/5"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center">
              <BitaxLogo size="small" />
            </Link>
            
            {/* Profil user sur mobile */}
            <button 
              className="p-2 text-gray-400 hover:text-white focus:outline-none rounded-lg hover:bg-white/5"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Menu utilisateur mobile */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  className="absolute right-0 top-16 w-48 py-2 mt-2 bg-gray-900/95 rounded-xl shadow-xl border border-gray-800/50 backdrop-blur-xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Paramètres
                  </Link>
                  <div className="border-t border-gray-800/50 my-1"></div>
                  <Link 
                    href="/logout" 
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Déconnexion
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Main content area avec background amélioré */}
          <motion.main 
            className="relative flex-1 overflow-y-auto focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background avec effets visuels avancés */}
            <div className="absolute inset-0 animated-grid">
              {/* Dégradé de fond */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-indigo-950/90 to-gray-900"></div>
              
              {/* Effets de dégradé */}
              <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent opacity-30 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-blue-900/20 via-purple-900/10 to-transparent opacity-30 blur-3xl"></div>
              
              {/* Orbes lumineux */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 pulse-glow blur-3xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 pulse-glow blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-blue-500/10 pulse-glow blur-3xl"></div>
            </div>
            
            {/* Contenu principal */}
            <div className="py-6 px-4 sm:px-6 lg:px-8 relative z-10">
              <Component {...pageProps} />
            </div>
          </motion.main>
        </div>
      </div>
    </AuthProvider>
  );
}