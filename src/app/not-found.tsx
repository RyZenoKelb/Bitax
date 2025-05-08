'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-indigo-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-4">Page non trouvée</h1>
        <p className="text-gray-400 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}