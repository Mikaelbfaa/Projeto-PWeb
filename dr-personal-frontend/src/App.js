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
  Dumbbell,
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
  error: null,
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
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

// Error Component
const ErrorMessage = ({ error, onDismiss }) => (
  <div className="bg-accent/20 border border-accent/30 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-accent mr-2" />
      <span className="text-primary">{error}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-accent hover:text-accent/80"
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
    <header className="bg-white text-primary shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
            className="flex items-center space-x-3 group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-primary/10">
              <Dumbbell className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FitnessPro AI
            </h1>
          </button>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-2">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: item.id })}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      state.currentPage === item.id 
                        ? 'bg-primary/10 text-primary'
                        : 'text-primary/80 hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform duration-300 ${
                      state.currentPage === item.id ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-primary/10"
          >
            <div className={`w-5 h-5 flex flex-col justify-center items-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
              <span className={`block w-5 h-0.5 bg-primary ${mobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary ${mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 pt-6 border-t border-primary/20">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch({ type: 'SET_PAGE', payload: item.id });
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                    state.currentPage === item.id 
                      ? 'bg-primary/10 text-primary'
                      : 'text-primary/80 hover:text-primary hover:bg-primary/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
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
      description: "IA avançada para análise de perfil e classificação automática de nível",
      color: "from-secondary to-accent",
      bgColor: "from-light to-white"
    },
    {
      icon: Heart,
      title: "Saúde Personalizada",
      description: "Adaptação baseada em condições de saúde e limitações físicas",
      color: "from-secondary to-accent",
      bgColor: "from-light to-white"
    },
    {
      icon: Calendar,
      title: "Progressão Temporal",
      description: "Planos com mesociclos e microciclos para evolução contínua",
      color: "from-secondary to-accent",
      bgColor: "from-light to-white"
    },
    {
      icon: Activity,
      title: "Otimização Científica",
      description: "Algoritmos de programação linear para seleção ideal de exercícios",
      color: "from-secondary to-accent",
      bgColor: "from-light to-white"
    }
  ];

  return (
    <div className="min-h-screen bg-dotted">
      <section className="bg-gradient-to-r from-primary to-secondary text-light py-32 relative overflow-hidden">
        
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-light/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-light/10 backdrop-blur-sm border border-light/20 mb-6">
              <Dumbbell className="h-16 w-16 text-light" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-light to-accent bg-clip-text text-transparent">
              Sistema de Prescrição
            </span>
            <br />
            <span className="bg-gradient-to-r from-accent to-light bg-clip-text text-transparent">
              Inteligente de Treinos
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-light/80">
            Gere planos de treino personalizados, 
            baseados em evidências científicas e adaptados às suas condições de saúde.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
              className="bg-accent text-primary px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-accent/80 transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-105 group"
            >
              Começar Avaliação
              <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'admin' })}
              className="bg-transparent border-2 border-light text-light px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-light hover:text-primary transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
            >
              Área Administrativa
            </button>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para criar o plano de treino perfeito para você
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`bg-gradient-to-br ${feature.bgColor} p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100`}>
                  <div className={`inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-primary mb-6 shadow-lg`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary to-secondary py-24 relative overflow-hidden">
        
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-light/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-light">
              Pronto para transformar seus treinos?
            </h2>
            <p className="text-xl md:text-2xl text-light/80 mb-12 leading-relaxed">
              Crie seu perfil completo e receba recomendações personalizadas em minutos.
            </p>
            
            
            
            <div className="mt-12 flex justify-center items-center space-x-8 text-light/80">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Cientificamente Validado</span>
              </div>
            </div>
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
            <div className="bg-gradient-to-r from-accent/20 to-accent/10 p-6 rounded-2xl border-2 border-accent/50 mb-6">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-accent text-primary mr-3">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-primary">Você é iniciante?</h3>
              </div>
              
              <p className="text-primary/80 mb-4 text-sm">
                Se você nunca fez musculação ou tem pouca experiência, marque esta opção para pular as etapas técnicas.
              </p>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="beginnerMode"
                    checked={isBeginnerMode}
                    onChange={() => handleBeginnerToggle(true)}
                    className="text-secondary focus:ring-secondary mr-2"
                  />
                  <span className="font-medium text-primary">Sim, sou iniciante</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="beginnerMode"
                    checked={!isBeginnerMode}
                    onChange={() => handleBeginnerToggle(false)}
                    className="text-secondary focus:ring-secondary mr-2"
                  />
                  <span className="font-medium text-gray-700">Tenho experiência</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID do Usuário
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
                      className="rounded border-gray-300 text-secondary focus:ring-secondary"
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
    return <LoadingSpinner message="Analisando seu perfil..." />;
  }

  return (
    <div className="min-h-screen bg-dotted py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-center mb-8 text-primary">Criação de Perfil</h1>
          
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id || (isBeginnerMode && (step.id === 2 || step.id === 3));
                const isSkipped = isBeginnerMode && (step.id === 2 || step.id === 3);
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isActive ? 'bg-secondary text-light' :
                      isSkipped ? 'bg-gray-200 text-gray-400' :
                      isCompleted ? 'bg-accent text-primary' : 'bg-gray-300'
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
                      isActive ? 'text-secondary' : 
                      isSkipped ? 'text-gray-400' :
                      isCompleted ? 'text-accent' : 'text-gray-500'
                    }`}>
                      {step.title}
                      {isSkipped && ' (Pulado)'}
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
            
            {(isBeginnerMode && currentStep === 1) || (!isBeginnerMode && currentStep < steps.length) ? (
              <button
                onClick={() => {
                  if (isBeginnerMode && currentStep === 1) {
                    setCurrentStep(4); // Pula para o step de saúde
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="flex items-center px-4 py-2 bg-secondary text-light rounded-lg hover:bg-secondary/80"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center px-6 py-2 bg-accent text-primary rounded-lg hover:bg-accent/80"
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
      <h3 className="text-lg font-semibold mb-2 text-primary">{title}</h3>
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
              className="text-secondary"
            />
            <span className={option === recommended ? 'font-semibold text-secondary' : 'text-gray-700'}>
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
      <div className="min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Nenhuma prescrição encontrada</h2>
          <p className="text-gray-600 mb-6">Primeiro você precisa criar um perfil.</p>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
            className="bg-secondary text-light px-6 py-3 rounded-lg hover:bg-secondary/80"
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
    <div className="min-h-screen bg-dotted py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-primary">Opções de Prescrição</h1>
          <p className="text-center text-gray-600 mb-8">
            Seu nível foi classificado como: <span className="font-semibold text-secondary">
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

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-lg font-semibold mb-2 text-primary">Duração do Mesociclo</h3>
              <p className="text-sm text-gray-600 mb-4">Duração total do plano em semanas</p>
              
              <select
                value={selectedOptions.mesocycle_duration}
                onChange={(e) => handleOptionChange('mesocycle_duration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
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
              className="bg-accent text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/80 transition-colors inline-flex items-center"
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
    <div className="bg-gradient-to-br from-white to-light/50 p-6 rounded-2xl border border-light/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-xl bg-secondary/20 text-secondary mr-3">
          <Activity className="h-5 w-5" />
        </div>
        <h4 className="font-bold text-lg text-primary">{exercise.name}</h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary/10 p-3 rounded-lg">
          <div className="text-xs text-secondary font-medium uppercase tracking-wider">Séries</div>
          <div className="text-xl font-bold text-secondary/80">{exercise.sets}</div>
        </div>
        <div className="bg-accent/10 p-3 rounded-lg">
          <div className="text-xs text-accent font-medium uppercase tracking-wider">Repetições</div>
          <div className="text-xl font-bold text-accent/80">{exercise.repetitions.min}-{exercise.repetitions.max}</div>
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <div className="text-xs text-primary font-medium uppercase tracking-wider">Pausa</div>
          <div className="text-sm font-semibold text-primary/80">{exercise.pause_time}</div>
        </div>
        <div className="bg-light/50 p-3 rounded-lg">
          <div className="text-xs text-gray-600 font-medium uppercase tracking-wider">Tipo</div>
          <div className="text-sm font-semibold text-gray-700 capitalize">{exercise.exercise_type}</div>
        </div>
      </div>
    </div>
  );

  const TrainingDayCard = ({ dayName, dayData }) => (
    <div className="bg-gradient-to-br from-white to-secondary/20 p-8 rounded-3xl shadow-xl border border-secondary/30 hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-secondary to-accent text-primary mr-4 shadow-lg">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold text-primary uppercase tracking-wide">{dayName}</h3>
      </div>
      
      <div className="space-y-4">
        {dayData.exercises.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-secondary/30">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {dayData.exercises.length} exercícios
          </span>
          <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full font-medium">
            Dia {dayName}
          </span>
        </div>
      </div>
    </div>
  );

  const MicrocycleCard = ({ microcycleName, microcycleData }) => {
    const trainingParams = microcycleData[0] && microcycleData[0].training_parameters;
    const trainingDays = microcycleData.slice(1);

    return (
      <div className="bg-gradient-to-br from-white to-light/50 rounded-3xl shadow-2xl p-10 mb-12 border border-light/30 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-secondary to-accent text-primary mb-4 shadow-lg">
            <BarChart3 className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
            {microcycleName.replace('_', ' ').toUpperCase()}
          </h2>
        </div>
        
        {trainingParams && (
          <div className="bg-gradient-to-r from-light/50 to-white/50 p-8 rounded-3xl mb-8 border border-light/30 shadow-inner">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-xl bg-secondary/20 text-secondary mr-3">
                <Settings className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Parâmetros de Treino</h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-secondary font-bold uppercase tracking-wider mb-2">Manifestação</div>
                <div className="text-sm font-semibold text-gray-700">{trainingParams.strength_manifestation}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-accent font-bold uppercase tracking-wider mb-2">Intensidade</div>
                <div className="text-sm font-semibold text-gray-700">{trainingParams.maximum_strength}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-primary font-bold uppercase tracking-wider mb-2">Séries</div>
                <div className="text-lg font-bold text-primary/80">{trainingParams.sets}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-accent font-bold uppercase tracking-wider mb-2">Repetições</div>
                <div className="text-lg font-bold text-accent/80">{trainingParams.repetitions.min}-{trainingParams.repetitions.max}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-red-600 font-bold uppercase tracking-wider mb-2">Pausa</div>
                <div className="text-sm font-semibold text-gray-700">{trainingParams.pause_time}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-2">Tempo Concêntrico</div>
                <div className="text-sm font-semibold text-gray-700">{trainingParams.concentric_contraction_time}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
    <div className="min-h-screen bg-gradient-to-br from-light via-white to-light/50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-gradient-to-br from-white to-light/50 rounded-3xl shadow-2xl p-12 mb-12 border border-light/30 backdrop-blur-sm">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-r from-secondary to-accent text-primary mb-6 shadow-lg">
              <FileText className="h-10 w-10" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-4">
              Sua Prescrição de Treino
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Plano personalizado gerado com inteligência artificial baseado no seu perfil
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 rounded-2xl border border-secondary/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-secondary text-light mr-3">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-secondary/80">Divisão</h3>
              </div>
              <p className="text-secondary/90 font-semibold text-lg">{prescription.division_type}</p>
            </div>
            
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 p-6 rounded-2xl border border-accent/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-accent text-primary mr-3">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-accent/80">Sequência</h3>
              </div>
              <p className="text-accent/90 font-semibold text-lg">{prescription.sequency_type}</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary/20 to-primary/10 p-6 rounded-2xl border border-primary/30 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-primary text-light mr-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-primary/80">Periodização</h3>
              </div>
              <p className="text-primary/90 font-semibold text-lg">{prescription.periodization_type}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <button
              onClick={() => window.print()}
              className="bg-gradient-to-r from-secondary to-accent text-primary px-8 py-4 rounded-2xl hover:from-accent hover:to-secondary inline-flex items-center justify-center font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Download className="mr-3 h-5 w-5" />
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
              className="bg-gradient-to-r from-accent to-secondary text-primary px-8 py-4 rounded-2xl hover:from-secondary hover:to-accent inline-flex items-center justify-center font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Download className="mr-3 h-5 w-5" />
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
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grupos Musculares</p>
              <p className="text-3xl font-bold">47</p>
              <p className="text-sm text-green-600">+2 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-secondary/20 text-secondary">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Exercícios</p>
              <p className="text-3xl font-bold">245</p>
              <p className="text-sm text-green-600">+12 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-accent/20 text-accent">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prescrições</p>
              <p className="text-3xl font-bold">1,247</p>
              <p className="text-sm text-green-600">+89 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-primary/20 text-primary">
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
            className="bg-secondary text-light px-4 py-2 rounded-lg hover:bg-secondary/80 inline-flex items-center"
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
                className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"
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
                  className="px-4 py-2 bg-secondary text-light rounded-lg hover:bg-secondary/80"
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
    <div className="min-h-screen bg-dotted">
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
                      ? 'border-secondary text-secondary'
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
      <div className="min-h-screen transition-colors duration-300 bg-light text-primary">
        <Header />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;