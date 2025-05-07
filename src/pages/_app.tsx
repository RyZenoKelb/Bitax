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

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<{[key: string]: {price: number, change24h: number, logo: string}}>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Logo Bitax amélioré avec animation
  const BitaxLogo = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
    const logoSize = size === 'small' ? '40px' : size === 'large' ? '60px' : '50px';
    return (
      <motion.div 
        className="flex items-center" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mr-3" style={{ width: logoSize, height: logoSize }}>
          <svg viewBox="0 0 100 100" width={logoSize} height={logoSize}>
            {/* Background hex */}
            <motion.polygon 
              points="50,5 95,25 95,75 50,95 5,75 5,25" 
              fill="url(#bitaxGradient)" 
              strokeWidth="2"
              stroke="rgba(255,255,255,0.1)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Ring animation */}
            <motion.circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="2"
              strokeDasharray="251"
              strokeDashoffset="251"
              animate={{ 
                strokeDashoffset: 0,
                rotate: [0, 360],
              }}
              transition={{ 
                strokeDashoffset: { duration: 2, ease: "easeInOut" },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            />
            
            {/* Dots for tech feeling */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.circle
                key={i}
                cx={50 + 45 * Math.cos(angle * Math.PI / 180)}
                cy={50 + 45 * Math.sin(angle * Math.PI / 180)}
                r="2"
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: i * 0.2
                }}
              />
            ))}
            
            {/* Letter B */}
            <motion.path 
              d="M35,30 h15 a10,10 0 0 1 0,20 h-15 v20 h15 a10,10 0 0 0 10,-10 v-5 a10,10 0 0 0 -10,-10 a10,10 0 0 0 10,-10 v-5 a10,10 0 0 0 -10,-10 h-15 v10 z" 
              fill="white"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="bitaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4338ca" />
                <stop offset="50%" stopColor="#3b0764" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#d946ef" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl -z-10"></div>
        </div>
        
        <div className="flex flex-col">
          <motion.span 
            className={`${size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl'} font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 tracking-tight`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            BITAX
          </motion.span>
          <motion.span 
            className={`${size === 'small' ? 'text-[0.6rem]' : size === 'large' ? 'text-sm' : 'text-xs'} text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            FISCALITÉ CRYPTO
          </motion.span>
        </div>
      </motion.div>
    );
  };

  // Récupérer les prix des cryptos depuis CoinGecko avec leurs logos
  const fetchCryptoPrices = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polygon,arbitrum,optimism,base&vs_currencies=eur&include_24h_change=true');
      const data = await response.json();
      
      // Logos SVG pour chaque crypto
      const cryptoLogos = {
        bitcoin: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#F7931A"/>
          <path d="M44.0726 27.4009C44.6651 23.1106 41.3947 21.0865 36.8853 19.753L38.1304 14.2631L34.8334 13.4892L33.6235 18.8261C32.7848 18.6268 31.9204 18.4382 31.0636 18.2507L32.2847 12.8666L29.9904 12.0928L28.744 17.5827C28.0443 17.4303 27.3599 17.2792 26.6967 17.1185L26.7054 17.0823L22.3681 15.9963L21.5536 19.5358C21.5536 19.5358 23.9679 20.1006 23.9213 20.1369C25.2876 20.4602 25.5537 21.3722 25.51 22.0976L24.0873 28.3132C24.1952 28.3407 24.3338 28.3796 24.4811 28.4409C24.358 28.4122 24.2284 28.3809 24.0962 28.3496L22.0732 37.1573C21.8957 37.5855 21.4488 38.2206 20.4711 37.9978C20.5002 38.0499 18.1033 37.3965 18.1033 37.3965L16.5732 41.1933L20.6699 42.2236C21.446 42.4085 22.2054 42.6033 22.9473 42.7849L21.6859 48.3431L24.9816 49.1169L26.2279 43.627C27.1032 43.848 27.9517 44.0503 28.7823 44.2389L27.5423 49.6942L30.8392 50.468L32.1007 44.9186C37.9315 45.9101 42.3074 45.4756 44.0458 40.1592C45.4345 35.9021 43.8331 33.5221 40.6776 31.9694C42.8849 31.4737 44.5386 30.0747 44.0726 27.4009ZM36.1792 37.8262C35.1837 42.084 27.5015 39.6523 25.2478 39.0744L26.9336 31.7642C29.1872 32.3434 37.2177 33.385 36.1792 37.8262ZM37.1745 27.3281C36.263 31.2123 29.8127 29.1325 27.9261 28.6466L29.461 21.9841C31.3476 22.47 38.1231 23.2826 37.1745 27.3281Z" fill="white"/>
        </svg>`,
        ethereum: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#627EEA"/>
          <path d="M32.498 12V25.87L44.495 31.1675L32.498 12Z" fill="white" fill-opacity="0.602"/>
          <path d="M32.498 12L20.5 31.1675L32.498 25.87V12Z" fill="white"/>
          <path d="M32.498 41.4491V51.9964L44.5032 33.2051L32.498 41.4491Z" fill="white" fill-opacity="0.602"/>
          <path d="M32.498 51.9964V41.4491L20.5 33.2051L32.498 51.9964Z" fill="white"/>
          <path d="M32.498 39.1114L44.495 30.8663L32.498 25.8711V39.1114Z" fill="white" fill-opacity="0.2"/>
          <path d="M20.5 30.8663L32.498 39.1114V25.8711L20.5 30.8663Z" fill="white" fill-opacity="0.602"/>
        </svg>`,
        solana: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#000000"/>
          <path d="M18.5825 40.0221C18.8344 39.7702 19.1875 39.6211 19.5659 39.6211H49.2154C49.8357 39.6211 50.1461 40.3926 49.7174 40.8213L45.4178 45.1209C45.1659 45.3728 44.8128 45.5219 44.4343 45.5219H14.7849C14.1646 45.5219 13.8542 44.7504 14.2829 44.3217L18.5825 40.0221Z" fill="url(#paint0_linear_solana)"/>
          <path d="M18.5825 19.4013C18.8596 19.1494 19.2127 19.0003 19.5659 19.0003H49.2154C49.8357 19.0003 50.1461 19.7718 49.7174 20.2005L45.4178 24.5001C45.1659 24.752 44.8128 24.9011 44.4343 24.9011H14.7849C14.1646 24.9011 13.8542 24.1296 14.2829 23.7009L18.5825 19.4013Z" fill="url(#paint1_linear_solana)"/>
          <path d="M45.4178 29.6835C45.1659 29.4316 44.8128 29.2825 44.4343 29.2825H14.7849C14.1646 29.2825 13.8542 30.054 14.2829 30.4828L18.5825 34.7823C18.8344 35.0342 19.1875 35.1833 19.5659 35.1833H49.2154C49.8357 35.1833 50.1461 34.4118 49.7174 33.9831L45.4178 29.6835Z" fill="url(#paint2_linear_solana)"/>
          <defs>
            <linearGradient id="paint0_linear_solana" x1="46.2978" y1="14.1326" x2="24.0261" y2="53.4389" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00FFA3"/>
              <stop offset="1" stop-color="#DC1FFF"/>
            </linearGradient>
            <linearGradient id="paint1_linear_solana" x1="37.0777" y1="9.99206" x2="14.806" y2="49.2984" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00FFA3"/>
              <stop offset="1" stop-color="#DC1FFF"/>
            </linearGradient>
            <linearGradient id="paint2_linear_solana" x1="41.6539" y1="12.0439" x2="19.3821" y2="51.3503" gradientUnits="userSpaceOnUse">
              <stop stop-color="#00FFA3"/>
              <stop offset="1" stop-color="#DC1FFF"/>
            </linearGradient>
          </defs>
        </svg>`,
        polygon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#8247E5"/>
          <path d="M42.2661 24.3989C41.5971 23.9999 40.7281 23.9999 39.9601 24.3989L34.1821 27.5969L30.2927 29.6939L24.5147 32.8919C23.8457 33.2909 22.9767 33.2909 22.2087 32.8919L17.7501 30.2939C17.0811 29.8949 16.6121 29.1959 16.6121 28.3979V23.2999C16.6121 22.6009 17.0811 21.8029 17.7501 21.4039L22.1097 18.8059C22.7787 18.4069 23.6477 18.4069 24.4157 18.8059L28.7753 21.4039C29.4443 21.8029 29.9133 22.5019 29.9133 23.2999V26.3989L33.8027 24.2029V21.1039C33.8027 20.4049 33.3337 19.6069 32.6647 19.2079L24.5147 14.7089C23.8457 14.3099 22.9767 14.3099 22.2087 14.7089L13.9597 19.2079C13.2907 19.6069 12.8217 20.3059 12.8217 21.1039V30.5949C12.8217 31.2939 13.2907 32.0919 13.9597 32.4909L22.2087 36.9899C22.8777 37.3889 23.7467 37.3889 24.5147 36.9899L30.2927 33.8909L34.1821 31.6949L39.9601 28.5959C40.6291 28.1969 41.4981 28.1969 42.2661 28.5959L46.6257 31.1939C47.2947 31.5929 47.7637 32.2919 47.7637 33.0899V38.1879C47.7637 38.8869 47.2947 39.6849 46.6257 40.0839L42.2661 42.7819C41.5971 43.1809 40.7281 43.1809 39.9601 42.7819L35.6005 40.1839C34.9315 39.7849 34.4625 39.0859 34.4625 38.2879V35.1889L30.5731 37.3849V40.4839C30.5731 41.1829 31.0421 41.9809 31.7111 42.3799L39.9601 46.8789C40.6291 47.2779 41.4981 47.2779 42.2661 46.8789L50.5151 42.3799C51.1841 41.9809 51.6531 41.2819 51.6531 40.4839V30.9929C51.6531 30.2939 51.1841 29.4959 50.5151 29.0969L42.2661 24.3989Z" fill="white"/>
        </svg>`,
        arbitrum: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#2D374B"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M32.2106 12.7083L45.6468 35.9736L45.6915 49.3264L32.2106 12.7083ZM33.8392 39.8594L24.0208 22.3125L18.3085 36.0181L33.8392 39.8594ZM42.5343 41.9583L33.2123 41.0278L20.8509 51.2917H42.5343V41.9583Z" fill="#28A0F0"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.3085 36.0181L33.8392 39.8594L33.2123 41.0278L20.8509 51.2917L18.3085 36.0181Z" fill="#FFFFFF"/>
        </svg>`,
        optimism: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#FF0420"/>
          <path d="M20.0085 15.5146L31.9915 15.5146C39.721 15.5146 45.6169 21.4104 45.6169 29.1399C45.6169 36.8695 39.721 42.7653 31.9915 42.7653L20.0085 42.7653C18.3476 42.7653 17 41.4177 17 39.7568L17 18.5232C17 16.8622 18.3476 15.5146 20.0085 15.5146Z" fill="white"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M27.4168 23.979C28.5257 23.979 29.5222 24.2848 30.4064 24.8964C31.2905 25.508 31.982 26.3616 32.4808 27.4572C32.9796 28.5527 33.229 29.8115 33.229 31.2336C33.229 32.6557 32.9796 33.9218 32.4808 35.0319C31.982 36.1421 31.2905 37.0029 30.4064 37.6146C29.5222 38.2262 28.5257 38.532 27.4168 38.532C26.3078 38.532 25.304 38.2262 24.4053 37.6146C23.5065 37.0029 22.8078 36.1421 22.309 35.0319C21.8102 33.9218 21.5608 32.6557 21.5608 31.2336C21.5608 29.8115 21.8102 28.5527 22.309 27.4572C22.8078 26.3616 23.5065 25.508 24.4053 24.8964C25.304 24.2848 26.3078 23.979 27.4168 23.979ZM29.1951 35.1963C29.7358 34.5114 30.0061 33.3972 30.0061 31.8536C30.0061 30.31 29.7358 29.2031 29.1951 28.5327C28.6544 27.8623 28.0354 27.5272 27.3383 27.5272C26.6411 27.5272 26.0148 27.8623 25.4596 28.5327C24.9043 29.2031 24.6267 30.31 24.6267 31.8536C24.6267 33.3972 24.9043 34.5114 25.4596 35.1963C26.0148 35.8811 26.6411 36.2235 27.3383 36.2235C28.0354 36.2235 28.6544 35.8811 29.1951 35.1963ZM37.3278 36.7693C37.8539 36.2235 38.117 35.5531 38.117 34.7581L38.117 34.5277L36.2539 34.5277C36.2539 34.9447 36.1686 35.2616 35.9979 35.4783C35.8273 35.695 35.5494 35.8034 35.1645 35.8034C34.7504 35.8034 34.441 35.6149 34.2364 35.2379C34.0317 34.8609 33.9294 34.159 33.9294 33.1323L33.9294 29.4545L38.117 29.4545L38.117 26.0473L33.9294 26.0473L33.9294 23.0989L30.7065 23.0989L30.7065 26.0473L28.9018 26.0473L28.9018 29.4545L30.7065 29.4545L30.7065 33.6617C30.7065 35.4892 31.0379 36.7947 31.7006 37.578C32.3633 38.3613 33.342 38.753 34.6367 38.753C35.722 38.753 36.6062 38.4252 37.3278 36.7693Z" fill="#FF0420"/>
        </svg>`,
        base: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="32" fill="#0052FF"/>
          <path d="M19.3896 18.57H44.6109C44.8658 18.57 45.0727 18.776 45.0727 19.03V44.9702C45.0727 45.2242 44.8658 45.4302 44.6109 45.4302H19.3896C19.1347 45.4302 18.9277 45.2242 18.9277 44.9702V19.03C18.9277 18.776 19.1347 18.57 19.3896 18.57Z" fill="white"/>
          <path d="M32.0003 42.9297C38.6653 42.9297 44.0723 37.5227 44.0723 30.8577C44.0723 24.1927 38.6653 18.7856 32.0003 18.7856C25.3352 18.7856 19.9282 24.1927 19.9282 30.8577C19.9282 37.5227 25.3352 42.9297 32.0003 42.9297Z" fill="#0052FF"/>
          <path d="M29.9634 35.4111C29.2418 35.4111 28.6397 35.2341 28.1569 34.8802C27.6751 34.5262 27.3347 34.0248 27.137 33.376H26.8096V38.2818H24.0723V23.4336H26.8096V27.997H27.137C27.3199 27.3788 27.6495 26.8899 28.1255 26.5301C28.6026 26.1703 29.2113 25.9904 29.9523 25.9904C31.0304 25.9904 31.8634 26.3666 32.4516 27.1191C33.0407 27.8717 33.3348 28.9763 33.3348 30.433C33.3348 31.9034 33.0325 33.0278 32.429 33.8054C31.8244 34.5759 31.0006 35.4111 29.9634 35.4111ZM29.1145 33.2657C29.6194 33.2657 29.9893 33.0622 30.2251 32.6564C30.4608 32.2494 30.5787 31.6086 30.5787 30.734C30.5787 29.9133 30.4645 29.3105 30.236 28.9255C30.0075 28.5405 29.6342 28.348 29.1145 28.348C28.5511 28.348 28.155 28.5473 27.926 28.9449C27.697 29.3425 27.583 29.9576 27.583 30.7891C27.583 31.6381 27.697 32.2532 27.926 32.6342C28.155 33.0152 28.5511 33.2657 29.1145 33.2657Z" fill="white"/>
          <path d="M39.9275 35.4112C38.5368 35.4112 37.4439 35.0297 36.6476 34.2667C35.8513 33.5037 35.4533 32.4647 35.4533 31.1497C35.4533 29.7891 35.8409 28.7253 36.6172 27.9592C37.3935 27.1931 38.4772 26.8105 39.8678 26.8105C41.1953 26.8105 42.2303 27.1721 42.9739 27.8965C43.7174 28.6209 44.0887 29.6192 44.0887 30.8913V31.9534H38.1336C38.1484 32.5826 38.301 33.0581 38.5912 33.3787C38.8815 33.6994 39.2855 33.8593 39.8035 33.8593C40.2567 33.8593 40.6241 33.7743 40.9054 33.6031C41.1868 33.432 41.3693 33.1899 41.4519 32.8768H43.9839C43.8618 33.7975 43.445 34.5286 42.7336 35.0689C42.0212 35.6092 41.0764 35.4112 39.9275 35.4112ZM39.8412 28.348C39.382 28.348 39.0072 28.4798 38.7157 28.7446C38.4242 29.0093 38.2462 29.4065 38.1824 29.9382H41.3327C41.3178 29.4328 41.1783 29.0467 40.9142 28.7797C40.65 28.5127 40.2911 28.348 39.8412 28.348Z" fill="white"/>
        </svg>`
      };
      
      const formattedData: {[key: string]: {price: number, change24h: number, logo: string}} = {
        BTC: { 
          price: data.bitcoin.eur, 
          change24h: data.bitcoin.eur_24h_change,
          logo: cryptoLogos.bitcoin
        },
        ETH: { 
          price: data.ethereum.eur, 
          change24h: data.ethereum.eur_24h_change,
          logo: cryptoLogos.ethereum 
        },
        SOL: { 
          price: data.solana.eur, 
          change24h: data.solana.eur_24h_change,
          logo: cryptoLogos.solana
        },
        MATIC: { 
          price: data.polygon.eur, 
          change24h: data.polygon.eur_24h_change,
          logo: cryptoLogos.polygon
        },
        ARB: { 
          price: data.arbitrum.eur, 
          change24h: data.arbitrum.eur_24h_change,
          logo: cryptoLogos.arbitrum
        },
        OP: { 
          price: data.optimism.eur, 
          change24h: data.optimism.eur_24h_change,
          logo: cryptoLogos.optimism
        },
        BASE: {
          price: data.base?.eur || 1.28,
          change24h: data.base?.eur_24h_change || 2.1,
          logo: cryptoLogos.base
        }
      };
      
      setCryptoPrices(formattedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des prix crypto:', error);
      // Valeurs par défaut en cas d'erreur
      setCryptoPrices({
        BTC: { price: 61243.75, change24h: 1.2, logo: '' },
        ETH: { price: 3829.16, change24h: -0.5, logo: '' },
        SOL: { price: 154.50, change24h: 4.7, logo: '' },
        MATIC: { price: 0.65, change24h: 2.3, logo: '' },
        ARB: { price: 1.28, change24h: 5.1, logo: '' },
        OP: { price: 2.45, change24h: -1.8, logo: '' },
        BASE: { price: 1.28, change24h: 2.1, logo: '' }
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

  // Navigation links
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )},
    { name: 'Portefeuille', href: '/wallet', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )},
    { name: 'Transactions', href: '/transactions', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )},
    { name: 'Rapports', href: '/reports', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { name: 'Guide', href: '/guide', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { name: 'Tarifs', href: '/pricing', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { name: 'Support', href: '/support', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
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
          
          /* Star particles animation */
          @keyframes twinkle {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.7; }
          }
          
          .star {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            border-radius: 50%;
          }
          
          /* Scrollbar */
          ::-webkit-scrollbar {
            width: 5px;
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
        
        {/* Sidebar moderne avec glass effect */}
        <motion.div 
          className={`fixed inset-y-0 left-0 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'} transform transition-all duration-300 ease-in-out backdrop-blur-xl border-r lg:static lg:translate-x-0 bg-white/5 dark:bg-gray-900/30 border-gray-200/10 dark:border-gray-800/30 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          initial={{ x: -20, opacity: 0.5 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Background with particles effect */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-blue-900/10"></div>
            
            {/* Star particles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="star" 
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Logo et branding */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/10 dark:border-gray-800/20">
            {!sidebarCollapsed ? (
              <Link href="/" className="flex items-center">
                <BitaxLogo />
              </Link>
            ) : (
              <Link href="/" className="flex items-center justify-center w-full">
                <div className="relative w-10 h-10">
                  <svg viewBox="0 0 100 100" width="40" height="40">
                    <polygon 
                      points="50,5 95,25 95,75 50,95 5,75 5,25" 
                      fill="url(#bitaxGradient)" 
                      strokeWidth="2"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <path 
                      d="M35,30 h15 a10,10 0 0 1 0,20 h-15 v20 h15 a10,10 0 0 0 10,-10 v-5 a10,10 0 0 0 -10,-10 a10,10 0 0 0 10,-10 v-5 a10,10 0 0 0 -10,-10 h-15 v10 z" 
                      fill="white"
                    />
                    <defs>
                      <linearGradient id="bitaxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4338ca" />
                        <stop offset="50%" stopColor="#3b0764" />
                        <stop offset="100%" stopColor="#6d28d9" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </Link>
            )}
            
            {!sidebarCollapsed && (
              <button 
                className="p-2 text-gray-400 hover:text-white focus:outline-none lg:hidden rounded-lg hover:bg-white/5"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            {/* Collapse button - visible only on desktop */}
            <button
              className="hidden lg:block p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-white/5"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand" : "Collapse"}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={sidebarCollapsed ? "M13 5l7 7-7 7" : "M11 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
          
          {/* Navigation links */}
          <div className={`px-3 py-4 overflow-y-auto h-[calc(100vh-64px)] flex flex-col ${sidebarCollapsed ? 'items-center' : ''}`}>
            <div className={`space-y-1 mb-6 ${sidebarCollapsed ? 'w-full flex flex-col items-center' : ''}`}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={sidebarCollapsed ? 'w-full flex justify-center' : 'w-full'}
                >
                  <Link 
                    href={link.href}
                    className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0 w-12 h-12' : 'px-3 w-full'} py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      router.pathname === link.href 
                        ? "bg-primary-600/20 text-primary-400 dark:text-primary-300 border-l-2 border-primary-500 backdrop-blur-md"
                        : "text-gray-400 hover:bg-white/5 hover:text-white hover:backdrop-blur-md"
                    }`}
                    title={sidebarCollapsed ? link.name : ''}
                  >
                    <span className={`${sidebarCollapsed ? '' : 'mr-3'} ${
                      router.pathname === link.href 
                        ? "text-primary-500" 
                        : "text-gray-400 group-hover:text-white"
                    }`}>
                      {link.icon}
                    </span>
                    {!sidebarCollapsed && <span>{link.name}</span>}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Crypto Prices Widget avec logos SVG */}
            {!sidebarCollapsed && (
              <motion.div 
                className="mb-6 rounded-xl p-3 bg-white/5 border border-white/10 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 pl-1.5 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Cours Crypto
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {Object.entries(cryptoPrices).map(([symbol, data], index) => (
                    <motion.div 
                      key={symbol}
                      className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2" 
                             dangerouslySetInnerHTML={{ __html: data.logo || '' }}></div>
                        <span className="text-sm text-gray-200 font-medium">{formatPrice(data.price)}</span>
                      </div>
                      <span className={`text-xs font-medium ${data.change24h >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                        {data.change24h >= 0 ? (
                          <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        )}
                        {formatPercentage(data.change24h)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Mon compte */}
            <div className={`mt-auto space-y-1 border-t border-gray-800/20 pt-4 ${sidebarCollapsed ? 'w-full flex flex-col items-center' : ''}`}>
              {!sidebarCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                  Compte
                </h3>
              )}
              <Link 
                href="/profile"
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0 w-12 h-12' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-white/5 hover:text-white group`}
                title={sidebarCollapsed ? "Profil" : ''}
              >
                <span className={`${sidebarCollapsed ? '' : 'mr-3'} text-gray-400 group-hover:text-white`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                {!sidebarCollapsed && <span>Mon Profil</span>}
              </Link>
              <Link 
                href="/settings"
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0 w-12 h-12' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-gray-400 hover:bg-white/5 hover:text-white group`}
                title={sidebarCollapsed ? "Paramètres" : ''}
              >
                <span className={`${sidebarCollapsed ? '' : 'mr-3'} text-gray-400 group-hover:text-white`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                {!sidebarCollapsed && <span>Paramètres</span>}
              </Link>
              <Link 
                href="/logout"
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0 w-12 h-12' : 'px-3'} py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 group`}
                title={sidebarCollapsed ? "Déconnexion" : ''}
              >
                <span className={`${sidebarCollapsed ? '' : 'mr-3'} text-red-400 group-hover:text-red-300`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                {!sidebarCollapsed && <span>Déconnexion</span>}
              </Link>
            </div>
          </div>
          
          {/* Footer de la sidebar */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800/20 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title={theme === 'dark' ? "Passer en mode clair" : "Passer en mode sombre"}
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
              
              {!sidebarCollapsed && (
                <div className="text-xs text-gray-500">
                  <span>v1.0.0</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 w-0 overflow-hidden">
          {/* Header pour mobile */}
          <motion.div 
            className="relative z-10 flex items-center justify-between h-16 bg-white/5 dark:bg-gray-900/30 border-b border-gray-200/10 dark:border-gray-800/20 px-4 lg:hidden backdrop-blur-xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button 
              className="p-2 text-gray-400 focus:outline-none rounded-lg hover:bg-white/5 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/" className="flex items-center">
              <BitaxLogo size="small" />
            </Link>
            
            {/* Profil user sur mobile */}
            <button 
              className="p-2 text-gray-400 focus:outline-none rounded-lg hover:bg-white/5 hover:text-white"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {/* Menu utilisateur mobile */}
            <AnimatePresence>
              {isUserMenuOpen && (
                <motion.div 
                  className="absolute right-0 top-16 w-48 py-2 mt-2 bg-white/10 dark:bg-gray-800/90 rounded-xl shadow-xl border border-gray-200/10 dark:border-gray-700/30 backdrop-blur-xl z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5 dark:hover:bg-gray-700/30"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-white/5 dark:hover:bg-gray-700/30"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Paramètres
                  </Link>
                  <div className="border-t border-gray-200/10 dark:border-gray-700/20 my-1"></div>
                  <Link 
                    href="/logout" 
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 dark:hover:bg-red-900/20"
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
            className="relative flex-1 overflow-y-auto focus:outline-none bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-indigo-950/20 dark:to-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Effets d'arrière-plan améliorés */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Grille animée */}
              <div className="absolute inset-0 dark:bg-[url('/dashboard-grid.svg')] bg-[url('/dashboard-grid-light.svg')] bg-repeat opacity-10"></div>
              
              {/* Effets de dégradé */}
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-indigo-600/5 via-purple-600/3 to-transparent opacity-30 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-600/5 via-purple-600/3 to-transparent opacity-30 blur-3xl"></div>
              
              {/* Star particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="star" 
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      opacity: Math.random() * 0.3,
                      width: `${Math.random() * 2 + 1}px`,
                      height: `${Math.random() * 2 + 1}px`,
                      animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 3}s`
                    }}
                  ></div>
                ))}
              </div>
              
              {/* Orbes lumineux */}
              <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/5 pulse-glow blur-3xl"></div>
              <div className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-purple-500/5 pulse-glow blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-blue-500/5 pulse-glow blur-3xl"></div>
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