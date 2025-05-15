// src/pages/wallets.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import { isDevModeEnabled } from '@/utils/mockTransactions';
import DevModeToggle from '@/components/Misc/DevModeToggle';
import NetworkIcon from '@/components/Visual/NetworkIcon';
import { toast } from 'react-hot-toast';
// Web3Modal
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletDetails {
  balance: string;
  network: string;
  ensName: string | null;
  name: string | null;
  category: string | null;
  lastActive: Date | null;
}

interface WalletStats {
  totalWallets: number;
  totalBalance: number;
  networks: Record<string, number>;
}

interface WalletCategory {
  id: string;
  name: string;
  color: string;
}

export default function Wallets() {
  // États
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [walletsDetails, setWalletsDetails] = useState<{
    [address: string]: WalletDetails;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState<boolean>(false);
  const [walletCategory, setWalletCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [editingWallet, setEditingWallet] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<string>("default");
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  const router = useRouter();

  // Catégories de wallets prédéfinies
  const walletCategories: WalletCategory[] = [
    { id: "all", name: "Tous les wallets", color: "gray" },
    { id: "default", name: "Non catégorisé", color: "gray" },
    { id: "defi", name: "DeFi", color: "indigo" },
    { id: "trading", name: "Trading", color: "cyan" },
    { id: "nft", name: "NFT", color: "purple" },
    { id: "staking", name: "Staking", color: "green" },
    { id: "gaming", name: "Gaming", color: "pink" },
  ];

  // Initialiser Web3Modal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const providerOptions = {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "your-infura-id" // Remplacer par votre infuraId ou utiliser un RPC personnalisé
          }
        },
        coinbasewallet: {
          package: CoinbaseWalletSDK,
          options: {
            appName: "Bitax",
            infuraId: "your-infura-id" // Remplacer par votre infuraId
          }
        }
      };

      const modal = new Web3Modal({
        network: "mainnet", // Optionnel, mais recommandé
        cacheProvider: true,
        providerOptions,
        theme: "dark"
      });

      setWeb3Modal(modal);
    }
  }, []);

  // Charger l'état du mode développeur
  useEffect(() => {
    setIsDevMode(isDevModeEnabled());
  }, []);

  // Connecter automatiquement si le provider est mis en cache
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
  }, [web3Modal]);

  // Charger les wallets au démarrage
  useEffect(() => {
    const connectedWallets = JSON.parse(
      localStorage.getItem("bitax-connected-wallets") || "[]"
    ) as string[];
    
    setWalletAddresses(connectedWallets);

    // Charger les détails de chaque wallet
    if (connectedWallets.length > 0) {
      loadWalletDetails(connectedWallets);
    } else {
      // Afficher le guide d'onboarding si aucun wallet n'est connecté
      setShowOnboarding(true);
    }

    // Charger les noms et catégories personnalisés
    const customWalletData = JSON.parse(
      localStorage.getItem("bitax-wallet-metadata") || "{}"
    ) as Record<string, any>;
    
    // Mettre à jour les détails avec les métadonnées personnalisées
    const initialDetails: { [address: string]: WalletDetails } = {};
    connectedWallets.forEach(address => {
      initialDetails[address] = {
        balance: "0",
        network: "Chargement...",
        ensName: null,
        name: customWalletData[address]?.name || null,
        category: customWalletData[address]?.category || "default",
        lastActive: customWalletData[address]?.lastActive 
          ? new Date(customWalletData[address].lastActive) 
          : new Date()
      };
    });
    
    setWalletsDetails(initialDetails);
  }, []);

  // Connecter un wallet avec Web3Modal
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Si nous sommes en mode dev, créer un wallet fictif pour tester
      if (isDevModeEnabled()) {
        console.log("Mode développement activé : création d'un wallet fictif");
        
        // Générer une adresse aléatoire pour simuler un wallet
        const randomAddr = "0x" + Array.from({ length: 40 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        
        // Créer un provider simulé
        const mockProvider = {
          getNetwork: async () => ({ name: "Ethereum" }),
          getBalance: async () => ethers.parseEther("1.5"),
          lookupAddress: async () => null
        } as unknown as ethers.BrowserProvider;
        
        // Traiter la connexion simulée
        await handleWalletConnect(randomAddr, mockProvider);
        toast.success("Wallet fictif connecté en mode test");
        setIsLoading(false);
        return;
      }
      
      if (!web3Modal) {
        throw new Error("Web3Modal n'est pas initialisé");
      }
      
      // Ouvrir la fenêtre modale pour choisir le wallet
      const instance = await web3Modal.connect();
      
      // Wrapper le provider avec ethers
      const provider = new ethers.BrowserProvider(instance);
      
      // Obtenir l'adresse
      const accounts = await provider.listAccounts();
      
      if (accounts.length === 0) {
        throw new Error("Aucun compte disponible");
      }
      
      const address = accounts[0].address;
      
      // Vérifier si le wallet est déjà connecté
      if (walletAddresses.includes(address)) {
        toast.error("Ce wallet est déjà connecté");
        return;
      }
      
      // Écouter les événements de changement
      instance.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // L'utilisateur s'est déconnecté du wallet
          console.log("Utilisateur déconnecté");
        } else if (accounts[0] !== address) {
          // L'utilisateur a changé de compte
          console.log("Compte changé :", accounts[0]);
          window.location.reload();
        }
      });
      
      instance.on("chainChanged", () => {
        // Le réseau a changé, recharger la page
        console.log("Réseau changé, rechargement...");
        window.location.reload();
      });
      
      // Connexion réussie, stocker les détails
      await handleWalletConnect(address, provider);
      
    } catch (err: any) {
      console.error("Erreur lors de la connexion du wallet:", err);
      toast.error(err.message || "Erreur lors de la connexion du wallet");
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnecter le Web3Modal
  const disconnectWeb3Modal = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
  };

  // Charger les détails de wallet (solde, etc.)
  const loadWalletDetails = async (addresses: string[]) => {
    setIsLoading(true);
    setError(null);

    try {
      // Tenter de se connecter à Ethereum
      const details: { [address: string]: WalletDetails } = {};
      const customWalletData = JSON.parse(
        localStorage.getItem("bitax-wallet-metadata") || "{}"
      ) as Record<string, any>;

      // Si nous sommes en mode dev, utiliser des données simulées
      if (isDevModeEnabled()) {
        addresses.forEach((address) => {
          details[address] = {
            balance: (+((Math.random() * 10).toFixed(4))).toString(),
            network: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"][
              Math.floor(Math.random() * 5)
            ],
            ensName: Math.random() > 0.5 ? address.substring(2, 8) + ".eth" : null,
            name: customWalletData[address]?.name || null,
            category: customWalletData[address]?.category || "default",
            lastActive: customWalletData[address]?.lastActive 
              ? new Date(customWalletData[address].lastActive) 
              : new Date()
          };
        });
      } else {
        // Vérifier si window.ethereum est disponible
        if (typeof window !== "undefined" && window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);

          // Récupérer le nom du réseau
          const network = await provider.getNetwork();
          const networkName = network.name === "homestead" ? "Ethereum" : network.name;

          for (const address of addresses) {
            try {
              // Récupérer le solde
              const balance = await provider.getBalance(address);
              const balanceInEth = ethers.formatEther(balance);

              // Tenter de récupérer un nom ENS si disponible
              let ensName = null;
              try {
                const ens = await provider.lookupAddress(address);
                if (ens) ensName = ens;
              } catch {
                // Ignorer les erreurs ENS
              }

              details[address] = {
                balance: balanceInEth,
                network: networkName,
                ensName,
                name: customWalletData[address]?.name || null,
                category: customWalletData[address]?.category || "default",
                lastActive: customWalletData[address]?.lastActive 
                  ? new Date(customWalletData[address].lastActive) 
                  : new Date()
              };
            } catch (error) {
              console.error(`Erreur en chargeant les détails pour ${address}:`, error);
              details[address] = {
                balance: "0",
                network: "Inconnu",
                ensName: null,
                name: customWalletData[address]?.name || null,
                category: customWalletData[address]?.category || "default",
                lastActive: customWalletData[address]?.lastActive 
                  ? new Date(customWalletData[address].lastActive) 
                  : new Date()
              };
            }
          }
        } else {
          // Fallback si window.ethereum n'est pas disponible
          addresses.forEach((address) => {
            details[address] = {
              balance: "0",
              network: "Non connecté",
              ensName: null,
              name: customWalletData[address]?.name || null,
              category: customWalletData[address]?.category || "default",
              lastActive: customWalletData[address]?.lastActive 
                ? new Date(customWalletData[address].lastActive) 
                : new Date()
            };
          });
        }
      }

      setWalletsDetails(details);
    } catch (error) {
      console.error("Erreur de chargement des détails de wallet:", error);
      setError(
        "Impossible de charger les détails des wallets. Veuillez rafraîchir la page."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour sauvegarder les métadonnées des wallets
  const saveWalletMetadata = (address: string, data: { name?: string | undefined; category?: string | undefined }) => {
    const metadata = JSON.parse(localStorage.getItem("bitax-wallet-metadata") || "{}") as Record<string, any>;
    
    metadata[address] = {
      ...metadata[address],
      ...data,
      lastActive: new Date().toISOString()
    };
    
    localStorage.setItem("bitax-wallet-metadata", JSON.stringify(metadata));
    
    // Mettre à jour l'état local
    setWalletsDetails(prev => ({
      ...prev,
      [address]: {
        ...prev[address],
        ...data,
        lastActive: new Date()
      }
    }));
  };

  // Traitement après la connexion d'un wallet
  const handleWalletConnect = async (address: string, walletProvider: ethers.BrowserProvider) => {
    try {
      // Ajouter le nouveau wallet à la liste
      const updatedWallets = [...walletAddresses, address];
      setWalletAddresses(updatedWallets);

      // Sauvegarder dans localStorage
      localStorage.setItem(
        "bitax-connected-wallets",
        JSON.stringify(updatedWallets)
      );

      // Charger les détails du nouveau wallet
      const network = await walletProvider.getNetwork();
      const networkName = network.name === "homestead" ? "Ethereum" : network.name;

      const balance = await walletProvider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);

      let ensName = null;
      try {
        const ens = await walletProvider.lookupAddress(address);
        if (ens) ensName = ens;
      } catch {
        // Ignorer les erreurs ENS
      }

      setWalletsDetails((prev) => ({
        ...prev,
        [address]: {
          balance: balanceInEth,
          network: networkName,
          ensName,
          name: null,
          category: "default",
          lastActive: new Date()
        },
      }));

      // Enregistrer les métadonnées initiales
      saveWalletMetadata(address, { category: "default" });
      
      toast.success("Wallet connecté avec succès !");
      setError(null);
      
      // Si c'était le premier wallet, fermer l'onboarding
      if (walletAddresses.length === 0) {
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion du wallet:", error);
      toast.error("Impossible de se connecter au wallet. Veuillez réessayer.");
    }
  };

  // Déconnecter un wallet
  const handleDisconnectWallet = (address: string) => {
    try {
      // Filtrer le wallet de la liste
      const updatedWallets = walletAddresses.filter(
        (wallet) => wallet !== address
      );
      setWalletAddresses(updatedWallets);

      // Mettre à jour les détails
      const updatedDetails = { ...walletsDetails };
      delete updatedDetails[address];
      setWalletsDetails(updatedDetails);

      // Sauvegarder dans localStorage
      localStorage.setItem(
        "bitax-connected-wallets",
        JSON.stringify(updatedWallets)
      );
      
      // Si c'était le dernier wallet, déconnecter Web3Modal
      if (updatedWallets.length === 0) {
        disconnectWeb3Modal();
      }

      toast.success("Wallet déconnecté avec succès");
      setError(null);
      
      // Si c'était le dernier wallet, montrer l'onboarding
      if (updatedWallets.length === 0) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion du wallet:", error);
      setError("Impossible de déconnecter le wallet. Veuillez réessayer.");
    }
  };

  // Rafraîchir les détails de wallet
  const handleRefreshWallet = async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isDevModeEnabled()) {
        // Simuler un chargement en mode dev
        setTimeout(() => {
          setWalletsDetails((prev) => ({
            ...prev,
            [address]: {
              ...prev[address],
              balance: (+((Math.random() * 10).toFixed(4))).toString(),
              network: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"][
                Math.floor(Math.random() * 5)
              ],
            },
          }));
          setIsLoading(false);
          
          // Mettre à jour la dernière activité
          saveWalletMetadata(address, {});
          
          toast.success("Informations du wallet mises à jour");
        }, 1000);
        return;
      }

      // Vérifier si window.ethereum est disponible
      if (typeof window !== "undefined" && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Récupérer le nom du réseau
        const network = await provider.getNetwork();
        const networkName = network.name === "homestead" ? "Ethereum" : network.name;

        // Récupérer le solde
        const balance = await provider.getBalance(address);
        const balanceInEth = ethers.formatEther(balance);

        // Tenter de récupérer un nom ENS si disponible
        let ensName = null;
        try {
          const ens = await provider.lookupAddress(address);
          if (ens) ensName = ens;
        } catch {
          // Ignorer les erreurs ENS
        }

        setWalletsDetails((prev) => ({
          ...prev,
          [address]: {
            ...prev[address],
            balance: balanceInEth,
            network: networkName,
            ensName,
            lastActive: new Date()
          },
        }));
        
        // Mettre à jour la dernière activité
        saveWalletMetadata(address, {});
        
        toast.success("Informations du wallet mises à jour");
      } else {
        throw new Error("Provider Ethereum non disponible");
      }
    } catch (error) {
      console.error(`Erreur en chargeant les détails pour ${address}:`, error);
      setError(`Impossible de rafraîchir les détails pour ${address}.`);
      toast.error("Erreur lors de la mise à jour des informations");
    } finally {
      setIsLoading(false);
    }
  };

  // Commencer l'édition d'un wallet
  const startEditWallet = (address: string) => {
    setEditingWallet(address);
    setEditName(walletsDetails[address]?.name || "");
    setEditCategory(walletsDetails[address]?.category || "default");
  };

  // Sauvegarder les modifications de wallet
  const saveWalletEdit = () => {
    if (!editingWallet) return;
    
    saveWalletMetadata(editingWallet, {
      name: editName || undefined,
      category: editCategory
    });
    
    toast.success("Wallet mis à jour avec succès");
    setEditingWallet(null);
  };

  // Filtrer les wallets en fonction de la catégorie et de la recherche
  const filteredWallets = walletAddresses.filter((address: string) => {
    // Filtre par catégorie
    if (walletCategory !== "all" && walletsDetails[address]?.category !== walletCategory) {
      return false;
    }
    
    // Filtre par recherche
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const addressMatch = address.toLowerCase().includes(lowerQuery);
      const nameMatch = walletsDetails[address]?.name?.toLowerCase().includes(lowerQuery);
      const ensMatch = walletsDetails[address]?.ensName?.toLowerCase().includes(lowerQuery);
      
      return addressMatch || nameMatch || ensMatch;
    }
    
    return true;
  });

  // Trier les wallets par dernière activité
  const sortedWallets = [...filteredWallets].sort((a, b) => {
    const dateA = walletsDetails[a]?.lastActive || new Date(0);
    const dateB = walletsDetails[b]?.lastActive || new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  // Obtenir la couleur d'une catégorie
  const getCategoryColor = (categoryId: string): string => {
    const category = walletCategories.find(cat => cat.id === categoryId);
    return category ? category.color : "gray";
  };

  // Obtenir le nom d'une catégorie
  const getCategoryName = (categoryId: string): string => {
    const category = walletCategories.find(cat => cat.id === categoryId);
    return category ? category.name : "Non catégorisé";
  };

  // Stats agrégées pour tous les wallets
  const walletStats: WalletStats = {
    totalWallets: walletAddresses.length,
    totalBalance: walletAddresses.reduce((total: number, address: string) => {
      return total + parseFloat(walletsDetails[address]?.balance || "0");
    }, 0),
    networks: walletAddresses.reduce((networks: Record<string, number>, address: string) => {
      const network = walletsDetails[address]?.network;
      if (network) {
        networks[network] = (networks[network] || 0) + 1;
      }
      return networks;
    }, {})
  };

  // Formatter la valeur pour l'affichage
  const formatValue = (value: number): string => {
    if (value > 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else {
      return value.toFixed(4);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec titre et description */}
      <div className="relative mb-6 pb-6">
        {/* Effet de fond animé */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-primary-300 to-secondary-300 blur-3xl animate-pulse-slow"></div>
        </div>

        {/* Titre et description */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Wallets
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Connectez, gérez et surveillez vos wallets crypto pour analyser vos
              transactions sur différentes blockchains.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <DevModeToggle className="mr-2" />
            <button
              onClick={() => loadWalletDetails(walletAddresses)}
              disabled={isLoading || walletAddresses.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm flex items-center ${
                isLoading || walletAddresses.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
                  : "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Chargement...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Rafraîchir tout
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques des wallets connectés */}
      {walletAddresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Wallets</h3>
              <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{walletStats.totalWallets}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">wallets connectés</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Balance Totale</h3>
              <span className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{formatValue(walletStats.totalBalance)}</span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">ETH</span>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Réseaux</h3>
              <span className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(walletStats.networks).map(([network, count], index) => (
                <span key={index} className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  {network} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      {walletAddresses.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {walletCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setWalletCategory(category.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors
                  ${walletCategory === category.id
                    ? `bg-${category.color}-100 text-${category.color}-800 dark:bg-${category.color}-900/30 dark:text-${category.color}-300 border-${category.color}-300 dark:border-${category.color}-700`
                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                  } border`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Rechercher un wallet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Grille des wallets connectés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Carte pour ajouter un nouveau wallet */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Connecter un Wallet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
            Ajoutez un nouveau wallet pour analyser ses transactions
          </p>
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connexion...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H19C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V10C3 8.89543 3.89543 8 5 8H6M15 5H9M15 5C16.1046 5 17 5.89543 17 7V8H7V7C7 5.89543 7.89543 5 9 5M15 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Connecter Wallet
              </>
            )}
          </button>
        </div>

        {/* Afficher les wallets connectés */}
        {sortedWallets.map((address) => (
          <div
            key={address}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm relative"
          >
            {/* Badge de catégorie */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getCategoryColor(walletsDetails[address]?.category || "default")}-100 text-${getCategoryColor(walletsDetails[address]?.category || "default")}-800 dark:bg-${getCategoryColor(walletsDetails[address]?.category || "default")}-900/30 dark:text-${getCategoryColor(walletsDetails[address]?.category || "default")}-300`}>
                {getCategoryName(walletsDetails[address]?.category || "default")}
              </span>
            </div>
            
            {/* Badge de statut connecté */}
            <div className="absolute top-4 right-4">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  Connecté
                </span>
              </div>
            </div>

            {/* Adresse et ENS */}
            <div className="mb-4 mt-10">
              <div className="flex items-center mb-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2">
                  {address.substring(2, 4).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  {editingWallet === address ? (
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-2"
                      placeholder="Nom du wallet"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  ) : (
                    walletsDetails[address]?.name || walletsDetails[address]?.ensName ? (
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {walletsDetails[address]?.name || walletsDetails[address]?.ensName}
                      </h3>
                    ) : null
                  )}
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 truncate"
                    title={address}
                  >
                    {address.substring(0, 8)}...{address.substring(address.length - 6)}
                  </p>
                </div>
              </div>
            </div>

            {/* Détails du wallet */}
            <div className="space-y-4">
              {/* Solde */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Solde
                </span>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {isLoading ? (
                    <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    `${parseFloat(
                      walletsDetails[address]?.balance || "0"
                    ).toFixed(4)} ETH`
                  )}
                </span>
              </div>

              {/* Réseau */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Réseau
                </span>
                <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {isLoading ? (
                    <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    walletsDetails[address]?.network || "Non connecté"
                  )}
                </span>
              </div>
              
              {/* Sélection de catégorie (visible en mode édition) */}
              {editingWallet === address && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    {walletCategories.filter(cat => cat.id !== "all").map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {editingWallet === address ? (
                <>
                  <button
                    onClick={saveWalletEdit}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sauvegarder
                  </button>
                  <button
                    onClick={() => setEditingWallet(null)}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Annuler
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/transactions?address=${address}`}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Transactions
                  </Link>
                  <button
                    onClick={() => handleRefreshWallet(address)}
                    disabled={isLoading}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Actualiser
                      </>
                    )}
                  </button>
                  <Link
                    href={`/reports?address=${address}`}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Rapports
                  </Link>
                  <button
                    onClick={() => startEditWallet(address)}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Éditer
                  </button>
                  <button
                    onClick={() => handleDisconnectWallet(address)}
                    className="flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Déconnecter
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Section informative sur les wallets */}
      {walletAddresses.length === 0 && !isLoading && !showOnboarding && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-primary-600 dark:text-primary-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Aucun wallet connecté
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Pour analyser vos transactions et générer des rapports fiscaux, vous
              devez d'abord connecter au moins un wallet crypto.
            </p>

            <div className="max-w-xs mx-auto">
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8H19C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V10C3 8.89543 3.89543 8 5 8H6M15 5H9M15 5C16.1046 5 17 5.89543 17 7V8H7V7C7 5.89543 7.89543 5 9 5M15 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Connecter Wallet
                  </>
                )}
              </button>

              {/* Wallet supportés */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Wallets supportés
                </p>
                <div className="flex justify-center space-x-4">
                  {[
                    { name: "MetaMask", icon: "🦊" },
                    { name: "Coinbase", icon: "🔷" },
                    { name: "WalletConnect", icon: "📱" },
                  ].map((wallet, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center"
                      title={wallet.name}
                    >
                      <div className="text-2xl mb-1">{wallet.icon}</div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {wallet.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowOnboarding(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenue sur la gestion de Wallets</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Apprenez comment connecter et gérer facilement vos wallets crypto</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">Connectez vos wallets</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Utilisez MetaMask, Coinbase Wallet ou WalletConnect pour connecter vos adresses crypto</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">Organisez vos wallets</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Nommez et catégorisez vos wallets pour une meilleure organisation</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-lg">Analysez vos transactions</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">Obtenez des rapports détaillés de vos transactions pour simplifier votre déclaration fiscale</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 flex flex-col justify-center">
                <h3 className="font-medium text-gray-900 dark:text-white text-lg mb-4 text-center">Prêt à commencer ?</h3>
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 8H19C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V10C3 8.89543 3.89543 8 5 8H6M15 5H9M15 5C16.1046 5 17 5.89543 17 7V8H7V7C7 5.89543 7.89543 5 9 5M15 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Connecter Wallet
                    </>
                  )}
                </button>
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    {[
                      { name: "MetaMask", icon: "🦊" },
                      { name: "Coinbase", icon: "🔷" },
                      { name: "WalletConnect", icon: "📱" },
                    ].map((wallet, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center"
                        title={wallet.name}
                      >
                        <div className="text-2xl mb-1">{wallet.icon}</div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {wallet.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                    Pas de wallet ? <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">Installer MetaMask</a>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setShowOnboarding(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium"
              >
                Ne plus afficher
              </button>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg"
              >
                Je comprends
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section d'informations sur les blockchain */}
      <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              Connectez plusieurs réseaux blockchain
            </h3>
            <p className="text-blue-100 max-w-xl">
              Bitax supporte les principales blockchains comme Ethereum, Polygon,
              Arbitrum, Optimism et Base. Connectez plusieurs wallets pour une
              analyse complète.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/guide"
              className="inline-block px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Voir le guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
