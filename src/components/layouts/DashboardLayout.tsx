// src/components/layouts/DashboardLayout.tsx
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
}

// Icônes SVG pour la navigation
const icons = {
  dashboard: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  guide: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  pricing: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  support: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  wallet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  sun: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  moon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Navigation principale
  const navigation: NavItem[] = [
    { name: 'Tableau de bord', href: '/dashboard', icon: icons.dashboard },
    { name: 'Guide', href: '/guide', icon: icons.guide },
    { name: 'Tarifs', href: '/pricing', icon: icons.pricing },
    { name: 'Support', href: '/support', icon: icons.support },
  ];

  // Check if current route is active
  const isActive = (href: string) => {
    return router.pathname === href;
  };

  // Wallet address (in real app, this would come from context/state)
  const walletAddress = '0x1234...5678';
  const userName = 'John Doe';
  const userEmail = 'john.doe@example.com';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-dark-secondary border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/dashboard" className={`flex items-center ${isSidebarOpen ? 'visible' : 'invisible'}`}>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-400 tracking-tight">
                  BITAX
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 -mt-1 font-medium tracking-wide">
                  FISCALITÉ CRYPTO
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {icons.chevronLeft}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <span className={`${active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-500'}`}>
                        {item.icon}
                      </span>
                      {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom section */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-150`}
            >
              <span className="text-gray-500 dark:text-gray-500">
                {theme === 'dark' ? icons.sun : icons.moon}
              </span>
              {isSidebarOpen && <span className="ml-3">
                {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
              </span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div 
        className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-16'}`}
      >
        {/* Top navigation */}
        <header className="sticky top-0 z-40 bg-white dark:bg-dark-secondary border-b border-gray-200 dark:border-gray-800 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-8">
            {/* Breadcrumb / Title */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => isActive(item.href))?.name || 'Tableau de bord'}
              </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors relative">
                {icons.bell}
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Wallet info */}
              <div className="hidden sm:flex items-center space-x-3 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {walletAddress}
                </span>
              </div>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                  </div>
                </button>

                {/* Dropdown menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white dark:bg-dark-secondary border border-gray-200 dark:border-gray-700 py-1">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      >
                        {icons.profile}
                        <span className="ml-3">Mon profil</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      >
                        {icons.settings}
                        <span className="ml-3">Paramètres</span>
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={() => {/* Handle logout */}}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                      >
                        {icons.logout}
                        <span className="ml-3">Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}