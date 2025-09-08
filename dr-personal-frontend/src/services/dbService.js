class DBService {
  constructor() {
    this.dbName = 'DrPersonalDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => {
        console.error('Erro ao abrir IndexedDB:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB conectado com sucesso');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Store para grupos musculares
        if (!db.objectStoreNames.contains('muscle_groups')) {
          const muscleStore = db.createObjectStore('muscle_groups', { keyPath: 'id' });
          muscleStore.createIndex('name', 'name', { unique: false });
          muscleStore.createIndex('size', 'size', { unique: false });
          muscleStore.createIndex('segment', 'segment', { unique: false });
        }
        
        // Store para condições de saúde
        if (!db.objectStoreNames.contains('health_conditions')) {
          const healthStore = db.createObjectStore('health_conditions', { keyPath: 'id' });
          healthStore.createIndex('name', 'name', { unique: false });
          healthStore.createIndex('category', 'category', { unique: false });
        }
        
        // Store para exercícios de preparação
        if (!db.objectStoreNames.contains('preparation_exercises')) {
          const prepStore = db.createObjectStore('preparation_exercises', { keyPath: 'id' });
          prepStore.createIndex('name', 'name', { unique: false });
          prepStore.createIndex('type', 'type', { unique: false });
        }
        
        // Store para exercícios de força
        if (!db.objectStoreNames.contains('strength_exercises')) {
          const strengthStore = db.createObjectStore('strength_exercises', { keyPath: 'id' });
          strengthStore.createIndex('name', 'name', { unique: false });
          strengthStore.createIndex('muscle_groups', 'muscle_groups', { unique: false, multiEntry: true });
        }
        
        // Store para rotinas
        if (!db.objectStoreNames.contains('routines')) {
          const routineStore = db.createObjectStore('routines', { 
            keyPath: 'id',
            autoIncrement: true 
          });
          routineStore.createIndex('level', 'level', { unique: false });
          routineStore.createIndex('weekly_frequency', 'weekly_frequency', { unique: false });
        }
        
        // Store para metadados (timestamps de sincronização, etc)
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
        
        console.log('IndexedDB schema criado/atualizado');
      };
    });
  }

  async ensureConnection() {
    if (!this.db) {
      await this.init();
    }
  }

  // Métodos genéricos para CRUD
  async saveData(storeName, data) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      transaction.onerror = () => {
        console.error(`Erro ao salvar em ${storeName}:`, transaction.error);
        reject(transaction.error);
      };
      
      transaction.oncomplete = () => {
        console.log(`Dados salvos em ${storeName} com sucesso`);
        resolve();
      };
      
      // Se data é um array, salvar cada item
      if (Array.isArray(data)) {
        data.forEach(item => {
          store.put(item);
        });
      } else {
        store.put(data);
      }
    });
  }

  async getData(storeName, id) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onerror = () => {
        console.error(`Erro ao buscar dados de ${storeName}:`, request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async getAllData(storeName) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onerror = () => {
        console.error(`Erro ao buscar todos os dados de ${storeName}:`, request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  async deleteData(storeName, id) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onerror = () => {
        console.error(`Erro ao deletar de ${storeName}:`, request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log(`Item deletado de ${storeName} com sucesso`);
        resolve();
      };
    });
  }

  async clearStore(storeName) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onerror = () => {
        console.error(`Erro ao limpar ${storeName}:`, request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        console.log(`Store ${storeName} limpo com sucesso`);
        resolve();
      };
    });
  }

  // Métodos específicos para cada tipo de dados
  async saveMuscleGroups(muscleGroups) {
    await this.saveData('muscle_groups', muscleGroups);
    await this.setLastSyncTime('muscle_groups');
  }

  async getMuscleGroups() {
    return await this.getAllData('muscle_groups');
  }

  async saveHealthConditions(healthConditions) {
    await this.saveData('health_conditions', healthConditions);
    await this.setLastSyncTime('health_conditions');
  }

  async getHealthConditions() {
    return await this.getAllData('health_conditions');
  }

  async savePreparationExercises(exercises) {
    await this.saveData('preparation_exercises', exercises);
    await this.setLastSyncTime('preparation_exercises');
  }

  async getPreparationExercises() {
    return await this.getAllData('preparation_exercises');
  }

  async saveStrengthExercises(exercises) {
    await this.saveData('strength_exercises', exercises);
    await this.setLastSyncTime('strength_exercises');
  }

  async getStrengthExercises() {
    return await this.getAllData('strength_exercises');
  }

  async saveRoutines(routines) {
    // Rotinas não têm ID, então vamos adicionar um baseado no índice
    const routinesWithId = routines.map((routine, index) => ({
      ...routine,
      id: `${routine.level}_${routine.weekly_frequency}_${index}`
    }));
    
    await this.saveData('routines', routinesWithId);
    await this.setLastSyncTime('routines');
  }

  async getRoutines() {
    return await this.getAllData('routines');
  }

  // Métodos para metadados
  async setLastSyncTime(dataType) {
    const metadata = {
      key: `last_sync_${dataType}`,
      timestamp: new Date().toISOString(),
      count: await this.getDataCount(dataType)
    };
    
    await this.saveData('metadata', metadata);
  }

  async getLastSyncTime(dataType) {
    return await this.getData('metadata', `last_sync_${dataType}`);
  }

  async getDataCount(storeName) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  // Método para buscar por nome (útil para autocompletar)
  async searchByName(storeName, searchTerm) {
    await this.ensureConnection();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index('name');
      const request = index.getAll();
      
      request.onerror = () => {
        reject(request.error);
      };
      
      request.onsuccess = () => {
        const results = request.result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        resolve(results);
      };
    });
  }

  // Método para exportar todos os dados
  async exportAllData() {
    const data = {
      muscle_groups: await this.getMuscleGroups(),
      health_conditions: await this.getHealthConditions(),
      preparation_exercises: await this.getPreparationExercises(),
      strength_exercises: await this.getStrengthExercises(),
      routines: await this.getRoutines(),
      metadata: {
        exported_at: new Date().toISOString(),
        muscle_groups_sync: await this.getLastSyncTime('muscle_groups'),
        health_conditions_sync: await this.getLastSyncTime('health_conditions'),
        preparation_exercises_sync: await this.getLastSyncTime('preparation_exercises'),
        strength_exercises_sync: await this.getLastSyncTime('strength_exercises'),
        routines_sync: await this.getLastSyncTime('routines'),
      }
    };
    
    return data;
  }

  // Método para limpar todos os dados
  async clearAllData() {
    const stores = ['muscle_groups', 'health_conditions', 'preparation_exercises', 'strength_exercises', 'routines'];
    
    for (const store of stores) {
      await this.clearStore(store);
    }
  }
}

// Singleton instance
const dbService = new DBService();

export default dbService;