// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import WalletConnectButton from '@/components/Wallet/WalletConnectButton';
import WalletConnectPanel from '@/components/Wallet/WalletConnectPanel';
import TransactionSummary from '@/components/Dashboard/TransactionSummary';
import TaxDashboard from '@/components/Dashboard/TaxDashboard';
import PremiumUnlock from '@/components/Dashboard/PremiumUnlock';
import OnboardingWizard from '@/components/Misc/OnboardingWizard';
import { getTransactions, NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import DevModeToggle from '@/components/Misc/DevModeToggle';
import { isDevModeEnabled } from '@/utils/mockTransactions';

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<{[key: string]: 'pending' | 'scanning' | 'completed' | 'error'}>({});
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDevMode(isDevModeEnabled());
  }, []);

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
    
    // Vérifier si des wallets sont déjà connectés
    const connectedWallets = JSON.parse(localStorage.getItem('bitax-connected-wallets') || '[]');
    if (connectedWallets.length > 0) {
      setWalletAddresses(connectedWallets);
      setIsWalletConnected(true);
      
      // Charger automatiquement les transactions après connexion
      fetchTransactions(connectedWallets[0], activeNetwork);
    }
  }, []);

  // Gérer la connexion du wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      // Ajouter le nouveau wallet à la liste des wallets connectés
      const updatedWallets = [...walletAddresses, address];
      setWalletAddresses(updatedWallets);
      setProvider(walletProvider);
      setIsWalletConnected(true);
      
      // Sauvegarder les wallets pour la persistance
      localStorage.setItem('bitax-connected-wallets', JSON.stringify(updatedWallets));
      
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
      // Mettre à jour le statut de scan pour ce réseau
      setScanProgress(prev => ({ ...prev, [network]: 'scanning' }));
      
      const txs = await getTransactions(address, network);
      const filteredTxs = filterSpamTransactions(txs);
      
      setTransactions(filteredTxs);
      setScanProgress(prev => ({ ...prev, [network]: 'completed' }));
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions sur ${network}:`, error);
      setError(`Impossible de récupérer les transactions sur ${network}. Veuillez réessayer plus tard.`);
      setScanProgress(prev => ({ ...prev, [network]: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  // Scanner un réseau spécifique
  const handleScanNetwork = async (network: NetworkType) => {
    setActiveNetwork(network);
    if (walletAddresses.length > 0) {
      await fetchTransactions(walletAddresses[0], network);
    }
  };

  // Scanner tous les réseaux en parallèle
  const handleMultiScan = async () => {
    if (walletAddresses.length === 0) return;
    
    setIsScanning(true);
    
    // Initialiser le statut de scan pour tous les réseaux
    const initialScanProgress: {[key: string]: 'pending' | 'scanning' | 'completed' | 'error'} = {};
    Object.keys(SUPPORTED_NETWORKS).forEach(network => {
      initialScanProgress[network] = 'pending';
    });
    setScanProgress(initialScanProgress);
    
    // Scanner chaque réseau en parallèle
    const networks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base', 'solana', 'avalanche', 'bsc'];
    
    try {
      const scanPromises = networks.map(async (network) => {
        try {
          setScanProgress(prev => ({ ...prev, [network]: 'scanning' }));
          const txs = await getTransactions(walletAddresses[0], network);
          const filteredTxs = filterSpamTransactions(txs);
          setScanProgress(prev => ({ ...prev, [network]: 'completed' }));
          return { network, transactions: filteredTxs };
        } catch (error) {
          console.error(`Erreur lors du scan de ${network}:`, error);
          setScanProgress(prev => ({ ...prev, [network]: 'error' }));
          return { network, transactions: [] };
        }
      });
      
      const results = await Promise.all(scanPromises);
      
      // Fusionner toutes les transactions
      const allTransactions = results.flatMap(result => result.transactions);
      
      // Trier par date (du plus récent au plus ancien)
      allTransactions.sort((a, b) => {
        const dateA = new Date(a.block_timestamp || 0).getTime();
        const dateB = new Date(b.block_timestamp || 0).getTime();
        return dateB - dateA;
      });
      
      setTransactions(allTransactions);
    } catch (error) {
      console.error('Erreur lors du multi-scan:', error);
      setError('Une erreur est survenue lors du scan multi-blockchain.');
    } finally {
      setIsScanning(false);
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
    <div className="space-y-8">
      {/* Afficher l'assistant d'onboarding pour les nouveaux utilisateurs */}
      {showOnboarding && (
        <OnboardingWizard 
          onComplete={handleOnboardingComplete} 
          onConnect={handleWalletConnect} 
          skipOnboarding={() => setShowOnboarding(false)}
        />
      )}
      
      {/* En-tête avec titre et sélection de réseau */}
      <div className="relative mb-6 pb-6">
        {/* Effet de fond animé */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Titre et navigation */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Tableau de bord fiscal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Visualisez et analysez vos données fiscales crypto sur différentes blockchains pour préparer votre déclaration.
            </p>
          </div>
          
          {/* Actions et vue du wallet */}
          {isWalletConnected && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <div className="flex flex-shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wallets connectés</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {walletAddresses.length} {walletAddresses.length > 1 ? 'wallets' : 'wallet'}
                  </div>
                </div>
              </div>
              
              <Link 
                href="/transactions" 
                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Voir les transactions
              </Link>
              
              <Link 
                href="/reports" 
                className="px-4 py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors font-medium text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Mes rapports
              </Link>
            </div>
          )}
        </div>
        
        {/* Barre de réseau */}
        {isWalletConnected && (
          <div className="mt-6 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Réseau :</span>
              
              <div className="flex flex-wrap gap-2">
                {(['eth', 'polygon', 'arbitrum', 'optimism', 'base'] as NetworkType[]).map((network) => (
                  <button
                    key={network}
                    onClick={() => handleScanNetwork(network)}
                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeNetwork === network 
                        ? 'text-white shadow-sm transform scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                    style={{
                      backgroundColor: activeNetwork === network 
                        ? network === 'eth' ? '#3B82F6' 
                        : network === 'polygon' ? '#8B5CF6' 
                        : network === 'arbitrum' ? '#2563EB' 
                        : network === 'optimism' ? '#EF4444' 
                        : '#60A5FA' 
                        : undefined
                    }}
                  >
                    {scanProgress[network] === 'scanning' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {network === 'eth' && 'Ethereum'}
                    {network === 'polygon' && 'Polygon'}
                    {network === 'arbitrum' && 'Arbitrum'}
                    {network === 'optimism' && 'Optimism'}
                    {network === 'base' && 'Base'}
                  </button>
                ))}
              </div>

              <DevModeToggle className="ml-auto mr-4" />
              
              <div className="ml-auto flex items-center">
                <button
                  onClick={() => handleScanNetwork(activeNetwork)}
                  disabled={isLoading || isScanning}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Rafraîchir
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleMultiScan}
                  disabled={isLoading || isScanning}
                  className={`ml-2 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-1.5 ${
                    isScanning
                      ? 'bg-indigo-700 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                  title="Scanner toutes les blockchains"
                >
                  {isScanning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Multi-scan en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Multi-scan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne latérale */}
        <div className="lg:col-span-1 space-y-6">
          {/* Panneau de connexion wallet */}
          {!isWalletConnected ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Connectez votre wallet
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Pour commencer, connectez votre wallet crypto pour analyser vos transactions.
                </p>
                <WalletConnectButton 
                  onConnect={handleWalletConnect}
                  variant="primary"
                  fullWidth
                  size="lg"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Vos wallets connectés
                </h2>
                <div className="space-y-2 mb-4">
                  {walletAddresses.map((address, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                    {address.substring(0, 8)}...{address.substring(address.length - 6)}
                    </p>
                  </div>
                  ))}
                </div>
                
                <Link
                  href="/wallets"
                  className="w-full mt-3 flex items-center justify-center px-4 py-2.5 border border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ajouter un wallet
                </Link>
                </div>
              
              {/* Statistiques */}
              {transactions.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Transactions trouvées</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{transactions.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                    <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: `${Math.min(transactions.length / 100 * 100, 100)}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Bannière Premium */}
          {!isPremiumUser && (
            <PremiumUnlock onUnlock={handleUnlockPremium} />
          )}
          
          {/* Liens rapides */}
          {isWalletConnected && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accès rapide</h3>
              <div className="space-y-3">
                <Link 
                  href="/transactions" 
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Analyser mes transactions</span>
                </Link>
                <Link 
                  href="/reports" 
                  className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          
          {/* Bannière Premium */}
          {!isPremiumUser && (
            <PremiumUnlock onUnlock={handleUnlockPremium} />
          )}
          
          {/* Liens rapides */}
          {isWalletConnected && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accès rapide</h3>
              <div className="space-y-3">
                <Link 
                  href="/transactions" 
                  className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">Analyser mes transactions</span>
                </Link>
                <Link 
                  href="/reports" 
                  className="flex items-center p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/40 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium">Générer des rapports</span>
                </Link>
                <Link 
                  href="/guide" 
                  className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">Guide d'utilisation</span>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Afficher les erreurs */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {isLoading || isScanning ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="ml-4 text-gray-600 dark:text-gray-300">Chargement des données...</p>
            </div>
          ) : (
            <>
              {isWalletConnected ? (
                transactions.length > 0 ? (
                  <>
                    {/* Résumé du portefeuille */}
                    <TransactionSummary 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                    />
                    
                    {/* Tableau de bord fiscal */}
                    <TaxDashboard 
                      transactions={transactions}
                      isPremiumUser={isPremiumUser}
                      walletAddress={walletAddresses[0]}
                    />
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Aucune transaction trouvée</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork}.
                      <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                      <button
                        onClick={() => handleScanNetwork(activeNetwork)}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Scanner à nouveau</span>
                      </button>
                      <button
                        onClick={handleMultiScan}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>Scanner toutes les blockchains</span>
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white">Bienvenue sur Bitax</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Connectez votre wallet pour commencer à analyser vos transactions et générer votre rapport fiscal.
                  </p>
                  <div className="mt-6">
                    <WalletConnectButton
                      onConnect={handleWalletConnect}
                      variant="primary"
                      size="lg"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}