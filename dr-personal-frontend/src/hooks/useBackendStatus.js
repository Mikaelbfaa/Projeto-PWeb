import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const useBackendStatus = () => {
  const [status, setStatus] = useState({
    api: {
      isOnline: false,
      isChecking: true,
      lastChecked: null,
      error: null
    },
    network: {
      isOnline: navigator.onLine,
      lastChecked: new Date()
    }
  });

  const checkBackendStatus = async () => {
    setStatus(prev => ({
      ...prev,
      api: { ...prev.api, isChecking: true }
    }));

    try {
      const isApiOnline = await apiService.checkBackendStatus();
      const timestamp = new Date();

      setStatus(prev => ({
        ...prev,
        api: {
          isOnline: isApiOnline,
          isChecking: false,
          lastChecked: timestamp,
          error: null
        },
        network: {
          isOnline: navigator.onLine,
          lastChecked: timestamp
        }
      }));
    } catch (error) {
      const timestamp = new Date();

      setStatus(prev => ({
        ...prev,
        api: {
          isOnline: false,
          isChecking: false,
          lastChecked: timestamp,
          error: error.message
        },
        network: {
          isOnline: navigator.onLine,
          lastChecked: timestamp
        }
      }));
    }
  };

  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000);

    const handleOnline = () => {
      setStatus(prev => ({
        ...prev,
        network: { isOnline: true, lastChecked: new Date() }
      }));
      checkBackendStatus();
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        network: { isOnline: false, lastChecked: new Date() },
        api: { ...prev.api, isOnline: false }
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshStatus = () => {
    checkBackendStatus();
  };

  return {
    status,
    refreshStatus,
    isChecking: status.api.isChecking
  };
};