"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Type définitions
interface WaitingListEntry {
  id: string;
  name: string;
  email: string;
  motivation: string | null;
  skills: string | null;
  invited: boolean;
  inviteCode: string | null;
  invitedAt: Date | null;
  createdAt: Date;
}

export default function WaitlistAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [entries, setEntries] = useState<WaitingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'invited'>('pending');
  const [sendingInvite, setSendingInvite] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  // Vérifier l'authentification et les droits d'administration
  useEffect(() => {
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    // Vérifier si l'utilisateur est administrateur
    if (session?.user?.email !== "ryzenoking@gmail.com") {
      router.push("/dashboard");
      return;
    }
    
    fetchWaitingList();
  }, [status, session, router, tab]);

  // Fonction pour récupérer la liste d'attente
  const fetchWaitingList = async () => {
    setLoading(true);
    try {
      // Adapter l'URL en fonction de l'onglet actif
      const url = `/api/admin/waitlist?status=${tab}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données");
      }
      
      const data = await response.json();
      setEntries(data);
    } catch (err) {
      setError("Impossible de charger les données. Veuillez réessayer.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour envoyer une invitation
  const sendInvite = async (id: string) => {
    setSendingInvite(id);
    setInviteLink(null);
    
    try {
      const response = await fetch(`/api/admin/waitlist/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'invitation");
      }
      
      const data = await response.json();
      
      // Stocker le lien d'invitation pour l'afficher
      if (data.inviteUrl) {
        setInviteLink(data.inviteUrl);
      }
      
      // Mettre à jour la liste
      await fetchWaitingList();
      setSuccessMessage("Invitation envoyée avec succès !");
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError("Impossible d'envoyer l'invitation. Veuillez réessayer.");
      console.error(err);
    } finally {
      setSendingInvite(null);
    }
  };

  // Filtrer les entrées en fonction de la recherche
  const filteredEntries = entries.filter(entry => 
    entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (entry.skills && entry.skills.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Gérer le chargement et les erreurs
  if (loading && entries.length === 0) {
    return (
      <div className="min-h-screen p-8 flex flex-col bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white">Administration de la liste d'attente</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Administration de la liste d'attente</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard" 
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Retour au tableau de bord
          </Link>
          
          <button
            onClick={() => fetchWaitingList()}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Actualiser
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300">
          {successMessage}
        </div>
      )}
      
      {inviteLink && (
        <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-300 mb-2">Lien d'invitation généré :</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={inviteLink} 
              readOnly 
              className="w-full p-2 border border-blue-300 dark:border-blue-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(inviteLink);
                setSuccessMessage("Lien copié dans le presse-papier!");
              }}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Copier
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8 border border-gray-200 dark:border-gray-700">
        {/* En-tête avec statistiques */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total des inscriptions</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{entries.length}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">En attente</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {entries.filter(e => !e.invited).length}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Invités</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {entries.filter(e => e.invited).length}
              </p>
            </div>
          </div>
        </div>
        
        {/* Contrôles et filtres */}
        <div className="flex flex-col md:flex-row gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom, email ou compétence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500"
              />
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex text-sm font-medium">
            <button
              onClick={() => setTab('pending')}
              className={`px-4 py-2 rounded-l-lg ${
                tab === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setTab('invited')}
              className={`px-4 py-2 rounded-r-lg ${
                tab === 'invited'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Invités
            </button>
          </div>
        </div>
        
        {/* Liste des inscriptions */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Compétences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Aucune inscription trouvée
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {entry.skills ? (
                        <div className="flex flex-wrap gap-1">
                          {entry.skills.split(',').map((skill, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Aucune</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            // Afficher les détails (motivation) dans une alerte
                            alert(`Motivation de ${entry.name}:\n\n${entry.motivation || "Aucune motivation fournie."}`);
                          }}
                          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Détails
                        </button>
                        
                        {!entry.invited && (
                          <button
                            onClick={() => sendInvite(entry.id)}
                            disabled={sendingInvite === entry.id}
                            className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {sendingInvite === entry.id ? 'Envoi...' : 'Inviter'}
                          </button>
                        )}
                        
                        {entry.invited && entry.inviteCode && (
                          <button
                            onClick={() => {
                              const url = `${window.location.origin}/invite/${entry.inviteCode}`;
                              navigator.clipboard.writeText(url);
                              setSuccessMessage("Lien d'invitation copié!");
                              setInviteLink(url);
                            }}
                            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Copier lien
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}