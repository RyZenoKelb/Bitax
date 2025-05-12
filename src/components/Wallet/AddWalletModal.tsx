// src/components/Wallet/AddWalletModal.tsx
import { useState, Fragment } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';
import NetworkIcon from '@/components/Visual/NetworkIcon';

interface AddWalletModalProps {
  onAdd: (wallet: { address: string; network: string; name?: string; isPrimary?: boolean }) => void;
  onClose: () => void;
  hasPrimaryWallet: boolean;
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ onAdd, onClose, hasPrimaryWallet }) => {
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [network, setNetwork] = useState<NetworkType>('eth');
  const [isPrimary, setIsPrimary] = useState<boolean>(!hasPrimaryWallet);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  
  // Valider l'adresse du wallet
  const validateAddress = (address: string): boolean => {
    // Vérifier que l'adresse est une adresse Ethereum valide (commence par 0x et contient 42 caractères)
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      setAddressError('Adresse Ethereum invalide. Elle doit commencer par 0x et contenir 42 caractères.');
      return false;
    }
    
    setAddressError(null);
    return true;
  };
  
  // Gérer l'ajout d'un wallet
  const handleAddWallet = async () => {
    try {
      setError(null);
      
      // Valider l'adresse
      if (!validateAddress(address)) {
        return;
      }
      
      setIsLoading(true);
      
      // Appeler la fonction onAdd avec les informations du wallet
      await onAdd({
        address,
        network,
        name: name.trim() || null,
        isPrimary
      });
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du wallet');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>
          
          {/* Centrer verticalement */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
              >
                Ajouter un nouveau wallet
              </Dialog.Title>
              
              <div className="mt-4 space-y-4">
                {/* Adresse du wallet */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adresse du wallet
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md ${
                        addressError ? 'border-red-300 dark:border-red-500' : ''
                      }`}
                      placeholder="0x..."
                    />
                    {addressError && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{addressError}</p>
                    )}
                  </div>
                </div>
                
                {/* Nom du wallet (optionnel) */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nom du wallet <span className="text-gray-400 dark:text-gray-500">(optionnel)</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      placeholder="Mon wallet principal..."
                    />
                  </div>
                </div>
                
                {/* Sélection du réseau */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Réseau blockchain
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(SUPPORTED_NETWORKS).map(([netId, netInfo]) => (
                      <button
                        key={netId}
                        type="button"
                        onClick={() => setNetwork(netId as NetworkType)}
                        className={`flex items-center justify-start p-3 rounded-lg text-sm font-medium ${
                          network === netId 
                            ? 'bg-primary-50 text-primary-700 border border-primary-200 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-700'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                        }`}
                      >
                        <NetworkIcon network={netId as NetworkType} size={20} className="mr-2" />
                        {netInfo.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Option wallet principal */}
                <div className="flex items-center">
                  <input
                    id="isPrimary"
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                  />
                  <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Définir comme wallet principal
                    {hasPrimaryWallet && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1 text-xs">(remplacera le wallet principal actuel)</span>
                    )}
                  </label>
                </div>
                
                {/* Afficher les erreurs */}
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                  onClick={onClose}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAddWallet}
                  disabled={!address || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Ajout en cours...
                    </>
                  ) : (
                    'Ajouter le wallet'
                  )}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddWalletModal;