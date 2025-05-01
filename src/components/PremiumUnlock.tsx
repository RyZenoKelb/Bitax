import React, { useState, useEffect } from 'react';

interface PremiumUnlockProps {
  onUnlock: () => void;
}

const PremiumUnlock: React.FC<PremiumUnlockProps> = ({ onUnlock }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Effet d'animation au chargement
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="card-premium relative overflow-hidden my-6 group">
      {/* Effet scintillant sur le contour */}
      <div 
        className="absolute -inset-px rounded-2xl opacity-70 blur-sm bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 animate-pulse"
        style={{ animationDuration: '3s' }}
      ></div>
      
      <div className="card-premium-inner relative">
        {/* Badge premium avec effet scintillant */}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl shadow-lg">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold tracking-wide text-sm">PREMIUM</span>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:pr-6 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-3 premium-text-gradient">Débloquez Bitax Premium</h3>
            <p className="text-gray-300 mb-5">
              Accédez à l'intégralité de vos transactions, des rapports complets et aux fonctionnalités avancées.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Transactions <span className="text-white font-medium">illimitées</span></span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Rapports PDF <span className="text-white font-medium">détaillés</span></span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Export CSV/Excel</span>
                </li>
              </ul>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Analyse fiscale <span className="text-white font-medium">avancée</span></span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Plusieurs <span className="text-white font-medium">méthodes de calcul</span></span>
                </li>
                <li className="flex items-start">
                  <div className="rounded-full p-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 mr-2 flex-shrink-0 mt-0.5">
                    <div className="bg-gray-900 rounded-full p-px">
                      <svg className="w-3.5 h-3.5 text-secondary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <span className="text-gray-300">Visualisations de <span className="text-white font-medium">gains</span></span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end min-w-[220px]">
            <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-center md:text-right shadow-lg">
              <p className="text-gray-400 text-sm mb-1">Abonnement à partir de</p>
              <div className="flex items-baseline justify-center md:justify-end">
                <span className="text-3xl font-bold text-white">9,99€</span>
                <span className="text-gray-400 ml-1 text-gradient">/mois</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Facturation annuelle • Sans engagement</p>
            </div>
            
            <button
              onClick={onUnlock}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`btn btn-premium ${isHovered ? 'scale-105' : ''} ${isAnimating ? 'animate-pulse' : ''}`}
            >
              {/* Effet de particules sur hover */}
              {isHovered && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-hidden">
                  <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '30%', animationDelay: '0s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '70%', top: '30%', animationDelay: '0.3s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full absolute animate-ping" style={{ left: '40%', top: '70%', animationDelay: '0.7s' }}></div>
                </div>
              )}
              
              <span className="relative flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Débloquer Bitax Premium
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Bannière de bas de carte */}
      <div className="bg-gradient-to-r from-primary-900 to-gray-900 py-2 px-6 text-center text-gray-300 text-sm font-medium border-t border-primary-700/30">
        Économisez du temps et de l'argent sur votre déclaration fiscale crypto
      </div>
    </div>
  );
};

export default PremiumUnlock;