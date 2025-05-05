// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import Head from 'next/head';
import WalletConnectButton from '@/components/WalletConnectButton';
import DashboardHeader from '@/components/DashboardHeader';
import TaxDashboard from '@/components/TaxDashboard';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';

// SVG Components pour les logos des blockchains
const EthereumLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
    <path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.602"/>
    <path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
    <path d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z" fill="white" fillOpacity="0.602"/>
    <path d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z" fill="white"/>
    <path d="M16.498 20.573L23.995 16.22L16.498 12.872V20.573Z" fill="white" fillOpacity="0.2"/>
    <path d="M9 16.22L16.498 20.573V12.872L9 16.22Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

const PolygonLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#8247E5"/>
    <path d="M21.092 13.12C20.686 12.888 20.222 12.888 19.815 13.12L16.677 14.92L14.416 16.184L11.277 17.984C10.87 18.216 10.407 18.216 10 17.984L7.611 16.6C7.204 16.368 6.944 15.96 6.944 15.496V12.728C6.944 12.32 7.148 11.912 7.611 11.68L10 10.296C10.407 10.064 10.87 10.064 11.277 10.296L13.666 11.68C14.073 11.912 14.333 12.32 14.333 12.784V14.584L16.594 13.32V11.52C16.594 11.112 16.39 10.704 15.927 10.472L11.333 7.816C10.926 7.584 10.463 7.584 10.055 7.816L5.407 10.472C4.944 10.704 4.74 11.112 4.74 11.52V16.704C4.74 17.112 4.944 17.52 5.407 17.752L10.055 20.408C10.463 20.64 10.926 20.64 11.333 20.408L14.472 18.608L16.733 17.344L19.871 15.544C20.278 15.312 20.742 15.312 21.149 15.544L23.538 16.928C23.945 17.16 24.205 17.568 24.205 18.032V20.8C24.205 21.208 24.001 21.616 23.538 21.848L21.149 23.232C20.742 23.464 20.278 23.464 19.871 23.232L17.482 21.848C17.075 21.616 16.815 21.208 16.815 20.744V18.944L14.555 20.208V22.008C14.555 22.416 14.759 22.824 15.222 23.056L19.871 25.712C20.278 25.944 20.742 25.944 21.149 25.712L25.797 23.056C26.204 22.824 26.464 22.416 26.464 21.952V16.768C26.464 16.36 26.26 15.952 25.797 15.72L21.092 13.12Z" fill="white"/>
  </svg>
);

const ArbitrumLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#28A0F0"/>
    <path d="M18.415 7.935L21.39 13.338C21.558 13.62 21.432 13.975 21.143 14.14L16.958 16.438C16.656 16.611 16.278 16.501 16.1 16.213L13.003 11.018C12.835 10.736 12.961 10.381 13.25 10.217L17.557 7.71C17.858 7.536 18.237 7.646 18.415 7.935Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M15.944 17.533C16.175 17.533 16.391 17.674 16.483 17.883L20.771 26.635C20.879 26.879 20.764 27.166 20.517 27.274C20.451 27.304 20.38 27.319 20.308 27.319H11.605C11.337 27.319 11.119 27.103 11.119 26.837C11.119 26.766 11.135 26.696 11.166 26.631L15.445 17.889C15.539 17.675 15.758 17.533 15.994 17.533H15.944Z" fill="white"/>
  </svg>
);

const OptimismLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#FF0420"/>
    <path d="M11.5 23.5C9.01 23.5 7 21.49 7 19V13C7 10.51 9.01 8.5 11.5 8.5C13.99 8.5 16 10.51 16 13V19C16 21.49 13.99 23.5 11.5 23.5ZM11.5 11.5C10.67 11.5 10 12.17 10 13V19C10 19.83 10.67 20.5 11.5 20.5C12.33 20.5 13 19.83 13 19V13C13 12.17 12.33 11.5 11.5 11.5Z" fill="white"/>
    <path d="M21.5 23.5C19.01 23.5 17 21.49 17 19V13C17 10.51 19.01 8.5 21.5 8.5C23.99 8.5 26 10.51 26 13V19C26 21.49 23.99 23.5 21.5 23.5ZM21.5 11.5C20.67 11.5 20 12.17 20 13V19C20 19.83 20.67 20.5 21.5 20.5C22.33 20.5 23 19.83 23 19V13C23 12.17 22.33 11.5 21.5 11.5Z" fill="white"/>
  </svg>
);

const BaseLogo = () => (
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="16" fill="#0052FF"/>
    <path d="M16 6C10.47 6 6 10.47 6 16C6 21.53 10.47 26 16 26C21.53 26 26 21.53 26 16C26 10.47 21.53 6 16 6ZM16 22.5C12.41 22.5 9.5 19.59 9.5 16C9.5 12.41 12.41 9.5 16 9.5C19.59 9.5 22.5 12.41 22.5 16C22.5 19.59 19.59 22.5 16 22.5Z" fill="white"/>
  </svg>
);

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true); // Connexion wallet simulée
  const [walletAddress, setWalletAddress] = useState<string>('0x109c...6778');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(true);
  const [activeNetwork, setActiveNetwork] = useState<NetworkType>('eth');
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer les transactions (factice)
  const fetchTransactions = async (address: string, network: NetworkType) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Si ETH, aucune transaction pour l'exemple
      if (network === 'eth') {
        setTransactions([]);
      } else {
        // Simuler quelques transactions pour les autres réseaux
        setTransactions(Array.from({ length: 12 }, (_, i) => ({
          id: i,
          hash: `0x${Math.random().toString(16).substring(2, 14)}`,
          timestamp: new Date().getTime() - (i * 86400000),
          value: Math.random() * 10,
          from: address,
          to: `0x${Math.random().toString(16).substring(2, 42)}`
        })));
      }
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

  // Connecter un wallet (factice)
  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWalletAddress('0x109c...6778');
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Tableau de bord | Bitax</title>
        <style jsx global>{`
          /* Styles pour le background et les effets visuels */
          body {
            background-color: #09091b !important;
            background-image: 
              radial-gradient(circle at 20% 35%, rgba(73, 49, 157, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 10%, rgba(39, 94, 254, 0.1) 0%, transparent 50%);
            position: relative;
            overflow-x: hidden;
          }
          
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232a50c6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            pointer-events: none;
            z-index: -1;
          }
          
          /* Animation de particules */
          @keyframes floatingParticles {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-10px) translateX(5px);
            }
            50% {
              transform: translateY(5px) translateX(-5px);
            }
            75% {
              transform: translateY(10px) translateX(10px);
            }
          }
          
          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: rgba(94, 102, 246, 0.2);
            pointer-events: none;
            animation: floatingParticles 15s infinite ease-in-out;
          }
          
          .particle:nth-child(2n) {
            background-color: rgba(130, 71, 229, 0.2);
            animation-duration: 25s;
            animation-delay: 2s;
          }
          
          .particle:nth-child(3n) {
            background-color: rgba(61, 193, 255, 0.2);
            animation-duration: 20s;
            animation-delay: 4s;
          }
          
          /* Style des sélecteurs de blockchain */
          .blockchain-selector {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
            border-radius: 0.75rem;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: 1px solid rgba(255, 255, 255, 0.05);
            background-color: rgba(30, 31, 75, 0.5);
          }
          
          .blockchain-selector:hover {
            background-color: rgba(45, 46, 100, 0.6);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
          
          .blockchain-selector.active {
            background-color: rgba(94, 102, 246, 0.2);
            border: 2px solid rgba(94, 102, 246, 0.4);
            box-shadow: 0 0 15px rgba(94, 102, 246, 0.15);
          }
          
          .blockchain-name {
            margin-top: 0.75rem;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }
          
          /* Bouton scan multi-chain */
          .scan-button {
            background: linear-gradient(to right, #4834d4, #0070f3);
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          
          .scan-button:hover {
            background: linear-gradient(to right, #5e42ff, #0080ff);
            box-shadow: 0 4px 12px rgba(72, 67, 218, 0.3);
            transform: translateY(-1px);
          }
          
          .scan-button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          
          /* Scan multi-chain button */
          .scan-multichain-button {
            background: linear-gradient(90deg, #7928ca, #3b82f6);
            border: none;
            color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .scan-multichain-button:hover {
            background: linear-gradient(90deg, #8a3ad8, #4b92ff);
            box-shadow: 0 0 20px rgba(75, 0, 130, 0.2);
          }
          
          .scan-multichain-button svg {
            margin-right: 0.5rem;
          }
          
          /* No transactions found */
          .no-tx-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            border-radius: 0.75rem;
            background-color: rgba(20, 21, 45, 0.7);
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: center;
          }
          
          .no-tx-icon {
            margin-bottom: 1.5rem;
            color: rgba(255, 255, 255, 0.2);
          }
          
          .no-tx-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: white;
          }
          
          .no-tx-subtitle {
            color: rgba(255, 255, 255, 0.6);
            margin-bottom: 1.5rem;
            max-width: 30rem;
          }
          
          .scan-again-button {
            background-color: rgba(94, 102, 246, 0.8);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .scan-again-button:hover {
            background-color: rgba(94, 102, 246, 1);
            transform: translateY(-1px);
          }
        `}</style>
      </Head>

      {/* Ajout de particules en arrière-plan */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 20 + 10}s`
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-white mb-6">Tableau de bord</h1>
        
        {/* Section de scanner de blockchain */}
        <div className="mb-8 bg-opacity-30 bg-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Scanner une blockchain</h2>
              <p className="text-gray-400">Sélectionnez un réseau pour scanner vos transactions</p>
            </div>
            
            <button
              onClick={() => handleScanNetwork(activeNetwork)}
              disabled={isLoading}
              className="scan-button"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scan en cours...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Scanner {activeNetwork === 'eth' ? 'Ethereum' : 
                          activeNetwork === 'polygon' ? 'Polygon' : 
                          activeNetwork === 'arbitrum' ? 'Arbitrum' : 
                          activeNetwork === 'optimism' ? 'Optimism' : 'Base'}
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div 
              className={`blockchain-selector ${activeNetwork === 'eth' ? 'active' : ''}`} 
              onClick={() => setActiveNetwork('eth')}
            >
              <EthereumLogo />
              <span className="blockchain-name">Ethereum</span>
            </div>
            <div 
              className={`blockchain-selector ${activeNetwork === 'polygon' ? 'active' : ''}`} 
              onClick={() => setActiveNetwork('polygon')}
            >
              <PolygonLogo />
              <span className="blockchain-name">Polygon</span>
            </div>
            <div 
              className={`blockchain-selector ${activeNetwork === 'arbitrum' ? 'active' : ''}`} 
              onClick={() => setActiveNetwork('arbitrum')}
            >
              <ArbitrumLogo />
              <span className="blockchain-name">Arbitrum</span>
            </div>
            <div 
              className={`blockchain-selector ${activeNetwork === 'optimism' ? 'active' : ''}`} 
              onClick={() => setActiveNetwork('optimism')}
            >
              <OptimismLogo />
              <span className="blockchain-name">Optimism</span>
            </div>
            <div 
              className={`blockchain-selector ${activeNetwork === 'base' ? 'active' : ''}`} 
              onClick={() => setActiveNetwork('base')}
            >
              <BaseLogo />
              <span className="blockchain-name">Base</span>
            </div>
          </div>
          
          <button
            onClick={() => {
              ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                handleScanNetwork(network as NetworkType);
              });
            }}
            disabled={isLoading}
            className="scan-multichain-button w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Scan automatique multi-chain
          </button>
        </div>
        
        {/* Affichage des résultats ou message aucune transaction */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="ml-4 text-white text-lg">Scan en cours...</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="bg-opacity-30 bg-gray-800 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-700/30">
            <h2 className="text-xl font-semibold text-white mb-4">Transactions trouvées ({transactions.length})</h2>
            {/* Ici vous pouvez intégrer votre composant TaxDashboard ou tableau de transactions */}
            <p className="text-gray-400">Transactions détectées sur {activeNetwork === 'eth' ? 'Ethereum' : 
                                                                 activeNetwork === 'polygon' ? 'Polygon' : 
                                                                 activeNetwork === 'arbitrum' ? 'Arbitrum' : 
                                                                 activeNetwork === 'optimism' ? 'Optimism' : 'Base'}</p>
          </div>
        ) : (
          <div className="no-tx-container">
            <div className="no-tx-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="no-tx-title">Aucune transaction trouvée</h3>
            <p className="no-tx-subtitle">
              Nous n'avons pas trouvé de transactions pour ce wallet sur {activeNetwork === 'eth' ? 'Ethereum' : 
                                                                       activeNetwork === 'polygon' ? 'Polygon' : 
                                                                       activeNetwork === 'arbitrum' ? 'Arbitrum' : 
                                                                       activeNetwork === 'optimism' ? 'Optimism' : 'Base'}.
              <br />Essayez de scanner un autre réseau ou connectez un wallet différent.
            </p>
            <button
              onClick={() => handleScanNetwork(activeNetwork)}
              className="scan-again-button"
            >
              Scanner à nouveau
            </button>
          </div>
        )}
      </div>
    </>
  );
}