// src/components/Wallet/WalletConnectButton.tsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectHandler from './WalletConnectHandler';
import { WalletType } from '@/types/wallet';
import toast from 'react-hot-toast';

interface WalletConnectButtonProps {
  onWalletAdded?: (walletInfo: {
    address: string;
    walletType: WalletType;
    name?: string;
  }) => void;
  className?: string;
  variant?: 'default' | 'primary' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  buttonText?: string;
}

const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({
  onWalletAdded,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  buttonText = 'Connecter un wallet'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Gérer la connexion d'un wallet
  const handleWalletConnect = async (address: string, walletType: WalletType, name?: string) => {
    try {
      setIsLoading(true);

      // Valider l'adresse
      if (!ethers.isAddress(address)) {
        throw new Error('Adresse Ethereum invalide');
      }

      // Si un callback est fourni, l'appeler
      if (onWalletAdded) {
        await onWalletAdded({
          address,
          walletType,
          name
        });
      }

      // Afficher un toast de succès
      toast.success(`Wallet ${walletType} ajouté avec succès !`);
      
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du wallet:', error);
      toast.error(error.message || 'Erreur lors de l\'ajout du wallet');
    } finally {
      setIsLoading(false);
    }
  };

  // Classes CSS basées sur les props
  const getButtonClasses = () => {
    // Classe de base
    let classes = 'btn ';
    
    // Classes de taille
    switch(size) {
      case 'sm':
        classes += 'btn-sm ';
        break;
      case 'lg':
        classes += 'btn-lg ';
        break;
      default: // md
        classes += ''; // Taille par défaut
    }
    
    // Classes de variante
    switch(variant) {
      case 'primary':
        classes += 'btn-primary ';
        break;
      case 'outline':
        classes += 'btn-outline ';
        break;
      case 'premium':
        classes += 'btn-premium ';
        break;
      default: // default
        classes += 'btn-outline ';
    }
    
    // Largeur
    if (fullWidth) {
      classes += 'w-full ';
    }
    
    // États
    if (isLoading) {
      classes += 'opacity-70 cursor-not-allowed ';
    }
    
    return classes + className;
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isLoading}
        className={getButtonClasses()}
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 mr-3 bg-transparent border-2 border-transparent border-t-white rounded-full"></div>
            <span>Connexion en cours...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 10V3L4 14H7V21L16 10H13Z" fill="currentColor" />
            </svg>
            {buttonText}
          </>
        )}
      </button>

      <WalletConnectHandler
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </>
  );
};

export default WalletConnectButton;