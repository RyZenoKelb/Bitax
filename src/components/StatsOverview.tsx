// src/components/StatsOverview.tsx
import React from 'react';
import { motion } from 'framer-motion'; // Si vous utilisez framer-motion, sinon supprimez cette ligne et les animations associées

interface StatItemProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  bgColorClass?: string;
  delay?: number;
  theme: 'light' | 'dark';
}

const StatItem: React.FC<StatItemProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  bgColorClass = 'from-primary-900/20 to-primary-800/10',
  delay = 0,
  theme
}) => {
  // Couleurs pour les changements selon le type et le thème
  const getChangeColor = () => {
    if (changeType === 'positive') {
      return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    } else if (changeType === 'negative') {
      return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    }
    return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  };
  
  // Icône pour la direction du changement
  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (changeType === 'negative') {
      return (
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };
  
  // Si vous n'utilisez pas framer-motion, supprimez motion. et les propriétés d'animation
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${bgColorClass} backdrop-blur-md border border-gray-800/30 dark:border-gray-700/20 p-6 hover-shadow-effect transition-all`}
    >
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-white dark:text-white">{value}</h3>
          
          {change && (
            <div className={`flex items-center mt-2 text-sm ${getChangeColor()}`}>
              {getChangeIcon()}
              <span>{change}</span>
            </div>
          )}
        </div>
        
        <div className="text-primary-300 dark:text-primary-300">
          {icon}
        </div>
      </div>
      
      {/* Éléments décoratifs */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-primary-500/10 blur-2xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

interface StatsOverviewProps {
  stats: Array<{
    id: string;
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    bgColorClass?: string;
  }>;
  columns?: 2 | 3 | 4;
  theme: 'light' | 'dark';
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  stats, 
  columns = 3,
  theme 
}) => {
  const columnClass = 
    columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 
    columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 
    'grid-cols-1 sm:grid-cols-3';
  
  return (
    <div className={`grid ${columnClass} gap-6`}>
      {stats.map((stat, index) => (
        <StatItem
          key={stat.id}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={stat.icon}
          bgColorClass={stat.bgColorClass}
          delay={index}
          theme={theme}
        />
      ))}
    </div>
  );
};

export default StatsOverview;