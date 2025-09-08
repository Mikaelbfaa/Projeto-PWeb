import React, { useState } from 'react';
import { BarChart3, Users, Activity, Heart, Calendar, Database } from 'lucide-react';
import Dashboard from '../components/admin/Dashboard';
import MuscleGroupsSync from '../components/admin/MuscleGroupsSync';
import HealthConditionsSync from '../components/admin/HealthConditionsSync';
import ExercisesSync from '../components/admin/ExercisesSync';
import RoutinesSync from '../components/admin/RoutinesSync';
import DataViewer from '../components/admin/DataViewer';
import OfflineStatus from '../components/common/OfflineStatus';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'muscle-groups', label: 'Grupos Musculares', icon: Users },
    { id: 'health-conditions', label: 'Condições de Saúde', icon: Heart },
    { id: 'exercises', label: 'Exercícios', icon: Activity },
    { id: 'routines', label: 'Rotinas', icon: Calendar },
    { id: 'data-viewer', label: 'Dados Locais', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-dotted dark:bg-dark-bg-primary">
      <div className="bg-white dark:bg-dark-bg-secondary shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {adminTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-secondary text-secondary dark:border-dark-secondary dark:text-dark-secondary'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'muscle-groups' && <MuscleGroupsSync />}
        {activeTab === 'health-conditions' && <HealthConditionsSync />}
        {activeTab === 'exercises' && <ExercisesSync />}
        {activeTab === 'routines' && <RoutinesSync />}
        {activeTab === 'data-viewer' && <DataViewer />}
      </div>
      
      <OfflineStatus />
    </div>
  );
};

export default AdminPage;