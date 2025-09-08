import React, { useState } from 'react';
import SyncPanel from './SyncPanel';

const ExercisesSync = () => {
  const [activeExerciseTab, setActiveExerciseTab] = useState('preparation');
  
  const exerciseTabs = [
    { id: 'preparation', label: 'Exercícios de Preparação' },
    { id: 'strength', label: 'Exercícios de Força' }
  ];

  const PreparationExercisesSync = () => (
    <SyncPanel
      title="Exercícios de Preparação"
      syncType="preparationExercises"
      dataKey="exercises"
      itemLabel="exercícios de preparação"
      itemLabelSingular="exercício de preparação"
      description="Sincronize exercícios de preparação (mobilidade e liberação) com o backend."
      formatDescription='O JSON deve conter um objeto com a propriedade "exercises" contendo um array de exercícios.'
      placeholder='{"exercises": [{"id": "1", "name": "Rotação externa", "type": "mobility", "count_type": "repetition"}]}'
    />
  );

  const StrengthExercisesSync = () => (
    <SyncPanel
      title="Exercícios de Força"
      syncType="strengthExercises"
      dataKey="exercises"
      itemLabel="exercícios de força"
      itemLabelSingular="exercício de força"
      description="Sincronize exercícios de força com o backend."
      formatDescription='O JSON deve conter um objeto com a propriedade "exercises" contendo um array de exercícios.'
      placeholder='{"exercises": [{"id": "1", "name": "Supino", "muscle_groups": ["Peitoral maior"], ...}]}'
    />
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-dark-primary">Gerenciamento de Exercícios</h1>
      
      <div className="bg-white dark:bg-dark-bg-secondary shadow mb-6">
        <div className="flex space-x-8 overflow-x-auto px-6">
          {exerciseTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveExerciseTab(tab.id)}
              className={`px-4 py-4 border-b-2 whitespace-nowrap ${
                activeExerciseTab === tab.id
                  ? 'border-secondary text-secondary dark:border-dark-secondary dark:text-dark-secondary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeExerciseTab === 'preparation' && <PreparationExercisesSync />}
      {activeExerciseTab === 'strength' && <StrengthExercisesSync />}
    </div>
  );
};

export default ExercisesSync;