import React from 'react';

interface BitaxLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

const NewBitaxLogo: React.FC<BitaxLogoProps> = ({ className = '', theme = 'dark' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative w-9 h-9 mr-2">
        {/* Hexagone avec effet de lumière */}
        <div className={`absolute inset-0 bg-gradient-to-br ${theme === 'dark' ? 'from-indigo-500 to-purple-600' : 'from-indigo-600 to-purple-700'} rounded-xl opacity-90 transform rotate-45`}></div>
        <div className={`absolute inset-0.5 bg-gradient-to-tr ${theme === 'dark' ? 'from-indigo-600 via-purple-500 to-indigo-400' : 'from-indigo-500 via-purple-400 to-indigo-300'} rounded-lg opacity-90 transform rotate-45 flex items-center justify-center`}>
          {/* Symbole ₿ stylisé */}
          <span className={`transform -rotate-45 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-white'}`}>₿</span>
        </div>
        {/* Effet de lueur */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-30 blur-sm transform rotate-45"></div>
      </div>
      
      {/* Texte du logo */}
      <div className="flex flex-col">
        <span className={`text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${theme === 'dark' ? 'from-indigo-400 via-purple-400 to-indigo-300' : 'from-indigo-600 via-purple-600 to-indigo-500'}`}>
          BITAX
        </span>
        <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Fiscalité crypto</span>
      </div>
    </div>
  );
};

export default NewBitaxLogo;