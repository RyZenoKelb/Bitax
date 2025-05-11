"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";

// Composant pour les étapes de progression
const ProgressStep = ({ number, title, isActive, isCompleted }: { 
  number: number; 
  title: string; 
  isActive: boolean; 
  isCompleted: boolean;
}) => {
  return (
    <div className="flex items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium 
        ${isCompleted ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 
          isActive ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-indigo-500' : 
          'bg-gray-800/50 text-gray-400 border border-gray-700'}`}
      >
        {isCompleted ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : number}
      </div>
      <div className="ml-3">
        <h3 className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
          {title}
        </h3>
      </div>
    </div>
  );
};

// Les étapes du formulaire
enum WaitingListStep {
  INFORMATION,
  MOTIVATION,
  CONFIRMATION
}

export default function WaitingListPage() {
  // États pour le formulaire
  const [currentStep, setCurrentStep] = useState<WaitingListStep>(WaitingListStep.INFORMATION);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    motivation: "",
    skills: [] as string[]
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  // Options de compétences
  const skillOptions = [
    "Développeur",
    "Designer",
    "Finance",
    "Marketing",
    "Crypto-enthousiaste",
    "Fiscalité"
  ];

  // Animation d'apparition
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Nettoyer l'erreur lorsque l'utilisateur tape
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Gestion des compétences avec toggles
  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      
      return {
        ...prev,
        skills: updatedSkills
      };
    });
  };

  // Valider les champs du formulaire
  const validateStep = () => {
    let isValid = true;
    const newErrors: any = {};

    if (currentStep === WaitingListStep.INFORMATION) {
      if (!formData.name.trim()) {
        newErrors.name = "Le nom est requis";
        isValid = false;
      }

      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
        isValid = false;
      }
    }

    if (currentStep === WaitingListStep.MOTIVATION && !formData.motivation.trim()) {
      newErrors.motivation = "Veuillez partager votre motivation";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour passer à l'étape suivante
  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Récupérer le nombre d'inscrits à la waiting list (optionnel)
  useEffect(() => {
    const fetchWaitlistCount = async () => {
      try {
        const response = await fetch("/api/waitlist/count");
        if (response.ok) {
          const data = await response.json();
          if (data.count) {
            setWaitlistCount(data.count);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'inscrits:", error);
      }
    };
    
    fetchWaitlistCount();
  }, []);

  // Soumission du formulaire
  const submitForm = async () => {
    if (validateStep()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de l'inscription");
        }

        setSubmitSuccess(true);
        
        // Incrémente le compteur si on en a un
        if (waitlistCount !== null) {
          setWaitlistCount(waitlistCount + 1);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setErrors({ submit: "Une erreur est survenue. Veuillez réessayer." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Arrière-plan avec effet de blockchain */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-600/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-600/5 rounded-full filter blur-[100px]"></div>
      </div>

      {/* Header minimaliste */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 tracking-tight">BITAX</h1>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full text-white">Beta</span>
        </Link>
        <Link 
          href="/" 
          className="text-sm text-white/70 hover:text-white flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour à l'accueil
        </Link>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              Rejoignez la beta privée
            </h1>
            <p className="text-lg text-white/80 max-w-lg mx-auto">
              Soyez parmi les premiers à tester Bitax et aidez-nous à construire la meilleure solution de fiscalité crypto en France.
            </p>
          </motion.div>

          {/* Progression des étapes */}
          <motion.div 
            className="flex justify-between mb-10 px-6 py-4 bg-gray-800/20 border border-white/5 rounded-xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProgressStep 
              number={1} 
              title="Informations" 
              isActive={currentStep === WaitingListStep.INFORMATION} 
              isCompleted={currentStep > WaitingListStep.INFORMATION}
            />
            <div className="border-t-2 border-dashed border-gray-700 flex-grow mt-5 mx-4"></div>
            <ProgressStep 
              number={2} 
              title="Motivation" 
              isActive={currentStep === WaitingListStep.MOTIVATION} 
              isCompleted={currentStep > WaitingListStep.MOTIVATION}
            />
            <div className="border-t-2 border-dashed border-gray-700 flex-grow mt-5 mx-4"></div>
            <ProgressStep 
              number={3} 
              title="Confirmation" 
              isActive={currentStep === WaitingListStep.CONFIRMATION} 
              isCompleted={submitSuccess}
            />
          </motion.div>

          {/* Formulaire */}
          <div className="relative bg-gray-800/30 backdrop-blur-sm border border-white/10 rounded-2xl shadow-2xl overflow-hidden mb-12">
            {/* Badge avec le nombre de personnes en waiting list (si disponible) */}
            {waitlistCount && waitlistCount > 0 && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full px-3 py-1 text-sm font-medium text-white shadow-lg flex items-center">
                <span>{waitlistCount}+</span>
                <span className="ml-1 text-xs opacity-80">personnes en attente</span>
              </div>
            )}
            
            {/* Contenu du formulaire */}
            <div className="p-6 sm:p-8">
              {/* Étape 1: Informations */}
              {currentStep === WaitingListStep.INFORMATION && (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <motion.div variants={item}>
                    <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                      Votre nom complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border ${
                        errors.name ? "border-red-500" : "border-gray-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                      placeholder="Satoshi Nakamoto"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                  </motion.div>

                  <motion.div variants={item}>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                      Votre email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-gray-900/50 border ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                      placeholder="satoshi@crypto.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                  </motion.div>

                  <motion.div variants={item}>
                    <label className="block text-sm font-medium text-white mb-2">
                      Vos compétences (optionnel)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {skillOptions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.skills.includes(skill)
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {skill}
                          {formData.skills.includes(skill) && (
                            <span className="ml-1">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="pt-4">
                    <button
                      onClick={nextStep}
                      className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                    >
                      Continuer
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Étape 2: Motivation */}
              {currentStep === WaitlingListStep.MOTIVATION && (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <motion.div variants={item}>
                    <label htmlFor="motivation" className="block text-sm font-medium text-white mb-1">
                      Pourquoi souhaitez-vous rejoindre la beta de Bitax ?
                    </label>
                    <textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full px-4 py-3 bg-gray-900/50 border ${
                        errors.motivation ? "border-red-500" : "border-gray-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white`}
                      placeholder="Partagez votre intérêt pour la fiscalité crypto, vos besoins spécifiques, ou comment vous pensez pouvoir contribuer à l'amélioration du produit..."
                    />
                    {errors.motivation && <p className="mt-1 text-sm text-red-500">{errors.motivation}</p>}
                  </motion.div>

                  <motion.div variants={item} className="pt-4 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-all"
                    >
                      Retour
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25"
                    >
                      Continuer
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Étape 3: Récapitulatif et Confirmation */}
              {currentStep === WaitlingListStep.CONFIRMATION && !submitSuccess && (
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-6"
                >
                  <motion.div variants={item}>
                    <h3 className="text-xl font-semibold text-white mb-4">Récapitulatif de votre candidature</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Nom</p>
                        <p className="text-white">{formData.name}</p>
                      </div>
                      
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{formData.email}</p>
                      </div>
                      
                      {formData.skills.length > 0 && (
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-400">Compétences</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {formData.skills.map((skill) => (
                              <span key={skill} className="px-2 py-1 bg-gray-800 text-xs rounded-full text-gray-300">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-gray-900/50 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Motivation</p>
                        <p className="text-white whitespace-pre-line">{formData.motivation}</p>
                      </div>
                    </div>
                    
                    {errors.submit && (
                      <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                        {errors.submit}
                      </div>
                    )}
                    
                    <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mb-6">
                      <p className="text-sm text-indigo-300">
                        <span className="font-medium">Note:</span> L'accès à la beta est limité et s'effectue par vagues. Vous serez notifié par email lorsque votre candidature sera acceptée.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={item} className="pt-4 flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 bg-gray-700 rounded-lg text-white font-medium hover:bg-gray-600 transition-all"
                    >
                      Retour
                    </button>
                    <button
                      onClick={submitForm}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Traitement...</span>
                        </div>
                      ) : (
                        "Confirmer et rejoindre la liste d'attente"
                      )}
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* Confirmation de succès */}
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Votre demande a été enregistrée !
                  </h3>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    Merci pour votre intérêt pour Bitax. Nous examinerons votre candidature et vous notifierons par email lorsque vous serez invité à rejoindre la beta.
                  </p>
                  
                  <Link 
                    href="/"
                    className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-all"
                  >
                    Retour à l'accueil
                  </Link>
                </motion.div>
              )}
            </div>
          </div>

          {/* Section avantages beta */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gray-800/20 backdrop-blur-sm border border-white/5 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Accès anticipé</h3>
              <p className="text-gray-400 text-sm">Testez Bitax avant tout le monde et profitez de ses fonctionnalités en exclusivité.</p>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-sm border border-white/5 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Impact direct</h3>
              <p className="text-gray-400 text-sm">Participez activement au développement et influencez l'évolution du produit.</p>
            </div>
            
            <div className="bg-gray-800/20 backdrop-blur-sm border border-white/5 rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Avantages exclusifs</h3>
              <p className="text-gray-400 text-sm">Bénéficiez d'offres spéciales et de tarifs préférentiels lors du lancement officiel.</p>
            </div>
          </motion.div>

          {/* Section FAQ */}
          <motion.div 
            className="rounded-xl border border-white/10 overflow-hidden backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-indigo-900/20 px-6 py-4 border-b border-white/10">
              <h3 className="text-lg font-medium text-white">Questions fréquentes sur la beta</h3>
            </div>
            <div className="bg-gray-800/20 divide-y divide-white/5">
              <div className="px-6 py-4">
                <h4 className="text-white font-medium mb-2">Quand serai-je accepté dans la beta ?</h4>
                <p className="text-gray-400 text-sm">Les invitations sont envoyées par vagues, généralement dans les 2 semaines suivant votre inscription. Nous privilégions les profils variés et complémentaires.</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="text-white font-medium mb-2">Combien de temps durera la phase beta ?</h4>
                <p className="text-gray-400 text-sm">La beta sera active pendant environ 2 mois avant le lancement officiel. Vous aurez tout le temps de tester et de nous faire vos retours.</p>
              </div>
              <div className="px-6 py-4">
                <h4 className="text-white font-medium mb-2">Y a-t-il un coût pour participer à la beta ?</h4>
                <p className="text-gray-400 text-sm">Non, la participation à la beta est entièrement gratuite. Vous aurez accès à toutes les fonctionnalités sans frais pendant cette période.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="mt-12 border-t border-white/5 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Bitax. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}