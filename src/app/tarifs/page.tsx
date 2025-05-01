import Link from "next/link";

export default function PricingPage() {
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
            Tarifs <span className="premium-gradient-text">transparents</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins fiscaux en cryptomonnaies
          </p>
        </div>
      </section>

      {/* Grille de tarifs */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Forfait gratuit */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 shadow-xl transition-transform hover:-translate-y-2 duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Gratuit</h3>
                <p className="text-gray-400 mb-4">Pour essayer Bitax</p>
                <p className="text-4xl font-bold my-6">0€</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Jusqu'à 100 transactions</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Support de 3 blockchains</span>
                  </li>
                  <li className="flex items-center opacity-70">
                    <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400">Export PDF limité</span>
                  </li>
                </ul>
                <Link href="/register" className="block text-center w-full py-3 px-4 border border-indigo-500/50 hover:border-indigo-500 rounded-lg font-medium transition-all hover:bg-indigo-500/10 hover:shadow-lg">
                  Commencer gratuitement
                </Link>
              </div>
            </div>
            
            {/* Forfait Premium */}
            <div className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-md rounded-xl overflow-hidden border border-indigo-500/30 shadow-2xl transform md:-translate-y-4 transition-transform hover:-translate-y-6 duration-300">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-bl-xl text-sm font-medium">
                Populaire
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-blue-300 mb-4">Pour les investisseurs actifs</p>
                <p className="text-4xl font-bold my-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">9,99€</p>
                <p className="text-sm text-gray-400 -mt-4 mb-6">par mois</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">Transactions illimitées</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">Toutes les blockchains</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">Exports PDF, CSV, Excel</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-200">Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/register" className="block text-center w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium transition-all hover:shadow-glow-purple">
                  Commencer l'essai
                </Link>
              </div>
            </div>
            
            {/* Forfait Entreprise */}
            <div className="bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50 shadow-xl transition-transform hover:-translate-y-2 duration-300">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Entreprise</h3>
                <p className="text-gray-400 mb-4">Pour les professionnels</p>
                <p className="text-4xl font-bold my-6">29,99€</p>
                <p className="text-sm text-gray-400 -mt-4 mb-6">par mois</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Tout le plan Premium</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">Multi-comptes</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">API dédiée</span>
                  </li>
                </ul>
                <Link href="/register" className="block text-center w-full py-3 px-4 border border-gray-500/50 hover:border-gray-400 rounded-lg font-medium transition-all hover:bg-gray-700/50 hover:shadow-lg">
                  Contacter les ventes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section FAQ (optionnelle) */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-heading text-center mb-10">Questions fréquentes</h2>
          
          <div className="space-y-6">
            {[
              {
                question: "Comment fonctionne la période d'essai ?",
                answer: "La période d'essai Premium dure 14 jours sans engagement. Vous pouvez annuler à tout moment pendant cette période sans être facturé."
              },
              {
                question: "Puis-je changer de forfait à tout moment ?",
                answer: "Oui, vous pouvez passer d'un forfait à l'autre à tout moment. La facturation sera ajustée au prorata si vous passez à un forfait supérieur."
              },
              {
                question: "Quelles méthodes de paiement acceptez-vous ?",
                answer: "Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) ainsi que les paiements par virement bancaire pour les forfaits Entreprise."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-6 border border-gray-700/30">
                <h3 className="text-xl font-medium mb-2">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer simple */}
      <footer className="py-8 bg-gray-900/80 border-t border-gray-800/50">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2025 Bitax. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <Link href="#" className="hover:text-white transition-colors">Conditions d'utilisation</Link>
            <Link href="#" className="hover:text-white transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}