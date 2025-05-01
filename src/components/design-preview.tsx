import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Données fictives pour les graphiques
const portfolioData = [
  { name: 'Jan', value: 4000 },
  { name: 'Fév', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Avr', value: 2780 },
  { name: 'Mai', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
  { name: 'Aoû', value: 4000 },
  { name: 'Sep', value: 4500 },
  { name: 'Oct', value: 5200 },
  { name: 'Nov', value: 6000 },
  { name: 'Déc', value: 7000 },
];

const assetsData = [
  { name: 'ETH', value: 45, color: '#6366F1' },
  { name: 'BTC', value: 30, color: '#F59E0B' },
  { name: 'SOL', value: 15, color: '#EC4899' },
  { name: 'AVAX', value: 10, color: '#EF4444' },
];

const transactionsData = [
  { date: '01/04', token: 'ETH', type: 'Achat', amount: '+0.5 ETH', value: '+900€', status: 'completed' },
  { date: '03/04', token: 'SOL', type: 'Vente', amount: '-10.2 SOL', value: '-420€', status: 'completed' },
  { date: '05/04', token: 'BTC', type: 'Achat', amount: '+0.025 BTC', value: '+1,105€', status: 'pending' },
  { date: '07/04', token: 'AVAX', type: 'Swap', amount: '+5.0 AVAX', value: '-0.12 ETH', status: 'completed' },
];

const BitaxRedesign = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isNightMode, setIsNightMode] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Animation d'ambiance dans l'arrière-plan
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const connectWallet = () => {
    setWalletConnected(true);
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  // Ambiance avec dégradés dynamiques basés sur la position de la souris
  const backgroundStyle = {
    background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
      ${isNightMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'} 0%, 
      ${isNightMode ? 'rgba(79, 70, 229, 0.05)' : 'rgba(99, 102, 241, 0.03)'} 50%, 
      transparent 80%)`,
  };

  return (
    <div className={`font-sans antialiased min-h-screen relative ${isNightMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Overlay d'ambiance */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={backgroundStyle}
      />
      
      {/* Éléments d'ambiance - orbes flous */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-40 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-[120px] opacity-10 pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-60 h-60 bg-indigo-500 rounded-full filter blur-[100px] opacity-10 pointer-events-none" />
      
      {/* Grille de fond subliminale */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

      {/* Structure principale */}
      <div className="relative z-10 h-screen flex">
        {/* Sidebar */}
        <div className={`fixed h-screen w-64 ${isNightMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl z-20 shadow-xl border-r ${isNightMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {/* Logo et marque */}
          <div className="h-16 flex items-center justify-center px-6 mb-6">
            <div className="relative flex items-center">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg mr-2">
                <div className="w-5 h-5 rounded-sm bg-white/90 flex items-center justify-center text-indigo-600 font-bold text-xs">B</div>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">Bitax</span>
              <span className="absolute -top-3 -right-10 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-[8px] uppercase tracking-widest rounded-full px-2 py-0.5 font-medium animate-pulse">
                Alpha
              </span>
            </div>
          </div>
          
          {/* Menu de navigation */}
          <nav className="px-4 mt-8">
            <div className="mb-2 text-xs uppercase font-semibold opacity-50 px-4">Menu Principal</div>
            {[
              { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
              { id: 'portfolio', icon: 'chart-line-up', label: 'Portfolio' },
              { id: 'transactions', icon: 'transfer', label: 'Transactions' },
              { id: 'tax-report', icon: 'file-text', label: 'Rapport Fiscal' },
              { id: 'settings', icon: 'settings', label: 'Paramètres' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeSidebarItem === item.id
                    ? 'bg-gradient-to-r from-indigo-500/10 to-blue-500/5 text-indigo-500'
                    : `${isNightMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} hover:bg-black/5`
                }`}
              >
                <div className={`w-7 h-7 flex items-center justify-center rounded-lg ${
                  activeSidebarItem === item.id 
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-gray-100 dark:bg-gray-800/70'
                }`}>
                  <i className={`icon-${item.icon} text-sm`}></i>
                </div>
                <span>{item.label}</span>
                {item.id === 'tax-report' && (
                  <span className="ml-auto bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">PRO</span>
                )}
              </button>
            ))}
            
            <div className="my-4 border-t border-gray-800/30"></div>
            <div className="mb-2 text-xs uppercase font-semibold opacity-50 px-4">Blockchains</div>
            
            {/* Liste des blockchains supportées */}
            <div className="grid grid-cols-3 gap-2 px-3 mb-4">
              {[
                { id: 'eth', color: 'from-blue-500 to-indigo-600', letter: 'E', name: 'ETH' },
                { id: 'polygon', color: 'from-purple-500 to-indigo-600', letter: 'P', name: 'MATIC' },
                { id: 'arbitrum', color: 'from-blue-400 to-sky-500', letter: 'A', name: 'ARB' },
                { id: 'optimism', color: 'from-red-500 to-rose-600', letter: 'O', name: 'OP' },
                { id: 'base', color: 'from-blue-600 to-cyan-500', letter: 'B', name: 'BASE' },
                { id: 'solana', color: 'from-fuchsia-500 to-purple-600', letter: 'S', name: 'SOL' },
              ].map((chain) => (
                <div 
                  key={chain.id}
                  className="flex flex-col items-center justify-center p-2 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${chain.color} shadow-lg shadow-${chain.id}-500/20 flex items-center justify-center text-white font-medium mb-1`}>
                    {chain.letter}
                  </div>
                  <span className="text-xs opacity-70">{chain.name}</span>
                </div>
              ))}
            </div>
            
            {/* Bannière Premium */}
            <div className="mx-4 my-6 p-4 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-600/90"></div>
              <div className="absolute bottom-0 right-0">
                <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
                  <path d="M35 0L39.7 24.1L63.6 16.4L44.1 34.6L70 44.6L44.1 53.2L63.6 70L39.7 62.3L35 70L30.3 62.3L6.4 70L25.9 53.2L0 44.6L25.9 34.6L6.4 16.4L30.3 24.1L35 0Z" fill="white"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center mr-2">
                    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-white text-sm font-semibold">Bitax Pro</span>
                </div>
                <p className="text-white/90 text-xs mb-3">Débloquez toutes les fonctionnalités premium</p>
                <button className="w-full bg-white/90 hover:bg-white text-amber-600 text-xs font-semibold py-1.5 rounded-lg transition-colors duration-200">
                  Upgrader
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 pl-64">
          {/* Header/Navbar */}
          <header className={`fixed top-0 right-0 left-64 h-16 ${isNightMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl z-10 border-b ${isNightMode ? 'border-gray-800' : 'border-gray-200'} flex items-center justify-between px-6`}>
            {/* Titre de la page */}
            <div>
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <p className="text-xs opacity-50">Vue d'ensemble de vos actifs crypto</p>
            </div>
            
            {/* Barre de recherche */}
            <div className={`relative w-72 ${isNightMode ? 'bg-gray-800/50' : 'bg-gray-100'} rounded-lg hidden md:block`}>
              <input 
                type="text"
                placeholder="Rechercher..."
                className={`w-full py-2 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  isNightMode 
                    ? 'bg-gray-800/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-60">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            {/* Actions de droite */}
            <div className="flex items-center space-x-4">
              {/* Connecter wallet / Wallet connecté */}
              {walletConnected ? (
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isNightMode ? 'bg-gray-800/70' : 'bg-gray-100'} border ${isNightMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-medium">0x7F...A3e2</span>
                </div>
              ) : (
                <button 
                  onClick={connectWallet}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-500 hover:to-blue-400 shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-indigo-500/30"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                  </svg>
                  Connecter Wallet
                </button>
              )}
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleNightMode}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                {isNightMode ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                  </svg>
                )}
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${isNightMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  <span className="absolute top-0 right-0 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </button>
                
                {/* Dropdown notifications */}
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50`}>
                    <div className="p-3 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Notifications</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white">3 nouvelles</span>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {[
                        { title: 'Alerte ETH', message: 'Le prix ETH a augmenté de 5% dans les dernières 24h', time: 'Il y a 12min', icon: '📈', color: 'bg-green-500' },
                        { title: 'Transaction réussie', message: 'Votre achat de 0.5 ETH est confirmé', time: 'Il y a 2h', icon: '✅', color: 'bg-blue-500' },
                        { title: 'Nouveau réseau', message: 'Support ajouté pour Arbitrum Nova', time: 'Il y a 1j', icon: '🔔', color: 'bg-indigo-500' },
                      ].map((notification, index) => (
                        <div key={index} className={`p-3 border-b ${isNightMode ? 'border-gray-700/50 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer`}>
                          <div className="flex">
                            <div className={`w-9 h-9 rounded-full ${notification.color} flex items-center justify-center text-white mr-3 flex-shrink-0`}>
                              {notification.icon}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              <p className="text-xs opacity-70 mt-0.5">{notification.message}</p>
                              <span className="text-xs opacity-50 mt-1">{notification.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2">
                      <button className="w-full text-center text-xs text-indigo-500 hover:underline py-1">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profil utilisateur */}
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white overflow-hidden"
                >
                  <span className="font-medium text-xs">JD</span>
                </button>
                
                {/* Menu profil */}
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-60 ${isNightMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-xl border z-50`}>
                    <div className="p-3 border-b border-gray-700/50">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white mr-3">
                          <span className="font-medium">JD</span>
                        </div>
                        <div>
                          <h3 className="font-medium">John Doe</h3>
                          <p className="text-xs opacity-70">john.doe@example.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {[
                        { label: 'Profil', icon: 'user' },
                        { label: 'Paramètres', icon: 'settings' },
                        { label: 'Abonnement', icon: 'credit-card' }
                      ].map((item, index) => (
                        <button 
                          key={index} 
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg ${isNightMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}`}
                        >
                          <div className={`w-6 h-6 rounded-full ${isNightMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center opacity-70`}>
                            <i className={`icon-${item.icon} text-xs`}></i>
                          </div>
                          {item.label}
                        </button>
                      ))}
                      <div className="border-t border-gray-700/50 my-1 pt-1">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-red-500/10 text-red-500">
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 dark:bg-red-500/20">
                            <i className="icon-log-out text-xs"></i>
                          </div>
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          {/* Contenu de la page */}
          <main className={`pt-16 h-screen overflow-auto ${isNightMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="p-6">
              {/* Cartes KPI */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {[
                  { title: 'Valeur Portfolio', value: '32,485.75€', change: '+12.5%', icon: 'wallet', color: 'bg-gradient-to-br from-indigo-500 to-blue-600' },
                  { title: 'Plus-Values', value: '7,412.32€', change: '+8.2%', icon: 'trending-up', color: 'bg-gradient-to-br from-emerald-500 to-green-600' },
                  { title: 'Transactions', value: '486', change: '+24 ce mois', icon: 'activity', color: 'bg-gradient-to-br from-amber-500 to-orange-600' },
                  { title: 'Estimation Fiscale', value: '1,845.90€', change: 'Mise à jour 28/03', icon: 'file-text', color: 'bg-gradient-to-br from-fuchsia-500 to-purple-600' },
                ].map((card, index) => (
                  <div key={index} className={`relative overflow-hidden rounded-2xl shadow-lg border ${isNightMode ? 'bg-gray-800/60 border-gray-700/70' : 'bg-white border-gray-100/70'} backdrop-blur-md p-6 group hover:shadow-xl transition-all duration-300`}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-opacity-10 filter blur-2xl transform translate-x-8 -translate-y-8 pointer-events-none group-hover:translate-x-6 transition-transform duration-700" style={{backgroundColor: card.color.split(' ')[2]}}></div>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium opacity-60 uppercase tracking-wider">{card.title}</p>
                        <h3 className="text-2xl font-bold mt-2">{card.value}</h3>
                        <p className={`text-xs mt-1 ${card.title === 'Plus-Values' ? 'text-green-500' : 'opacity-60'}`}>{card.change}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${card.color} text-white shadow-lg`}>
                        <i className={`icon-${card.icon} text-lg`}></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Graphique principal et Répartition des actifs */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Graphique principal */}
                <div className={`xl:col-span-2 rounded-2xl shadow-lg border ${isNightMode ? 'bg-gray-800/60 border-gray-700/70' : 'bg-white border-gray-100/70'} backdrop-blur-md p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Évolution du Portfolio</h3>
                      <p className="text-xs opacity-60">Derniers 12 mois</p>
                    </div>
                    <div className="flex">
                      {['1D', '1S', '1M', '1A', 'ALL'].map((period, index) => (
                        <button 
                          key={index} 
                          className={`text-xs px-2.5 py-1 rounded-lg ${period === '1A' ? 'bg-indigo-500 text-white' : 'opacity-60 hover:opacity-100'}`}
                        >
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={portfolioData}
                        margin={{
                          top: 5,
                          right: 20,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={isNightMode ? '#374151' : '#f0f0f0'} />
                        <XAxis 
                          dataKey="name" 
                          tick={{fill: isNightMode ? '#9CA3AF' : '#6B7280'}}
                          axisLine={{stroke: isNightMode ? '#374151' : '#E5E7EB'}}
                        />
                        <YAxis 
                          tick={{fill: isNightMode ? '#9CA3AF' : '#6B7280'}}
                          axisLine={{stroke: isNightMode ? '#374151' : '#E5E7EB'}}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: isNightMode ? '#1F2937' : '#FFFFFF',
                            borderColor: isNightMode ? '#374151' : '#E5E7EB',
                            color: isNightMode ? '#F9FAFB' : '#111827',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#6366F1" 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#6366F1" 
                          strokeWidth={3} 
                          dot={{ r: 4, strokeWidth: 2, fill: isNightMode ? '#1F2937' : '#FFFFFF' }} 
                          activeDot={{ r: 8, strokeWidth: 0, fill: '#6366F1' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Répartition des actifs */}
                <div className={`rounded-2xl shadow-lg border ${isNightMode ? 'bg-gray-800/60 border-gray-700/70' : 'bg-white border-gray-100/70'} backdrop-blur-md p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Répartition des Actifs</h3>
                      <p className="text-xs opacity-60">Par token</p>
                    </div>
                    <button className="text-xs opacity-60 hover:opacity-100">
                      <i className="icon-more-horizontal text-lg"></i>
                    </button>
                  </div>
                  <div className="h-48 flex items-center justify-center mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetsData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {assetsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: isNightMode ? '#1F2937' : '#FFFFFF',
                            borderColor: isNightMode ? '#374151' : '#E5E7EB',
                            color: isNightMode ? '#F9FAFB' : '#111827',
                          }}
                          formatter={(value) => [`${value}%`, 'Allocation']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Légende du graphique */}
                  <div className="space-y-2">
                    {assetsData.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: asset.color }}></div>
                          <span className="text-sm">{asset.name}</span>
                        </div>
                        <span className="text-sm font-medium">{asset.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Transactions récentes et informations fiscales */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Transactions récentes */}
                <div className={`xl:col-span-2 rounded-2xl shadow-lg border ${isNightMode ? 'bg-gray-800/60 border-gray-700/70' : 'bg-white border-gray-100/70'} backdrop-blur-md p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Transactions Récentes</h3>
                      <p className="text-xs opacity-60">7 derniers jours</p>
                    </div>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200">
                      Voir toutes
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead>
                        <tr className="text-left text-xs uppercase font-medium opacity-60">
                          <th className="pb-3 pl-2">Date</th>
                          <th className="pb-3">Token</th>
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Montant</th>
                          <th className="pb-3">Valeur</th>
                          <th className="pb-3 text-right pr-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {transactionsData.map((tx, index) => (
                          <tr key={index} className={`${isNightMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'} cursor-pointer rounded-lg transition-colors duration-200`}>
                            <td className="py-3 pl-2 rounded-l-lg">{tx.date}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                                  tx.token === 'ETH' ? 'bg-blue-500/20 text-blue-500' :
                                  tx.token === 'BTC' ? 'bg-amber-500/20 text-amber-500' :
                                  tx.token === 'SOL' ? 'bg-purple-500/20 text-purple-500' :
                                  'bg-red-500/20 text-red-500'
                                }`}>
                                  {tx.token.charAt(0)}
                                </div>
                                {tx.token}
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs ${
                                tx.type === 'Achat' ? 'bg-green-500/10 text-green-500' :
                                tx.type === 'Vente' ? 'bg-red-500/10 text-red-500' :
                                'bg-blue-500/10 text-blue-500'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 font-medium">{tx.amount}</td>
                            <td className="py-3">{tx.value}</td>
                            <td className="py-3 text-right pr-2 rounded-r-lg">
                              {tx.status === 'completed' ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-500/10 text-green-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1"></span>
                                  Complété
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-500">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1 animate-pulse"></span>
                                  En attente
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Aperçu fiscal */}
                <div className={`rounded-2xl shadow-lg border ${isNightMode ? 'bg-gray-800/60 border-gray-700/70' : 'bg-white border-gray-100/70'} backdrop-blur-md p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold">Aperçu Fiscal</h3>
                      <p className="text-xs opacity-60">Exercice en cours</p>
                    </div>
                    <button className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors duration-200 flex items-center justify-center">
                      <i className="icon-download text-sm"></i>
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    {/* Plus-values */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Plus-values</span>
                        <span className="font-medium text-green-500">+5,231.45€</span>
                      </div>
                      <div className="h-2 bg-gray-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    {/* Moins-values */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Moins-values</span>
                        <span className="font-medium text-red-500">-1,982.27€</span>
                      </div>
                      <div className="h-2 bg-gray-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    {/* Résultat net */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-sm">
                        <span>Résultat net</span>
                        <span className="font-medium text-indigo-500">+3,249.18€</span>
                      </div>
                      <div className="h-2 bg-gray-700/30 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: '55%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-gray-700/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium">Impôt estimé</p>
                        <p className="text-xs opacity-60">Taux forfaitaire 30%</p>
                      </div>
                      <div className="text-xl font-bold">974.75€</div>
                    </div>
                    
                    <button className="w-full py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center">
                      <i className="icon-file-text text-sm mr-2"></i>
                      Générer rapport complet
                    </button>
                    
                    <div className="mt-3 text-center">
                      <span className="text-xs opacity-60">
                        Dernière mise à jour: 28/03/2023
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bannière premium (visible seulement sur le dashboard) */}
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="relative p-8 flex flex-col md:flex-row items-center justify-between z-10">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-xl font-bold text-white mb-2">Passez à Bitax Pro</h3>
                    <p className="text-indigo-200 text-sm max-w-md">
                      Débloquez toutes les fonctionnalités avancées, les analyses fiscales détaillées et le support prioritaire.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3 rounded-lg bg-white text-indigo-600 font-medium hover:bg-indigo-50 transition-colors">
                      Voir les forfaits
                    </button>
                    <button className="px-6 py-3 rounded-lg bg-indigo-500/20 text-white border border-indigo-300/30 hover:bg-indigo-500/30 transition-colors">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* CSS Personnalisé */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, ${isNightMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px),
            linear-gradient(to bottom, ${isNightMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px);
          background-size: 24px 24px;
        }
        
        /* Simulated icons - in production, use a real icon pack */
        [class^="icon-"] {
          font-family: sans-serif;
          font-style: normal;
        }
        .icon-layout-dashboard:before { content: "📊"; }
        .icon-chart-line-up:before { content: "📈"; }
        .icon-transfer:before { content: "↔️"; }
        .icon-file-text:before { content: "📄"; }
        .icon-settings:before { content: "⚙️"; }
        .icon-user:before { content: "👤"; }
        .icon-credit-card:before { content: "💳"; }
        .icon-log-out:before { content: "🚪"; }
        .icon-wallet:before { content: "👛"; }
        .icon-trending-up:before { content: "📈"; }
        .icon-activity:before { content: "📊"; }
        .icon-more-horizontal:before { content: "⋯"; }
        .icon-download:before { content: "⬇️"; }
      `}</style>
    </div>
  );
};

export default BitaxRedesign;