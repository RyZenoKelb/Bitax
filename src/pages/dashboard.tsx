// src/pages/dashboard.tsx
// Contenu copié depuis index.tsx pour créer une route Dashboard

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import WalletConnectButton from '@/components/WalletConnectButton';
import WalletConnectPanel from '@/components/WalletConnectPanel';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionList from '@/components/TransactionList';
import TaxDashboard from '@/components/TaxDashboard';
import PremiumUnlock from '@/components/PremiumUnlock';
import OnboardingWizard from '@/components/OnboardingWizard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import DashboardLayout from '@/components/DashboardLayout';

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);

  // Vérifier si c'est la première visite
  useEffect(() => {
    const hasVisited = localStorage.getItem('bitax-visited');
    if (!hasVisited) {
      setIsFirstVisit(true);
      setShowOnboarding(true);
      localStorage.setItem('bitax-visited', 'true');
    } else {
      setIsFirstVisit(false);
    }
    
    // Vérifier le statut premium (simulé ici)
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
  }, []);

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      setWalletAddress(address);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions après connexion
      await fetchTransactions(address, activeNetwork);
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };

  // Récupérer les transactions
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      setTransactions(filteredTxs);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      setError('Impossible de récupérer les transactions. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network: NetworkType) => {
    setActiveNetwork(network);
    if (walletAddress) {
      await fetchTransactions(walletAddress, network);
    }
  };

  // Compléter l'onboarding
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Débloquer les fonctionnalités premium
  const handleUnlockPremium = () => {
    setIsPremiumUser(true);
    localStorage.setItem('bitax-premium', 'true');
  };

  // Si l'utilisateur n'est pas connecté, afficher une page d'accueil améliorée
  if (!isWalletConnected) {
    return (
      <div className="space-y-16">
        {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
        {showOnboarding && (
          <OnboardingWizard 
            onComplete={handleOnboardingComplete} 
            onConnect={handleWalletConnect} 
            skipOnboarding={() => setShowOnboarding(false)}
          />
        )}
        
        {/* Hero Section améliorée */}
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20">
          {/* Arrière-plan avec effet de gradient */}
          <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
            <svg className="h-96 w-96 sm:h-[40rem] sm:w-[40rem]" width="960" height="637" viewBox="0 0 960 637" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.8" filter="url(#filter0_f_983_1700)">
                <circle cx="538.5" cy="144.5" r="298.5" fill="#4285F4"/>
              </g>
              <defs>
                <filter id="filter0_f_983_1700" x="40" y="-354" width="997" height="997" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_983_1700"/>
                </filter>
              </defs>
            </svg>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                  <span className="text-gray-900 dark:text-white">Simplifiez votre </span>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">fiscalité crypto</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Connectez votre wallet, analysez vos transactions et générez votre rapport fiscal en quelques clics.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <button 
                    onClick={() => setShowOnboarding(true)}
                    className="btn-primary"
                  >
                    Commencer maintenant
                  </button>
                  <Link href="/guide" className="btn-outline">
                    Découvrir Bitax
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {[
                    { metric: "5+", label: "Blockchains supportées" },
                    { metric: "100%", label: "Conforme à la législation" },
                    { metric: "24/7", label: "Support disponible" },
                    { metric: "99.9%", label: "Précision des calculs" }
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{item.metric}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative lg:pl-8">
                <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Connectez votre wallet
                    </h2>
                    <WalletConnectButton 
                      onConnect={handleWalletConnect}
                      variant="primary"
                      fullWidth
                      size="lg"
                    />
                    
                    {/* Indicateurs de confiance */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Connexion sécurisée
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Données chiffrées
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Réseaux supportés */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Réseaux supportés</p>
                    <div className="flex space-x-3">
                      {[
                        { name: "ETH", color: "#627EEA" },
                        { name: "POLYGON", color: "#8247E5" },
                        { name: "ARBITRUM", color: "#28A0F0" },
                        { name: "OPTIMISM", color: "#FF0420" },
                        { name: "BASE", color: "#0052FF" }
                      ].map((network, i) => (
                        <div 
                          key={i} 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: network.color }}
                          title={network.name}
                        >
                          {network.name.substring(0, 1)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Élément décoratif */}
                <div className="absolute -z-10 -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full blur-2xl opacity-70"></div>
              </div>
            </div>
          </div>
        </section>
          
        {/* Section Comment ça marche */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Comment ça marche</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Bitax simplifie le processus de déclaration fiscale pour vos crypto-monnaies en trois étapes simples.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: "Connectez votre wallet",
                  description: "Bitax se connecte à votre wallet via une connexion sécurisée, sans jamais accéder à vos clés privées ou à vos fonds."
                },
                {
                  icon: (
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: "Analysez vos transactions",
                  description: "Notre algorithme analyse automatiquement vos transactions sur différentes blockchains et identifie les événements taxables."
                },
                {
                  icon: (
                    <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                  title: "Générez votre rapport",
                  description: "Obtenez un rapport fiscal complet, téléchargeable en PDF, CSV ou Excel, prêt à être utilisé pour votre déclaration d'impôts."
                }
              ].map((step, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <button
                onClick={() => setShowOnboarding(true)}
                className="btn-primary"
              >
                Essayer maintenant
              </button>
            </div>
          </div>
        </section>
          
        {/* Section avantages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi choisir Bitax</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Notre plateforme est conçue pour rendre la fiscalité crypto aussi simple et précise que possible.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Analyse précise",
                  description: "Algorithme avancé qui identifie correctement les événements taxables selon les dernières règles fiscales."
                },
                {
                  icon: "🔐",
                  title: "Sécurité maximale",
                  description: "Vos clés privées et vos fonds restent toujours sous votre contrôle. Bitax ne stocke pas vos données sensibles."
                },
                {
                  icon: "🌐",
                  title: "Multi-blockchain",
                  description: "Support des principales blockchains : Ethereum, Polygon, Arbitrum, Optimism, Base et plus encore."
                },
                {
                  icon: "📊",
                  title: "Visualisations claires",
                  description: "Graphiques et rapports intuitifs pour comprendre facilement votre situation fiscale crypto."
                },
                {
                  icon: "⚙️",
                  title: "Méthodes d'évaluation",
                  description: "Plusieurs méthodes de calcul fiscal disponibles : FIFO, LIFO, HIFO et prix moyen pondéré."
                },
                {
                  icon: "📱",
                  title: "Accessible partout",
                  description: "Application web responsive accessible depuis tous vos appareils, ordinateur, tablette ou smartphone."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Section tarifs simplifiée */}
        <section className="py-16 bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Plans tarifaires</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Choisissez l'offre qui correspond le mieux à vos besoins.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Plan gratuit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gratuit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour essayer Bitax</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">0€</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Analyse limitée à 100 transactions</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Rapport fiscal basique</span>
                  </li>
                </ul>
                <Link href="/pricing" className="w-full btn-outline justify-center">
                  Commencer gratuitement
                </Link>
              </div>
              
              {/* Plan premium */}
              <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-xl p-6 border border-blue-200 dark:border-blue-800 transform md:-translate-y-4 relative">
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
                  Populaire
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les investisseurs actifs</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">9,99€</span>
                  <span className="text-gray-500 dark:text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Transactions illimitées</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Rapport fiscal complet</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Toutes les méthodes de calcul</span>
                  </li>
                </ul>
                <Link href="/pricing" className="w-full btn-primary justify-center">
                  S'abonner à Premium
                </Link>
              </div>
              
              {/* Plan entreprise */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Entreprise</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les professionnels</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">29,99€</span>
                  <span className="text-gray-500 dark:text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Tout le contenu Premium</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">API dédiée</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Support dédié</span>
                  </li>
                </ul>
                <Link href="/pricing" className="w-full btn-outline justify-center">
                  Contacter les ventes
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link href="/pricing" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                Voir tous les détails des plans &rarr;
              </Link>
            </div>
          </div>
        </section>
          
        {/* Section témoignages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ce que disent nos utilisateurs</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez comment Bitax aide des milliers d'utilisateurs à simplifier leur fiscalité crypto.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Bitax m'a fait économiser des heures de travail sur ma déclaration fiscale. Un outil indispensable !",
                  author: "Thomas L.",
                  role: "Trader Crypto",
                  avatar: "T"
                },
                {
                  quote: "Interface intuitive et rapport détaillé. Je recommande à tous les détenteurs de crypto-monnaies.",
                  author: "Sophie M.",
                  role: "Investisseuse",
                  avatar: "S"
                },
                {
                  quote: "Le suivi des transactions DeFi est impressionnant. Bitax comprend vraiment les besoins des utilisateurs.",
                  author: "Marc D.",
                  role: "Développeur Web3",
                  avatar: "M"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start mb-4">
                    <svg className="h-12 w-12 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          
        {/* CTA final */}
        <section className="py-16 bg-blue-600 dark:bg-blue-800 rounded-3xl text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Prêt à simplifier votre fiscalité crypto ?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Commencez dès aujourd'hui et générez votre premier rapport fiscal en quelques minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setShowOnboarding(true)}
                className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Essayer gratuitement
              </button>
              <Link 
                href="/guide" 
                className="px-8 py-4 bg-transparent hover:bg-blue-700 border-2 border-white font-bold rounded-xl transition-colors duration-300"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Affichage du tableau de bord pour les utilisateurs connectés
  return (
    <DashboardLayout>
      <div className="min-h-screen p-8 space-y-8 fade-in">
        {/* Header avec statistiques rapides */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-6">
            <h1 className="text-3xl font-bold text-white mb-1">Tableau de bord fiscal</h1>
            <p className="text-gray-400">
              {transactions.length > 0 
                ? `${transactions.length} transactions analysées • ${new Date().toLocaleDateString('fr-FR')}`
                : "Connectez-vous pour voir vos transactions"}
            </p>
          </div>
          
          <div className="col-span-12 lg:col-span-6 flex justify-end items-center">
            {/* Wallet info avec badge animé */}
            <div className="flex items-center bg-gray-800/50 backdrop-blur-sm p-2 px-4 rounded-full border border-gray-700/50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300 mr-2">Wallet:</span>
              <span className="text-sm font-mono text-white bg-gray-700/70 py-0.5 px-2 rounded">
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Affichage de l'erreur */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-700/50 rounded-xl p-4 text-red-300 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">{error}</p>
                <p className="mt-1 text-sm opacity-80">Vérifiez votre connexion internet et réessayez.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sélecteur de réseau */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-5 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Réseaux blockchain
            </h2>
            
            <div className="space-x-2">
              {!isPremiumUser && (
                <button
                  onClick={handleUnlockPremium}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <span className="flex items-center">
                    <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Déverrouiller Premium
                  </span>
                </button>
              )}
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex flex-wrap gap-2 mb-4">
              {['eth', 'polygon', 'arbitrum', 'optimism', 'base'].map((network) => (
                <button
                  key={network}
                  onClick={() => handleScanNetwork(network as NetworkType)}
                  className={`relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeNetwork === network 
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
                      : 'bg-gray-700/70 text-gray-200 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {/* Indicateur coloré pour chaque réseau */}
                  <span className="w-4 h-4 mr-1.5 rounded-full bg-opacity-80"
                    style={{
                      backgroundColor: {
                        'eth': '#627EEA',
                        'polygon': '#8247E5',
                        'arbitrum': '#28A0F0',
                        'optimism': '#FF0420',
                        'base': '#0052FF'
                      }[network]
                    }}
                  ></span>
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                  
                  {activeNetwork === network && isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600/90 rounded-lg backdrop-blur-sm">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => handleScanNetwork(activeNetwork)}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scan en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Scanner {activeNetwork.toUpperCase()}
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                    handleScanNetwork(network as NetworkType);
                  });
                }}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-70"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Multi-chain Turbo Scan
              </button>
            </div>
            
            {transactions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-400">Transactions analysées</span>
                  <span className="text-lg font-bold text-white">{transactions.length}</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Contenu principal */}
        {isLoading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20">
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-300/20 opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-500 animate-spin"></div>
              </div>
              <p className="mt-6 text-lg font-medium text-gray-300">Analyse des transactions en cours...</p>
              <p className="mt-2 text-sm text-gray-400">Veuillez patienter pendant que nous analysons vos données blockchain</p>
            </div>
          </div>
        ) : (
          <>
            {transactions.length > 0 ? (
              <>
                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[
                    {
                      title: 'Balance totale',
                      value: '12,452 €',
                      change: '+14.5%',
                      isPositive: true,
                      icon: (
                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    {
                      title: 'Plus-values',
                      value: '3,841 €',
                      change: '+8.2%',
                      isPositive: true,
                      icon: (
                        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )
                    },
                    {
                      title: 'Impôts estimés',
                      value: '960 €',
                      change: '-2.4%',
                      isPositive: false,
                      icon: (
                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      )
                    }
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 card-hover">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                          <p className="mt-1 text-2xl font-semibold text-white">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.isPositive ? 'bg-emerald-900/20' : 'bg-red-900/20'} border ${stat.isPositive ? 'border-emerald-700/30' : 'border-red-700/30'}`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center">
                        <span className={`text-sm font-medium ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.change}
                        </span>
                        <span className="ml-1.5 text-xs text-gray-500">depuis 30 jours</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tableau de bord fiscal avec graphique */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">Synthèse fiscale</h2>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700/70 rounded-lg hover:bg-gray-700 transition-colors">
                        Jour
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Mois
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-700/70 rounded-lg hover:bg-gray-700 transition-colors">
                        Année
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <TaxDashboard 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                      walletAddress={walletAddress}
                    />
                  </div>
                </div>
                
                {/* Résumé des transactions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden mb-8">
                  <div className="p-6 border-b border-gray-700/50">
                    <h2 className="text-lg font-semibold text-white">Résumé des transactions</h2>
                  </div>
                  
                  <div className="p-6">
                    <TransactionSummary 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                  </div>
                </div>
                
                {/* Liste des transactions */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-white">
                      Historique des transactions
                    </h2>
                    <div className="flex items-center space-x-2">
                      <select className="text-sm bg-gray-700/70 border-0 rounded-lg p-2 text-gray-300">
                        <option>Tous les types</option>
                        <option>Achats</option>
                        <option>Ventes</option>
                        <option>Transferts</option>
                      </select>
                      <button className="p-2 bg-gray-700/70 rounded-lg text-gray-300 hover:bg-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                      </button>
                      <button className="p-2 bg-gray-700/70 rounded-lg text-gray-300 hover:bg-gray-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <TransactionList 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-700/70 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">Aucune transaction trouvée</h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork}.
                    <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleScanNetwork(activeNetwork)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Scanner à nouveau
                    </button>
                    <button
                      onClick={() => {
                        // Changer de réseau
                        const networks = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
                        const currentIndex = networks.indexOf(activeNetwork);
                        const nextNetwork = networks[(currentIndex + 1) % networks.length];
                        handleScanNetwork(nextNetwork as NetworkType);
                      }}
                      className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium flex items-center justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Essayer un autre réseau
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
    </DashboardLayout>
  );
}