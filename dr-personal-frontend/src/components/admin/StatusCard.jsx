import React from 'react';
import { CheckCircle, X, Loader } from 'lucide-react';

const StatusCard = ({
  title,
  status,
  isChecking,
  lastChecked,
  error,
  onlineText = 'Online',
  offlineText = 'Offline',
  colorScheme = 'green'
}) => {
  const getColors = () => {
    switch (colorScheme) {
      case 'blue':
        return {
          bg: status ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-gray-50 dark:bg-gray-900/30',
          text: status ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400',
          icon: status ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
        };
      default:
        return {
          bg: status ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30',
          text: status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
          icon: status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        };
    }
  };

  const colors = getColors();

  return (
    <div className={`flex items-center justify-between p-3 rounded ${colors.bg}`}>
      <div className="flex items-center space-x-2">
        {isChecking ? (
          <Loader className="h-5 w-5 text-gray-500 animate-spin" />
        ) : status ? (
          <CheckCircle className={`h-5 w-5 ${colors.icon}`} />
        ) : (
          <X className={`h-5 w-5 ${colors.icon}`} />
        )}
        <div>
          <span className="dark:text-dark-primary">{title}</span>
          {lastChecked && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Verificado: {lastChecked.toLocaleTimeString('pt-BR')}
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <span className={`font-medium ${colors.text}`}>
          {isChecking ? 'Verificando...' : status ? onlineText : offlineText}
        </span>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusCard;