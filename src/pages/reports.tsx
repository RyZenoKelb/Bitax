// src/pages/reports.tsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import WalletConnectButton from '@/components/Wallet/WalletConnectButton';

// Types pour les rapports fiscaux
interface FiscalReport {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  year: number;
  type: 'annual' | 'quarterly' | 'custom';
  status: 'completed' | 'processing' | 'error';
  downloadUrl?: string;
  walletAddress: string;
  networks: string[];
  transactionCount: number;
  taxMethod: 'FIFO' | 'LIFO' | 'HIFO' | 'ACB';
  format: 'PDF' | 'CSV' | 'XLSX';
}

// Pour le moment, données fictives pour démonstration
const sampleReports: FiscalReport[] = [
  /*
  {
    id: '1',
    title: 'Rapport fiscal annuel 2024',
    description: 'Rapport complet des opérations crypto pour l\'année fiscale 2024',
    createdAt: '2025-01-15T14:30:00Z',
    year: 2024,
    type: 'annual',
    status: 'completed',
    downloadUrl: '/reports/rapport-fiscal-2024.pdf',
    walletAddress: '0x1234...5678',
    networks: ['Ethereum', 'Polygon', 'Arbitrum'],
    transactionCount: 142,
    taxMethod: 'FIFO',
    format: 'PDF'
  },
  {
    id: '2',
    title: 'Rapport Q3 2024',
    description: 'Rapport trimestriel juillet - septembre 2024',
    createdAt: '2024-10-05T09:15:00Z',
    year: 2024,
    type: 'quarterly',
    status: 'completed',
    downloadUrl: '/reports/rapport-q3-2024.pdf',
    walletAddress: '0x1234...5678',
    networks: ['Ethereum', 'Optimism'],
    transactionCount: 48,
    taxMethod: 'FIFO',
    format: 'PDF'
  }
  */
];

export default function Reports() {
  // États
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const [walletAddresses, setWalletAddresses] = useState<string[]>([]);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [reports, setReports] = useState<FiscalReport[]>(sampleReports);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewReportModal, setShowNewReportModal] = useState<boolean>(false);
  const [filterYear, setFilterYear] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'annual' | 'quarterly' | 'custom'>('all');
  
  // Vérifier le statut premium et récupérer les wallets connectés
  useEffect(() => {
    const isPremium = localStorage.getItem('bitax-premium') === 'true';
    setIsPremiumUser(isPremium);
    
    // Vérifier si des wallets sont déjà connectés
    const connectedWallets = JSON.parse(localStorage.getItem('bitax-connected-wallets') || '[]');
    if (connectedWallets.length > 0) {
      setWalletAddresses(connectedWallets);
      setIsWalletConnected(true);
      
      // Charger les rapports de l'utilisateur
      fetchReports();
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
      
      // Charger les rapports de l'utilisateur
      fetchReports();
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
      setError('Impossible de se connecter au wallet. Veuillez réessayer.');
    }
  };

  // Récupérer les rapports de l'utilisateur
  const fetchReports = async () => {
    setIsLoading(true);
    
    try {
      // Simule un chargement d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour l'instant, on utilise simplement les exemples statiques
      // Dans le futur, on ferait un appel à l'API pour récupérer les vrais rapports
      setReports(sampleReports);
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error);
      setError('Impossible de récupérer vos rapports fiscaux.');
    } finally {
      setIsLoading(false);
    }
  };

  // Générer un nouveau rapport
  const handleGenerateReport = async (reportData: any) => {
    // Cette fonction serait implémentée pour créer un nouveau rapport
    setShowNewReportModal(false);
    
    // Simule une génération de rapport
    setIsLoading(true);
    try {
      // Simule un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // À l'avenir, nous ajouterions le nouveau rapport à la liste
      // setReports([newReport, ...reports]);
      
      alert('Fonctionnalité non implémentée: la génération de rapports sera ajoutée prochainement.');
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      setError('Une erreur est survenue lors de la génération du rapport.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec effet de gradient */}
      <div className="relative mb-6 pb-6">
        {/* Effet de fond animé */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
          <div className="w-96 h-96 rounded-full bg-gradient-to-br from-purple-300 to-blue-300 blur-3xl animate-pulse-slow"></div>
        </div>
        
        {/* Titre et boutons d'action */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Rapports Fiscaux
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
              Consultez et téléchargez vos rapports fiscaux pour vos déclarations d'impôts sur les crypto-monnaies.
            </p>
          </div>
          
          {/* Actions et vue du wallet */}
          {isWalletConnected && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <div className="flex flex-shrink-0 h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white">
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
              
              <button
                onClick={() => setShowNewReportModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-sm flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nouveau rapport
              </button>
              
              <Link 
                href="/transactions" 
                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Voir les transactions
              </Link>
            </div>
          )}
        </div>
        
        {/* Filtres pour les rapports */}
        {isWalletConnected && reports.length > 0 && (
          <div className="mt-6 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filtrer par :</span>
              
              <select
                value={filterYear.toString()}
                onChange={(e) => setFilterYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-0 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="all">Toutes les années</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border-0 dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="all">Tous les types</option>
                <option value="annual">Annuel</option>
                <option value="quarterly">Trimestriel</option>
                <option value="custom">Personnalisé</option>
              </select>
              
              <div className="ml-auto">
                <button
                  onClick={fetchReports}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Afficher les erreurs */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4 text-red-700 dark:text-red-300 animate-pulse">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Contenu principal */}
      {!isWalletConnected ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Connectez votre wallet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Pour consulter vos rapports fiscaux et en générer de nouveaux, veuillez d'abord connecter votre wallet crypto.
            </p>
            
            <div className="max-w-xs mx-auto">
              <WalletConnectButton 
                onConnect={handleWalletConnect}
                variant="primary"
                fullWidth
                size="lg"
              />
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400 rounded-full animate-spin"></div>
          <div className="ml-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Chargement des rapports</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Veuillez patienter pendant que nous récupérons vos rapports fiscaux...</p>
          </div>
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-6">
          {/* Liste des rapports */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rapport
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Format
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {report.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {report.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(report.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          report.type === 'annual' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : report.type === 'quarterly'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                        }`}>
                          {report.type === 'annual' 
                            ? 'Annuel' 
                            : report.type === 'quarterly' 
                            ? 'Trimestriel'
                            : 'Personnalisé'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {report.transactionCount} transactions
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                          {report.format}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                          report.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : report.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {report.status === 'completed'
                            ? 'Terminé'
                            : report.status === 'processing'
                            ? 'En cours'
                            : 'Erreur'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          {report.status === 'completed' && (
                            <a
                              href={report.downloadUrl}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              Télécharger
                            </a>
                          )}
                          <button
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                          >
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {reports.length > 0 && (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Affichage de {reports.length} rapports
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Exporter tous
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <svg className="w-20 h-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">Aucun rapport fiscal</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Vous n'avez pas encore généré de rapports fiscaux. Créez votre premier rapport pour faciliter votre déclaration d'impôts.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowNewReportModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg flex items-center justify-center mx-auto space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Générer un rapport</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Section premium (si non premium) */}
      {!isPremiumUser && isWalletConnected && (
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Passez à Bitax Premium</h3>
              <p className="text-purple-100 max-w-xl">
                Accédez à des rapports fiscaux avancés, des méthodes de calcul personnalisées et un support prioritaire pour vos déclarations.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                href="/pricing" 
                className="inline-block px-6 py-3 bg-white text-purple-600 hover:bg-purple-50 font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Découvrir Premium
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Commentaires sur les fonctionnalités futures */}
      {/* 
      DÉVELOPPEMENTS FUTURS POUR LA PAGE RAPPORTS:
      
      1. Génération de rapports:
        - Implémentation de plusieurs méthodes de calcul (FIFO, LIFO, HIFO, etc.)
        - Support pour différentes juridictions fiscales (France, Belgique, Suisse, Canada...)
        - Calcul des plus-values à court et long terme
        - Prise en compte des frais de transaction
        
      2. Formats d'export:
        - Génération PDF avec mise en page professionnelle
        - Export Excel avec formules de calcul
        - Export CSV pour compatibilité avec d'autres logiciels
        - Format spécifique pour le formulaire 2086 français
      
      3. Historique et stockage:
        - Stockage chiffré des rapports générés
        - Comparaison entre différentes années fiscales
        - Versions archivées avec possibilité de restauration
        
      4. Fonctionnalités avancées:
        - Planification fiscale et simulations
        - Rapports pour multiples wallets/comptes
        - Intégration directe avec les plateformes fiscales gouvernementales
        - Conseils fiscaux personnalisés (avec avertissement approprié)
        - Rapports interactifs avec visualisations
        
      5. Améliorations UX:
        - Interface de création guidée (wizard)
        - Notifications par email quand un rapport est prêt
        - Aperçu avant génération
        - Rappels automatiques pour les échéances fiscales
      */}
    </div>
  );
}