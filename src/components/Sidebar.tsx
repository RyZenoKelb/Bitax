import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// Types pour les éléments de menu
interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const Sidebar: React.FC = () => {
  const router = useRouter();

  // Construction des groupes de menu
  const menuGroups: MenuGroup[] = [
    {
      title: "PRINCIPAL",
      items: [
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          label: "Dashboard",
          href: "/dashboard",
          isActive: router.pathname === '/dashboard'
        }
      ]
    },
    {
      title: "CONTENU",
      items: [
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
          ),
          label: "Portefeuilles",
          href: "/wallets",
          isActive: router.pathname === '/wallets'
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          label: "Transactions",
          href: "/transactions",
          isActive: router.pathname === '/transactions'
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          label: "Rapports",
          href: "/reports",
          isActive: router.pathname === '/reports'
        }
      ]
    },
    {
      title: "PARAMÈTRES",
      items: [
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          label: "Préférences",
          href: "/settings",
          isActive: router.pathname === '/settings'
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          ),
          label: "Premium",
          href: "/pricing",
          isActive: router.pathname === '/pricing'
        },
        {
          icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          label: "Facturation",
          href: "/billing",
          isActive: router.pathname === '/billing'
        }
      ]
    }
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-xl z-30">
      {/* Logo et titre */}
      <div className="p-5 border-b border-gray-800 flex items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">BITAX</div>
      </div>

      {/* Contenu du sidebar */}
      <div className="flex-grow overflow-y-auto custom-scrollbar px-4 py-2">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="text-xs text-gray-500 font-semibold tracking-wider mb-3 pl-2">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item, itemIndex) => (
                <Link 
                  href={item.href} 
                  key={itemIndex}
                >
                  <a className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                    item.isActive 
                      ? 'bg-blue-600 text-white font-medium' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}>
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-400"></span>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer du sidebar */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-3">
            BX
          </div>
          <div>
            <div className="text-sm font-medium">Mon Compte</div>
            <div className="text-xs text-gray-500">Premium</div>
          </div>
          <svg className="w-4 h-4 ml-auto text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 