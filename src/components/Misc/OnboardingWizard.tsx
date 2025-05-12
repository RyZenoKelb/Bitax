// src/components/OnboardingWizard.tsx
import React, { useState } from 'react';
import Link from 'next/link';

interface OnboardingWizardProps {
  onComplete: () => void;
  onConnect: (address: string, provider: any) => void;
  skipOnboarding: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onConnect,
  skipOnboarding
}) => {
  const [step, setStep] = useState<number>(1);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  
  // Fonction pour connecter le wallet (simulée)
  const connectWallet = async () => {
    try {
      // Vérifier si MetaMask est installé
      if (typeof window !== 'undefined' && window.ethereum) {
        // Demander les comptes à MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length > 0) {
          // Appeler la fonction onConnect avec l'adresse et le provider
          onConnect(accounts[0], window.ethereum);
          // Passer à l'étape suivante
          goToStep(3);
        }
      } else {
        alert('Veuillez installer MetaMask ou un autre wallet compatible Ethereum pour continuer.');
        window.open('https://metamask.io/download/', '_blank');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion du wallet:', error);
    }
  };
  
  // Fonction pour aller à une étape spécifique avec une animation
  const goToStep = (nextStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
    }, 300);
  };
  
  // Fonction pour terminer l'onboarding
  const completeOnboarding = () => {
    onComplete();
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
      <div className="max-w-2xl w-full mx-4">
        <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          {/* En-tête */}
          <div className="relative p-6 border-b border-gray-700">
            <button 
              onClick={skipOnboarding}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-2xl font-bold text-white">Bienvenue sur Bitax</h2>
            <p className="text-gray-300 mt-1">Commençons à configurer votre compte fiscal crypto</p>
            
            {/* Indicateur d'étape */}
            <div className="flex items-center mt-6">
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === i 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                        : step > i 
                          ? 'bg-indigo-900/50 text-indigo-300' 
                          : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step > i ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i
                    )}
                  </div>
                  
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > i ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-700'
                    }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          {/* Contenu de l'étape */}
          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Découvrez Bitax</h3>
                <p className="text-gray-300">
                  Bitax est une plateforme qui simplifie la gestion fiscale de vos crypto-monnaies. 
                  Nous allons vous guider à travers les étapes essentielles pour commencer à utiliser le service.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <svg className="w-8 h-8 text-indigo-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h4 className="text-lg font-medium text-white mb-1">Connexion de wallet</h4>
                    <p className="text-sm text-gray-300">Connectez votre wallet en toute sécurité pour scanner vos transactions</p>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50">
                    <svg className="w-8 h-8 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h4 className="text-lg font-medium text-white mb-1">Calcul fiscal</h4>
                    <p className="text-sm text-gray-300">Obtenez une analyse détaillée de vos plus-values et moins-values</p>
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Connectez votre wallet</h3>
                <p className="text-gray-300">
                  Pour commencer à analyser vos transactions crypto, connectez votre wallet.
                  Nous ne stockons pas vos clés privées et utilisons uniquement des connexions sécurisées en lecture seule.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button
                    onClick={connectWallet}
                    className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center mb-3">
                      <span className="text-2xl">🦊</span>
                    </div>
                    <span className="text-white font-medium">MetaMask</span>
                  </button>
                  
                  <button
                    onClick={connectWallet}
                    className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center mb-3">
                      <span className="text-2xl">🔷</span>
                    </div>
                    <span className="text-white font-medium">Coinbase Wallet</span>
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-400">
                    Autres options disponibles dans les paramètres
                  </p>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">Prêt à commencer !</h3>
                <p className="text-gray-300">
                  Félicitations ! Votre compte est maintenant configuré. Vous pouvez dès à présent scanner vos transactions
                  et générer vos rapports fiscaux.
                </p>
                
                <div className="mt-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-700/30">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-300 font-medium">Wallet connecté avec succès</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-lg font-medium text-white mb-3">Prochaines étapes :</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5 mr-3 text-xs text-white font-bold">1</div>
                      <span className="text-gray-300">Scanner vos transactions sur différentes blockchains</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5 mr-3 text-xs text-white font-bold">2</div>
                      <span className="text-gray-300">Analyser vos plus-values et moins-values</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center mt-0.5 mr-3 text-xs text-white font-bold">3</div>
                      <span className="text-gray-300">Générer et exporter votre rapport fiscal</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4 bg-indigo-900/30 rounded-lg p-4 border border-indigo-700/30">
                  <h4 className="text-base font-medium text-white mb-2">Vous avez besoin d'aide ?</h4>
                  <p className="text-gray-300 text-sm">
                    Consultez notre <Link href="/guide" className="text-indigo-400 hover:underline">guide</Link> ou contactez notre <Link href="/support" className="text-indigo-400 hover:underline">support</Link>.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Pied de page avec boutons */}
          <div className="p-6 border-t border-gray-700 flex justify-between">
            <button
              onClick={() => step > 1 ? goToStep(step - 1) : skipOnboarding()}
              className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
            >
              {step > 1 ? 'Précédent' : 'Passer'}
            </button>
            
            <button
              onClick={() => step < 3 ? goToStep(step + 1) : completeOnboarding()}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 transition-colors"
            >
              {step === 3 ? 'Commencer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;