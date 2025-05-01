import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  AreaChart, Area, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { NetworkType, SUPPORTED_NETWORKS } from '@/utils/transactions';

// Types de graphiques supportés
type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'radar';

// Types de données pour les graphiques
interface ChartData {
  [key: string]: string | number;
}

interface ChartSeries {
  dataKey: string;
  name: string;
  color: string;
  type?: 'line' | 'bar' | 'area';
}

interface DataVisualizationProps {
  data: ChartData[];
  type: ChartType;
  title?: string;
  series?: ChartSeries[];
  xAxisKey?: string;
  height?: number;
  showLegend?: boolean;
  colors?: string[];
  currencySymbol?: string;
  stacked?: boolean;
  percentageView?: boolean;
  isDarkMode?: boolean;
  compareMode?: boolean;
  labelKey?: string;
  valueKey?: string;
  showGridLines?: boolean;
  className?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  isAnimationActive?: boolean;
  emptyStateMessage?: string;
  networks?: NetworkType[];
}

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#A855F7'  // purple-500
];

const DataVisualization: React.FC<DataVisualizationProps> = ({
  data,
  type,
  title,
  series,
  xAxisKey = 'name',
  height = 300,
  showLegend = true,
  colors = DEFAULT_COLORS,
  currencySymbol = '€',
  stacked = false,
  percentageView = false,
  isDarkMode = false,
  compareMode = false,
  labelKey,
  valueKey = 'value',
  showGridLines = true,
  className = '',
  yAxisLabel,
  xAxisLabel,
  isAnimationActive = true,
  emptyStateMessage = 'Aucune donnée disponible',
  networks
}) => {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 768);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Vérifier si nous avons des données à afficher
  if (!data || data.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-${height} bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
        <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{emptyStateMessage}</p>
      </div>
    );
  }
  
  // Formater les valeurs pour l'affichage
  const formatValue = (value: any) => {
    if (percentageView && typeof value === 'number') {
      return `${(value * 100).toFixed(2)}%`;
    }
    
    if (typeof value === 'number') {
      // Afficher les grands nombres de manière plus lisible
      if (Math.abs(value) >= 1000000) {
        return `${currencySymbol}${(value / 1000000).toFixed(2)}M`;
      } else if (Math.abs(value) >= 1000) {
        return `${currencySymbol}${(value / 1000).toFixed(1)}k`;
      } else {
        return `${currencySymbol}${value.toFixed(2)}`;
      }
    }
    
    return value;
  };
  
  // Personnaliser l'infobulle
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) {
      return null;
    }
    
    return (
      <div className={`p-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg rounded-lg border`}>
        <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {entry.name}: 
              </span>
              <span className={`text-xs font-medium ml-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {formatValue(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Générer un ID unique pour les gradients
  const gradientId = `chart-gradient-${Math.random().toString(36).substring(2, 9)}`;
  
  // Rendu du graphique en fonction du type
  const renderChart = () => {
    // Adapter les noms des réseaux pour un meilleur affichage
    let chartData = data;
    
    if (networks) {
      chartData = data.map(item => {
        if (item.network && networks.includes(item.network as NetworkType)) {
          const networkConfig = SUPPORTED_NETWORKS[item.network as NetworkType];
          return {
            ...item,
            networkName: networkConfig.name,
            networkColor: networkConfig.color
          };
        }
        return item;
      });
    }
    
    const tickFormatter = (value: any) => {
      if (typeof value === 'number') {
        if (percentageView) {
          return `${(value * 100).toFixed(0)}%`;
        }
        return formatValue(value);
      }
      
      // Si c'est une date, formater de manière plus courte
      if (value && typeof value === 'string' && value.length === 10 && value.includes('-')) {
        const dateParts = value.split('-');
        if (dateParts.length === 3) {
          return `${dateParts[2]}/${dateParts[1]}`;
        }
      }
      
      // Pour les longues chaînes, les abréger
      if (typeof value === 'string' && value.length > 10 && windowWidth < 768) {
        return `${value.substring(0, 7)}...`;
      }
      
      return value;
    };
    
    const chartProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 20 }
    };
    
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...chartProps}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                tickFormatter={tickFormatter}
                label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <YAxis 
                tickFormatter={tickFormatter}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {series ? (
                series.map((s, index) => (
                  <Line
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color || colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={isAnimationActive}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={valueKey}
                  name={labelKey || "Valeur"}
                  stroke={colors[0]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={isAnimationActive}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...chartProps}>
              <defs>
                {colors.map((color, index) => (
                  <linearGradient key={`${gradientId}${index}`} id={`${gradientId}${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                tickFormatter={tickFormatter}
                label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <YAxis 
                tickFormatter={tickFormatter}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {series ? (
                series.map((s, index) => (
                  <Area
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stackId={stacked ? "1" : undefined}
                    stroke={s.color || colors[index % colors.length]}
                    fillOpacity={1}
                    fill={`url(#${gradientId}${index})`}
                    isAnimationActive={isAnimationActive}
                  />
                ))
              ) : (
                <Area
                  type="monotone"
                  dataKey={valueKey}
                  name={labelKey || "Valeur"}
                  stroke={colors[0]}
                  fillOpacity={1}
                  fill={`url(#${gradientId}0)`}
                  isAnimationActive={isAnimationActive}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...chartProps}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />}
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                tickFormatter={tickFormatter}
                label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <YAxis 
                tickFormatter={tickFormatter}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {series ? (
                series.map((s, index) => (
                  <Bar
                    key={s.dataKey}
                    dataKey={s.dataKey}
                    name={s.name}
                    stackId={stacked ? "a" : undefined}
                    fill={s.color || colors[index % colors.length]}
                    isAnimationActive={isAnimationActive}
                  />
                ))
              ) : (
                <Bar
                  dataKey={valueKey}
                  name={labelKey || "Valeur"}
                  fill={colors[0]}
                  isAnimationActive={isAnimationActive}
                  shape={({ x, y, width, height, index }: any) => {
                    // Si nous avons des réseaux et des couleurs par réseau, les utiliser
                    if (networks && chartData[index] && typeof chartData[index].networkColor === 'string') {
                      const networkColor = chartData[index].networkColor as string;
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={networkColor}
                          rx={4}
                          ry={4}
                        />
                      );
                    }
                    // Sinon, utiliser la couleur par défaut
                    return (
                      <rect
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        fill={colors[0]}
                        rx={4}
                        ry={4}
                      />
                    );
                  }}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={labelKey !== undefined}
                outerRadius={80}
                innerRadius={compareMode ? 40 : 0}
                fill="#8884d8"
                dataKey={valueKey}
                nameKey={labelKey || xAxisKey}
                label={labelKey !== undefined ? ({ name, percent }) => 
                  `${String(name).substring(0, 12)}${String(name).length > 12 ? '...' : ''}: ${(percent * 100).toFixed(0)}%` 
                  : false
                }
                isAnimationActive={isAnimationActive}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={(entry.color as string) || colors[index % colors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );
        
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart {...chartProps}>
              {showGridLines && <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#e5e7eb'} />}
              <XAxis 
                dataKey={xAxisKey} 
                type="number" 
                name={xAxisLabel || xAxisKey}
                unit={percentageView ? '%' : ''}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                label={xAxisLabel ? { value: xAxisLabel, position: 'bottom', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <YAxis 
                dataKey={valueKey} 
                type="number" 
                name={yAxisLabel || valueKey}
                unit={percentageView ? '%' : ''}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'left', offset: 0, fill: isDarkMode ? '#D1D5DB' : '#4B5563' } : undefined}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              {showLegend && <Legend />}
              
              {series ? (
                series.map((s, index) => (
                  <Scatter
                    key={s.dataKey}
                    name={s.name}
                    data={chartData.filter(item => item[s.dataKey] !== undefined)}
                    fill={s.color || colors[index % colors.length]}
                    isAnimationActive={isAnimationActive}
                  />
                ))
              ) : (
                <Scatter 
                  name={labelKey || "Valeur"}
                  data={chartData} 
                  fill={colors[0]}
                  isAnimationActive={isAnimationActive}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        );
        
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart cx="50%" cy="50%" outerRadius={80} data={chartData}>
              <PolarGrid stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
              <PolarAngleAxis 
                dataKey={labelKey || xAxisKey}
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              />
              <PolarRadiusAxis 
                tick={{ fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
              />
              
              {series ? (
                series.map((s, index) => (
                  <Radar
                    key={s.dataKey}
                    name={s.name}
                    dataKey={s.dataKey}
                    stroke={s.color || colors[index % colors.length]}
                    fill={s.color || colors[index % colors.length]}
                    fillOpacity={0.2}
                    isAnimationActive={isAnimationActive}
                  />
                ))
              ) : (
                <Radar
                  name={labelKey || "Valeur"}
                  dataKey={valueKey}
                  stroke={colors[0]}
                  fill={colors[0]}
                  fillOpacity={0.2}
                  isAnimationActive={isAnimationActive}
                />
              )}
              
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {title && (
        <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
      )}
      {renderChart()}
    </div>
  );
};

export default DataVisualization;