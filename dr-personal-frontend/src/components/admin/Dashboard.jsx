import React from 'react';
import { Users, Heart, Activity, Calendar, FileText, RefreshCw } from 'lucide-react';
import { useLocalData } from '../../hooks/useLocalData';
import { useBackendStatus } from '../../hooks/useBackendStatus';
import StatusCard from './StatusCard';

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
          <StatusCard
            title="API Backend"
            status={backendStatus.api.isOnline}
            isChecking={backendStatus.api.isChecking}
            lastChecked={backendStatus.api.lastChecked}
            error={backendStatus.api.error}
          />

          <StatusCard
            title="Banco de Dados"
            status={backendStatus.api.isOnline}
            isChecking={backendStatus.api.isChecking}
            lastChecked={backendStatus.api.lastChecked}
            error={backendStatus.api.error}
            onlineText="Conectado"
            offlineText="Desconectado"
          />

          <StatusCard
            title="Conectividade"
            status={backendStatus.network.isOnline}
            isChecking={false}
            lastChecked={backendStatus.network.lastChecked}
            colorScheme="blue"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;