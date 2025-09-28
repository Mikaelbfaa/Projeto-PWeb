import React from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useSyncLogic } from '../../hooks/useSyncLogic';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import JsonUploadModal from './JsonUploadModal';

const SyncPanel = ({ 
  title,
  syncType,
  dataKey,
  itemLabel,
  itemLabelSingular,
  description,
  formatDescription,
  placeholder
}) => {
  const {
    showUploadModal,
    jsonInput,
    isValidJson,
    parsedData,
    isLoading,
    showConfirmModal,
    state,
    handleJsonChange,
    formatJson,
    handleSync,
    resetModal,
    openUploadModal,
    proceedToConfirm,
    dispatch
  } = useSyncLogic(syncType, dataKey, itemLabel, itemLabelSingular);

  if (isLoading) {
    return <LoadingSpinner message={`Sincronizando ${itemLabel}...`} />;
  }

  return (
    <div>
      {state.error && (
        <ErrorMessage 
          error={state.error} 
          onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
        />
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-dark-primary">{title}</h1>
        <button
          onClick={openUploadModal}
          className="bg-secondary text-light dark:bg-dark-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 inline-flex items-center transition-colors"
        >
          <Upload className="mr-2 h-4 w-4" />
          Sincronizar Dados
        </button>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-dark-primary">Informações</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {description}
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">Formato Esperado:</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {formatDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      <JsonUploadModal
        show={showUploadModal}
        title={`Sincronizar ${title}`}
        subtitle={`Cole o JSON dos ${itemLabel}:`}
        jsonInput={jsonInput}
        isValidJson={isValidJson}
        parsedData={parsedData}
        dataKey={dataKey}
        itemLabel={itemLabel}
        placeholder={placeholder}
        onJsonChange={handleJsonChange}
        onFormat={formatJson}
        onCancel={resetModal}
        onProceed={proceedToConfirm}
      />

      {/* Modal de Confirmação */}
      {showConfirmModal && parsedData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 dark:text-dark-primary">Confirmar Sincronização</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Você está prestes a sincronizar <strong>{parsedData[dataKey].length} {itemLabel}</strong>. 
              Esta ação substituirá todos os dados existentes.
            </p>
            <p className="text-red-600 dark:text-red-400 text-sm mb-6">
              ATENÇÃO: Esta ação não pode ser desfeita!
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => dispatch({ type: 'SET_SHOW_CONFIRM_MODAL', payload: false })}
                className="px-4 py-2 text-gray-600 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSync}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirmar Sincronização
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyncPanel;