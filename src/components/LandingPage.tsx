import React from 'react';
import Link from 'next/link';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="text-center px-4 py-16">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Simplifiez votre <span className="text-blue-600 dark:text-blue-400">fiscalité crypto</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Connectez votre wallet, analysez vos transactions et générez vos rapports fiscaux en quelques clics.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Se connecter
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            S'inscrire
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Pourquoi choisir Bitax ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connexion sécurisée</h3>
              <p className="text-gray-600 dark:text-gray-300">Connectez votre wallet en toute sécurité.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analyses détaillées</h3>
              <p className="text-gray-600 dark:text-gray-300">Visualisez vos transactions en temps réel.</p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Rapports fiscaux</h3>
              <p className="text-gray-600 dark:text-gray-300">Générez des rapports conformes facilement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Prêt à commencer ?</h2>
        <Link href="/signup" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Créer un compte
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;