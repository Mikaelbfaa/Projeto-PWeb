import dbService from '../dbService';
import BaseStorage from './BaseStorage';

// Cria instâncias específicas para cada tipo de dado
export const muscleGroupsStorage = new BaseStorage(dbService, 'muscle_groups');
export const healthConditionsStorage = new BaseStorage(dbService, 'health_conditions');
export const preparationExercisesStorage = new BaseStorage(dbService, 'preparation_exercises');
export const strengthExercisesStorage = new BaseStorage(dbService, 'strength_exercises');

// Rotinas precisam de tratamento especial para ID
export class RoutinesStorage extends BaseStorage {
  constructor(dbService) {
    super(dbService, 'routines');
  }

  async save(routines) {
    // Rotinas não têm ID, então vamos adicionar um baseado no índice
    const routinesWithId = routines.map((routine, index) => ({
      ...routine,
      id: `${routine.level}_${routine.weekly_frequency}_${index}`
    }));
    
    await this.db.saveData(this.storeName, routinesWithId);
    await this.db.setLastSyncTime(this.storeName);
  }
}

export const routinesStorage = new RoutinesStorage(dbService);

// Função utilitária para obter estatísticas de todos os dados
export const getStorageStats = async () => {
  try {
    const [
      muscleGroupsStats,
      healthConditionsStats,
      preparationExercisesStats,
      strengthExercisesStats,
      routinesStats
    ] = await Promise.all([
      Promise.all([muscleGroupsStorage.count(), muscleGroupsStorage.getLastSync()]),
      Promise.all([healthConditionsStorage.count(), healthConditionsStorage.getLastSync()]),
      Promise.all([preparationExercisesStorage.count(), preparationExercisesStorage.getLastSync()]),
      Promise.all([strengthExercisesStorage.count(), strengthExercisesStorage.getLastSync()]),
      Promise.all([routinesStorage.count(), routinesStorage.getLastSync()])
    ]);

    return {
      muscleGroups: {
        count: muscleGroupsStats[0],
        lastSync: muscleGroupsStats[1]?.timestamp || null
      },
      healthConditions: {
        count: healthConditionsStats[0],
        lastSync: healthConditionsStats[1]?.timestamp || null
      },
      preparationExercises: {
        count: preparationExercisesStats[0],
        lastSync: preparationExercisesStats[1]?.timestamp || null
      },
      strengthExercises: {
        count: strengthExercisesStats[0],
        lastSync: strengthExercisesStats[1]?.timestamp || null
      },
      routines: {
        count: routinesStats[0],
        lastSync: routinesStats[1]?.timestamp || null
      },
      get totalItems() {
        return this.muscleGroups.count + this.healthConditions.count + 
               this.preparationExercises.count + this.strengthExercises.count + 
               this.routines.count;
      }
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas de armazenamento:', error);
    return {
      muscleGroups: { count: 0, lastSync: null },
      healthConditions: { count: 0, lastSync: null },
      preparationExercises: { count: 0, lastSync: null },
      strengthExercises: { count: 0, lastSync: null },
      routines: { count: 0, lastSync: null },
      totalItems: 0
    };
  }
};

// Função para exportar todos os dados
export const exportAllData = async () => {
  const [
    muscleGroups,
    healthConditions,
    preparationExercises,
    strengthExercises,
    routines,
    stats
  ] = await Promise.all([
    muscleGroupsStorage.getAll(),
    healthConditionsStorage.getAll(),
    preparationExercisesStorage.getAll(),
    strengthExercisesStorage.getAll(),
    routinesStorage.getAll(),
    getStorageStats()
  ]);

  return {
    muscle_groups: muscleGroups,
    health_conditions: healthConditions,
    preparation_exercises: preparationExercises,
    strength_exercises: strengthExercises,
    routines: routines,
    metadata: {
      exported_at: new Date().toISOString(),
      ...stats
    }
  };
};

// Função para limpar todos os dados
export const clearAllData = async () => {
  await Promise.all([
    muscleGroupsStorage.clear(),
    healthConditionsStorage.clear(),
    preparationExercisesStorage.clear(),
    strengthExercisesStorage.clear(),
    routinesStorage.clear()
  ]);
};