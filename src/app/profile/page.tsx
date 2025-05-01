"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [wallets, setWallets] = useState<any[]>([]);
  const [isLoadingWallets, setIsLoadingWallets] = useState(false);

  // Charger les données de l'utilisateur
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
      });
      
      // Récupérer les wallets de l'utilisateur
      fetchWallets();
    }
  }, [session]);

  // Fonction pour récupérer les wallets de l'utilisateur
  const fetchWallets = async () => {
    if (!session?.user) return;
    
    setIsLoadingWallets(true);
    
    try {
      const response = await fetch("/api/wallet");
      if (response.ok) {
        const data = await response.json();
        setWallets(data.wallets);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des wallets", error);
    } finally {
      setIsLoadingWallets(false);
    }
  };

  // Gérer la modification des champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        // Mettre à jour la session
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            email: formData.email,
          },
        });
        
        setMessage({
          type: "success",
          text: "Profil mis à jour avec succès",
        });
      } else {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue");
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Une erreur est survenue lors de la mise à jour du profil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formater une adresse wallet pour l'affichage
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`;
  };

  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Mon profil</h1>
        
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Section de l'avatar et du statut */}
            <div className="md:w-1/3 bg-gray-50 dark:bg-gray-700 p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                {session.user.image ? (
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-500">
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "Profile"}
                      width={112}
                      height={112}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-medium">
                    {(session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U").toUpperCase()}
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {session.user.name || "Utilisateur"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{session.user.email}</p>
              
              {session.user.isPremium ? (
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-4 py-2 rounded-full flex items-center text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Compte Premium
                </div>
              ) : (
                <Link href="/pricing" className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center text-sm font-medium">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Passer Premium
                </Link>
              )}
            </div>
            
            {/* Section du formulaire de profil */}
            <div className="md:w-2/3 p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Informations personnelles</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-gray-900"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary py-2 px-6 relative"
                    >
                      {isLoading ? (
                        <>
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                          <span className="opacity-0">Sauvegarder</span>
                        </>
                      ) : (
                        "Sauvegarder"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Section des wallets connectés */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Wallets connectés</h3>
              <Link href="/dashboard" className="btn-outline py-2 px-4 text-sm">
                Ajouter un wallet
              </Link>
            </div>
            
            {isLoadingWallets ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : wallets.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">Aucun wallet connecté pour le moment.</p>
                <Link href="/dashboard" className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:underline">
                  Connecter un wallet →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {wallets.map((wallet) => (
                  <div key={wallet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 01-2-2v0a2 2 0 00-2-2h0a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 012 2v0c0 1.105.895 2 2 2h0" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {wallet.name || `Wallet ${formatAddress(wallet.address)}`}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatAddress(wallet.address)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {wallet.isPrimary && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                          Principal
                        </span>
                      )}
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full uppercase">
                        {wallet.network}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}