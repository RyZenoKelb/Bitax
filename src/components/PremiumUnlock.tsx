import React, { useState } from 'react';

interface PremiumUnlockProps {
  onUnlock: () => void;
}

const PremiumUnlock: React.FC<PremiumUnlockProps> = ({ onUnlock }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div className="my-6 overflow-hidden bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
      <div className="relative p-6">
        {/* Badge premium avec effet scintillant */}
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl shadow-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-yellow-100" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold tracking-wide text-sm">PREMIUM</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:pr-6 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">Débloquez Bitax Premium</h3>
            <p className="text-gray-700 mb-4">
              Accédez à l'intégralité de vos transactions, des rapports complets et aux fonctionnalités avancées.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Transactions <b>illimitées</b></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Rapports PDF <b>détaillés</b></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Export CSV/Excel</span>
                </li>
              </ul>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Analyse fiscale <b>avancée</b></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Plusieurs <b>méthodes de calcul</b></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Visualisations de <b>gains</b></span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end min-w-[220px]">
            <div className="bg-white/70 rounded-xl p-4 mb-4 text-center md:text-right shadow-sm">
              <p className="text-gray-600 text-sm mb-1">Abonnement à partir de</p>
              <div className="flex items-baseline justify-center md:justify-end">
                <span className="text-3xl font-bold text-gray-800">9,99€</span>
                <span className="text-gray-600 ml-1">/mois</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Facturation annuelle • Sans engagement</p>
            </div>
            
            <button
              onClick={onUnlock}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                isHovered ? 'scale-105' : ''
              }`}
            >
              {/* Effet de particules sur hover */}
              {isHovered && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                  <div className="w-1 h-1 bg-white rounded-full animate-ping absolute"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-ping absolute" style={{ animationDelay: '0.2s', left: '60%' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-ping absolute" style={{ animationDelay: '0.5s', right: '30%' }}></div>
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
      
      {/* Bannière des économies potentielles */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 py-2 px-6 text-center text-white text-sm font-medium">
        Économisez du temps et de l'argent sur votre déclaration fiscale crypto
      </div>
    </div>
  );
};

export default PremiumUnlock;