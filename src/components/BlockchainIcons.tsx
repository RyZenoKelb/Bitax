// src/components/BlockchainIcons.tsx
import React from 'react';

interface BlockchainIconProps {
  size?: number;
  className?: string;
}

export const EthereumIcon: React.FC<BlockchainIconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="16" fill="#627EEA"/>
    <path d="M16.498 4V12.87L23.995 16.22L16.498 4Z" fill="white" fillOpacity="0.602"/>
    <path d="M16.498 4L9 16.22L16.498 12.87V4Z" fill="white"/>
    <path d="M16.498 21.968V27.995L24 17.616L16.498 21.968Z" fill="white" fillOpacity="0.602"/>
    <path d="M16.498 27.995V21.967L9 17.616L16.498 27.995Z" fill="white"/>
    <path d="M16.498 20.573L23.995 16.22L16.498 12.872V20.573Z" fill="white" fillOpacity="0.2"/>
    <path d="M9 16.22L16.498 20.573V12.872L9 16.22Z" fill="white" fillOpacity="0.602"/>
  </svg>
);

export const PolygonIcon: React.FC<BlockchainIconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="16" fill="#8247E5"/>
    <path d="M21.092 13.12C20.686 12.888 20.222 12.888 19.815 13.12L16.677 14.92L14.416 16.184L11.277 17.984C10.87 18.216 10.407 18.216 10 17.984L7.611 16.6C7.204 16.368 6.944 15.96 6.944 15.496V12.728C6.944 12.32 7.148 11.912 7.611 11.68L10 10.296C10.407 10.064 10.87 10.064 11.277 10.296L13.666 11.68C14.073 11.912 14.333 12.32 14.333 12.784V14.584L16.594 13.32V11.52C16.594 11.112 16.39 10.704 15.927 10.472L11.333 7.816C10.926 7.584 10.463 7.584 10.055 7.816L5.407 10.472C4.944 10.704 4.74 11.112 4.74 11.52V16.704C4.74 17.112 4.944 17.52 5.407 17.752L10.055 20.408C10.463 20.64 10.926 20.64 11.333 20.408L14.472 18.608L16.733 17.344L19.871 15.544C20.278 15.312 20.742 15.312 21.149 15.544L23.538 16.928C23.945 17.16 24.205 17.568 24.205 18.032V20.8C24.205 21.208 24.001 21.616 23.538 21.848L21.149 23.232C20.742 23.464 20.278 23.464 19.871 23.232L17.482 21.848C17.075 21.616 16.815 21.208 16.815 20.744V18.944L14.555 20.208V22.008C14.555 22.416 14.759 22.824 15.222 23.056L19.871 25.712C20.278 25.944 20.742 25.944 21.149 25.712L25.797 23.056C26.204 22.824 26.464 22.416 26.464 21.952V16.768C26.464 16.36 26.26 15.952 25.797 15.72L21.092 13.12Z" fill="white"/>
  </svg>
);

export const ArbitrumIcon: React.FC<BlockchainIconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="16" fill="#28A0F0"/>
    <path d="M18.415 7.935L21.39 13.338C21.558 13.62 21.432 13.975 21.143 14.14L16.958 16.438C16.656 16.611 16.278 16.501 16.1 16.213L13.003 11.018C12.835 10.736 12.961 10.381 13.25 10.217L17.557 7.71C17.858 7.536 18.237 7.646 18.415 7.935Z" fill="white"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M15.944 17.533C16.175 17.533 16.391 17.674 16.483 17.883L20.771 26.635C20.879 26.879 20.764 27.166 20.517 27.274C20.451 27.304 20.38 27.319 20.308 27.319H11.605C11.337 27.319 11.119 27.103 11.119 26.837C11.119 26.766 11.135 26.696 11.166 26.631L15.445 17.889C15.539 17.675 15.758 17.533 15.994 17.533H15.944Z" fill="white"/>
  </svg>
);

export const OptimismIcon: React.FC<BlockchainIconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="16" fill="#FF0420"/>
    <path d="M11.5 23.5C9.01 23.5 7 21.49 7 19V13C7 10.51 9.01 8.5 11.5 8.5C13.99 8.5 16 10.51 16 13V19C16 21.49 13.99 23.5 11.5 23.5ZM11.5 11.5C10.67 11.5 10 12.17 10 13V19C10 19.83 10.67 20.5 11.5 20.5C12.33 20.5 13 19.83 13 19V13C13 12.17 12.33 11.5 11.5 11.5Z" fill="white"/>
    <path d="M21.5 23.5C19.01 23.5 17 21.49 17 19V13C17 10.51 19.01 8.5 21.5 8.5C23.99 8.5 26 10.51 26 13V19C26 21.49 23.99 23.5 21.5 23.5ZM21.5 11.5C20.67 11.5 20 12.17 20 13V19C20 19.83 20.67 20.5 21.5 20.5C22.33 20.5 23 19.83 23 19V13C23 12.17 22.33 11.5 21.5 11.5Z" fill="white"/>
  </svg>
);

export const BaseIcon: React.FC<BlockchainIconProps> = ({ size = 40, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="16" cy="16" r="16" fill="#0052FF"/>
    <path d="M16 6C10.47 6 6 10.47 6 16C6 21.53 10.47 26 16 26C21.53 26 26 21.53 26 16C26 10.47 21.53 6 16 6ZM16 22.5C12.41 22.5 9.5 19.59 9.5 16C9.5 12.41 12.41 9.5 16 9.5C19.59 9.5 22.5 12.41 22.5 16C22.5 19.59 19.59 22.5 16 22.5Z" fill="white"/>
  </svg>
);

// Composant de sélection de blockchain
interface BlockchainSelectorProps {
  network: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ 
  network, 
  name, 
  isActive, 
  onClick, 
  className = '' 
}) => {
  const getIcon = () => {
    switch(network) {
      case 'eth':
        return <EthereumIcon />;
      case 'polygon':
        return <PolygonIcon />;
      case 'arbitrum':
        return <ArbitrumIcon />;
      case 'optimism':
        return <OptimismIcon />;
      case 'base':
        return <BaseIcon />;
      default:
        return <EthereumIcon />;
    }
  };
  
  return (
    <div 
      className={`
        flex flex-col items-center justify-center p-5 rounded-xl cursor-pointer 
        transition-all duration-300 ease-in-out
        ${isActive 
          ? 'bg-primary-900/20 border-2 border-primary-500/40 shadow-glow-primary' 
          : 'bg-bitax-dark-light border border-bitax-border hover:bg-bitax-dark-lighter hover:border-primary-900/30'
        }
        ${className}
      `}
      onClick={onClick}
    >
      {getIcon()}
      <span className="mt-3 font-medium text-white">{name}</span>
    </div>
  );
};

// Composant bouton de scan
interface ScanButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  network?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ScanButton: React.FC<ScanButtonProps> = ({ 
  onClick, 
  isLoading = false, 
  disabled = false, 
  network,
  className = '',
  children
}) => {
  const getNetworkName = () => {
    switch(network) {
      case 'eth':
        return 'Ethereum';
      case 'polygon':
        return 'Polygon';
      case 'arbitrum':
        return 'Arbitrum';
      case 'optimism':
        return 'Optimism';
      case 'base':
        return 'Base';
      default:
        return '';
    }
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        px-4 py-2.5 rounded-lg font-medium text-white
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${isLoading || disabled
          ? 'bg-bitax-button/50 cursor-not-allowed'
          : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:shadow-glow-primary transform hover:-translate-y-0.5'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Scan en cours...
        </>
      ) : children ? (
        children
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Scanner {getNetworkName()}
        </>
      )}
    </button>
  );
};

// Composant bouton de scan multi-chain
export const MultiChainScanButton: React.FC<ScanButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        w-full py-3 px-4 rounded-lg font-medium text-white
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${isLoading || disabled
          ? 'bg-bitax-button/50 cursor-not-allowed'
          : 'bg-gradient-to-r from-accent-600 via-primary-600 to-secondary-600 hover:shadow-glow-accent transform hover:-translate-y-0.5'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Multi-scan en cours...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          Scan automatique multi-chain
        </>
      )}
    </button>
  );
};