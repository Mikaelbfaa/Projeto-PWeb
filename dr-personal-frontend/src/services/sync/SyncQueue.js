class SyncQueue {
  constructor() {
    this.queue = new Map();
    this.loadFromStorage();
  }

  // Carregar fila do localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('pendingSync');
      if (saved) {
        const pendingData = JSON.parse(saved);
        this.queue = new Map(Object.entries(pendingData));
        console.log('Fila de sincronização carregada:', this.queue.size, 'itens');
      }
    } catch (error) {
      console.error('Erro ao carregar fila de sincronização:', error);
      this.queue.clear();
    }
  }

  // Salvar fila no localStorage
  saveToStorage() {
    try {
      const queueData = Object.fromEntries(this.queue);
      localStorage.setItem('pendingSync', JSON.stringify(queueData));
    } catch (error) {
      console.error('Erro ao salvar fila de sincronização:', error);
    }
  }

  // Adicionar item à fila
  add(dataType, data) {
    this.queue.set(dataType, {
      data,
      timestamp: new Date().toISOString(),
      attempts: 0
    });
    this.saveToStorage();
    console.log(`${dataType} adicionado à fila de sincronização`);
  }

  // Remover item da fila
  remove(dataType) {
    this.queue.delete(dataType);
    this.saveToStorage();
    console.log(`${dataType} removido da fila de sincronização`);
  }

  // Obter item da fila
  get(dataType) {
    return this.queue.get(dataType);
  }

  // Incrementar tentativas
  incrementAttempts(dataType, attempts) {
    const item = this.queue.get(dataType);
    if (item) {
      item.attempts = (item.attempts || 0) + attempts;
      this.queue.set(dataType, item);
      this.saveToStorage();
    }
  }

  // Obter todos os itens
  getAll() {
    return Array.from(this.queue.entries());
  }

  // Verificar se tem itens
  isEmpty() {
    return this.queue.size === 0;
  }

  // Obter tamanho da fila
  size() {
    return this.queue.size;
  }

  // Limpar fila
  clear() {
    this.queue.clear();
    localStorage.removeItem('pendingSync');
    console.log('Fila de sincronização limpa');
  }

  // Obter status detalhado
  getStatus() {
    return {
      count: this.queue.size,
      types: Array.from(this.queue.keys()),
      details: Object.fromEntries(
        Array.from(this.queue.entries()).map(([key, value]) => [
          key, 
          {
            timestamp: value.timestamp,
            attempts: value.attempts || 0,
            dataCount: Array.isArray(value.data) ? value.data.length : 1
          }
        ])
      )
    };
  }
}

export default SyncQueue;