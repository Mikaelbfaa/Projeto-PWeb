import SyncQueue from './SyncQueue';
import SyncRetryLogic from './SyncRetryLogic';
import { getApiMethod } from './ApiSyncMethods';

class OfflineSyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncQueue = new SyncQueue();
    this.retryLogic = new SyncRetryLogic();
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      console.log('Aplicação voltou online');
      this.isOnline = true;
      this.processPendingSync();
    });

    window.addEventListener('offline', () => {
      console.log('Aplicação ficou offline');
      this.isOnline = false;
    });
  }

  // Método principal para sincronizar dados
  async syncData(dataType, data, saveLocalData) {
    if (this.isOnline) {
      return await this.syncOnline(dataType, data, saveLocalData);
    } else {
      return await this.syncOffline(dataType, data, saveLocalData);
    }
  }

  // Sincronização quando online
  async syncOnline(dataType, data, saveLocalData) {
    const apiMethod = getApiMethod(dataType);
    
    const result = await this.retryLogic.executeWithRetry(
      () => apiMethod(data),
      dataType
    );

    if (result.success) {
      // Sincronização bem-sucedida
      await saveLocalData(dataType, data);
      this.syncQueue.remove(dataType);
      
      return { 
        success: true, 
        response: result.result, 
        offline: false 
      };
    } else {
      // Falha na sincronização - adicionar à fila offline
      console.log(`Falha na sincronização online de ${dataType}, salvando para sincronização offline`);
      this.syncQueue.add(dataType, data);
      await saveLocalData(dataType, data);
      
      return { 
        success: false, 
        error: result.error.message, 
        offline: true, 
        savedLocally: true 
      };
    }
  }

  // Sincronização quando offline
  async syncOffline(dataType, data, saveLocalData) {
    console.log(`Modo offline: ${dataType} será sincronizado quando voltar online`);
    this.syncQueue.add(dataType, data);
    await saveLocalData(dataType, data);
    
    return { 
      success: true, 
      offline: true, 
      savedLocally: true 
    };
  }

  // Processar fila de sincronização
  async processPendingSync() {
    if (!this.isOnline || this.syncQueue.isEmpty()) {
      return;
    }

    console.log(`Processando ${this.syncQueue.size()} sincronizações pendentes...`);
    
    const results = [];
    const queueItems = this.syncQueue.getAll();
    
    for (const [dataType, pendingItem] of queueItems) {
      try {
        // Verificar se deve tentar novamente
        if (!this.retryLogic.shouldRetry(pendingItem.attempts || 0)) {
          console.warn(`${dataType} tem muitas tentativas falhadas, pulando...`);
          continue;
        }

        const apiMethod = getApiMethod(dataType);
        const result = await this.retryLogic.executeWithRetry(
          () => apiMethod(pendingItem.data),
          dataType
        );

        if (result.success) {
          this.syncQueue.remove(dataType);
          results.push({ dataType, success: true, response: result.result });
        } else {
          this.syncQueue.incrementAttempts(dataType, result.attempts);
          results.push({ dataType, success: false, error: result.error.message });
        }
        
      } catch (error) {
        console.error(`Erro ao processar ${dataType}:`, error);
        results.push({ dataType, success: false, error: error.message });
      }
    }

    this.notifyResults(results);
    return results;
  }

  // Notificar sobre resultados da sincronização
  notifyResults(results) {
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      console.log(`✅ ${successful.length} sincronizações bem-sucedidas:`, 
        successful.map(r => r.dataType));
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('offlineSyncSuccess', { 
        detail: { successful, failed } 
      }));
    }

    if (failed.length > 0) {
      console.log(`❌ ${failed.length} sincronizações falharam:`, 
        failed.map(r => r.dataType));
    }
  }

  // Forçar sincronização manual
  async forceSync() {
    if (this.isOnline) {
      return await this.processPendingSync();
    } else {
      console.warn('Não é possível forçar sincronização enquanto offline');
      return [];
    }
  }

  // Obter status da sincronização
  getStatus() {
    return {
      isOnline: this.isOnline,
      ...this.syncQueue.getStatus()
    };
  }

  // Limpar fila
  clearQueue() {
    this.syncQueue.clear();
  }
}

export default OfflineSyncManager;