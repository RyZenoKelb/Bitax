"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

// Schema de validation
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit comporter au moins 8 caractères"),
});

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);
    
    try {
      // Validate form data
      const validation = registerSchema.safeParse(formData);
      if (!validation.success) {
        const fieldErrors: any = {};
        validation.error.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }
      
      // Submit to API
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      // Gestion spécifique des erreurs de parsing JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error("Erreur de parsing JSON:", jsonError);
        throw new Error("Erreur lors de la communication avec le serveur. Réponse non JSON reçue.");
      }
      
      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de l'inscription");
      }
      
      // Sign in the user after successful registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      
      if (signInResult?.error) {
        throw new Error("Erreur lors de la connexion automatique. Veuillez vous connecter manuellement.");
      }
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error: any) {
      setFormError(error.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
            Créer un compte
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Rejoignez Bitax et simplifiez votre fiscalité crypto
          </p>
        </div>
        
        {formError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {formError}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nom complet
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.name 
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                } dark:bg-gray-700 dark:text-white text-gray-900 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Votre nom"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.email 
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                } dark:bg-gray-700 dark:text-white text-gray-900 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`block w-full px-4 py-3 rounded-lg border ${
                  errors.password 
                    ? "border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500" 
                    : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500"
                } dark:bg-gray-700 dark:text-white text-gray-900 focus:outline-none focus:ring-2 transition-colors`}
                placeholder="Minimum 8 caractères"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 relative"
            >
              {isLoading ? (
                <>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span className="opacity-0">Créer mon compte</span>
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">ou</p>
          <button 
            className="mt-4 w-full py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}