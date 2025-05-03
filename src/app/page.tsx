import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden relative">
      {/* Fond animé avec particules et gradient */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient de fond amélioré */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"></div>
        
        {/* Overlay de gradient avec effet de pulsation */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 animate-pulse">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <radialGradient id="grid-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-gradient)" />
          </svg>
        </div>
        
        {/* Grille animée */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10 animate-slow-pan"></div>
      </div>

      {/* Particules/étoiles animées */}
      <div className="stars-container absolute inset-0 -z-5 animate-twinkle"></div>

      {/* Header amélioré avec navbar moderne */}
      <header className="absolute top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8 z-10 backdrop-blur-lg bg-gray-900/10 border-b border-gray-800/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="inline-block group">
              <div className="flex items-center">
                {/* Logo amélioré - sans le B */}
                <div className="flex flex-col relative">
                  <span className="text-3xl font-display font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-300 tracking-tight transition-all duration-300 group-hover:scale-105">BITAX</span>
                  <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">FISCALITÉ CRYPTO</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            </Link>
          </div>

          {/* Navbar améliorée */}
          <nav className="hidden md:flex items-center space-x-6">
            {['Fonctionnalités', 'Tarifs', 'Guide'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}
                className="nav-link-enterprise relative px-2 py-1 text-gray-300 hover:text-white font-medium transition-colors duration-300"
              >
                <span className="relative z-10">{item}</span>
                <span className="absolute inset-0 rounded-md -z-10 bg-white/0 hover:bg-white/10 transition-colors duration-300"></span>
              </Link>
            ))}
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/login" 
                className="nav-btn-secondary px-4 py-2 rounded-lg text-white border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
              >
                <span className="relative z-10">Connexion</span>
              </Link>
              
              <Link 
                href="/register" 
                className="nav-btn-primary px-4 py-2 rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 transition-all duration-300 hover:shadow-glow relative overflow-hidden"
              >
                <span className="relative z-10">S'inscrire</span>
                <span className="absolute inset-0 scale-x-0 opacity-0 bg-gradient-to-r from-primary-500 to-secondary-500 transform origin-left hover:scale-x-100 hover:opacity-100 transition-all duration-500 -z-10"></span>
              </Link>
            </div>
          </nav>

          {/* Bouton menu mobile amélioré */}
          <button className="md:hidden nav-btn-mobile text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-heading mb-4 leading-tight">
              <span className="text-white font-montserrat font-bold">Votre fiscalité crypto, </span>
              <span className="premium-gradient-text">simplifiée</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 font-opensans">
              Bitax automatise la déclaration de vos cryptomonnaies et calcule vos plus-values en quelques clics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <Link href="/register" className="btn-hero-improved">
                <span className="btn-content flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Commencer gratuitement
                </span>
              </Link>
              <Link href="/guide" className="btn-hero-secondary-improved">
                <span className="btn-content flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Comment ça marche
                </span>
              </Link>
            </div>
            
            {/* Logos de cryptomonnaies améliorés */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
              {/* Ethereum */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 784.37 1277.39" xmlns="http://www.w3.org/2000/svg">
                  <g>
                    <polygon fill="#343434" fillRule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54"/>
                    <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33"/>
                    <polygon fill="#3C3C3B" fillRule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89"/>
                    <polygon fill="#8C8C8C" fillRule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89"/>
                    <polygon fill="#141414" fillRule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33"/>
                    <polygon fill="#393939" fillRule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33"/>
                  </g>
                </svg>
                <span className="text-sm font-medium text-white">ETH</span>
              </div>
              
              {/* Polygon/Matic */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 38.4 33.5" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#8247E5" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
                    c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
                    c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                    c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
                    L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
                    c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                </svg>
                <span className="text-sm font-medium text-white">MATIC</span>
              </div>
              
              {/* Arbitrum */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#2D374B"/>
                  <path d="M512 1024C794.769 1024 1024 794.769 1024 512C1024 229.23 794.769 0 512 0C229.23 0 0 229.23 0 512C0 794.769 229.23 1024 512 1024Z" fill="#28A0F0"/>
                  <path d="M672.2 499.1V619.8L568.3 680.1V559.4L672.2 499.1Z" fill="white"/>
                  <path d="M568.3 680.1V559.4L466.5 498V618.7L568.3 680.1Z" fill="#96BEDC"/>
                  <path d="M672.2 378.5V499.1L568.3 559.4V438.8L672.2 378.5Z" fill="#96BEDC"/>
                  <path d="M568.3 438.8V559.4L466.5 498V377.3L568.3 438.8Z" fill="white"/>
                  <path d="M466.5 618.7V498L357.8 434.3V555L466.5 618.7Z" fill="white"/>
                  <path d="M466.5 377.3V498L357.8 434.3V313.7L466.5 377.3Z" fill="#96BEDC"/>
                </svg>
                <span className="text-sm font-medium text-white">ARB</span>
              </div>
              
              {/* Optimism */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28Z" fill="#FF0420"/>
                  <path d="M9.08465 8.69519H12.6871C12.786 8.69519 12.8652 8.77448 12.8652 8.8933V11.5335C12.8652 11.6325 12.7859 11.7118 12.6871 11.7118H9.08465C8.98583 11.7118 8.90654 11.6325 8.90654 11.5335V8.8933C8.90654 8.77448 8.98583 8.69519 9.08465 8.69519Z" fill="white"/>
                  <path d="M13.6739 8.69519H17.2764C17.3752 8.69519 17.4545 8.77448 17.4545 8.8933V11.5335C17.4545 11.6325 17.3752 11.7118 17.2764 11.7118H13.6739C13.5751 11.7118 13.4958 11.6325 13.4958 11.5335V8.8933C13.4958 8.77448 13.5751 8.69519 13.6739 8.69519Z" fill="white"/>
                  <path d="M9.08465 12.4812H12.6871C12.786 12.4812 12.8652 12.5605 12.8652 12.6593V15.2995C12.8652 15.3984 12.7859 15.4777 12.6871 15.4777H9.08465C8.98583 15.4777 8.90654 15.3984 8.90654 15.2995V12.6593C8.90654 12.5605 8.98583 12.4812 9.08465 12.4812Z" fill="white"/>
                  <path d="M13.6739 12.4812H17.2764C17.3752 12.4812 17.4545 12.5605 17.4545 12.6593V15.2995C17.4545 15.3984 17.3752 15.4777 17.2764 15.4777H13.6739C13.5751 15.4777 13.4958 15.3984 13.4958 15.2995V12.6593C13.4958 12.5605 13.5751 12.4812 13.6739 12.4812Z" fill="white"/>
                  <path d="M9.08465 16.2674H12.6871C12.786 16.2674 12.8652 16.3467 12.8652 16.4455V19.0857C12.8652 19.1845 12.7859 19.2638 12.6871 19.2638H9.08465C8.98583 19.2638 8.90654 19.1845 8.90654 19.0857V16.4455C8.90654 16.3467 8.98583 16.2674 9.08465 16.2674Z" fill="white"/>
                  <path d="M13.6739 16.2674H17.2764C17.3752 16.2674 17.4545 16.3467 17.4545 16.4455V19.0857C17.4545 19.1845 17.3752 19.2638 17.2764 19.2638H13.6739C13.5751 19.2638 13.4958 19.1845 13.4958 19.0857V16.4455C13.4958 16.3467 13.5751 16.2674 13.6739 16.2674Z" fill="white"/>
                </svg>
                <span className="text-sm font-medium text-white">OPT</span>
              </div>
              
              {/* Base */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19 38C29.4934 38 38 29.4934 38 19C38 8.50659 29.4934 0 19 0C8.50659 0 0 8.50659 0 19C0 29.4934 8.50659 38 19 38ZM19.7146 7.60573L29.1945 22.8486C29.8464 23.8368 29.1278 25.1395 27.9506 25.1395H8.04937C6.87215 25.1395 6.15358 23.8368 6.8055 22.8486L16.2854 7.60573C16.9313 6.6249 18.0687 6.6249 18.7146 7.60573H19.7146Z" fill="#0052FF"/>
                </svg>
                <span className="text-sm font-medium text-white">BASE</span>
              </div>
              
              {/* Solana */}
              <div className="crypto-tag">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 397.7 311.7" xmlns="http://www.w3.org/2000/svg">
                  <linearGradient id="solGradientA" gradientUnits="userSpaceOnUse" x1="360.8791" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientA)" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                  <linearGradient id="solGradientB" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.163" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientB)" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5
                    c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                  <linearGradient id="solGradientC" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
                    <stop offset="0" style={{ stopColor: '#00FFA3' }}/>
                    <stop offset="1" style={{ stopColor: '#DC1FFF' }}/>
                  </linearGradient>
                  <path fill="url(#solGradientC)" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4
                    c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                </svg>
                <span className="text-sm font-medium text-white">SOL</span>
              </div>
            </div>
          </div>
          
          {/* 3D Hero Image avec effet amélioré */}
          <div className="relative w-full h-[400px] transform translate-x-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="dashboard-preview bg-gray-900/80 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl transform hover:rotate-0 transition-all duration-700 hover:scale-105 w-[90%] h-[90%] rotate-negative-6">
                <div className="p-3 border-b border-gray-800/50 flex items-center">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-xs text-center flex-1 text-gray-400">Tableau de bord Bitax</div>
                </div>
                <div className="p-4 flex flex-col gap-4">
                  <div className="flex justify-between">
                    <div className="h-8 w-32 bg-blue-600/30 rounded-lg animate-pulse"></div>
                    <div className="h-8 w-20 bg-purple-600/30 rounded-lg animate-pulse"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50 animate-pulse-slow"></div>
                    <div className="h-24 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                  </div>
                  <div className="h-32 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="h-6 w-32 bg-blue-600/20 rounded-t-lg"></div>
                    <div className="p-3 flex items-end space-x-2 h-[calc(100%-24px)]">
                      <div className="w-1/12 h-[10%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[30%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[20%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[60%] bg-blue-500/50 rounded-t-sm animate-pulse-slow"></div>
                      <div className="w-1/12 h-[40%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[70%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[50%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[80%] bg-blue-500/50 rounded-t-sm animate-pulse-slow"></div>
                      <div className="w-1/12 h-[60%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[30%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[50%] bg-blue-500/50 rounded-t-sm"></div>
                      <div className="w-1/12 h-[20%] bg-blue-500/50 rounded-t-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}