// 1. D'abord, créons les pages manquantes

// src/pages/guide.tsx - Remplace "Comment ça marche" par "Guide d'utilisation"
import React from 'react';

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Guide d'utilisation</h1>
      
      <div className="space-y-8">
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Connectez votre wallet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Bitax se connecte directement à votre wallet crypto sans jamais accéder à vos clés privées, 
            garantissant une sécurité maximale pour vos actifs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h3 className="font-medium text-gray-800 dark:text-white mb-2">Wallets supportés</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                <li>MetaMask</li>
                <li>Coinbase Wallet</li>
                <li>WalletConnect</li>
                <li>Trust Wallet</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Sécurité garantie</h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Bitax ne stocke jamais vos clés privées et n'a aucun accès à vos fonds.
                Toutes les données sont traitées localement sur votre appareil.
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Analysez vos transactions</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Notre technologie scanne automatiquement toutes vos transactions sur les blockchains supportées, 
            identifie les événements taxables et calcule vos plus et moins-values.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {[
              {
                title: "Multi-blockchain",
                description: "Support de plusieurs blockchains dont Ethereum, Polygon, Arbitrum, Optimism et Base",
                icon: "🔄"
              },
              {
                title: "Analyse automatique",
                description: "Identification automatique des transactions taxables et calcul des gains/pertes",
                icon: "📊"
              },
              {
                title: "Historique complet",
                description: "Analyse de l'historique complet des transactions, quelle que soit la période",
                icon: "📅"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <h3 className="font-medium text-gray-800 dark:text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Générez votre rapport fiscal</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Obtenez un rapport complet de vos plus-values et moins-values crypto, prêt à être utilisé 
            pour votre déclaration fiscale annuelle.
          </p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-medium text-gray-800 dark:text-white">Formats d'export</h3>
              </div>
              <div className="p-4 space-y-2 text-gray-600 dark:text-gray-300">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>Rapport PDF détaillé</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Export Excel complet</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Export CSV brut</span>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <h3 className="font-medium text-gray-800 dark:text-white">Conformité fiscale</h3>
              </div>
              <div className="p-4 space-y-3 text-gray-600 dark:text-gray-300">
                <p className="text-sm">
                  Les rapports générés par Bitax sont conformes aux exigences fiscales et incluent:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Calcul des plus-values à court et long terme</li>
                  <li>Méthodes FIFO, LIFO, HIFO et prix moyen pondéré</li>
                  <li>Détail de chaque transaction taxable</li>
                  <li>Résumé fiscal annuel</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

