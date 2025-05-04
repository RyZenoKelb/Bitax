import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 ml-64 relative overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-blue-600 filter blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 rounded-full bg-indigo-600 filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-48 right-1/3 w-96 h-96 rounded-full bg-purple-600 filter blur-3xl opacity-10"></div>
          
          {/* Grille subtile */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Conteneur du contenu avec défilement */}
        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout; 