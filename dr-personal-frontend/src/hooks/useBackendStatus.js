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
    database: {
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
    console.log('useBackendStatus: Checking backend status...');

    setStatus(prev => ({
      ...prev,
      api: { ...prev.api, isChecking: true },
      database: { ...prev.database, isChecking: true }
    }));

    try {
      const isApiOnline = await apiService.checkBackendStatus();
      const timestamp = new Date();

      console.log('useBackendStatus: API status:', isApiOnline);

      setStatus(prev => ({
        ...prev,
        api: {
          isOnline: isApiOnline,
          isChecking: false,
          lastChecked: timestamp,
          error: null
        },
        // Assumimos que se a API está online, o banco também está
        database: {
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
      console.error('useBackendStatus: Error checking backend:', error);
      const timestamp = new Date();

      setStatus(prev => ({
        ...prev,
        api: {
          isOnline: false,
          isChecking: false,
          lastChecked: timestamp,
          error: error.message
        },
        database: {
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
    // Verificação inicial
    checkBackendStatus();

    // Verificação periódica a cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);

    // Listener para mudanças de conectividade
    const handleOnline = () => {
      console.log('useBackendStatus: Network came online, checking backend...');
      setStatus(prev => ({
        ...prev,
        network: { isOnline: true, lastChecked: new Date() }
      }));
      checkBackendStatus();
    };

    const handleOffline = () => {
      console.log('useBackendStatus: Network went offline');
      setStatus(prev => ({
        ...prev,
        network: { isOnline: false, lastChecked: new Date() },
        api: { ...prev.api, isOnline: false },
        database: { ...prev.database, isOnline: false }
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
    console.log('useBackendStatus: Manual refresh requested');
    checkBackendStatus();
  };

  return {
    status,
    refreshStatus,
    isAnyOffline: !status.api.isOnline || !status.database.isOnline || !status.network.isOnline,
    isAllOnline: status.api.isOnline && status.database.isOnline && status.network.isOnline,
    isChecking: status.api.isChecking || status.database.isChecking
  };
};