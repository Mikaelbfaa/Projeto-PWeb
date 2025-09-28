import React from 'react';
import { Users, Heart, Activity, Calendar, FileText, CheckCircle, X, RefreshCw, Loader } from 'lucide-react';
import { useLocalData } from '../../hooks/useLocalData';
import { useBackendStatus } from '../../hooks/useBackendStatus';

const Dashboard = () => {
  const { getLocalDataStats } = useLocalData();
  const { status: backendStatus, refreshStatus, isChecking } = useBackendStatus();
  const stats = getLocalDataStats();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-dark-primary">Dashboard Administrativo</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Grupos Musculares</p>
              <p className="text-3xl font-bold dark:text-dark-primary">{stats.muscleGroups.count}</p>
              {stats.muscleGroups.lastSync && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Sincronizado: {new Date(stats.muscleGroups.lastSync).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-secondary/20 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Condições de Saúde</p>
              <p className="text-3xl font-bold dark:text-dark-primary">{stats.healthConditions.count}</p>
              {stats.healthConditions.lastSync && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Sincronizado: {new Date(stats.healthConditions.lastSync).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-red-500/20 text-red-500">
              <Heart className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Exercícios</p>
              <p className="text-3xl font-bold dark:text-dark-primary">
                {stats.preparationExercises.count + stats.strengthExercises.count}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.preparationExercises.count} prep + {stats.strengthExercises.count} força
              </p>
            </div>
            <div className="p-3 rounded-full bg-accent/20 text-accent dark:bg-dark-accent/20 dark:text-dark-accent">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Rotinas</p>
              <p className="text-3xl font-bold dark:text-dark-primary">{stats.routines.count}</p>
              {stats.routines.lastSync && (
                <p className="text-sm text-green-600 dark:text-green-400">
                  Sincronizado: {new Date(stats.routines.lastSync).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <div className="p-3 rounded-full bg-purple-500/20 text-purple-500">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Local</p>
              <p className="text-3xl font-bold dark:text-dark-primary">{stats.totalItems}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">Itens armazenados</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/20 text-blue-500">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold dark:text-dark-primary">Status do Sistema</h2>
          <button
            onClick={refreshStatus}
            disabled={isChecking}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Atualizar status"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 dark:text-gray-400 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-4">
          {/* API Backend Status */}
          <div className={`flex items-center justify-between p-3 rounded ${
            backendStatus.api.isOnline
              ? 'bg-green-50 dark:bg-green-900/30'
              : 'bg-red-50 dark:bg-red-900/30'
          }`}>
            <div className="flex items-center space-x-2">
              {backendStatus.api.isChecking ? (
                <Loader className="h-5 w-5 text-gray-500 animate-spin" />
              ) : backendStatus.api.isOnline ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <div>
                <span className="dark:text-dark-primary">API Backend</span>
                {backendStatus.api.lastChecked && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Verificado: {backendStatus.api.lastChecked.toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`font-medium ${
                backendStatus.api.isOnline
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {backendStatus.api.isChecking ? 'Verificando...' :
                 backendStatus.api.isOnline ? 'Online' : 'Offline'}
              </span>
              {backendStatus.api.error && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {backendStatus.api.error}
                </p>
              )}
            </div>
          </div>

          {/* Database Status */}
          <div className={`flex items-center justify-between p-3 rounded ${
            backendStatus.database.isOnline
              ? 'bg-green-50 dark:bg-green-900/30'
              : 'bg-red-50 dark:bg-red-900/30'
          }`}>
            <div className="flex items-center space-x-2">
              {backendStatus.database.isChecking ? (
                <Loader className="h-5 w-5 text-gray-500 animate-spin" />
              ) : backendStatus.database.isOnline ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <div>
                <span className="dark:text-dark-primary">Banco de Dados</span>
                {backendStatus.database.lastChecked && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Verificado: {backendStatus.database.lastChecked.toLocaleTimeString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`font-medium ${
                backendStatus.database.isOnline
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {backendStatus.database.isChecking ? 'Verificando...' :
                 backendStatus.database.isOnline ? 'Conectado' : 'Desconectado'}
              </span>
              {backendStatus.database.error && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                  {backendStatus.database.error}
                </p>
              )}
            </div>
          </div>

          {/* Network Status */}
          <div className={`flex items-center justify-between p-3 rounded ${
            backendStatus.network.isOnline
              ? 'bg-blue-50 dark:bg-blue-900/30'
              : 'bg-gray-50 dark:bg-gray-900/30'
          }`}>
            <div className="flex items-center space-x-2">
              {backendStatus.network.isOnline ? (
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              ) : (
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              )}
              <div>
                <span className="dark:text-dark-primary">Conectividade</span>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Verificado: {backendStatus.network.lastChecked.toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
            <span className={`font-medium ${
              backendStatus.network.isOnline
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {backendStatus.network.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;