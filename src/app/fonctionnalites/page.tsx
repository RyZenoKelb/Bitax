import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header simplifié avec juste un logo pour revenir à l'accueil */}
      <header className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Link href="/" className="inline-block">
            <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 p-2 rounded-xl shadow-glow-purple transform hover:scale-105 transition-all">
              BITAX
            </div>
          </Link>
        </div>
      </header>

      {/* Section titre */}
      <section className="py-12 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-heading mb-4">
            Fonctionnalités <span className="premium-gradient-text">Bitax</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Des outils puissants pour simplifier votre fiscalité cryptocurrency
          </p>
        </div>
      </section>

      {/* Section fonctionnalités principales */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Multi-Wallets",
                description: "Connectez vos wallets en toute sécurité et analysez vos transactions sur différentes blockchains sans partager vos clés privées."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Calcul Automatisé",
                description: "Notre algorithme analyse vos transactions, identifie les plus-values/moins-values et calcule vos obligations fiscales selon la méthode de votre choix."
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Rapports Complets",
                description: "Générez des rapports fiscaux détaillés en PDF, CSV ou Excel, prêts à être utilisés pour votre déclaration d'impôts ou à partager avec votre comptable."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-md rounded-xl p-6 shadow-xl border border-gray-700/50 transform transition-all hover:-translate-y-2 hover:shadow-indigo-500/10 duration-300">
                <div className="w-16 h-16 rounded-xl bg-indigo-900/50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section blockchain supportées */}
      <section className="py-16 bg-gradient-to-b from-transparent to-indigo-900/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-3xl font-heading text-center mb-12">Blockchains Supportées</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base', 'Solana'].map((network, index) => (
              <div key={index} className="bg-gray-800/40 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 flex flex-col items-center justify-center text-center transform transition-all hover:scale-105 hover:bg-indigo-900/30 hover:border-indigo-500/50 duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl mb-3">
                  {network.charAt(0)}
                </div>
                <span className="text-lg font-medium">{network}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section comparaison avantages */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-heading text-center mb-12">Pourquoi choisir Bitax?</h2>
          
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
            <div className="grid grid-cols-3 bg-gray-800/50 p-4 border-b border-gray-700/50">
              <div className="col-span-1"></div>
              <div className="text-center font-bold">Solutions manuelles</div>
              <div className="text-center font-bold text-indigo-400">Bitax</div>
            </div>
            
            {[
              {
                feature: "Temps requis",
                manual: "Des heures, voire des jours",
                bitax: "Quelques minutes"
              },
              {
                feature: "Erreurs de calcul",
                manual: "Fréquentes",
                bitax: "Algorithme précis"
              },
              {
                feature: "Support multi-chaînes",
                manual: "Complexe",
                bitax: "Intégré et automatisé"
              },
              {
                feature: "Méthodes de calcul",
                manual: "Limitées",
                bitax: "Multiples options"
              },
              {
                feature: "Mise à jour des prix",
                manual: "Manuelle",
                bitax: "Automatique et précise"
              }
            ].map((item, index) => (
              <div key={index} className={`grid grid-cols-3 p-4 ${index % 2 === 0 ? 'bg-gray-800/20' : ''} border-b border-gray-700/50 text-sm md:text-base`}>
                <div className="font-medium">{item.feature}</div>
                <div className="text-center text-gray-400">{item.manual}</div>
                <div className="text-center text-indigo-300">{item.bitax}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-900/70 to-purple-900/70 rounded-3xl mx-4 sm:mx-8 lg:mx-12 my-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à simplifier votre fiscalité crypto?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Commencez gratuitement et générez votre premier rapport fiscal en quelques minutes.
          </p>
          <Link href="/register" className="px-8 py-4 bg-white text-indigo-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Essayer gratuitement
          </Link>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 bg-gray-900/80 border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Bitax. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link>
            <Link href="#" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}