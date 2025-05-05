// src/components/DashboardSidebar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: {
    count: number;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  subItems?: {
    name: string;
    href: string;
  }[];
};

interface DashboardSidebarProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  walletConnected: boolean;
  walletAddress?: string;
  isPremiumUser: boolean;
  className?: string;
  onMobileClose?: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userName = 'John Doe',
  userEmail = 'john.doe@example.com',
  userAvatar,
  walletConnected,
  walletAddress = '',
  isPremiumUser,
  className = '',
  onMobileClose
}) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Navigation principale
  const mainNavItems: NavItem[] = [
    {
      name: 'Tableau de bord',
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      name: 'Portefeuille',
      href: '/wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      badge: {
        count: 12,
        variant: 'primary'
      }
    },
    {
      name: 'Rapports Fiscaux',
      href: '/tax-reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      subItems: [
        { name: 'Rapport annuel', href: '/tax-reports/annual' },
        { name: 'Plus-values', href: '/tax-reports/capital-gains' },
        { name: 'NFTs', href: '/tax-reports/nfts' },
        { name: 'DeFi', href: '/tax-reports/defi' },
      ]
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    }
  ];
  
  // Navigation secondaire
  const secondaryNavItems: NavItem[] = [
    {
      name: 'Documentation',
      href: '/guide',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      name: 'Support',
      href: '/support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    }
  ];
  
  // Déterminer si un lien est actif
  const isActive = (href: string) => {
    return router.pathname === href || router.pathname.startsWith(`${href}/`);
  };
  
  // Toggle l'expansion des sous-menus
  const toggleExpand = (name: string) => {
    if (expanded === name) {
      setExpanded(null);
    } else {
      setExpanded(name);
    }
  };
  
  // Formatter l'adresse wallet
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  return (
    <aside className={`flex flex-col h-full overflow-y-auto bg-gray-900 dark:bg-gray-900 shadow-xl border-r border-gray-800 dark:border-gray-800 ${className}`}>
      {/* Logo et branding en haut */}
      <div className="px-4 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight">BITAX</h1>
            <span className="text-xs text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
          </div>
        </Link>
        
        {/* Bouton de fermeture pour mobile */}
        {onMobileClose && (
          <button onClick={onMobileClose} className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Info Wallet */}
      <div className="px-4 py-4 border-t border-b border-gray-800 dark:border-gray-800 bg-gray-800/30 dark:bg-gray-800/30">
        {walletConnected ? (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-300">Wallet connecté</span>
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-gray-800 dark:bg-gray-800 rounded-lg border border-gray-700 dark:border-gray-700">
              <span className="text-sm font-medium text-white">{formatAddress(walletAddress)}</span>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-white" title="Copier l'adresse">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="p-1 text-gray-400 hover:text-white" title="Voir sur Etherscan">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
            
            {isPremiumUser && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-primary-900 to-secondary-900 rounded-lg border border-primary-700 opacity-90">
                <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="text-xs font-medium text-primary-300">Premium</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 dark:bg-gray-800 rounded-lg px-3 py-3 text-center">
            <p className="text-xs text-gray-400 mb-2">Wallet non connecté</p>
            <button className="w-full py-1.5 px-3 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors">
              Connecter un wallet
            </button>
          </div>
        )}
      </div>
      
      {/* Navigation principale */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</h3>
        
        {mainNavItems.map((item) => (
          <div key={item.name} className="space-y-1">
            {item.subItems ? (
              <>
                <button 
                  onClick={() => toggleExpand(item.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href) 
                      ? 'bg-primary-900/40 text-primary-400 border-l-2 border-primary-500' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full bg-${item.badge.variant}-900 text-${item.badge.variant}-300`}>
                        {item.badge.count}
                      </span>
                    )}
                  </div>
                  <svg 
                    className={`w-4 h-4 transition-transform ${expanded === item.name ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Sous-menu */}
                {expanded === item.name && (
                  <div className="mt-1 pl-10 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive(subItem.href)
                            ? 'bg-primary-900/20 text-primary-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-900/40 text-primary-400 border-l-2 border-primary-500'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-gray-400">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full bg-${item.badge.variant}-900 text-${item.badge.variant}-300`}>
                    {item.badge.count}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>
      
      {/* Navigation secondaire */}
      <div className="px-2 py-4 space-y-1 border-t border-gray-800 dark:border-gray-800">
        <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
        
        {secondaryNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-900/40 text-primary-400 border-l-2 border-primary-500'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="mr-3 text-gray-400">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
      
      {/* Compte utilisateur */}
      <div className="px-4 py-4 mt-auto border-t border-gray-800 dark:border-gray-800 bg-gray-800/30 dark:bg-gray-800/30">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {userAvatar ? (
              <img className="h-9 w-9 rounded-full" src={userAvatar} alt={userName} />
            ) : (
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-medium">
                {userName.charAt(0)}
              </div>
            )}
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
          <div className="flex-shrink-0">
            <button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        {!isPremiumUser && (
          <div className="mt-3">
            <Link 
              href="/pricing" 
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Passer Premium
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;