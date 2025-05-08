'use client';

// src/context/DevModeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { isDevModeEnabled } from '@/utils/mockTransactions';

interface DevModeContextType {
  isDevMode: boolean;
  toggleDevMode: () => void;
}

const DevModeContext = createContext<DevModeContextType | undefined>(undefined);

export const useDevMode = (): DevModeContextType => {
  const context = useContext(DevModeContext);
  if (!context) {
    throw new Error('useDevMode must be used within a DevModeProvider');
  }
  return context;
};

export const DevModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDevMode(isDevModeEnabled());
  }, []);

  const toggleDevMode = () => {
    const newState = !isDevMode;
    setIsDevMode(newState);
    localStorage.setItem('bitax-dev-mode', newState ? 'enabled' : 'disabled');
  };

  return (
    <DevModeContext.Provider value={{ isDevMode, toggleDevMode }}>
      {children}
    </DevModeContext.Provider>
  );
};