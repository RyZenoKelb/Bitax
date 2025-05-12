// src/components/SupportedNetworks.tsx
import React from 'react';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import NetworkIcon from '@/components/Visual/NetworkIcon';

interface SupportedNetworksProps {
  onSelect?: (network: NetworkType) => void;
  selectedNetwork?: NetworkType;
  isLoading?: boolean;
  loadingNetwork?: NetworkType;
  layout?: 'grid' | 'horizontal';
  className?: string;
}

/**
 * Composant qui affiche les réseaux blockchain supportés
 * Peut être utilisé comme sélecteur si onSelect est fourni
 */
const SupportedNetworks: React.FC<SupportedNetworksProps> = ({
  onSelect,
  selectedNetwork,
  isLoading = false,
  loadingNetwork,
  layout = 'grid',
  className = '',
}) => {
  // Liste des réseaux principaux à afficher en priorité
  const mainNetworks: NetworkType[] = ['eth', 'polygon', 'arbitrum', 'optimism', 'base'];
  
  // Liste des réseaux secondaires (si on veut tout afficher)
  const secondaryNetworks: NetworkType[] = ['solana', 'avalanche', 'bsc'];
  
  const allNetworks = [...mainNetworks, ...secondaryNetworks];
  
  // Détermine si un réseau est en état de chargement
  const isNetworkLoading = (network: NetworkType) => {
    return isLoading && loadingNetwork === network;
  };
  
  // Détermine si un réseau est actuellement sélectionné
  const isNetworkSelected = (network: NetworkType) => {
    return selectedNetwork === network;
  };
  
  // Classe CSS pour le conteneur principal
  const containerClass = layout === 'grid' 
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3'
    : 'flex flex-wrap gap-3';
  
  return (
    <div className={`${containerClass} ${className}`}>
      {mainNetworks.map((network) => (
        <div
          key={network}
          onClick={() => onSelect && onSelect(network)}
          className={`relative group flex items-center justify-center ${layout === 'grid' ? 'flex-col' : 'flex-row'} p-3 rounded-xl border transition-all duration-200 ${
            isNetworkSelected(network) 
              ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
              : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-600'
          } ${onSelect ? 'cursor-pointer' : ''}`}
        >
          {/* Indicateur de chargement */}
          {isNetworkLoading(network) && (
            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm rounded-xl">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <NetworkIcon 
            network={network} 
            size={layout === 'grid' ? 44 : 32} 
            className={`${layout === 'grid' ? 'mb-2' : 'mr-3'}`}
          />
          
          <div className={`${layout === 'grid' ? 'text-center' : ''}`}>
            <span className={`font-medium text-gray-900 dark:text-white ${layout === 'grid' ? 'text-sm' : 'text-base'}`}>
              {SUPPORTED_NETWORKS[network].name}
            </span>
            
            {layout !== 'grid' && (
              <div className="flex items-center mt-1">
                <div 
                  className="w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: SUPPORTED_NETWORKS[network].color }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {SUPPORTED_NETWORKS[network].nativeTokenSymbol}
                </span>
              </div>
            )}
          </div>
          
          {/* Badge de sélection */}
          {isNetworkSelected(network) && (
            <div className="absolute -top-1.5 -right-1.5 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SupportedNetworks;