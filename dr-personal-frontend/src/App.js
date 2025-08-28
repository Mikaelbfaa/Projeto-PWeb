import React, { useState, useContext, createContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Activity, 
  Settings, 
  Heart, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Users, 
  Database,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  Home,
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  Dumbbell
} from 'lucide-react';

// Context for global state management
const AppContext = createContext();

// Initial state
const initialState = {
  currentUser: null,
  currentPage: 'home',
  userProfile: null,
  partialPrescription: null,
  fullPrescription: null,
  adminData: {
    muscleGroups: [],
    strengthExercises: [],
    preparationExercises: [],
    healthConditions: [],
    routines: []
  },
  loading: false,
  error: null
};

// Reducer for state management
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_PARTIAL_PRESCRIPTION':
      return { ...state, partialPrescription: action.payload };
    case 'SET_FULL_PRESCRIPTION':
      return { ...state, fullPrescription: action.payload };
    case 'SET_ADMIN_DATA':
      return { 
        ...state, 
        adminData: { ...state.adminData, [action.dataType]: action.payload } 
      };
    default:
      return state;
  }
}

// Mock API service
const apiService = {
  generatePartialPrescription: async (profile) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const trainingTime = profile.profile.uninterrupted_training_time;
    let level = "BEGINNER";
    if (trainingTime > 24) {
      level = "ADVANCED";
    } else if (trainingTime > 12) {
      level = "INTERMEDIATE";
    }
    
    return {
      db_return: "Profile created successfully",
      level: level,
      training_method: {
        recommended: "SA-SB-SU",
        options: ["SA-SB-SU", "Full Body", "SA-SB-SA-SB", "Push-Pull-Legs"]
      },
      division_type: {
        recommended: "Upper and Lower",
        options: ["Upper and Lower", "Push and Pull", "Full Body", "By Muscle Group"]
      },
      sequency_type: {
        recommended: "Conventional",
        options: ["Conventional", "Inverted", "Alternated by Segment"]
      },
      periodization_type: {
        recommended: "Linear",
        options: ["Linear", "Undulating", "Block", "Reverse Linear"]
      },
      mesocycle_duration: {
        recommended: 8,
        options: [6, 8, 10, 12]
      },
      progression_status: trainingTime > 0 ? {
        recommended: "progression",
        options: ["progression", "stagnated"]
      } : null
    };
  },

  generateFullPrescription: async (request) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    return {
      division_type: request.division_type,
      sequency_type: request.sequency_type,
      periodization_type: request.periodization_type,
      microcycle_1: [
        {
          training_parameters: {
            strength_manifestation: "Hypertrophy Strength",
            maximum_strength: "65-75%",
            sets: 3,
            repetitions: { min: 8, max: 12 },
            pause_time: "90-120s",
            concentric_contraction_time: "2s",
            eccentric_contraction_time: "3s",
            execution_method: "Controlled"
          }
        },
        {
          SA: {
            exercises: [
              {
                exercise_id: "SA01",
                name: "Supino reto com barra",
                exercise_type: "strength",
                sets: 3,
                repetitions: { min: 8, max: 12 },
                pause_time: "90-120s"
              },
              {
                exercise_id: "SA02",
                name: "Desenvolvimento com halteres",
                exercise_type: "strength",
                sets: 3,
                repetitions: { min: 10, max: 15 },
                pause_time: "60-90s"
              }
            ]
          }
        },
        {
          SB: {
            exercises: [
              {
                exercise_id: "SB01",
                name: "Agachamento livre",
                exercise_type: "strength",
                sets: 3,
                repetitions: { min: 8, max: 12 },
                pause_time: "90-120s"
              },
              {
                exercise_id: "SB02",
                name: "Levantamento terra",
                exercise_type: "strength",
                sets: 3,
                repetitions: { min: 6, max: 10 },
                pause_time: "120-150s"
              }
            ]
          }
        }
      ]
    };
  },

  syncMuscleGroups: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { 
      inserted_muscles: Array.isArray(data) ? data.length : 10,
      deleted_muscles: 5
    };
  }
};

// Loading Component
const LoadingSpinner = ({ message = "Carregando..." }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

// Error Component
const ErrorMessage = ({ error, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
      <span className="text-red-800">{error}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      )}
    </div>
  </div>
);

// Header Component
const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'profile', label: 'Criar Perfil', icon: UserPlus },
    { id: 'prescription', label: 'Prescrições', icon: FileText },
    { id: 'admin', label: 'Administração', icon: Settings }
  ];

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8" />
            <h1 className="text-xl font-bold">FitnessPro AI</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                  className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
                    state.currentPage === item.id 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-blue-500 transition-colors"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-blue-500 pt-4">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: 'SET_PAGE', payload: item.id });
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-3 rounded transition-colors ${
                    state.currentPage === item.id 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};

// Home Page
const HomePage = () => {
  const { dispatch } = useContext(AppContext);

  const features = [
    {
      icon: TrendingUp,
      title: "Análise Inteligente",
      description: "IA avançada para análise de perfil e classificação automática de nível"
    },
    {
      icon: Heart,
      title: "Saúde Personalizada",
      description: "Adaptação baseada em condições de saúde e limitações físicas"
    },
    {
      icon: Calendar,
      title: "Progressão Temporal",
      description: "Planos com mesociclos e microciclos para evolução contínua"
    },
    {
      icon: Activity,
      title: "Otimização Científica",
      description: "Algoritmos de programação linear para seleção ideal de exercícios"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Sistema de Prescrição Inteligente de Treinos
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Utilize inteligência artificial para gerar planos de treino personalizados, 
            baseados em evidências científicas e adaptados às suas condições de saúde.
          </p>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
            className="bg-white text-blue-600 px-6 md:px-8 py-3 md:py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Começar Avaliação
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Funcionalidades Principais</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Crie seu perfil completo e receba recomendações personalizadas em minutos.
          </p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Perfil
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'admin' })}
              className="border border-gray-400 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Área Administrativa
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Profile Creation Page
const ProfilePage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: `user_${Date.now()}`,
    gender: 'MALE',
    birth_date: '',
    weekly_frequency: 3,
    session_time: 60,
    uninterrupted_training_time: 0,
    detraining: 0,
    previous_experience: 0,
    technique: 'AVERAGE',
    strength_values: {
      bench_press: 0,
      lat_pulldown: 0,
      squat: 0,
      deadlift: 0,
      handgrip_dynamometer: 0
    },
    health_conditions: []
  });

  const steps = [
    { id: 1, title: 'Dados Pessoais', icon: User },
    { id: 2, title: 'Experiência', icon: TrendingUp },
    { id: 3, title: 'Força', icon: Activity },
    { id: 4, title: 'Saúde', icon: Heart }
  ];

  const healthConditionsOptions = [
    'tendinopatia do supraespinal',
    'lombalgia crônica',
    'artrose de joelho',
    'tendinite de aquiles',
    'síndrome do túnel do carpo',
    'hérnia de disco'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.generatePartialPrescription({ profile: formData });
      dispatch({ type: 'SET_PARTIAL_PRESCRIPTION', payload: response });
      dispatch({ type: 'SET_USER_PROFILE', payload: formData });
      dispatch({ type: 'SET_PAGE', payload: 'prescription' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao gerar prescrição parcial' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID do Usuário
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite seu ID único"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gênero
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MALE">Masculino</option>
                <option value="FEMALE">Feminino</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência Semanal
                </label>
                <input
                  type="number"
                  value={formData.weekly_frequency}
                  onChange={(e) => handleInputChange('weekly_frequency', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="7"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duração da Sessão (min)
                </label>
                <input
                  type="number"
                  value={formData.session_time}
                  onChange={(e) => handleInputChange('session_time', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempo Ininterrupto de Treino (meses)
              </label>
              <input
                type="number"
                value={formData.uninterrupted_training_time}
                onChange={(e) => handleInputChange('uninterrupted_training_time', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Período de Destreino (meses)
              </label>
              <input
                type="number"
                value={formData.detraining}
                onChange={(e) => handleInputChange('detraining', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="120"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiência Prévia (anos)
              </label>
              <input
                type="number"
                value={formData.previous_experience}
                onChange={(e) => handleInputChange('previous_experience', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível Técnico
              </label>
              <select
                value={formData.technique}
                onChange={(e) => handleInputChange('technique', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BAD">Ruim</option>
                <option value="AVERAGE">Médio</option>
                <option value="GOOD">Bom</option>
                <option value="EXCELLENT">Excelente</option>
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600 mb-4">
              Informe suas cargas máximas nos exercícios principais (em kg). Deixe em 0 se não souber.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supino (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.bench_press}
                  onChange={(e) => handleInputChange('strength_values.bench_press', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puxada Alta (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.lat_pulldown}
                  onChange={(e) => handleInputChange('strength_values.lat_pulldown', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agachamento (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.squat}
                  onChange={(e) => handleInputChange('strength_values.squat', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Levantamento Terra (kg)
                </label>
                <input
                  type="number"
                  value={formData.strength_values.deadlift}
                  onChange={(e) => handleInputChange('strength_values.deadlift', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Condições de Saúde
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Selecione as condições de saúde que se aplicam ao seu caso:
              </p>
              
              <div className="grid md:grid-cols-2 gap-3">
                {healthConditionsOptions.map(condition => (
                  <label key={condition} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.health_conditions.includes(condition)}
                      onChange={() => handleHealthConditionToggle(condition)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{condition}</span>
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
    return <LoadingSpinner message="Analisando seu perfil com IA..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">Criação de Perfil</h1>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive ? 'bg-blue-600 text-white' :
                      isCompleted ? 'bg-green-600 text-white' : 'bg-gray-300'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                    
                    {index < steps.length - 1 && (
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
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
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

// Prescription Options Page
const PrescriptionPage = () => {
  const { state, dispatch } = useContext(AppContext);
  const [selectedOptions, setSelectedOptions] = useState({
    training_method: '',
    division_type: '',
    sequency_type: '',
    periodization_type: '',
    mesocycle_duration: 0,
    progression_status: ''
  });
  const [showFullPrescription, setShowFullPrescription] = useState(false);

  useEffect(() => {
    if (state.partialPrescription) {
      setSelectedOptions({
        training_method: state.partialPrescription.training_method.recommended,
        division_type: state.partialPrescription.division_type.recommended,
        sequency_type: state.partialPrescription.sequency_type.recommended,
        periodization_type: state.partialPrescription.periodization_type.recommended,
        mesocycle_duration: state.partialPrescription.mesocycle_duration.recommended,
        progression_status: state.partialPrescription.progression_status ? state.partialPrescription.progression_status.recommended : ''
      });
    }
  }, [state.partialPrescription]);

  const handleOptionChange = (field, value) => {
    setSelectedOptions(prev => ({ ...prev, [field]: value }));
  };

  const generateFullPrescription = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const request = {
        user_id: state.userProfile.id,
        training_method: selectedOptions.training_method,
        division_type: selectedOptions.division_type,
        sequency_type: selectedOptions.sequency_type,
        periodization_type: selectedOptions.periodization_type,
        mesocycle_duration: selectedOptions.mesocycle_duration,
        progression_status: selectedOptions.progression_status || null
      };
      
      const response = await apiService.generateFullPrescription(request);
      dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: response });
      setShowFullPrescription(true);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao gerar prescrição completa' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const OptionSelector = ({ title, field, options, recommended, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
      
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={field}
              value={option}
              checked={selectedOptions[field] === option}
              onChange={(e) => handleOptionChange(field, e.target.value)}
              className="text-blue-600"
            />
            <span className={option === recommended ? 'font-semibold text-blue-600' : ''}>
              {option}
              {option === recommended && ' (Recomendado)'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  if (!state.partialPrescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhuma prescrição encontrada</h2>
          <p className="text-gray-600 mb-6">Primeiro você precisa criar um perfil.</p>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Criar Perfil
          </button>
        </div>
      </div>
    );
  }

  if (state.loading) {
    return <LoadingSpinner message="Gerando plano de treino completo..." />;
  }

  if (showFullPrescription && state.fullPrescription) {
    return <FullPrescriptionView />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Opções de Prescrição</h1>
          <p className="text-center text-gray-600 mb-8">
            Seu nível foi classificado como: <span className="font-semibold text-blue-600">
              {state.partialPrescription.level}
            </span>
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <OptionSelector
              title="Método de Treino"
              field="training_method"
              options={state.partialPrescription.training_method.options}
              recommended={state.partialPrescription.training_method.recommended}
              description="Estrutura de divisão dos treinos na semana"
            />

            <OptionSelector
              title="Tipo de Divisão"
              field="division_type"
              options={state.partialPrescription.division_type.options}
              recommended={state.partialPrescription.division_type.recommended}
              description="Como os grupos musculares serão organizados"
            />

            <OptionSelector
              title="Tipo de Sequência"
              field="sequency_type"
              options={state.partialPrescription.sequency_type.options}
              recommended={state.partialPrescription.sequency_type.recommended}
              description="Ordem de execução dos exercícios"
            />

            <OptionSelector
              title="Periodização"
              field="periodization_type"
              options={state.partialPrescription.periodization_type.options}
              recommended={state.partialPrescription.periodization_type.recommended}
              description="Modelo de progressão ao longo do tempo"
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Duração do Mesociclo</h3>
              <p className="text-sm text-gray-600 mb-4">Duração total do plano em semanas</p>
              
              <select
                value={selectedOptions.mesocycle_duration}
                onChange={(e) => handleOptionChange('mesocycle_duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {state.partialPrescription.mesocycle_duration.options.map(duration => (
                  <option key={duration} value={duration}>
                    {duration} semanas
                    {duration === state.partialPrescription.mesocycle_duration.recommended ? ' (Recomendado)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {state.partialPrescription.progression_status && (
              <OptionSelector
                title="Status de Progressão"
                field="progression_status"
                options={state.partialPrescription.progression_status.options}
                recommended={state.partialPrescription.progression_status.recommended}
                description="Status atual da sua evolução"
              />
            )}
          </div>

          <div className="text-center">
            <button
              onClick={generateFullPrescription}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Gerar Plano Completo
              <FileText className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Full Prescription View
const FullPrescriptionView = () => {
  const { state } = useContext(AppContext);
  const prescription = state.fullPrescription;

  const ExerciseCard = ({ exercise }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
        <div>Séries: {exercise.sets}</div>
        <div>Repetições: {exercise.repetitions.min}-{exercise.repetitions.max}</div>
        <div>Pausa: {exercise.pause_time}</div>
        <div>Tipo: {exercise.exercise_type}</div>
      </div>
    </div>
  );

  const TrainingDayCard = ({ dayName, dayData }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-blue-600">{dayName}</h3>
      <div className="space-y-3">
        {dayData.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );

  const MicrocycleCard = ({ microcycleName, microcycleData }) => {
    const trainingParams = microcycleData[0] && microcycleData[0].training_parameters;
    const trainingDays = microcycleData.slice(1);

    return (
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{microcycleName.replace('_', ' ').toUpperCase()}</h2>
        
        {trainingParams && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Parâmetros de Treino</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Manifestação:</span>
                <br />
                {trainingParams.strength_manifestation}
              </div>
              <div>
                <span className="font-medium">Intensidade:</span>
                <br />
                {trainingParams.maximum_strength}
              </div>
              <div>
                <span className="font-medium">Séries:</span>
                <br />
                {trainingParams.sets}
              </div>
              <div>
                <span className="font-medium">Repetições:</span>
                <br />
                {trainingParams.repetitions.min}-{trainingParams.repetitions.max}
              </div>
              <div>
                <span className="font-medium">Pausa:</span>
                <br />
                {trainingParams.pause_time}
              </div>
              <div>
                <span className="font-medium">Tempo Concêntrico:</span>
                <br />
                {trainingParams.concentric_contraction_time}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingDays.map((dayObj, index) => {
            const [dayName, dayData] = Object.entries(dayObj)[0];
            return (
              <TrainingDayCard
                key={index}
                dayName={dayName}
                dayData={dayData}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-center mb-6">Sua Prescrição de Treino</h1>
          
          <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-600">Divisão</h3>
              <p>{prescription.division_type}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-600">Sequência</h3>
              <p>{prescription.sequency_type}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-600">Periodização</h3>
              <p>{prescription.periodization_type}</p>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Imprimir
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar JSON
            </button>
          </div>
        </div>

        {Object.entries(prescription)
          .filter(([key]) => key.startsWith('microcycle'))
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

// Admin Dashboard
const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'muscle-groups', label: 'Grupos Musculares', icon: Users },
    { id: 'exercises', label: 'Exercícios', icon: Activity }
  ];

  const AdminDashboard = () => (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grupos Musculares</p>
              <p className="text-3xl font-bold">47</p>
              <p className="text-sm text-green-600">+2 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exercícios</p>
              <p className="text-3xl font-bold">245</p>
              <p className="text-sm text-green-600">+12 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prescrições</p>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-sm text-green-600">+89 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sistema em Funcionamento</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>API Backend</span>
            </div>
            <span className="text-green-600 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Banco de Dados</span>
            </div>
            <span className="text-green-600 font-medium">Conectado</span>
          </div>
        </div>
      </div>
    </div>
  );

  const MuscleGroupsAdmin = () => {
    const [showUploadModal, setShowUploadModal] = useState(false);

    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciamento de Grupos Musculares</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Sincronizar Dados
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Informações</h2>
          <p className="text-gray-600">
            Use este painel para sincronizar grupos musculares. A sincronização substitui 
            completamente todos os dados existentes.
          </p>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Sincronizar Grupos Musculares</h2>
              <p className="text-gray-600 mb-4">Cole os dados JSON dos grupos musculares:</p>
              
              <textarea
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"muscle_groups": [{"id": "1", "name": "bíceps", ...}]}'
              />
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sincronizar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ExercisesAdmin = () => (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gerenciamento de Exercícios</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Funcionalidade de gerenciamento de exercícios em desenvolvimento.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
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
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
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
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'muscle-groups' && <MuscleGroupsAdmin />}
        {activeTab === 'exercises' && <ExercisesAdmin />}
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const renderPage = () => {
    switch (state.currentPage) {
      case 'home':
        return <HomePage />;
      case 'profile':
        return <ProfilePage />;
      case 'prescription':
        return <PrescriptionPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          {renderPage()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;