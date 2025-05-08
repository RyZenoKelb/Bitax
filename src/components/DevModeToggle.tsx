// src/components/DevModeToggle.tsx
import { useState, useEffect } from 'react';

interface DevModeToggleProps {
  className?: string;
}

const DevModeToggle: React.FC<DevModeToggleProps> = ({ className }) => {
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  // Charger la préférence de localStorage au montage du composant
  useEffect(() => {
    const savedMode = localStorage.getItem('bitax-dev-mode');
    setIsDevMode(savedMode === 'true');
  }, []);

  // Mettre à jour l'état et sauvegarder dans localStorage
  const toggleDevMode = () => {
    const newState = !isDevMode;
    setIsDevMode(newState);
    localStorage.setItem('bitax-dev-mode', String(newState));
    
    // Rafraîchir la page pour appliquer les changements
    // Si vous préférez ne pas rafraîchir, vous pouvez enlever cette ligne
    // window.location.reload();
  };

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className="mr-3">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
          Mode test
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {isDevMode ? 'Activé (données simulées)' : 'Désactivé (données réelles)'}
        </div>
      </div>
      <button
        onClick={toggleDevMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          isDevMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
        }`}
        role="switch"
        aria-checked={isDevMode}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDevMode ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default DevModeToggle;