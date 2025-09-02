import React from 'react';

const LoadingSpinner = ({ message = "Carregando..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary dark:border-dark-secondary"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
  </div>
);

export default LoadingSpinner;