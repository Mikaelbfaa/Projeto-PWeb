import React, { useState, useContext } from 'react';
import { FileText, ChevronLeft, ChevronRight, Download, Calendar, BarChart3, Settings, Users, TrendingUp } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const FullPrescriptionView = () => {
  const { state, dispatch } = useContext(AppContext);
  const prescription = state.fullPrescription;
  const [expandedMicrocycles, setExpandedMicrocycles] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  const toggleMicrocycle = (microcycleName) => {
    setExpandedMicrocycles(prev => ({
      ...prev,
      [microcycleName]: !prev[microcycleName]
    }));
  };

  const toggleDay = (dayKey) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  const ExerciseRow = ({ exercise, index }) => {
    return (
      <tr className={`transition-colors ${index % 2 === 0 ? 'bg-gray-50 dark:bg-dark-bg-secondary' : 'bg-white dark:bg-dark-bg-primary'} hover:bg-blue-50 dark:hover:bg-purple-900/20`}>
        <td className="px-4 py-3 text-sm font-medium text-primary dark:text-dark-primary">{exercise.name}</td>
        <td className="px-4 py-3 text-sm text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-secondary/10 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary rounded-full font-bold">
            {exercise.sets}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-center">
          {exercise.count_type === 'repetition' ? (
            <span className="inline-flex items-center px-2.5 py-1 bg-accent/10 text-accent dark:bg-dark-accent/20 dark:text-dark-accent rounded-full text-xs font-medium">
              {exercise.repetitions ? `${exercise.repetitions.min}-${exercise.repetitions.max}` : 'N/A'}
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              {exercise.execution_time}s
            </span>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-center">
          <span className="font-medium text-gray-600 dark:text-gray-300">{exercise.pause_time}</span>
        </td>
        <td className="px-4 py-3 text-sm text-center">
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded text-xs capitalize">
            {exercise.exercise_type || 'strength'}
          </span>
        </td>
      </tr>
    );
  };

  const TrainingDayCard = ({ dayName, dayData, microcycleName }) => {
    const dayKey = `${microcycleName}-${dayName}`;
    const isExpanded = expandedDays[dayKey];

    if (!dayData || !dayData.exercises) {
      return (
        <div className="bg-white dark:bg-dark-bg-primary rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-dark-bg-secondary px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-primary dark:text-dark-primary">Dia {dayName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Nenhum exercício encontrado</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-dark-bg-primary rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-4">
        <button
          onClick={() => toggleDay(dayKey)}
          className="w-full bg-gradient-to-r from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10 dark:from-dark-secondary/10 dark:to-dark-secondary/5 dark:hover:from-dark-secondary/20 dark:hover:to-dark-secondary/10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-secondary dark:bg-dark-secondary text-white shadow-md">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-primary dark:text-dark-primary">Dia {dayName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{dayData.exercises.length} exercícios</p>
              </div>
            </div>
            <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-dark-bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Exercício</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Séries</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Reps/Tempo</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Pausa</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Tipo</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-dark-bg-primary divide-y divide-gray-200 dark:divide-gray-700">
                  {dayData.exercises.map((exercise, index) => (
                    <ExerciseRow key={exercise.exercise_id || index} exercise={exercise} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const MicrocycleCard = ({ microcycleName, microcycleData }) => {
    const isExpanded = expandedMicrocycles[microcycleName];
    const trainingParams = microcycleData.training_parameters;
    console.log(JSON.stringify(microcycleData, null, 2));
    
    // Extrair os dias de treino
    const trainingDays = [];
    for (let i = 1; i < microcycleData.length; i++) {
      const dayObj = microcycleData[i];
      Object.keys(dayObj).forEach(dayName => {
        trainingDays.push({
          name: dayName,
          data: dayObj[dayName]
        });
      });
    }

    const totalExercises = trainingDays.reduce((total, day) => total + (day.data?.exercises?.length || 0), 0);

    return (
      <div className="bg-white dark:bg-dark-bg-primary rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
        <button
          onClick={() => toggleMicrocycle(microcycleName)}
          className="w-full bg-gradient-to-r from-secondary/20 to-secondary/10 hover:from-secondary/30 hover:to-secondary/15 dark:from-dark-secondary/20 dark:to-dark-secondary/10 dark:hover:from-dark-secondary/30 dark:hover:to-dark-secondary/15 p-6 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-secondary dark:bg-dark-secondary text-white shadow-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-primary dark:text-dark-primary">
                  {microcycleName.replace('_', ' ').toUpperCase()}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <span>{trainingDays.length} dias de treino</span>
                  <span>•</span>
                  <span>{totalExercises} exercícios total</span>
                </div>
              </div>
            </div>
            <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
              <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </div>
          </div>
        </button>
        
        {isExpanded && (
          <div className="p-6 bg-gray-50 dark:bg-dark-bg-secondary">
            {trainingParams && (
              <div className="bg-white dark:bg-dark-bg-primary rounded-xl p-6 mb-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-secondary/10 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary mr-3">
                    <Settings className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-primary dark:text-dark-primary">Parâmetros de Treino</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Manifestação</div>
                    <div className="text-sm font-semibold text-primary dark:text-dark-primary">{trainingParams.strength_manifestation}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Intensidade</div>
                    <div className="text-sm font-semibold text-primary dark:text-dark-primary">{trainingParams.maximum_strength}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Séries</div>
                    <div className="text-lg font-bold text-secondary dark:text-dark-secondary">{trainingParams.sets}</div>
                  </div>
                  {trainingParams.repetitions && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Repetições</div>
                      <div className="text-lg font-bold text-accent dark:text-dark-accent">{trainingParams.repetitions.min}-{trainingParams.repetitions.max}</div>
                    </div>
                  )}
                  <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Pausa</div>
                    <div className="text-sm font-semibold text-primary dark:text-dark-primary">{trainingParams.pause_time}</div>
                  </div>
                  {trainingParams.concentric_contraction_tempo && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Tempo Concêntrico</div>
                      <div className="text-sm font-semibold text-primary dark:text-dark-primary">{trainingParams.concentric_contraction_tempo}</div>
                    </div>
                  )}
                  {trainingParams.eccentric_contraction_tempo && (
                    <div className="bg-gray-50 dark:bg-dark-bg-secondary p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-300 font-medium uppercase tracking-wider mb-1">Tempo Excêntrico</div>
                      <div className="text-sm font-semibold text-primary dark:text-dark-primary">{trainingParams.eccentric_contraction_tempo}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {trainingDays.map((day, index) => (
                <TrainingDayCard
                  key={index}
                  dayName={day.name}
                  dayData={day.data}
                  microcycleName={microcycleName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const expandAllMicrocycles = () => {
    const allMicrocycles = Object.keys(prescription).filter(key => key.toLowerCase().startsWith('microcycle'));
    const expanded = {};
    allMicrocycles.forEach(micro => {
      expanded[micro] = true;
    });
    setExpandedMicrocycles(expanded);
  };

  const collapseAllMicrocycles = () => {
    setExpandedMicrocycles({});
    setExpandedDays({});
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header com botão voltar */}
        <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'prescription' })}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Voltar às Prescrições</span>
            </button>
            
            <div className="flex space-x-3">
              <button
                onClick={expandAllMicrocycles}
                className="px-4 py-2 text-sm bg-secondary/10 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary hover:bg-secondary/20 dark:hover:bg-dark-secondary/30 rounded-lg transition-colors"
              >
                Expandir Todos
              </button>
              <button
                onClick={collapseAllMicrocycles}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Colapsar Todos
              </button>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-secondary dark:bg-dark-secondary text-white mb-4 shadow-lg">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-primary dark:text-dark-primary">
              Sua Prescrição de Treino
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Plano personalizado gerado com inteligência artificial baseado no seu perfil
            </p>
          </div>
          
          {/* Informações da prescrição */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-secondary/10 border-secondary/20 dark:bg-dark-secondary/20 dark:border-dark-secondary/30 p-6 rounded-xl border">
              <div className="flex items-center mb-3">
                <Users className="h-5 w-5 mr-2 text-secondary dark:text-dark-secondary" />
                <h3 className="font-bold text-primary dark:text-dark-primary">Divisão</h3>
              </div>
              <p className="font-semibold text-secondary dark:text-dark-secondary">{prescription.division_type}</p>
            </div>
            
            <div className="bg-accent/10 border-accent/20 dark:bg-dark-accent/20 dark:border-dark-accent/30 p-6 rounded-xl border">
              <div className="flex items-center mb-3">
                <TrendingUp className="h-5 w-5 mr-2 text-accent dark:text-dark-accent" />
                <h3 className="font-bold text-primary dark:text-dark-primary">Sequência</h3>
              </div>
              <p className="font-semibold text-accent dark:text-dark-accent">{prescription.sequency_type}</p>
            </div>
            
            <div className="bg-primary/10 border-primary/20 dark:bg-dark-primary/20 dark:border-dark-primary/30 p-6 rounded-xl border">
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 mr-2 text-primary dark:text-dark-primary" />
                <h3 className="font-bold text-primary dark:text-dark-primary">Periodização</h3>
              </div>
              <p className="font-semibold text-primary dark:text-dark-primary">{prescription.periodization_type}</p>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="bg-secondary hover:bg-secondary/80 text-white dark:bg-dark-secondary dark:hover:bg-dark-secondary/80 px-6 py-3 rounded-lg inline-flex items-center font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Imprimir Prescrição
            </button>
            <button
              onClick={() => {
                const data = JSON.stringify(prescription, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'prescricao-treino.json';
                a.click();
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 px-6 py-3 rounded-lg inline-flex items-center font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar JSON
            </button>
          </div>
        </div>

        {/* Microciclos */}
        {Object.entries(prescription)
          .filter(([key]) => key.toLowerCase().startsWith('microcycle'))
          .map(([microcycleName, microcycleData]) => (
            <MicrocycleCard
              key={microcycleName}
              microcycleName={microcycleName}
              microcycleData={microcycleData}
            />
          ))}
      </div>
    </div>
  );
};

export default FullPrescriptionView;