class SyncRetryLogic {
  constructor(maxAttempts = 3) {
    this.maxAttempts = maxAttempts;
  }

  // Executar com retry e backoff exponencial
  async executeWithRetry(operation, dataType) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxAttempts; attempt++) {
      try {
        console.log(`Tentativa ${attempt}/${this.maxAttempts} para ${dataType}`);
        const result = await operation();
        console.log(`${dataType} sincronizado com sucesso na tentativa ${attempt}`);
        return { success: true, result, attempts: attempt };
        
      } catch (error) {
        lastError = error;
        console.error(`Tentativa ${attempt} falhou para ${dataType}:`, error.message);
        
        // Se não é a última tentativa, aguardar antes de tentar novamente
        if (attempt < this.maxAttempts) {
          const delayMs = this.calculateBackoffDelay(attempt);
          console.log(`Aguardando ${delayMs}ms antes da próxima tentativa...`);
          await this.delay(delayMs);
        }
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    return { 
      success: false, 
      error: lastError, 
      attempts: this.maxAttempts 
    };
  }

  // Calcular delay com backoff exponencial
  calculateBackoffDelay(attempt) {
    // Base delay: 1s, 2s, 4s, 8s...
    return Math.pow(2, attempt) * 1000;
  }

  // Função auxiliar para delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Verificar se deve tentar novamente baseado no número de tentativas anteriores
  shouldRetry(attempts) {
    return attempts < 10; // Limite máximo de tentativas acumuladas
  }
}

export default SyncRetryLogic;