import { useState } from 'react';
import Toast from '../components/common/Toast';

// Hook para gerenciar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          className="animate-slide-in-right"
          style={{ animationDelay: `${index * 100}ms` }}
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
  );

  return { 
    showToast, 
    showSuccess, 
    showWarning, 
    showError, 
    ToastContainer 
  };
};