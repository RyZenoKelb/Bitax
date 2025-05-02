"use client";

import { useState } from "react";
import Link from "next/link";

export default function ApiTestPage() {
  const [endpoint, setEndpoint] = useState("/api/test");
  const [method, setMethod] = useState("GET");
  const [requestBody, setRequestBody] = useState("{\n  \"test\": \"value\"\n}");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState<string | null>(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setRawResponse(null);
    
    try {
      let requestOptions: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      };
      
      // Ajouter le body pour les méthodes non-GET
      if (method !== "GET" && requestBody) {
        try {
          // Valider que le body est un JSON valide
          const parsedBody = JSON.parse(requestBody);
          requestOptions.body = JSON.stringify(parsedBody);
        } catch (e) {
          setError("Corps de requête JSON invalide");
          setLoading(false);
          return;
        }
      }
      
      // Faire la requête fetch
      const fetchResponse = await fetch(endpoint, requestOptions);
      
      // Récupérer la réponse brute
      const rawText = await fetchResponse.text();
      setRawResponse(rawText);
      
      // Tenter de parser la réponse comme du JSON
      try {
        const jsonResponse = JSON.parse(rawText);
        setResponse({
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: Object.fromEntries([...fetchResponse.headers.entries()]),
          data: jsonResponse
        });
      } catch (jsonError) {
        // Si la réponse n'est pas du JSON valide
        setError("La réponse n'est pas du JSON valide");
        setResponse({
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: Object.fromEntries([...fetchResponse.headers.entries()]),
        });
      }
    } catch (fetchError: any) {
      setError(`Erreur réseau: ${fetchError.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 p-2 rounded-xl shadow-glow-purple transform hover:scale-105 transition-all">
              BITAX
            </div>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Testeur d'API</h1>
          <p className="text-gray-300">Utilisez cet outil pour tester les endpoints API et diagnostiquer les problèmes</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-bold mb-4">Requête</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Méthode</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              
              {method !== "GET" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Corps de la requête (JSON)</label>
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    rows={8}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white font-mono text-sm"
                  />
                </div>
              )}
              
              <div>
                <button
                  onClick={handleTest}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium transition-all hover:shadow-lg"
                >
                  {loading ? "Envoi en cours..." : "Tester l'API"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl border border-gray-700/50">
            <h2 className="text-xl font-bold mb-4">Réponse</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
                <h3 className="font-bold mb-1">Erreur:</h3>
                <p>{error}</p>
              </div>
            )}
            
            {response && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={response.status >= 200 && response.status < 300 ? "text-green-400" : "text-red-400"}>
                      {response.status} {response.statusText}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Headers:</h3>
                  <div className="p-3 bg-gray-900/50 rounded-lg overflow-x-auto max-h-32">
                    <pre className="text-xs text-gray-300">
                      {JSON.stringify(response.headers, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {response.data && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-1">Données (JSON):</h3>
                    <div className="p-3 bg-gray-900/50 rounded-lg overflow-x-auto max-h-80">
                      <pre className="text-xs text-green-300">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {rawResponse && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-1">Réponse brute:</h3>
                <div className="p-3 bg-gray-900/50 rounded-lg overflow-x-auto max-h-80">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {rawResponse}
                  </pre>
                </div>
              </div>
            )}
            
            {!loading && !response && !error && (
              <div className="p-8 text-center text-gray-400">
                <p>Lancez une requête pour voir les résultats</p>
              </div>
            )}
            
            {loading && (
              <div className="p-8 text-center">
                <svg className="animate-spin h-8 w-8 text-indigo-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <h2 className="text-xl font-bold mb-4">Comment diagnostiquer les problèmes</h2>
          <div className="space-y-4 text-gray-300">
            <p>
              Utilisez cet outil pour identifier la racine du problème avec vos APIs. Voici quelques étapes de diagnostic:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Commencez par tester l'API de base <code className="text-indigo-300 bg-gray-900/50 px-1 rounded">/api/test</code> pour vérifier que votre serveur répond correctement.</li>
              <li>Si cette API fonctionne, testez ensuite l'API problématique (comme <code className="text-indigo-300 bg-gray-900/50 px-1 rounded">/api/register</code>).</li>
              <li>Examinez les erreurs et les réponses brutes pour identifier où se situe le problème.</li>
              <li>Si vous recevez du HTML au lieu du JSON, cela indique généralement une erreur 500 côté serveur.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}