import { useContext, useEffect, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import {
  muscleGroupsStorage,
  healthConditionsStorage,
  preparationExercisesStorage,
  strengthExercisesStorage,
  routinesStorage,
  getStorageStats,
  exportAllData as exportStorageData,
  clearAllData as clearStorageData
} from '../services/storage';

export const useLocalData = () => {
  const { state, dispatch } = useContext(AppContext);

  // Carregar todos os dados locais na inicialização
  const loadAllLocalData = useCallback(async () => {
    try {
      console.log('Carregando dados locais...');
      
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

      dispatch({
        type: 'LOAD_ALL_LOCAL_DATA',
        payload: {
          muscleGroups,
          healthConditions,
          preparationExercises,
          strengthExercises,
          routines,
          syncTimes: {
            muscleGroups: stats.muscleGroups.lastSync,
            healthConditions: stats.healthConditions.lastSync,
            preparationExercises: stats.preparationExercises.lastSync,
            strengthExercises: stats.strengthExercises.lastSync,
            routines: stats.routines.lastSync
          }
        }
      });

      console.log('Dados locais carregados:', {
        muscleGroups: muscleGroups.length,
        healthConditions: healthConditions.length,
        preparationExercises: preparationExercises.length,
        strengthExercises: strengthExercises.length,
        routines: routines.length
      });

    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados locais' });
    }
  }, [dispatch]);

  // Salvar dados específicos localmente
  const saveLocalData = useCallback(async (dataType, data) => {
    try {
      let syncTime;
      
      switch (dataType) {
        case 'muscleGroups':
          await muscleGroupsStorage.save(data);
          syncTime = await muscleGroupsStorage.getLastSync();
          break;
        case 'healthConditions':
          await healthConditionsStorage.save(data);
          syncTime = await healthConditionsStorage.getLastSync();
          break;
        case 'preparationExercises':
          await preparationExercisesStorage.save(data);
          syncTime = await preparationExercisesStorage.getLastSync();
          break;
        case 'strengthExercises':
          await strengthExercisesStorage.save(data);
          syncTime = await strengthExercisesStorage.getLastSync();
          break;
        case 'routines':
          await routinesStorage.save(data);
          syncTime = await routinesStorage.getLastSync();
          break;
        default:
          throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }

      // Atualizar estado local
      dispatch({ type: 'SET_LOCAL_DATA', dataType, payload: data });
      
      // Atualizar tempo de sincronização
      dispatch({ 
        type: 'SET_LOCAL_SYNC_TIME', 
        dataType, 
        payload: syncTime?.timestamp 
      });

      console.log(`Dados ${dataType} salvos localmente:`, data.length, 'itens');
      
    } catch (error) {
      console.error(`Erro ao salvar ${dataType} localmente:`, error);
      throw error;
    }
  }, [dispatch]);

  // Limpar todos os dados locais
  const clearAllLocalData = useCallback(async () => {
    try {
      await clearStorageData();
      dispatch({ type: 'CLEAR_LOCAL_DATA' });
      console.log('Todos os dados locais foram limpos');
    } catch (error) {
      console.error('Erro ao limpar dados locais:', error);
      throw error;
    }
  }, [dispatch]);

  // Exportar todos os dados
  const exportAllData = useCallback(async () => {
    try {
      const data = await exportStorageData();
      
      // Criar arquivo para download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dr-personal-backup-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      console.log('Dados exportados com sucesso');
      return data;
      
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  }, []);

  // Buscar dados por nome
  const searchLocalData = useCallback(async (dataType, searchTerm) => {
    try {
      let results;
      
      switch (dataType) {
        case 'muscleGroups':
          results = await muscleGroupsStorage.searchByName(searchTerm);
          break;
        case 'healthConditions':
          results = await healthConditionsStorage.searchByName(searchTerm);
          break;
        case 'preparationExercises':
          results = await preparationExercisesStorage.searchByName(searchTerm);
          break;
        case 'strengthExercises':
          results = await strengthExercisesStorage.searchByName(searchTerm);
          break;
        case 'routines':
          results = await routinesStorage.searchByName(searchTerm);
          break;
        default:
          throw new Error(`Tipo de dados desconhecido: ${dataType}`);
      }
      
      return results;
      
    } catch (error) {
      console.error(`Erro ao buscar ${dataType}:`, error);
      throw error;
    }
  }, []);

  // Obter estatísticas dos dados locais
  const getLocalDataStats = useCallback(() => {
    const { localData } = state;
    
    return {
      muscleGroups: {
        count: localData.muscleGroups.length,
        lastSync: localData.syncTimes.muscleGroups,
        hasData: localData.muscleGroups.length > 0
      },
      healthConditions: {
        count: localData.healthConditions.length,
        lastSync: localData.syncTimes.healthConditions,
        hasData: localData.healthConditions.length > 0
      },
      preparationExercises: {
        count: localData.preparationExercises.length,
        lastSync: localData.syncTimes.preparationExercises,
        hasData: localData.preparationExercises.length > 0
      },
      strengthExercises: {
        count: localData.strengthExercises.length,
        lastSync: localData.syncTimes.strengthExercises,
        hasData: localData.strengthExercises.length > 0
      },
      routines: {
        count: localData.routines.length,
        lastSync: localData.syncTimes.routines,
        hasData: localData.routines.length > 0
      },
      totalItems: localData.muscleGroups.length + 
                 localData.healthConditions.length + 
                 localData.preparationExercises.length + 
                 localData.strengthExercises.length + 
                 localData.routines.length,
      isLoaded: localData.isLoaded
    };
  }, [state]);

  // Carregar dados na inicialização
  useEffect(() => {
    if (!state.localData.isLoaded) {
      loadAllLocalData();
    }
  }, [state.localData.isLoaded, loadAllLocalData]);

  return {
    localData: state.localData,
    loadAllLocalData,
    saveLocalData,
    clearAllLocalData,
    exportAllData,
    searchLocalData,
    getLocalDataStats
  };
};