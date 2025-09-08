import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          textColor: 'text-white'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-500',
          icon: <AlertCircle className="h-5 w-5 text-white" />,
          textColor: 'text-white'
        };
      case 'error':
        return {
          bgColor: 'bg-red-500',
          icon: <XCircle className="h-5 w-5 text-white" />,
          textColor: 'text-white'
        };
      default:
        return {
          bgColor: 'bg-blue-500',
          icon: <CheckCircle className="h-5 w-5 text-white" />,
          textColor: 'text-white'
        };
    }
  };

  const { bgColor, icon, textColor } = getToastStyles();

  return (
    <div className={`fixed top-4 right-4 z-[100] ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg max-w-sm animate-slide-in-right flex items-center space-x-3`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium whitespace-pre-line">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};


export default Toast;