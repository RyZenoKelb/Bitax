// src/components/DashboardStyles.tsx
import React from 'react';
import Head from 'next/head';

const DashboardStyles: React.FC = () => {
  return (
    <Head>
      <style jsx global>{`
        /* Importation des styles spécifiques au dashboard */
        @import url('/styles/dashboard.css');
        @import url('/styles/bouttons.css');
        
        /* Effets de background additionnels pour le dashboard */
        body {
          position: relative;
          overflow-x: hidden;
        }
        
        /* Suppression du padding par défaut pour le contenu dashboard */
        .dashboard-content .container {
          padding-left: 0;
          padding-right: 0;
        }
        
        /* Correction des animations pour éviter le flickering */
        .theme-transition * {
          transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease !important;
        }
        
        /* Effets de glassmorphism avancés */
        .glass-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        /* Fix pour les badges et labels */
        .badge-premium {
          background: linear-gradient(90deg, #7B3FE4, #0EEAFF);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        /* Scrollbar stylisée */
        ::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </Head>
  );
};

export default DashboardStyles;