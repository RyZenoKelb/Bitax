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

// src/pages/pricing.tsx - Page de tarifs
import React from 'react';

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">Tarifs transparents, sans surprise</h1>
      <p className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
        Choisissez la formule qui correspond à vos besoins et prenez le contrôle de votre fiscalité crypto.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Plan gratuit */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gratuit</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Pour découvrir l'application</p>
            
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">0€</span>
              <span className="text-gray-500 dark:text-gray-400">/mois</span>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Connexion de wallet</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Scan limité à 100 transactions</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Aperçu du rapport fiscal</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-400">Export PDF limité</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-400">Plusieurs méthodes de calcul</span>
              </li>
              <li className="flex items-start opacity-50">
                <svg className="h-5 w-5 text-gray-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="text-gray-500 dark:text-gray-400">Support client prioritaire</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">
            Commencer gratuitement
          </button>
        </div>
        
        {/* Plan premium (mise en avant) */}
        <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-xl p-6 border border-blue-200 dark:border-blue-800 transform md:-translate-y-4 flex flex-col relative">
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
            Populaire
          </div>
          
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les investisseurs actifs</p>
            
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">9,99€</span>
              <span className="text-gray-500 dark:text-gray-400">/mois</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Facturé annuellement</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Transactions illimitées</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Analyses avancées et graphiques</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Exports PDF, Excel et CSV</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Toutes les méthodes de calcul fiscal</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Support multi-blockchain</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Support client standard</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg">
            S'abonner à Premium
          </button>
        </div>
        
        {/* Plan entreprise */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Entreprise</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les professionnels du secteur</p>
            
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">29,99€</span>
              <span className="text-gray-500 dark:text-gray-400">/mois</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Facturé annuellement</p>
            </div>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Tout le contenu Premium</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Gestion multi-comptes</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Rapports personnalisables</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">API dédiée</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Assistance dédiée</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-gray-600 dark:text-gray-300">Formation personnalisée</span>
              </li>
            </ul>
          </div>
          
          <button className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
            Contacter les ventes
          </button>
        </div>
      </div>
      
      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-900 dark:text-white">Questions fréquentes</h2>
        
        <div className="max-w-3xl mx-auto space-y-6">
          {[
            {
              question: "Puis-je essayer Bitax avant de m'abonner ?",
              answer: "Oui, notre plan gratuit vous permet de tester les fonctionnalités de base sans engagement. Vous pourrez scanner jusqu'à 100 transactions et avoir un aperçu du rapport fiscal."
            },
            {
              question: "Comment fonctionne la facturation ?",
              answer: "Les plans Premium et Entreprise sont facturés annuellement. Vous pouvez annuler à tout moment, mais aucun remboursement n'est effectué pour les périodes partiellement utilisées."
            },
            {
              question: "Est-ce que Bitax est conforme aux réglementations fiscales ?",
              answer: "Bitax est conçu pour vous aider à préparer vos déclarations fiscales, mais nous vous recommandons toujours de consulter un expert-comptable ou un conseiller fiscal pour valider vos déclarations finales."
            },
            {
              question: "Quelles blockchains sont supportées ?",
              answer: "Nous supportons actuellement Ethereum, Polygon, Arbitrum, Optimism, Base, et d'autres réseaux majeurs. Nous ajoutons régulièrement de nouveaux réseaux."
            },
            {
              question: "Puis-je changer de formule à tout moment ?",
              answer: "Oui, vous pouvez passer à une formule supérieure à tout moment. Le changement prendra effet immédiatement et la différence de prix sera calculée au prorata."
            }
          ].map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{item.question}</h3>
              <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/pages/support.tsx - Page de support
import React from 'react';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Support client</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Assistance par chat</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Notre équipe d'experts est disponible pour répondre rapidement à vos questions par chat en direct.
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Démarrer un chat
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">Email</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Envoyez-nous un email pour des questions plus complexes ou si vous préférez une assistance écrite.
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Envoyer un email
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-200 dark:border-gray-700 mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Contactez-nous</h2>
        
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="name"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Votre nom"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="votre@email.com"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Sujet de votre message"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Détaillez votre question ou problème..."
            ></textarea>
          </div>
          
          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Envoyer le message
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Base de connaissances</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Consultez notre documentation complète pour trouver rapidement des réponses à vos questions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Guide d'utilisation",
              description: "Apprenez les bases de l'utilisation de Bitax",
              icon: "📚"
            },
            {
              title: "Tutoriels vidéo",
              description: "Guides pas à pas en vidéo",
              icon: "🎬"
            },
            {
              title: "FAQ",
              description: "Réponses aux questions fréquentes",
              icon: "❓"
            },
            {
              title: "Calcul fiscal",
              description: "Comment nous calculons vos impôts",
              icon: "🧮"
            },
            {
              title: "Méthodes d'évaluation",
              description: "FIFO, LIFO, HIFO expliqués",
              icon: "📊"
            },
            {
              title: "Sécurité",
              description: "Comment nous protégeons vos données",
              icon: "🔒"
            }
          ].map((category, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{category.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">{category.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Ensuite, voici le nouveau fichier _app.tsx modifié

// src/pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@headlessui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Logo SVG importé sous forme de composant
const BitaxLogo = ({ isDarkMode = false }: { isDarkMode?: boolean }) => (
  <svg width="150" height="40" viewBox="0 0 420 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDarkMode ? "#6366F1" : "#6366F1"} />
        <stop offset="100%" stopColor={isDarkMode ? "#1D4ED8" : "#3B82F6"} />
      </linearGradient>
      <linearGradient id="txtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isDarkMode ? "#818CF8" : "#4338CA"} />
        <stop offset="100%" stopColor={isDarkMode ? "#60A5FA" : "#2563EB"} />
      </linearGradient>
    </defs>
    <g transform="translate(0, 0)">
      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="url(#bgGradient)" stroke={isDarkMode ? "#818CF8" : "#4F46E5"} strokeWidth="2" />
      <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="#FFFFFF" fillOpacity="0.2" />
      <line x1="30" y1="65" x2="30" y2="45" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="45" y1="65" x2="45" y2="35" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="60" y1="65" x2="60" y2="40" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="75" y1="65" x2="75" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <text x="35" y="30" fontFamily="Poppins, sans-serif" fontSize="18" fontWeight="bold" fill="white">$</text>
    </g>
    <text x="120" y="70" fontFamily="Poppins, sans-serif" fontSize="60" fontWeight="700" fill="url(#txtGradient)">BITAX</text>
    <text x="123" y="90" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="500" fill={isDarkMode ? "#D1D5DB" : "#6B7280"}>Fiscalité crypto simplifiée</text>
  </svg>
);

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const router = useRouter();

  // Toggle du thème (light/dark)
  const toggleTheme = () => {
    setTheme(current => {
      const newTheme = current === 'light' ? 'dark' : 'light';
      localStorage.setItem('bitax-theme', newTheme);
      return newTheme;
    });
  };

  // Vérifier si l'utilisateur a déjà une préférence de thème
  useEffect(() => {
    // Initialiser avec un délai pour éviter le flash lors du chargement
    const savedTheme = localStorage.getItem('bitax-theme') as 'light' | 'dark' | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    
    // Attendre un peu pour faire l'animation d'apparition
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [Component]);

  return (
    <>
      <Head>
        <title>Bitax | Fiscalité crypto simplifiée</title>
        <meta name="description" content="Bitax - Scannez vos transactions crypto et générez votre rapport fiscal en quelques clics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content={theme === 'dark' ? '#1F2937' : '#FFFFFF'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bitax | Fiscalité crypto simplifiée" />
        <meta name="twitter:description" content="Scannez vos transactions crypto et générez votre rapport fiscal en quelques clics." />
        <meta property="og:title" content="Bitax | Fiscalité crypto simplifiée" />
        <meta property="og:description" content="Scannez vos transactions crypto et générez votre rapport fiscal en quelques clics." />
        <meta property="og:type" content="website" />
      </Head>
      
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'dark' : ''} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        {/* Header avec navigation */}
        <header className="bg-white shadow-sm dark:bg-bitax-gray-800 dark:border-b dark:border-bitax-gray-700 sticky top-0 z-50 transition-colors duration-300">
          <div className="container mx-auto py-4 px-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/">
                <BitaxLogo isDarkMode={theme === 'dark'} />
              </Link>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Navigation desktop */}
              <nav className="hidden md:flex space-x-1">
                <Link href="/" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  router.pathname === '/' 
                    ? 'bg-bitax-primary-50 text-bitax-primary-600 dark:bg-bitax-primary-900/20 dark:text-bitax-primary-400' 
                    : 'text-gray-700 hover:text-bitax-primary-600 hover:bg-bitax-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-bitax-gray-700'
                }`}>
                  Tableau de bord
                </Link>
                <Link href="/guide" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  router.pathname === '/guide' 
                    ? 'bg-bitax-primary-50 text-bitax-primary-600 dark:bg-bitax-primary-900/20 dark:text-bitax-primary-400' 
                    : 'text-gray-700 hover:text-bitax-primary-600 hover:bg-bitax-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-bitax-gray-700'
                }`}>
                  Guide d'utilisation
                </Link>
                <Link href="/pricing" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  router.pathname === '/pricing' 
                    ? 'bg-bitax-primary-50 text-bitax-primary-600 dark:bg-bitax-primary-900/20 dark:text-bitax-primary-400' 
                    : 'text-gray-700 hover:text-bitax-primary-600 hover:bg-bitax-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-bitax-gray-700'
                }`}>
                  Tarifs
                </Link>
                <Link href="/support" className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  router.pathname === '/support' 
                    ? 'bg-bitax-primary-50 text-bitax-primary-600 dark:bg-bitax-primary-900/20 dark:text-bitax-primary-400' 
                    : 'text-gray-700 hover:text-bitax-primary-600 hover:bg-bitax-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-bitax-gray-700'
                }`}>
                  Support
                </Link>
              </nav>
              
              {/* Bouton toggle thème avec animation */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-bitax-gray-600 hover:text-bitax-gray-900 hover:bg-bitax-gray-100 dark:text-bitax-gray-400 dark:hover:text-white dark:hover:bg-bitax-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bitax-primary-500 dark:focus:ring-offset-bitax-gray-800 transition-colors duration-200"
                aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
              >
                <div className="relative w-5 h-5">
                  <Transition
                    show={theme === 'light'}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute inset-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </div>
                  </Transition>
                  <Transition
                    show={theme === 'dark'}
                    enter="transition-opacity duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute inset-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </Transition>
                </div>
              </button>
              
              {/* Menu hamburger mobile */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-bitax-gray-600 hover:text-bitax-gray-900 hover:bg-bitax-gray-100 dark:text-bitax-gray-400 dark:hover:text-white dark:hover:bg-bitax-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bitax-primary-500 dark:focus:ring-offset-bitax-gray-800"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Ouvrir le menu</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Menu mobile */}
          <Transition
            as={Fragment}
            show={isMenuOpen}
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 bg-white dark:bg-bitax-gray-800 md:hidden">
              <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/' 
                  ? 'bg-bitax-primary-100 text-bitax-primary-700 dark:bg-bitax-primary-900 dark:text-bitax-primary-200' 
                  : 'text-bitax-gray-700 hover:bg-bitax-gray-100 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-700 dark:hover:text-white'
              }`}>
                Tableau de bord
              </Link>
              <Link href="/guide" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/guide' 
                  ? 'bg-bitax-primary-100 text-bitax-primary-700 dark:bg-bitax-primary-900 dark:text-bitax-primary-200' 
                  : 'text-bitax-gray-700 hover:bg-bitax-gray-100 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-700 dark:hover:text-white'
              }`}>
                Guide d'utilisation
              </Link>
              <Link href="/pricing" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/pricing' 
                  ? 'bg-bitax-primary-100 text-bitax-primary-700 dark:bg-bitax-primary-900 dark:text-bitax-primary-200' 
                  : 'text-bitax-gray-700 hover:bg-bitax-gray-100 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-700 dark:hover:text-white'
              }`}>
                Tarifs
              </Link>
              <Link href="/support" className={`block px-3 py-2 rounded-md text-base font-medium ${
                router.pathname === '/support' 
                  ? 'bg-bitax-primary-100 text-bitax-primary-700 dark:bg-bitax-primary-900 dark:text-bitax-primary-200' 
                  : 'text-bitax-gray-700 hover:bg-bitax-gray-100 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-700 dark:hover:text-white'
              }`}>
                Support
              </Link>
            </div>
          </Transition>
        </header>
        
        {/* Contenu principal */}
        <main className="flex-grow py-10 px-4 sm:px-6 bg-bitax-gray-50 dark:bg-bitax-gray-900 transition-colors duration-300">
          <div className="container mx-auto">
            <Component {...pageProps} />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-bitax-gray-200 py-8 dark:bg-bitax-gray-800 dark:border-bitax-gray-700 transition-colors duration-300">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Bitax</h3>
                <p className="text-sm text-bitax-gray-600 dark:text-bitax-gray-400 mb-4">
                  Simplifiez votre fiscalité crypto avec notre solution intuitive de suivi et de déclaration.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-bitax-gray-500 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-bitax-gray-500 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-bitax-gray-500 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    <span className="sr-only">Discord</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                      Tableau de bord
                    </Link>
                  </li>
                  <li>
                    <Link href="/guide" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                      Guide d'utilisation
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Légal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">Conditions d'utilisation</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">Politique de confidentialité</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">Mentions légales</a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-bitax-gray-600 hover:text-bitax-primary-600 dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">Cookies</a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-bitax-gray-200 dark:border-bitax-gray-700">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-bitax-gray-600 dark:text-bitax-gray-400 mb-4 md:mb-0">
                  &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-bitax-gray-600 hover:text-bitax-primary-600 text-sm dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    Mentions légales
                  </a>
                  <a href="#" className="text-bitax-gray-600 hover:text-bitax-primary-600 text-sm dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    Politique de confidentialité
                  </a>
                  <a href="#" className="text-bitax-gray-600 hover:text-bitax-primary-600 text-sm dark:text-bitax-gray-400 dark:hover:text-bitax-primary-400">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

// 4. Voici les styles améliorés pour les boutons à ajouter dans src/styles/globals.css

// src/styles/globals.css (ajouts à la section @layer components)
/**
 * Styles personnalisés pour les boutons et la navigation 
 * Ajoutez ce code dans votre fichier globals.css après les imports
 * et avant les styles utilitaires personnalisés
 */

@layer components {
  /* Styles des boutons améliorés */
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5;
  }
  
  .btn-primary {
    @apply btn bg-bitax-primary-600 hover:bg-bitax-primary-700 text-white focus:ring-bitax-primary-500 shadow-md hover:shadow-lg dark:bg-bitax-primary-600 dark:hover:bg-bitax-primary-700 dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-secondary {
    @apply btn bg-bitax-gray-200 hover:bg-bitax-gray-300 text-bitax-gray-800 focus:ring-bitax-gray-500 dark:bg-bitax-gray-700 dark:hover:bg-bitax-gray-600 dark:text-white dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-success {
    @apply btn bg-bitax-success-500 hover:bg-bitax-success-600 text-white focus:ring-bitax-success-500 shadow-md hover:shadow-lg dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-danger {
    @apply btn bg-bitax-danger-500 hover:bg-bitax-danger-600 text-white focus:ring-bitax-danger-500 shadow-md hover:shadow-lg dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-outline {
    @apply btn border-2 border-bitax-gray-300 text-bitax-gray-700 hover:bg-bitax-gray-50 focus:ring-bitax-gray-500 dark:border-bitax-gray-600 dark:text-white dark:hover:bg-bitax-gray-800 dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-premium {
    @apply btn bg-gradient-to-r from-bitax-premium-500 to-bitax-premium-600 hover:from-bitax-premium-600 hover:to-bitax-premium-700 text-white shadow-lg hover:shadow-xl focus:ring-bitax-premium-500 dark:focus:ring-offset-bitax-gray-800;
  }
  
  .btn-sm {
    @apply px-4 py-2 text-sm rounded-lg;
  }
  
  .btn-lg {
    @apply px-8 py-4 text-lg rounded-xl;
  }
  
  /* Styles améliorés des liens de navigation */
  .nav-link {
    @apply px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:text-bitax-primary-600 hover:bg-bitax-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-bitax-gray-700;
  }
  
  .nav-link-active {
    @apply px-4 py-2 text-sm font-medium rounded-lg bg-bitax-primary-50 text-bitax-primary-600 dark:bg-bitax-primary-900/20 dark:text-bitax-primary-400;
  }
  
  /* Styles pour la navigation mobile */
  .mobile-nav-link {
    @apply block px-3 py-2 rounded-md text-base font-medium text-bitax-gray-700 hover:bg-bitax-gray-100 dark:text-bitax-gray-300 dark:hover:bg-bitax-gray-700 dark:hover:text-white;
  }
  
  .mobile-nav-link-active {
    @apply block px-3 py-2 rounded-md text-base font-medium bg-bitax-primary-100 text-bitax-primary-700 dark:bg-bitax-primary-900 dark:text-bitax-primary-200;
  }
  
  /* Styles de cartes et conteneurs */
  .card-hover {
    @apply transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg;
  }
  
  .feature-card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow;
  }
  
  .form-input {
    @apply block w-full rounded-lg border-gray-300 shadow-sm focus:border-bitax-primary-500 focus:ring-bitax-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white;
  }
}