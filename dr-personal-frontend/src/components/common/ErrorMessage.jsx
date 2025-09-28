import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error, onDismiss }) => (
  <div className="bg-accent/20 dark:bg-dark-accent/20 border border-accent/30 dark:border-dark-accent/30 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-accent dark:text-dark-accent mr-2" />
      <span className="text-primary dark:text-dark-primary">{error}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-accent dark:text-dark-accent hover:text-accent/80 dark:hover:text-dark-accent/80"
        >
          ×
        </button>
      )}
    </div>
  </div>
);

export default ErrorMessage;