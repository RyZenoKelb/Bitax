// src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Transition } from '@headlessui/react';

// Logo component
const BitaxLogo = ({ compact = false }: { compact?: boolean }) => {
  return (
    <div className={`flex items-center ${compact ? 'justify-center' : ''}`}>
      <div className="flex flex-col">
        <span className={`${compact ? 'text-xl' : 'text-2xl'} font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight`}>
          {compact ? 'BX' : 'BITAX'}
        </span>
        {!compact && (
          <span className="text-xs text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide">FISCALITÉ CRYPTO</span>
        )}
      </div>
    </div>
  );
};

interface NavigationItem {
  name: string;
  href: string;
  icon: JSX.Element;
  badge?: string | number;
}

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    // Initialize
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Navigation items
  const mainNavigation: NavigationItem[] = [
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
      ),
    },
    {
      name: 'Portefeuille',
      href: '/wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      badge: '3',
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      name: 'Rapports Fiscaux',
      href: '/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      name: 'Historique',
      href: '/history',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  const secondaryNavigation: NavigationItem[] = [
    {
      name: 'Guide',
      href: '/guide',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      name: 'Paramètres',
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Support',
      href: '/support',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
  ];

  // Navigate with animation
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Add animation/transition here if needed
    router.push(href);
  };

  // Determine if a nav item is active
  const isActive = (href: string) => {
    return router.pathname === href || (href !== '/dashboard' && router.pathname.startsWith(href));
  };

  // Render navigation item
  const renderNavItem = (item: NavigationItem, index: number) => {
    const active = isActive(item.href);
    
    return (
      <Link 
        key={index} 
        href={item.href}
        onClick={(e) => handleNavigation(e, item.href)}
        className={`
          flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} 
          px-4 py-3 rounded-lg transition-all duration-300 group relative
          ${active 
            ? 'bg-primary-900/30 text-primary-400 dark:bg-primary-900/40 dark:text-primary-300' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}
        `}
      >
        <div className="flex items-center">
          <div className={`${active ? 'text-primary-400 dark:text-primary-300' : 'text-gray-400 group-hover:text-white'}`}>
            {item.icon}
          </div>
          
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium">{item.name}</span>
          )}
        </div>
        
        {!isCollapsed && item.badge && (
          <div className="bg-primary-600/70 text-xs font-medium text-white rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
            {item.badge}
          </div>
        )}
        
        {isCollapsed && item.badge && (
          <div className="absolute top-1 right-1.5 bg-primary-600/70 text-xs font-medium text-white rounded-full h-4 min-w-4 flex items-center justify-center px-1">
            {item.badge}
          </div>
        )}
        
        {isCollapsed && (
          <span className="absolute left-full ml-2 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-50 whitespace-nowrap">
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  // Main sidebar component
  return (
    <>
      {/* Mobile menu backdrop */}
      {isMobile && (
        <Transition
          show={isMobileOpen}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary-600 text-white rounded-full p-3 shadow-lg transition-transform hover:scale-105"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isMobileOpen 
              ? "M6 18L18 6M6 6l12 12" 
              : "M4 6h16M4 12h16M4 18h16"
            } 
          />
        </svg>
      </button>

      {/* Sidebar */}
      <Transition
        show={!isMobile || isMobileOpen}
        enter="transition-all ease-in-out duration-300"
        enterFrom={isMobile ? "-translate-x-full" : ""}
        enterTo={isMobile ? "translate-x-0" : ""}
        leave="transition-all ease-in-out duration-200"
        leaveFrom={isMobile ? "translate-x-0" : ""}
        leaveTo={isMobile ? "-translate-x-full" : ""}
        className={`fixed inset-y-0 left-0 z-40 flex flex-col 
          ${isCollapsed ? 'w-16' : 'w-64'} 
          transition-all duration-300 ease-in-out
          bg-gray-900 dark:bg-gray-900 border-r border-gray-800/50 dark:border-gray-800/50`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800/50 dark:border-gray-800/50">
          <div className="flex items-center">
            <BitaxLogo compact={isCollapsed} />
          </div>
          
          {!isCollapsed && !isMobile && (
            <button 
              onClick={() => setIsCollapsed(true)}
              className="text-gray-400 hover:text-white p-1.5 rounded-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}
          
          {isCollapsed && !isMobile && (
            <button 
              onClick={() => setIsCollapsed(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
          
          {isMobile && (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="text-gray-400 hover:text-white p-1.5 rounded-md"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Main navigation */}
        <div className="flex-1 px-2 py-4 overflow-y-auto">
          <nav className="space-y-1.5">
            {mainNavigation.map((item, index) => renderNavItem(item, index))}
          </nav>

          {/* Secondary navigation */}
          <div className={`mt-8 ${!isCollapsed ? 'pt-6 border-t border-gray-800/50 dark:border-gray-800/50' : 'pt-4'}`}>
            <nav className="space-y-1.5">
              {secondaryNavigation.map((item, index) => renderNavItem(item, index))}
            </nav>
          </div>
        </div>

        {/* User profile at bottom */}
        <div className={`p-4 border-t border-gray-800/50 dark:border-gray-800/50 ${isCollapsed ? 'text-center' : ''}`}>
          <div className={`flex ${isCollapsed ? 'flex-col items-center' : 'items-center space-x-3'}`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white shadow-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-gray-400 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </Transition>
      
      {/* Spacer div for desktop to push content to the right */}
      <div className={`hidden lg:block ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}></div>
    </>
  );
};

export default Sidebar;