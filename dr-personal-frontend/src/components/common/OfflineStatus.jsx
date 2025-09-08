import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import offlineSync from '../../utils/offlineSync';

const OfflineStatus = () => {
  const [status, setStatus] = useState(offlineSync.getStatus());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState(null);

  useEffect(() => {
    // Atualizar status periodicamente
    const interval = setInterval(() => {
      setStatus(offlineSync.getStatus());
    }, 1000);

    // Escutar eventos de sincronização bem-sucedida
    const handleSyncSuccess = (event) => {
      setLastSyncResult(event.detail);
      setTimeout(() => setLastSyncResult(null), 5000); // Limpar após 5 segundos
    };

    window.addEventListener('offlineSyncSuccess', handleSyncSuccess);

    return () => {
      clearInterval(interval);
      window.removeEventListener('offlineSyncSuccess', handleSyncSuccess);
    };
  }, []);

  const handleForceSync = async () => {
    if (!status.isOnline || status.count === 0) return;
    
    setIsProcessing(true);
    try {
      await offlineSync.forceSync();
    } catch (error) {
      console.error('Erro ao forçar sincronização:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Se não há dados pendentes e está online, não mostrar nada
  if (status.isOnline && status.count === 0 && !lastSyncResult) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Status de conexão */}
      <div className={`mb-2 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
        status.isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {status.isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">
          {status.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Dados pendentes para sincronização */}
      {status.count > 0 && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-4 py-3 rounded-lg shadow-lg mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <div>
                <p className="text-sm font-medium">
                  {status.count} sincronização(ões) pendente(s)
                </p>
                <p className="text-xs">
                  {status.types.join(', ')}
                </p>
              </div>
            </div>
            
            {status.isOnline && (
              <button
                onClick={handleForceSync}
                disabled={isProcessing}
                className="ml-2 p-1 hover:bg-yellow-200 rounded transition-colors"
                title="Sincronizar agora"
              >
                <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Detalhes das sincronizações pendentes */}
          <div className="mt-2 space-y-1">
            {Object.entries(status.details).map(([dataType, details]) => (
              <div key={dataType} className="text-xs flex justify-between">
                <span>{dataType}: {details.dataCount} itens</span>
                <span>
                  {details.attempts > 0 ? `${details.attempts} tentativas` : 'Aguardando'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resultado da última sincronização */}
      {lastSyncResult && (
        <div className="bg-green-100 text-green-800 border border-green-200 px-4 py-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Sincronização concluída!</p>
              <p className="text-xs">
                ✅ {lastSyncResult.successful.length} sucesso(s)
                {lastSyncResult.failed.length > 0 && (
                  <span> | ❌ {lastSyncResult.failed.length} falha(s)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineStatus;