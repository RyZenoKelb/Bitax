// src/components/WelcomeCard.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WelcomeCardProps {
  username?: string;
  onConnect: () => void;
  theme: 'light' | 'dark';
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ username = '', onConnect, theme }) => {
  const [greeting, setGreeting] = useState('Bonjour');
  const [currentTime, setCurrentTime] = useState('');
  
  // Définir la salutation en fonction de l'heure
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      setGreeting('Bonjour');
    } else if (hour >= 12 && hour < 18) {
      setGreeting('Bon après-midi');
    } else {
      setGreeting('Bonsoir');
    }
    
    // Formater l'heure avec les heures et minutes
    const timeOptions: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    };
    setCurrentTime(now.toLocaleTimeString('fr-FR', timeOptions));
  }, []);
  
  // Liste des fonctionnalités avec dégradés
  const features = [
    {
      title: 'Connexion Wallet',
      description: 'Connectez votre wallet crypto en toute sécurité',
      icon: (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          theme === 'dark' ? 'bg-primary-900/50' : 'bg-primary-100'
        }`}>
          <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        </div>
      ),
      gradient: 'from-primary-500 to-secondary-500'
    },
    {
      title: 'Scan Multi-Blockchain',
      description: 'Analysez vos transactions sur toutes les blockchains',
      icon: (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
        }`}>
          <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      ),
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Rapports Fiscaux',
      description: 'Générez des rapports fiscaux conformes aux normes',
      icon: (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          theme === 'dark' ? 'bg-emerald-900/50' : 'bg-emerald-100'
        }`}>
          <svg className={`w-6 h-6 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      ),
      gradient: 'from-emerald-500 to-teal-500'
    }
  ];
  
  return (
    <div className={`rounded-xl overflow-hidden relative ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90'
        : 'bg-white'
    } border ${theme === 'dark' ? 'border-gray-800/40' : 'border-gray-200/70'} shadow-lg`}>
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-500/10 blur-3xl rounded-full"></div>
      <div className="absolute inset-0 bg-crypto-grid opacity-[0.03]"></div>
      
      <div className="p-6 sm:p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center mb-2">
              <span className={`inline-block w-3 h-3 rounded-full ${
                theme === 'dark' ? 'bg-primary-500' : 'bg-primary-500'
              } mr-2 animate-pulse-soft`}></span>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentTime} — Version 2.1.4
              </p>
            </div>
            
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
              {greeting}{username ? `, ${username}` : ' et bienvenue sur Bitax'}
            </h1>
            <p className={`max-w-xl text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Bitax est votre plateforme complète pour gérer votre fiscalité crypto en toute simplicité.
              Analysez vos transactions, calculez vos plus-values et générez des rapports fiscaux conformes.
            </p>
          </div>
          
          {/* Date du jour avec look "neon" */}
          <div className={`hidden md:flex flex-col items-center justify-center mt-6 md:mt-0 px-6 py-4 rounded-xl ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/30'
              : 'bg-gradient-to-br from-gray-50 to-gray-100/80 border border-gray-200/50'
          }`}>
            <div className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {new Date().getDate()}
            </div>
            <div className={`text-sm uppercase tracking-wide ${
              theme === 'dark' ? 'text-primary-400' : 'text-primary-600'
            }`}>
              {new Date().toLocaleDateString('fr-FR', { month: 'long' })}
            </div>
          </div>
        </div>
        
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className={`relative overflow-hidden rounded-xl ${
              theme === 'dark'
                ? 'bg-gray-800/50 border border-gray-700/30'
                : 'bg-white border border-gray-200/50'
            } p-5 hover-shadow-effect`}>
              <div className="flex items-start">
                {feature.icon}
                <div className="ml-3">
                  <h3 className={`text-base font-bold mb-1 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
              
              {/* Effet de lueur sur fond */}
              <div className={`absolute -right-12 -bottom-12 w-24 h-24 rounded-full bg-gradient-to-r ${feature.gradient} opacity-10 blur-xl`}></div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={onConnect}
            className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500' 
                : 'bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600'
            } hover:shadow-lg flex-grow sm:flex-grow-0 w-full sm:w-auto`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Connecter un wallet
          </button>
          
          <Link 
            href="/guide"
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
            } flex-grow sm:flex-grow-0 w-full sm:w-auto`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Guide d'utilisation
          </Link>
          
          <Link 
            href="/pricing"
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center ${
              theme === 'dark' 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
            } flex-grow sm:flex-grow-0 w-full sm:w-auto`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Plans tarifaires
          </Link>
        </div>
      </div>
      
      {/* Pied de carte avec infos supplémentaires */}
      <div className={`px-8 py-4 ${theme === 'dark' ? 'bg-gray-800/40 border-t border-gray-700/30' : 'bg-gray-50 border-t border-gray-200/40'}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <span className={`inline-block w-2 h-2 rounded-full ${
              theme === 'dark' ? 'bg-green-400' : 'bg-green-500'
            } mr-2`}></span>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Système opérationnel • Dernière mise à jour: {new Date().toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/support" 
              className={`text-sm flex items-center ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Besoin d'aide?
            </Link>
            <Link 
              href="/demo" 
              className={`text-sm flex items-center ${theme === 'dark' ? 'text-primary-400' : 'text-primary-600'}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Voir la démo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;