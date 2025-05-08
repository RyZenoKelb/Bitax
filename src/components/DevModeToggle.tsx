// src/components/DevModeToggle.tsx
import { useDevMode } from '@/context/DevModeContext';

interface DevModeToggleProps {
  className?: string;
}

const DevModeToggle: React.FC<DevModeToggleProps> = ({ className }) => {
  const { isDevMode, toggleDevMode } = useDevMode();

  return (
    <div className={`flex items-center ${className || ''}`}>
      <div className="mr-3">
        <div className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5">
          Mode test
          {isDevMode && (
            <span className="ml-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 animate-pulse">
              <span className="sr-only">Actif</span>
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {isDevMode ? (
            <span className="text-green-500 font-medium">Activé (données simulées)</span>
          ) : (
            <span>Désactivé (données réelles)</span>
          )}
        </div>
      </div>
      <button
        onClick={toggleDevMode}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          isDevMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
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