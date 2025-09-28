import { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext';
import apiService from '../services/apiService';
import mockService from '../services/mockService';

export const usePrescription = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const [selectedOptions, setSelectedOptions] = useState({
    training_method: '',
    division_type: '',
    sequency_type: '',
    periodization_type: '',
    mesocycle_duration: 0,
    progression_status: ''
  });

  // Sincronizar opções selecionadas com a prescrição parcial
  useEffect(() => {
    if (state.partialPrescription) {
      setSelectedOptions({
        training_method: state.partialPrescription.training_method.recommended,
        division_type: state.partialPrescription.division_type.recommended,
        sequency_type: state.partialPrescription.sequency_type.recommended,
        periodization_type: state.partialPrescription.periodization_type.recommended,
        mesocycle_duration: state.partialPrescription.mesocycle_duration.recommended,
        progression_status: state.partialPrescription.progression_status 
          ? state.partialPrescription.progression_status.recommended 
          : ''
      });
    }
  }, [state.partialPrescription]);

  const handleOptionChange = useCallback((field, value) => {
    setSelectedOptions(prev => ({ ...prev, [field]: value }));
  }, []);

  const generateFullPrescription = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const request = {
        user_id: state.userProfile.id,
        training_method: selectedOptions.training_method,
        division_type: selectedOptions.division_type,
        sequency_type: selectedOptions.sequency_type,
        periodization_type: selectedOptions.periodization_type,
        mesocycle_duration: selectedOptions.mesocycle_duration
      };

      // Usa dados mockados se estiver em modo demo
      const service = state.demoMode ? mockService : apiService;
      const response = await service.generateFullPrescription(request);

      dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: response });

      // Adicionar ao histórico
      dispatch({
        type: 'ADD_TO_PRESCRIPTION_HISTORY',
        userProfile: state.userProfile,
        partialPrescription: state.partialPrescription,
        fullPrescription: response
      });

      return { success: true, data: response };

    } catch (error) {
      console.error('Error generating full prescription:', error);
      console.log('usePrescription error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        demoMode: state.demoMode
      });

      // Verifica se é erro de conectividade
      const additionalInfo = error.responseInfo || {};
      if (apiService.isConnectivityError(error, additionalInfo) && !state.demoMode) {
        console.log('usePrescription: Detected connectivity error, showing offline modal');
        dispatch({ type: 'SHOW_OFFLINE_MODAL', payload: error.message });
        return { success: false, error: error.message, isConnectivityError: true };
      }

      let errorMessage = 'Erro ao gerar prescrição completa';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando na porta 8000';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Erro do servidor: ${error.message}`;
      }

      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };

    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.userProfile, state.partialPrescription, state.demoMode, selectedOptions, dispatch]);

  const viewPrescriptionDetails = useCallback((fullPrescription) => {
    dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: fullPrescription });
  }, [dispatch]);

  const navigateToProfile = useCallback(() => {
    dispatch({ type: 'SET_PAGE', payload: 'profile' });
  }, [dispatch]);

  // Funções para gerenciar modal offline
  const handleOfflineModalClose = useCallback(() => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
  }, [dispatch]);

  const handleGoHome = useCallback(() => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
    dispatch({ type: 'SET_PAGE', payload: 'home' });
  }, [dispatch]);

  const handleUseDemoData = useCallback(async () => {
    dispatch({ type: 'HIDE_OFFLINE_MODAL' });
    dispatch({ type: 'SET_DEMO_MODE', payload: true });

    // Gera prescrição com dados mockados
    const result = await generateFullPrescription();
    if (result.success) {
      // Adiciona uma flag visual para indicar modo demo
      const demoResponse = {
        ...result.data,
        is_demo: true,
        demo_notice: 'Esta é uma demonstração com dados fictícios'
      };
      dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: demoResponse });
    }
  }, [dispatch, generateFullPrescription]);

  return {
    // State
    selectedOptions,
    partialPrescription: state.partialPrescription,
    fullPrescription: state.fullPrescription,
    prescriptionHistory: state.prescriptionHistory,
    loading: state.loading,
    error: state.error,
    offlineModal: state.offlineModal,
    demoMode: state.demoMode,

    // Actions
    handleOptionChange,
    generateFullPrescription,
    viewPrescriptionDetails,
    navigateToProfile,

    // Offline Modal Actions
    handleOfflineModalClose,
    handleGoHome,
    handleUseDemoData,

    // Utilities
    clearError: () => dispatch({ type: 'SET_ERROR', payload: null })
  };
};