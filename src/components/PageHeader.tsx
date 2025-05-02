import React from 'react';
import Link from 'next/link';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  primaryAction?: {
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  theme = 'dark',
  primaryAction,
  secondaryAction 
}) => {
  return (
    <div className={`mb-8 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-6 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-1 text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {subtitle}
              </p>
            )}
          </div>
          
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-3">
              {secondaryAction && (
                secondaryAction.href ? (
                  <Link
                    href={secondaryAction.href}
                    className={`inline-flex items-center px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'} rounded-lg text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                  >
                    {secondaryAction.icon && (
                      <span className="w-4 h-4 mr-2">
                        <i className={`lucide lucide-${secondaryAction.icon}`}></i>
                      </span>
                    )}
                    {secondaryAction.label}
                  </Link>
                ) : (
                  <button
                    onClick={secondaryAction.onClick}
                    className={`inline-flex items-center px-4 py-2 border ${theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-gray-300 hover:border-gray-400'} rounded-lg text-sm font-medium ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'} transition-colors`}
                  >
                    {secondaryAction.icon && (
                      <span className="w-4 h-4 mr-2">
                        <i className={`lucide lucide-${secondaryAction.icon}`}></i>
                      </span>
                    )}
                    {secondaryAction.label}
                  </button>
                )
              )}
              
              {primaryAction && (
                primaryAction.href ? (
                  <Link
                    href={primaryAction.href}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-colors`}
                  >
                    {primaryAction.icon && (
                      <span className="w-4 h-4 mr-2">
                        <i className={`lucide lucide-${primaryAction.icon}`}></i>
                      </span>
                    )}
                    {primaryAction.label}
                  </Link>
                ) : (
                  <button
                    onClick={primaryAction.onClick}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} transition-colors`}
                  >
                    {primaryAction.icon && (
                      <span className="w-4 h-4 mr-2">
                        <i className={`lucide lucide-${primaryAction.icon}`}></i>
                      </span>
                    )}
                    {primaryAction.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;