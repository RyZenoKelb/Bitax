// src/components/Wallet/ImportFromExchangeModal.tsx
import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ImportFromExchangeModalProps {
  onImport: (exchange: { name: string; apiKey: string; apiSecret: string }) => void;
  onClose: () => void;
}

const exchanges = [
  { id: 'binance', name: 'Binance', logo: '🔶' },
  { id: 'coinbase', name: 'Coinbase', logo: '🔵' },
  { id: 'kraken', name: 'Kraken', logo: '🐙' },
  { id: 'ftx', name: 'FTX', logo: '🔷' },
  { id: 'kucoin', name: 'KuCoin', logo: '🟢' },
  { id: 'huobi', name: 'Huobi', logo: '🔴' },
];

const ImportFromExchangeModal: React.FC<ImportFromExchangeModalProps> = ({ onImport, onClose }) => {
  const [selectedExchange, setSelectedExchange] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImport = async () => {
    if (!selectedExchange) {
      setError('Veuillez sélectionner un exchange');
      return;
    }
    
    if (!apiKey.trim()) {
      setError('Veuillez entrer une clé API');
      return;
    }
    
    if (!apiSecret.trim()) {
      setError('Veuillez entrer une clé secrète API');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const exchange = exchanges.find(e => e.id === selectedExchange);
      if (!exchange) throw new Error('Exchange non reconnu');
      
      onImport({
        name: exchange.name,
        apiKey,
        apiSecret
      });
      
      onClose();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'importation');
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
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
            </Transition.Child>
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
                Importer depuis un exchange
              </Dialog.Title>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connectez votre compte d'exchange pour importer automatiquement vos transactions.
                </p>
                
                <div className="mt-4 space-y-4">
                  {/* Sélection de l'exchange */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sélectionnez un exchange
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {exchanges.map(exchange => (
                        <button
                          key={exchange.id}
                          type="button"
                          onClick={() => setSelectedExchange(exchange.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg ${
                            selectedExchange === exchange.id 
                              ? 'bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-700'
                              : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600'
                          } border`}
                        >
                          <span className="text-2xl mb-1">{exchange.logo}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {exchange.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Champs API uniquement si un exchange est sélectionné */}
                  {selectedExchange && (
                    <>
                      <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Clé API
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            id="apiKey"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Clé secrète API
                        </label>
                        <div className="mt-1">
                          <input
                            type="password"
                            id="apiSecret"
                            value={apiSecret}
                            onChange={(e) => setApiSecret(e.target.value)}
                            className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                          />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                        <div className="flex">
                          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-400">Attention</h3>
                            <div className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                              <p>
                                Assurez-vous que votre clé API dispose uniquement des permissions de lecture (READ-ONLY).
                                Bitax n'a jamais besoin de permissions d'écriture ou de trading.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Afficher les erreurs */}
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
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
                  onClick={handleImport}
                  disabled={!selectedExchange || !apiKey || !apiSecret || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importation...
                    </>
                  ) : (
                    'Importer'
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

export default ImportFromExchangeModal;