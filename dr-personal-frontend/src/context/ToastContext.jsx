import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random(); // Garantir ID único
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration = 4000) => {
    showToast(message, 'success', duration);
  };

  const showWarning = (message, duration = 4000) => {
    showToast(message, 'warning', duration);
  };

  const showError = (message, duration = 5000) => {
    showToast(message, 'error', duration);
  };

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showWarning, showError }}>
      {children}
      
      {/* Container de Toasts */}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id}
            className="pointer-events-auto"
            style={{ 
              animationDelay: `${index * 50}ms`,
              zIndex: 100 - index 
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              isVisible={true}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};