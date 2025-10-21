import React from 'react';
import { BarChart3, TrendingUp, Target, CheckCircle } from 'lucide-react';

const OCRStats = ({ results = [], suggestions = [] }) => {
  const totalResults = results.length;
  const selectedResults = results.filter(r => r.selected).length;
  const highConfidenceResults = results.filter(r => r.confidence > 0.7).length;
  const resultsWithKeywords = results.filter(r => r.keywords.length > 0).length;
  
  const stats = [
    {
      label: 'Total Extraídos',
      value: totalResults,
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Seleccionados',
      value: selectedResults,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Alta Confianza',
      value: highConfidenceResults,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Con Palabras Clave',
      value: resultsWithKeywords,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (totalResults === 0) return null;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Estadísticas del OCR</h4>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <IconComponent className={`h-3 w-3 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>
      
      {suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <Target className="h-3 w-3 inline mr-1" />
            {suggestions.length} sugerencias inteligentes disponibles
          </p>
        </div>
      )}
    </div>
  );
};

export default OCRStats;
