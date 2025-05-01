import React from 'react';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    login();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Se connecter</h1>
        <button onClick={handleLogin} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Connexion (démo)
        </button>
      </div>
    </div>
  );
};

export default LoginPage;