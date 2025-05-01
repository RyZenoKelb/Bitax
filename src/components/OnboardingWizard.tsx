import React, { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import WalletConnectPanel from './WalletConnectPanel';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component?: React.ReactNode;
  buttonText?: string;
  skipText?: string;
  canSkip?: boolean;
}

interface OnboardingWizardProps {
  onComplete: () => void;
  onConnect?: (address: string, provider: any) => void;
  skipOnboarding?: () => void;
  initialStep?: number;
  steps?: OnboardingStep[];
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onConnect,
  skipOnboarding,
  initialStep = 0,
  steps: customSteps
}) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  
  // Définir les étapes par défaut
  const defaultSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenue sur Bitax',
      description: 'Simplifiez votre déclaration fiscale crypto en quelques étapes simples. Prêt à commencer ?',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      buttonText: 'Commencer',
      canSkip: true,
      skipText: 'Passer l\'onboarding'
    },
    {
      id: 'connect-wallet',
      title: 'Connectez votre wallet',
      description: 'Liez votre wallet crypto pour analyser vos transactions. Vos clés privées restent entre vos mains.',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      component: <WalletConnectPanel onConnect={(address, provider) => {
        setWalletAddress(address);
        onConnect && onConnect(address, provider);
      }} />,
      buttonText: 'Continuer',
      canSkip: false
    },
    {
      id: 'choose-blockchains',
      title: 'Sélectionnez vos blockchains',
      description: 'Quelles blockchains utilisez-vous ? Nous scannerons celles-ci pour trouver vos transactions.',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      component: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
          {[
            { id: 'eth', name: 'Ethereum', icon: '🔷', color: 'bg-blue-100 dark:bg-blue-900/30' },
            { id: 'polygon', name: 'Polygon', icon: '🟣', color: 'bg-purple-100 dark:bg-purple-900/30' },
            { id: 'arbitrum', name: 'Arbitrum', icon: '🔵', color: 'bg-indigo-100 dark:bg-indigo-900/30' },
            { id: 'optimism', name: 'Optimism', icon: '🔴', color: 'bg-red-100 dark:bg-red-900/30' },
            { id: 'base', name: 'Base', icon: '🟢', color: 'bg-green-100 dark:bg-green-900/30' },
            { id: 'solana', name: 'Solana', icon: '🟪', color: 'bg-violet-100 dark:bg-violet-900/30' },
            { id: 'avalanche', name: 'Avalanche', icon: '❄️', color: 'bg-red-100 dark:bg-red-900/30' },
            { id: 'bsc', name: 'BNB Chain', icon: '🟡', color: 'bg-yellow-100 dark:bg-yellow-900/30' }
          ].map(blockchain => (
            <button
              key={blockchain.id}
              className={`relative flex flex-col items-center p-4 rounded-xl ${blockchain.color} hover:bg-opacity-80 transition-colors duration-200 border-2 border-transparent hover:border-blue-500`}
            >
              <span className="text-2xl mb-2">{blockchain.icon}</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">{blockchain.name}</span>
              
              {/* Checkmark overlay */}
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center opacity-0 hover:opacity-100">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      ),
      buttonText: 'Continuer',
      canSkip: true,
      skipText: 'Scanner toutes les blockchains'
    },
    {
      id: 'scan-transactions',
      title: 'Scannez vos transactions',
      description: 'Nous allons maintenant rechercher et analyser vos transactions sur les blockchains sélectionnées.',
      icon: (
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      component: (
        <div className="flex flex-col items-center mt-6 mb-4">
          <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Recherche des transactions en cours... Cela peut prendre quelques instants selon l'activité de votre wallet.
          </p>
        </div>
      ),
      buttonText: 'Continuer',
      canSkip: false
    },
    {
      id: 'setup-complete',
      title: 'Configuration terminée !',
      description: `Votre wallet ${walletAddress ? `(${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)})` : ''} est maintenant connecté. Vous pouvez accéder à votre tableau de bord fiscal.`,
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      buttonText: 'Accéder au dashboard',
      canSkip: false
    }
  ];
  
  // Utiliser les étapes personnalisées ou les étapes par défaut
  const steps = customSteps || defaultSteps;
  
  // Mettre à jour l'adresse du wallet dans l'étape finale
  useEffect(() => {
    if (walletAddress && steps.find(step => step.id === 'setup-complete')) {
      const setupStep = steps.find(step => step.id === 'setup-complete');
      if (setupStep) {
        setupStep.description = `Votre wallet (${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}) est maintenant connecté. Vous pouvez accéder à votre tableau de bord fiscal.`;
      }
    }
  }, [walletAddress]);
  
  // Navigation entre les étapes
  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    } else {
      // Dernière étape, montrer l'animation de célébration
      setShowCelebration(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Récupérer l'étape actuelle
  const currentStepData = steps[currentStep];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 overflow-y-auto">
      <div className="max-w-3xl w-full mx-auto p-4">
        {/* Effet de célébration */}
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-ping w-48 h-48 bg-blue-500 rounded-full opacity-75"></div>
            </div>
            <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-ping w-32 h-32 bg-green-500 rounded-full opacity-75" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <div className="absolute top-1/4 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
              <div className="animate-ping w-40 h-40 bg-purple-500 rounded-full opacity-75" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Indicateur de progression */}
          <div className="h-1 bg-gray-200 dark:bg-gray-700">
            <div 
              className="h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="mr-4 p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  {currentStepData.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {currentStepData.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-lg">
                    {currentStepData.description}
                  </p>
                </div>
              </div>
              
              {/* Étapes */}
              <div className="hidden md:flex items-center space-x-2">
                {steps.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep 
                        ? 'bg-blue-600 dark:bg-blue-500' 
                        : index < currentStep 
                          ? 'bg-green-500 dark:bg-green-400' 
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            
            {/* Contenu de l'étape */}
            <Transition
              show={!isTransitioning}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="min-h-[300px]">
                {currentStepData.component}
              </div>
            </Transition>
            
            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <div>
                {currentStep > 0 && (
                  <button
                    onClick={goToPreviousStep}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                  </button>
                )}
              </div>
              
              <div className="flex space-x-3">
                {currentStepData.canSkip && (
                  <button
                    onClick={skipOnboarding || (() => onComplete())}
                    className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {currentStepData.skipText || 'Passer'}
                  </button>
                )}
                
                <button
                  onClick={goToNextStep}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors duration-200 flex items-center"
                >
                  {currentStepData.buttonText || 'Continuer'}
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;