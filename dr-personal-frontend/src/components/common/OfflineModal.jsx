import React from 'react';
import { WifiOff, Home, PlayCircle, X } from 'lucide-react';

const OfflineModal = ({ isOpen, onClose, onGoHome, onUseDemoData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl max-w-md mx-4 p-8 transform transition-all duration-300 scale-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-full">
            <WifiOff className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4 text-primary dark:text-dark-primary">
          Backend Offline
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          O servidor não está disponível no momento. Você pode voltar à página inicial ou explorar o sistema com dados de demonstração.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Demo button */}
          <button
            onClick={onUseDemoData}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-secondary to-primary hover:from-primary hover:to-secondary text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
          >
            <PlayCircle size={20} />
            Ver Demonstração com Dados Mockados
          </button>

          {/* Home button */}
          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-dark-bg-primary dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-300"
          >
            <Home size={20} />
            Voltar à Página Inicial
          </button>
        </div>

        {/* Info note */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Dica:</strong> A demonstração usa dados fictícios para mostrar como o sistema funciona quando conectado ao backend.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfflineModal;