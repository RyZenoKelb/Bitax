import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header amélioré avec logo moderne */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 backdrop-blur-lg bg-gray-900/50 border-b border-gray-800/30">
        <div className="container mx-auto">
          <Link href="/" className="inline-block group">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 animate-pulse-slow"></div>
                <div className="relative z-10 font-display text-2xl font-bold text-white">B</div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight">BITAX</span>
                <span className="text-xs text-gray-400 -mt-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
              </div>
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

      {/* Le reste du contenu reste identique... */}
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

      {/* Le reste du code reste inchangé... */}
    </div>
  );
}