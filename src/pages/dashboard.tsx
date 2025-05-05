// src/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';
import { getTransactions, NetworkType } from '@/utils/transactions';
import { filterSpamTransactions } from '@/utils/SpamFilter';
import { 
  BlockchainSelector, 
  ScanButton, 
  MultiChainScanButton 
} from '@/components/BlockchainIcons';

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
          body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(67, 56, 202, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.07) 0%, transparent 40%);
            pointer-events: none;
            z-index: -1;
          }
          
          .starry-bg::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(1px 1px at 50px 60px, #4834d4, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 100px 120px, #3b82f6, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 170px 90px, #7c3aed, rgba(0,0,0,0)),
              radial-gradient(1px 1px at 230px 210px, #4834d4, rgba(0,0,0,0)),
              radial-gradient(1.5px 1.5px at 320px 150px, #3b82f6, rgba(0,0,0,0));
            background-repeat: repeat;
            background-size: 500px 500px;
            opacity: 0.15;
            pointer-events: none;
            z-index: -1;
          }
          
          .grid-overlay::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              linear-gradient(to right, rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
            pointer-events: none;
            z-index: -1;
          }
          
          .card-glow {
            box-shadow: 0 0 20px rgba(67, 56, 202, 0.1);
            transition: all 0.3s ease;
          }
          
          .card-glow:hover {
            box-shadow: 0 0 30px rgba(67, 56, 202, 0.2);
          }
        `}</style>
      </Head>

      <div className="starry-bg grid-overlay min-h-screen">
        <div className="h-full">
          <h1 className="text-2xl font-bold text-white mt-1 mb-6">Tableau de bord</h1>
          
          {/* Section de scanner de blockchain */}
          <div className="mb-8 bg-bitax-card rounded-xl p-6 border border-bitax-border card-glow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Scanner une blockchain</h2>
                <p className="text-gray-400">Sélectionnez un réseau pour scanner vos transactions</p>
              </div>
              
              <ScanButton 
                onClick={() => handleScanNetwork(activeNetwork)}
                isLoading={isLoading}
                network={activeNetwork}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
              <BlockchainSelector 
                network="eth" 
                name="Ethereum" 
                isActive={activeNetwork === 'eth'}
                onClick={() => setActiveNetwork('eth')}
              />
              <BlockchainSelector 
                network="polygon" 
                name="Polygon" 
                isActive={activeNetwork === 'polygon'}
                onClick={() => setActiveNetwork('polygon')}
              />
              <BlockchainSelector 
                network="arbitrum" 
                name="Arbitrum" 
                isActive={activeNetwork === 'arbitrum'}
                onClick={() => setActiveNetwork('arbitrum')}
              />
              <BlockchainSelector 
                network="optimism" 
                name="Optimism" 
                isActive={activeNetwork === 'optimism'}
                onClick={() => setActiveNetwork('optimism')}
              />
              <BlockchainSelector 
                network="base" 
                name="Base" 
                isActive={activeNetwork === 'base'}
                onClick={() => setActiveNetwork('base')}
              />
            </div>
            
            <MultiChainScanButton
              onClick={() => {
                ['eth', 'polygon', 'arbitrum', 'optimism', 'base'].forEach(network => {
                  handleScanNetwork(network as NetworkType);
                });
              }}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
          
          {/* Affichage des résultats ou message aucune transaction */}
          {isLoading ? (
            <div className="flex items-center justify-center p-12 bg-bitax-card rounded-xl border border-bitax-border">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 border-4 border-t-primary-500 border-r-primary-500 border-b-secondary-500 border-l-secondary-500 rounded-full animate-spin"></div>
                <p className="text-white text-lg">Scan en cours...</p>
              </div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="bg-bitax-card rounded-xl p-6 border border-bitax-border card-glow">
              <h2 className="text-xl font-semibold text-white mb-4">Transactions trouvées ({transactions.length})</h2>
              {/* Ici vous pouvez intégrer votre composant TaxDashboard ou tableau de transactions */}
              <p className="text-gray-400">Transactions détectées sur {
                activeNetwork === 'eth' ? 'Ethereum' : 
                activeNetwork === 'polygon' ? 'Polygon' : 
                activeNetwork === 'arbitrum' ? 'Arbitrum' : 
                activeNetwork === 'optimism' ? 'Optimism' : 'Base'
              }</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-bitax-card rounded-xl border border-bitax-border">
              <div className="text-gray-500 mb-6">
                <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7L12 13L21 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aucune transaction trouvée</h3>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Nous n'avons pas trouvé de transactions pour ce wallet sur {
                  activeNetwork === 'eth' ? 'Ethereum' : 
                  activeNetwork === 'polygon' ? 'Polygon' : 
                  activeNetwork === 'arbitrum' ? 'Arbitrum' : 
                  activeNetwork === 'optimism' ? 'Optimism' : 'Base'
                }.<br />
                Essayez de scanner un autre réseau ou connectez un wallet différent.
              </p>
              <ScanButton
                onClick={() => handleScanNetwork(activeNetwork)}
                network={activeNetwork}
                className="px-6 py-3"
              >
                Scanner à nouveau
              </ScanButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}