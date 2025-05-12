// src/components/DevModeIndicator.tsx
import { useEffect, useState } from 'react';
import { useDevMode } from '@/context/DevModeContext';

const DevModeIndicator: React.FC = () => {
  const { isDevMode } = useDevMode();
  const [isVisible, setIsVisible] = useState(true);

  // Masquer l'indicateur après 10 secondes
  useEffect(() => {
    if (isDevMode) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isDevMode]);

  if (!isDevMode || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg shadow-lg animate-pulse"
      onClick={() => setIsVisible(false)}
    >
      🧪 Mode Test Actif - Données simulées
    </div>
  );
};

export default DevModeIndicator;