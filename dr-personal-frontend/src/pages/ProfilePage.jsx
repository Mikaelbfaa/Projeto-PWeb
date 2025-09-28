import React, { useState, useContext } from 'react';
import { User, TrendingUp, Activity, Heart, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import apiService from '../services/apiService';
import mockService from '../services/mockService';
import { HEALTH_CONDITIONS, PROFILE_STEPS } from '../constants';
import { validateFormData, sanitizeFormData, getErrorMessage } from '../utils/validation';

const ProfilePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);
  const [formData, setFormData] = useState({
    id: `user_${Date.now()}`,
    gender: 'MALE',
    birth_date: '',
    weekly_frequency: 3,
    session_time: 60,
    uninterrupted_training_time: 0,
    detraining: 0,
    previous_experience: 0,
    technique: 'REGULAR',
    strength_values: {
      bench_press: 0,
      lat_pulldown: 0,
      squat: 0,
      deadlift: 0,
      handgrip_dynamometer: 0
    },
    health_conditions: []
  });

  const handleInputChange = (field, value) => {
    const processedValue = field.includes('weekly_frequency') || field.includes('session_time') || 
                          field.includes('uninterrupted_training_time') || field.includes('detraining') || 
                          field.includes('previous_experience') || field.includes('strength_values')
      ? (value === '' ? 0 : Number(value))
      : value;

    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: processedValue
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: processedValue }));
    }
  };

  const handleHealthConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      health_conditions: prev.health_conditions.includes(condition)
        ? prev.health_conditions.filter(c => c !== condition)
        : [...prev.health_conditions, condition]
    }));
  };

  const handleBeginnerToggle = (isBeginner) => {
    setIsBeginnerMode(isBeginner);
    if (isBeginner) {
      setFormData(prev => ({
        ...prev,
        uninterrupted_training_time: 0,
        detraining: 0,
        previous_experience: 0,
        technique: 'BAD',
        strength_values: {
          bench_press: 0,
          lat_pulldown: 0,
          squat: 0,
          deadlift: 0,
          handgrip_dynamometer: 0
        }
      }));
    }
  };

  const handleSubmit = async () => {
    const validationErrors = validateFormData(formData);
    if (validationErrors.length > 0) {
      dispatch({ type: 'SET_ERROR', payload: `Dados inválidos: ${validationErrors.join(', ')}` });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const sanitizedFormData = sanitizeFormData(formData);

      // Usa dados mockados se estiver em modo demo
      const service = state.demoMode ? mockService : apiService;
      const response = await service.generatePartialPrescription({ profile: sanitizedFormData });

      dispatch({ type: 'SET_PARTIAL_PRESCRIPTION', payload: response });
      dispatch({ type: 'SET_USER_PROFILE', payload: sanitizedFormData });
      dispatch({ type: 'SET_PAGE', payload: 'prescription' });
    } catch (error) {
      console.error('Error generating partial prescription:', error);
      console.log('Error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        demoMode: state.demoMode
      });

      // Verifica se é erro de conectividade e não está em modo demo
      const additionalInfo = error.responseInfo || {};
      if (apiService.isConnectivityError(error, additionalInfo) && !state.demoMode) {
        console.log('Detected connectivity error, showing offline modal');
        dispatch({ type: 'SHOW_OFFLINE_MODAL', payload: error.message });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Se chegou até aqui, é um erro real do servidor ou estamos em modo demo
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-6 rounded-2xl border-2 border-accent/50 mb-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-secondary dark:bg-dark-secondary text-light mr-3">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-primary dark:text-dark-primary">Você é iniciante?</h3>
              </div>
              
              <p className="text-primary/80 dark:text-dark-primary/80 mb-4 text-sm">
                Se você nunca fez musculação ou tem pouca experiência, marque esta opção para pular as etapas técnicas.
              </p>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="beginnerMode"
                    checked={isBeginnerMode}
                    onChange={() => handleBeginnerToggle(true)}
                    className="text-secondary dark:text-dark-secondary focus:ring-secondary dark:focus:ring-dark-secondary mr-2"
                  />
                  <span className="font-medium text-primary dark:text-dark-primary">Sim, sou iniciante</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="beginnerMode"
                    checked={!isBeginnerMode}
                    onChange={() => handleBeginnerToggle(false)}
                    className="text-secondary dark:text-dark-secondary focus:ring-secondary dark:focus:ring-dark-secondary mr-2"
                  />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tenho experiência</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID do Usuário
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                placeholder="Digite seu ID único"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gênero
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequência Semanal
                </label>
                <input
                  type="number"
                  value={formData.weekly_frequency}
                  onChange={(e) => handleInputChange('weekly_frequency', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="1"
                  max="7"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duração da Sessão (min)
                </label>
                <input
                  type="number"
                  value={formData.session_time}
                  onChange={(e) => handleInputChange('session_time', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="15"
                  max="180"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tempo Ininterrupto de Treino (meses)
              </label>
              <input
                type="number"
                value={formData.uninterrupted_training_time}
                onChange={(e) => handleInputChange('uninterrupted_training_time', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Período de Destreino (meses)
              </label>
              <input
                type="number"
                value={formData.detraining}
                onChange={(e) => handleInputChange('detraining', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Experiência Prévia (anos)
              </label>
              <input
                type="number"
                value={formData.previous_experience}
                onChange={(e) => handleInputChange('previous_experience', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                min="0"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nível Técnico
              </label>
              <select
                value={formData.technique}
                onChange={(e) => handleInputChange('technique', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
              >
                <option value="BAD">Ruim</option>
                <option value="REGULAR">Médio</option>
                <option value="GOOD">Bom</option>
                <option value="EXCELLENT">Excelente</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Informe suas cargas máximas nos exercícios principais (em kg). Deixe em 0 se não souber.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Supino (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.bench_press}
                  onChange={(e) => handleInputChange('strength_values.bench_press', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Puxada Alta (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.lat_pulldown}
                  onChange={(e) => handleInputChange('strength_values.lat_pulldown', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agachamento (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.squat}
                  onChange={(e) => handleInputChange('strength_values.squat', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Levantamento Terra (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.deadlift}
                  onChange={(e) => handleInputChange('strength_values.deadlift', e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-secondary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
                  min="0"
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Condições de Saúde
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Selecione as condições de saúde que se aplicam ao seu caso:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {HEALTH_CONDITIONS.map(condition => (
                  <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.health_conditions.includes(condition)}
                      onChange={() => handleHealthConditionToggle(condition)}
                      className="rounded border-gray-300 text-secondary dark:text-dark-secondary focus:ring-secondary dark:focus:ring-dark-secondary"
                    />
                    <span className="text-sm dark:text-dark-primary">{condition}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (state.loading) {
    return <LoadingSpinner message="Analisando seu perfil..." />;
  }

  return (
    <div className="min-h-screen py-8 bg-dotted dark:bg-dark-bg-primary">
      <div className="container mx-auto px-4 max-w-4xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white border-gray-200 dark:bg-dark-bg-secondary dark:border-gray-700 rounded-lg shadow-lg p-8 border">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary dark:text-dark-accent">Criação de Perfil</h1>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {PROFILE_STEPS.map((step, index) => {
                const iconMap = {
                  1: User,
                  2: TrendingUp,
                  3: Activity,
                  4: Heart
                };
                const Icon = iconMap[step.id];
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id || (isBeginnerMode && (step.id === 2 || step.id === 3));
                const isSkipped = isBeginnerMode && (step.id === 2 || step.id === 3);
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive ? 'bg-secondary text-light dark:bg-dark-secondary' :
                      isSkipped ? 'bg-gray-200 text-gray-400' :
                      isCompleted ? 'bg-accent text-primary dark:bg-dark-accent dark:text-dark-primary' : 'bg-gray-300'
                    }`}>
                      {isCompleted && !isSkipped ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : isSkipped ? (
                        <span className="text-xs">—</span>
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-secondary dark:text-dark-secondary' : 
                      isSkipped ? 'text-gray-400' :
                      isCompleted ? 'text-accent dark:text-dark-accent' : 'text-gray-500 dark:text-gray-200'
                    }`}>
                      {step.title}
                      {isSkipped && ' (Pulado)'}
                    </span>
                    
                    {index < PROFILE_STEPS.length - 1 && (
                      <ChevronRight className="ml-4 h-4 w-4 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            {renderStep()}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                if (isBeginnerMode && currentStep === 4) {
                  setCurrentStep(1);
                } else {
                  setCurrentStep(prev => Math.max(1, prev - 1));
                }
              }}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </button>
            
            {(isBeginnerMode && currentStep === 1) || (!isBeginnerMode && currentStep < PROFILE_STEPS.length) ? (
              <button
                onClick={() => {
                  if (isBeginnerMode && currentStep === 1) {
                    setCurrentStep(4);
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-secondary text-light dark:bg-dark-secondary rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-secondary text-light rounded-lg hover:bg-secondary/80"
              >
                Gerar Prescrição
                <CheckCircle className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;