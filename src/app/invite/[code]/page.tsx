"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { signIn } from "next-auth/react";

// Schema de validation
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

// Interface pour les détails de l'invitation
interface InviteDetails {
  email: string;
  name: string;
}

export default function InvitePage({ params }: { params: { code: string } }) {
  const [inviteDetails, setInviteDetails] = useState<InviteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  
  // Obtenir les détails de l'invitation
  useEffect(() => {
    const fetchInviteDetails = async () => {
      try {
        const response = await fetch(`/api/admin/waitlist/invite?code=${params.code}`);
        
        if (!response.ok) {
          throw new Error("Code d'invitation invalide ou expiré");
        }
        
        const data = await response.json();
        setInviteDetails({
          email: data.email,
          name: data.name,
        });
        
        // Pré-remplir le formulaire
        setFormData({
          name: data.name,
          email: data.email,
          password: "",
        });
      } catch (err) {
        setError("Ce lien d'invitation n'est pas valide ou a expiré.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInviteDetails();
  }, [params.code]);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Effacer l'erreur lorsque l'utilisateur tape
    if (formErrors[name]) {
    setFormErrors((prev: Record<string, string | null>) => ({
      ...prev,
      [name]: null,
    }));
    }
  };
  
  // Soumettre le formulaire d'inscription
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Valider les données du formulaire
      const validation = registerSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: any = {};
        validation.error.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setFormErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }
      
      // Soumettre à l'API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          inviteCode: params.code, // Inclure le code d'invitation
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Une erreur est survenue lors de l'inscription");
      }
      
      // Connecter l'utilisateur
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (signInResult?.error) {
        throw new Error("Erreur lors de la connexion automatique. Veuillez vous connecter manuellement.");
      }
      
      // Rediriger vers le tableau de bord
      router.push("/dashboard");
    } catch (error: any) {
      setFormError(error.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-700 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification de votre invitation...</p>
        </div>
      </div>
    );
  }

  // Afficher une erreur si l'invitation n'est pas valide
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Invitation invalide</h2>
            <p className="text-gray-300 mt-2">{error}</p>
          </div>
          
          <div className="mt-6">
            <Link
              href="/waitlist"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Rejoindre la liste d'attente
            </Link>
            
            <Link
              href="/"
              className="block w-full text-center mt-4 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le formulaire d'inscription
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Vous êtes invité !</h2>
          <p className="text-gray-300 mt-2">Complétez votre inscription pour accéder à la beta de Bitax</p>
        </div>
        
        {formError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Votre nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                formErrors.name ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="John Doe"
              disabled={true} // Verrouillé car c'est pré-rempli avec le nom de l'invitation
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Votre email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                formErrors.email ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="john.doe@example.com"
              disabled={true} // Verrouillé car c'est pré-rempli avec l'email de l'invitation
            />
            {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Créez un mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-700 border ${
                formErrors.password ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Minimum 8 caractères"
            />
            {formErrors.password && <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Création du compte...</span>
                </div>
              ) : (
                "Créer mon compte Bitax"
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>
            En créant un compte, vous acceptez nos{" "}
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
              Politique de confidentialité
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}