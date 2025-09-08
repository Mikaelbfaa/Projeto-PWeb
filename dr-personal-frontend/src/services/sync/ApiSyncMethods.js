// Mapeamento centralizado dos métodos de API para sincronização
import apiService from '../apiService';

export const API_SYNC_METHODS = {
  muscleGroups: (data) => apiService.syncMuscleGroups({ muscle_groups: data }),
  healthConditions: (data) => apiService.syncHealthConditions({ health_conditions: data }),
  preparationExercises: (data) => apiService.syncPreparationExercises({ exercises: data }),
  strengthExercises: (data) => apiService.syncStrengthExercises({ exercises: data }),
  routines: (data) => apiService.syncRoutines({ routines: data })
};

export const getApiMethod = (dataType) => {
  const method = API_SYNC_METHODS[dataType];
  if (!method) {
    throw new Error(`Método de API não encontrado para: ${dataType}`);
  }
  return method;
};

export const getSupportedDataTypes = () => {
  return Object.keys(API_SYNC_METHODS);
};