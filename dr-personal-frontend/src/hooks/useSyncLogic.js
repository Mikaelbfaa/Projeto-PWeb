import { useState, useContext } from 'react';
import { useToast } from '../context/ToastContext';
import { AppContext } from '../context/AppContext';
import { useLocalData } from './useLocalData';
import offlineSync from '../utils/offlineSync';

export const useSyncLogic = (syncType, dataKey, itemLabel, itemLabelSingular) => {
  const { state, dispatch } = useContext(AppContext);
  const { saveLocalData } = useLocalData();
  const { showSuccess, showWarning, showError } = useToast();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validateJson = (jsonString) => {
    if (!jsonString.trim()) {
      setIsValidJson(true);
      setParsedData(null);
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      
      if (!parsed[dataKey] || !Array.isArray(parsed[dataKey])) {
        throw new Error(`JSON deve conter um array "${dataKey}"`);
      }

      setIsValidJson(true);
      setParsedData(parsed);
    } catch (error) {
      setIsValidJson(false);
      setParsedData(null);
    }
  };

  const handleJsonChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);
    validateJson(value);
  };

  const formatJson = () => {
    if (parsedData) {
      setJsonInput(JSON.stringify(parsedData, null, 2));
    }
  };

  const handleSync = async () => {
    if (!parsedData) return;

    setIsLoading(true);
    setShowConfirmModal(false);
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const result = await offlineSync.syncData(syncType, parsedData[dataKey], saveLocalData);
      
      // Toast estético
      if (result.success) {
        if (result.offline) {
          showWarning(`Dados salvos localmente!\n${parsedData[dataKey].length} ${itemLabel} serão sincronizados quando voltar online.`);
        } else {
          showSuccess(`Sincronização concluída!\n${parsedData[dataKey].length} ${itemLabel} sincronizados e salvos localmente.`);
        }
      } else {
        if (result.savedLocally) {
          showWarning(`Erro na sincronização, mas dados salvos localmente.\n${parsedData[dataKey].length} ${itemLabel} serão sincronizados quando possível.`);
        }
      }
      
      resetModal();
    } catch (error) {
      console.error(`Error syncing ${syncType}:`, error);
      
      let errorMessage = `Erro ao sincronizar ${itemLabel}`;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando na porta 8000';
      } else if (error.message.includes('422')) {
        errorMessage = 'Dados inválidos enviados para o servidor. Verifique o formato JSON.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Erro do servidor: ${error.message}`;
      }
      
      showError(errorMessage);
      resetModal();
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setShowUploadModal(false);
    setShowConfirmModal(false);
    setJsonInput('');
    setParsedData(null);
    setIsValidJson(true);
  };

  const openUploadModal = () => setShowUploadModal(true);
  
  const proceedToConfirm = () => {
    setShowUploadModal(false);
    setTimeout(() => setShowConfirmModal(true), 100);
  };

  return {
    // States
    showUploadModal,
    jsonInput,
    isValidJson,
    parsedData,
    isLoading,
    showConfirmModal,
    state,
    
    // Actions
    handleJsonChange,
    formatJson,
    handleSync,
    resetModal,
    openUploadModal,
    proceedToConfirm,
    dispatch
  };
};