import React from 'react';
import { Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const JsonUploadModal = ({
  show,
  title,
  subtitle,
  jsonInput,
  isValidJson,
  parsedData,
  dataKey,
  itemLabel,
  placeholder,
  onJsonChange,
  onFormat,
  onCancel,
  onProceed
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 dark:text-dark-primary">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{subtitle}</p>
        
        <div className="relative mb-4">
          <textarea
            value={jsonInput}
            onChange={onJsonChange}
            className={`w-full h-64 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 font-mono text-sm resize-none ${
              isValidJson 
                ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-primary focus:ring-secondary dark:focus:ring-dark-secondary' 
                : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 focus:ring-red-500'
            }`}
            placeholder={placeholder}
          />
          
          {!isValidJson && (
            <div className="absolute top-2 right-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>

        {!isValidJson && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-800 dark:text-red-200 text-sm">JSON inválido. Verifique a sintaxe.</span>
            </div>
          </div>
        )}

        {parsedData && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                <span className="text-green-800 dark:text-green-200 font-medium">
                  JSON válido! {parsedData[dataKey].length} {itemLabel} detectados
                </span>
              </div>
              <button
                onClick={onFormat}
                className="flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Formatar
              </button>
            </div>
            
            <div className="text-sm text-green-700 dark:text-green-300">
              Primeiro item: <strong>{parsedData[dataKey][0]?.name}</strong>
            </div>
          </div>
        )}
        
        <div className="flex justify-between space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onProceed}
            disabled={!parsedData || !isValidJson}
            className="px-6 py-2 bg-secondary text-light dark:bg-dark-secondary rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Sincronizar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonUploadModal;