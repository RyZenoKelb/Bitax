// src/context/DevModeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isDevModeEnabled } from '@/utils/mockTransactions';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const DevModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  // Charger l'état du mode développeur au démarrage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDevMode(isDevModeEnabled());
    }
  }, []);

  // Fonction pour basculer le mode développeur
  const toggleDevMode = () => {
    const newState = !isDevMode;
    setIsDevMode(newState);
    localStorage.setItem('bitax-dev-mode', String(newState));
    // Rafraîchir la page pour appliquer les changements globalement
    // Vous pouvez supprimer cette ligne si vous préférez un changement sans rechargement
    window.location.reload();
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useDevMode = () => {
  const context = useContext(DevModeContext);
  if (context === undefined) {
    throw new Error('useDevMode doit être utilisé à l\'intérieur d\'un DevModeProvider');
  }
  return context;
};