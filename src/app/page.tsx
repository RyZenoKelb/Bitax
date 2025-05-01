import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
          <svg className="h-[40rem] w-[40rem]" width="960" height="637" viewBox="0 0 960 637" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8" filter="url(#filter0_f_983_1700)">
              <circle cx="538.5" cy="144.5" r="298.5" fill="#4285F4"/>
            </g>
            <defs>
              <filter id="filter0_f_983_1700" x="40" y="-354" width="997" height="997" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_983_1700"/>
              </filter>
            </defs>
          </svg>
        </div>
        
        <div className="absolute bottom-0 left-0 -z-10 opacity-20 dark:opacity-10">
          <svg className="h-[30rem] w-[30rem]" width="860" height="537" viewBox="0 0 960 637" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.8" filter="url(#filter0_f_983_1700)">
              <circle cx="338.5" cy="344.5" r="298.5" fill="#6A2DD1"/>
            </g>
            <defs>
              <filter id="filter0_f_983_1700" x="40" y="-354" width="997" height="997" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_983_1700"/>
              </filter>
            </defs>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
              <span className="text-gray-900 dark:text-white">Votre fiscalité crypto, </span>
              <span className="text-gradient">simplifiée</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics. 
              Finies les heures de calculs compliqués.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/register" className="btn-primary btn-lg">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </Link>
              <Link href="/guide" className="btn-outline btn-lg">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </span>
              </Link>
            </div>
            
            {/* Network Icons */}
            <div className="flex flex-wrap justify-center gap-4 my-6">
              {['ETH', 'MATIC', 'ARB', 'OPT', 'BASE', 'SOL'].map((network, i) => (
                <div key={i} className="flex items-center backdrop-blur-md bg-white/10 dark:bg-white/5 rounded-full px-4 py-2 border border-gray-200/20 dark:border-gray-700/30">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500/80 to-secondary-500/80 flex items-center justify-center text-white text-xs font-bold mr-2">
                    {network.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{network}</span>
                </div>
              ))}
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {[
                { metric: "5+", label: "Blockchains supportées" },
                { metric: "100%", label: "Conforme à la législation" },
                { metric: "24/7", label: "Support disponible" },
                { metric: "99.9%", label: "Précision des calculs" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary-500 dark:text-primary-400">{item.metric}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Une solution complète pour votre fiscalité crypto
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Notre plateforme simplifie chaque étape de votre déclaration fiscale crypto
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Connexion Multi-Wallets",
                description: "Connectez vos wallets en toute sécurité, sans jamais partager vos clés privées. Bitax analyse vos transactions sur différentes blockchains."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Calcul Automatisé",
                description: "Notre algorithme analyse vos transactions, identifie les plus-values/moins-values et calcule vos obligations fiscales selon la méthode de votre choix (FIFO, LIFO...)."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Rapports Complets",
                description: "Générez des rapports fiscaux détaillés en PDF, CSV ou Excel, prêts à être utilisés pour votre déclaration d'impôts ou à partager avec votre comptable."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-16 h-16 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comment ça marche
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Trois étapes simples pour gérer votre fiscalité crypto
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                number: "01",
                title: "Connectez votre wallet",
                description: "Liez votre wallet en toute sécurité. Vos clés privées restent entre vos mains."
              },
              {
                number: "02",
                title: "Analysez vos transactions",
                description: "Notre algorithme analyse automatiquement vos transactions et identifie les événements taxables."
              },
              {
                number: "03",
                title: "Générez votre rapport",
                description: "Téléchargez votre rapport fiscal complet, prêt à être utilisé pour votre déclaration."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 w-full h-2 transform translate-x-1/2">
                    <div className="h-0.5 w-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                  </div>
                )}
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-display font-bold text-lg mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-800/20 rounded-3xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ils font confiance à Bitax
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Découvrez ce que nos utilisateurs disent de notre plateforme
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Bitax m'a fait économiser des heures de travail sur ma déclaration fiscale. Un outil indispensable !",
                author: "Thomas L.",
                role: "Trader Crypto",
                avatar: "T"
              },
              {
                quote: "Interface intuitive et rapport détaillé. Je recommande à tous les détenteurs de crypto-monnaies.",
                author: "Sophie M.",
                role: "Investisseuse",
                avatar: "S"
              },
              {
                quote: "Le suivi des transactions DeFi est impressionnant. Bitax comprend vraiment les besoins des utilisateurs.",
                author: "Marc D.",
                role: "Développeur Web3",
                avatar: "M"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center justify-center font-medium">
                      {testimonial.avatar}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section Summary */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choisissez le forfait qui correspond à vos besoins
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Gratuit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour essayer Bitax</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white my-6">0€</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Jusqu'à 100 transactions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Multi-blockchains</span>
                  </li>
                  <li className="flex items-center opacity-50">
                    <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-500">Export PDF limité</span>
                  </li>
                </ul>
                <Link href="/register" className="btn-outline w-full justify-center">
                  Commencer gratuitement
                </Link>
              </div>
            </div>
            
            {/* Premium Plan - Highlighted */}
            <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-xl border border-blue-200 dark:border-blue-800 overflow-hidden transform md:-translate-y-4 relative">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-medium">
                Populaire
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les investisseurs actifs</p>
                <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 my-6">9,99€</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">par mois</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Transactions illimitées</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Toutes les blockchains</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Exports PDF, CSV, Excel</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/register" className="btn-primary w-full justify-center">
                  Commencer l'essai
                </Link>
              </div>
            </div>
            
            {/* Business Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Entreprise</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Pour les professionnels</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white my-6">29,99€</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">par mois</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Tout le plan Premium</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">Multi-comptes</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">API dédiée</span>
                  </li>
                </ul>
                <Link href="/register" className="btn-outline w-full justify-center">
                  Contacter les ventes
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-primary-600 dark:text-primary-400 hover:underline">
              Voir tous les détails des plans →
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier votre fiscalité crypto ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Commencez dès aujourd'hui et générez votre premier rapport fiscal en quelques minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-white text-primary-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Essayer gratuitement
            </Link>
            <Link href="/login" className="px-8 py-4 bg-transparent hover:bg-primary-700 border-2 border-white font-bold rounded-xl transition-colors duration-300">
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}