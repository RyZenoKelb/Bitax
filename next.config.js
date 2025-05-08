/** @type {import('next').NextConfig} */
const nextConfig = {
    // Activation du mode strict de React pour une meilleure qualité de code
    reactStrictMode: true,
    
    // Paramètres d'images pour optimiser les performances
    images: {
      domains: ['images.unsplash.com'], // Ajoutez les domaines d'images externes si nécessaire
      formats: ['image/avif', 'image/webp'],
    },
    
    // Configuration pour l'expiration des pages statiques
    staticPageGenerationTimeout: 180,
    
    // Gestion des redirections
    async redirects() {
      return [
        {
          source: '/tarifs',
          destination: '/pricing',
          permanent: true,
        },
        {
          source: '/features',
          destination: '/guide',
          permanent: true,
        },
      ]
    },
    
    // Activation du RSC pour les pages utilisant 'use client'
    experimental: {
      serverActions: true,
    },
  }
  
  module.exports = nextConfig