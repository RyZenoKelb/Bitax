// src/components/NetworkIcon.tsx
import React from 'react';
import { NetworkType } from '@/utils/transactions';

interface NetworkIconProps {
  network: NetworkType;
  size?: number;
  className?: string;
}

const NetworkIcon: React.FC<NetworkIconProps> = ({ 
  network, 
  size = 24,
  className = ''
}) => {
  const getNetworkColor = (network: NetworkType): string => {
    switch (network) {
      case 'eth':
        return '#627EEA';
      case 'polygon':
        return '#8247E5';
      case 'arbitrum':
        return '#28A0F0';
      case 'optimism':
        return '#FF0420';
      case 'base':
        return '#0052FF';
      case 'solana':
        return '#14F195';
      case 'avalanche':
        return '#E84142';
      case 'bsc':
        return '#F0B90B';
      default:
        return '#627EEA';
    }
  };

  const renderNetworkIcon = () => {
    const color = getNetworkColor(network);
    
    switch (network) {
      case 'eth':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M16.498 4v8.87l7.497 3.35z" fill="#FFF" fillOpacity="0.6" />
            <path d="M16.498 4L9 16.22l7.498-3.35z" fill="#FFF" />
            <path d="M16.498 21.968v6.027L24 17.616z" fill="#FFF" fillOpacity="0.6" />
            <path d="M16.498 27.995v-6.028L9 17.616z" fill="#FFF" />
            <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="#FFF" fillOpacity="0.2" />
            <path d="M9 16.22l7.498 4.353v-7.701z" fill="#FFF" fillOpacity="0.6" />
          </svg>
        );
      
      case 'polygon':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M21.092 12.693c-.369-.215-.848-.215-1.254 0L16.65 14.61l-2.13 1.215-3.188 1.918c-.369.215-.848.215-1.254 0l-2.5-1.488c-.369-.215-.627-.61-.627-1.057V11.73c0-.41.258-.806.627-1.057l2.462-1.453c.369-.215.848-.215 1.254 0l2.462 1.453c.369.215.627.61.627 1.057v1.918l2.13-1.25v-1.917c0-.41-.258-.806-.627-1.057l-4.555-2.7c-.369-.215-.848-.215-1.254 0L6.627 9.03C6.258 9.282 6 9.677 6 10.125v5.365c0 .41.258.806.627 1.057l4.592 2.7c.369.215.848.215 1.254 0l3.188-1.882 2.13-1.25 3.188-1.882c.369-.215.848-.215 1.254 0l2.462 1.453c.369.215.627.61.627 1.057v2.468c0 .41-.258.806-.627 1.057l-2.462 1.488c-.369.215-.848.215-1.254 0l-2.462-1.453c-.369-.215-.627-.61-.627-1.057V14.33l-2.13 1.25v1.917c0 .41.258.806.627 1.057l4.592 2.7c.369.215.848.215 1.254 0l4.592-2.7c.369-.215.627-.61.627-1.057v-5.4c0-.41-.258-.806-.627-1.057l-4.629-2.736z" fill="#FFF" />
          </svg>
        );
        
      case 'arbitrum':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M14.3 7.909l-7.139 12.544c-.746 1.257.318 2.816 1.763 2.598l15.156-2.29a.177.177 0 00.037-.339L15.95 7.95a1.356 1.356 0 00-1.65-.042zm1.888.7l6.83 9.664H15.3c-.145 0-.262-.117-.262-.261V9.166c0-.338.358-.545.63-.347z" fill="#FFF" />
          </svg>
        );
        
      case 'optimism':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M10.93 9.822L8.76 13.781l6.284 1.664-3.339-5.623a.548.548 0 00-.775-.25v.25zm5.88 5.621l-6.226-1.694 2.945 5.312 3.339-3.31-.058-.308zm-.308-5.454l3.339 5.562 2.17-3.898-4.733-1.973a.548.548 0 00-.776.31zm4.56 6.312l-3.05 5.454a.548.548 0 01-.776.188l-3.339-5.621 6.226-1.358.94 1.337zm-10.44 1.027l1.78 3.222c.14.256.444.392.733.315l6.518-1.725-4.849 4.825c-.189.188-.47.264-.733.202l-5.296-1.661a.703.703 0 01-.463-.437l-2.19-5.13c-.116-.265-.068-.562.116-.787l3.399-3.898 1.053 5.074h-.067z" fill="#FFF" />
          </svg>
        );
        
      case 'base':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M16 6C10.48 6 6 10.48 6 16s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm5.32 15.32c-.18.18-.43.18-.61 0l-4.7-4.7-4.7 4.7c-.18.18-.43.18-.61 0-.18-.18-.18-.43 0-.61l4.7-4.7-4.7-4.7c-.18-.18-.18-.43 0-.61.18-.18.43-.18.61 0l4.7 4.7 4.7-4.7c.18-.18.43-.18.61 0 .18.18.18.43 0 .61l-4.7 4.7 4.7 4.7c.18.18.18.43 0 .61z" fill="#FFF" />
          </svg>
        );
        
      case 'solana':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill="#000" />
            <path d="M10.5 21.18l2.38-2.38h8.52a.52.52 0 01.37.88l-2.38 2.38H10.5a.52.52 0 01-.37-.88H10.5zm0-5.18l2.38-2.38h8.52a.52.52 0 01.37.88l-2.38 2.38H10.5a.52.52 0 01-.37-.88H10.5zm10.9-4.3h-8.52L10.5 9.32a.52.52 0 01.37-.88h8.9l2.38 2.38a.52.52 0 01-.37.88h-.37z" fill="#14F195" />
          </svg>
        );
        
      case 'avalanche':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M20.72 17.47h3.5l-7.56-13.2a.95.95 0 00-1.7 0l-3.74 6.48h3.07c.24 0 .47.1.63.29a.9.9 0 01.19.67l-.75 4.7c-.06.35.04.7.26.98.22.27.55.42.9.42h4.32c.35 0 .67-.15.9-.42.22-.27.32-.63.26-.98l-.28-1.75v-.02c0-.12-.13-.2-.24-.15l-.93.39a.19.19 0 00-.1.1l.07.45z" fill="#FFF" />
            <path d="M23.63 22.36l-7.56 5.38c-.23.17-.5.26-.78.26-.27 0-.55-.09-.78-.26l-7.56-5.38a.95.95 0 01-.35-1.06l1.95-6.23h3.5c.12 0 .22.1.2.22l-.19 1.26a.2.2 0 00.26.22l1.67-.7c.06-.03.1-.08.13-.14l.38-1.33c.03-.12.15-.2.27-.2h4.25l-3.03 1.27c-.04.01-.07.05-.08.09l-1.81 5.67c-.06.2.16.36.33.24l6.13-4.16a.95.95 0 011.32.24l2.18 2.75c.28.36.32.85.07 1.25v.13z" fill="#FFF" />
          </svg>
        );
        
      case 'bsc':
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z" fill="#FFF" />
          </svg>
        );
        
      default:
        // Cercle générique pour les réseaux non spécifiés
        return (
          <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
            <circle cx="16" cy="16" r="16" fill={color} />
            <text x="16" y="20" fontSize="14" textAnchor="middle" fill="#FFF">
              {typeof network === 'string' ? network.charAt(0).toUpperCase() : 'X'}
            </text>
          </svg>
        );
    }
  };

  return renderNetworkIcon();
};

export default NetworkIcon;