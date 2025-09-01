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
  Moon,
  Sun,
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
  prescriptionHistory: [],
  adminData: {
    muscleGroups: [],
    strengthExercises: [],
    preparationExercises: [],
    healthConditions: [],
    routines: []
  },
  loading: false,
  error: null,
  darkTheme: localStorage.getItem('darkTheme') === 'true',
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
    case 'ADD_TO_PRESCRIPTION_HISTORY':
      const newPrescription = {
        id: Date.now(),
        createdAt: new Date().toLocaleString('pt-BR'),
        userProfile: action.userProfile,
        partialPrescription: action.partialPrescription,
        fullPrescription: action.fullPrescription
      };
      return { 
        ...state, 
        prescriptionHistory: [newPrescription, ...state.prescriptionHistory] 
      };
    case 'SET_ADMIN_DATA':
      return { 
        ...state, 
        adminData: { ...state.adminData, [action.dataType]: action.payload } 
      };
    case 'TOGGLE_DARK_THEME':
      return { ...state, darkTheme: !state.darkTheme };
    default:
      return state;
  }
}

// API service
const apiService = {
  generatePartialPrescription: async (profileData) => {
    try {
      console.log('Sending data to API:', profileData); // Debug log
      
      const response = await fetch('/api/prescription/generate-partial-prescription', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            id: profileData.profile.id,
            gender: profileData.profile.gender.toLowerCase(),
            birth_date: profileData.profile.birth_date,
            weekly_frequency: Number(profileData.profile.weekly_frequency),
            session_time: Number(profileData.profile.session_time),
            uninterrupted_training_time: Number(profileData.profile.uninterrupted_training_time),
            detraining: Number(profileData.profile.detraining),
            previous_experience: Number(profileData.profile.previous_experience),
            technique: profileData.profile.technique.toLowerCase(),
            strength_values: {
              bench_press: Number(profileData.profile.strength_values.bench_press),
              lat_pulldown: Number(profileData.profile.strength_values.lat_pulldown),
              squat: Number(profileData.profile.strength_values.squat),
              deadlift: Number(profileData.profile.strength_values.deadlift),
              handgrip_dynamometer: Number(profileData.profile.strength_values.handgrip_dynamometer)
            },
            health_conditions: profileData.profile.health_conditions
          }
        })
      });

      if (!response.ok) {
        let errorDetail = '';
        try {
          const errorBody = await response.text();
          console.error('API Error Response:', errorBody); // Debug log
          errorDetail = errorBody ? ` - ${errorBody}` : '';
        } catch (e) {
          // Ignore error parsing response body
        }
        throw new Error(`HTTP error! status: ${response.status}${errorDetail}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling generatePartialPrescription API:', error);
      throw error;
    }
  },

  generateFullPrescription: async (request) => {
    try {
      const response = await fetch('/api/prescription/generate-prescription', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          user_id: request.user_id,
          training_method: request.training_method,
          division_type: request.division_type,
          sequency_type: request.sequency_type,
          periodization_type: request.periodization_type,
          mesocycle_duration: request.mesocycle_duration
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling generateFullPrescription API:', error);
      throw error;
    }
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
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary dark:border-dark-secondary"></div>
    <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
  </div>
);

// Error Component
const ErrorMessage = ({ error, onDismiss }) => (
  <div className="bg-accent/20 dark:bg-dark-accent/20 border border-accent/30 dark:border-dark-accent/30 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="h-5 w-5 text-accent dark:text-dark-accent mr-2" />
      <span className="text-primary dark:text-dark-primary">{error}</span>
      {onDismiss && (
        <button 
          onClick={onDismiss}
          className="ml-auto text-accent dark:text-dark-accent hover:text-accent/80 dark:hover:text-dark-accent/80"
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
    <header className="bg-white text-primary dark:bg-dark-bg-secondary dark:text-dark-primary shadow-md fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
            className="flex items-center space-x-3 group cursor-pointer transition-all duration-300 hover:scale-105"
          >
            <div className="p-2 rounded-xl bg-primary/10 dark:bg-dark-secondary/20">
              <Dumbbell className="h-8 w-8 text-primary dark:text-dark-secondary" />
            </div>
            <h1 className="text-2xl font-bold text-secondary dark:text-dark-accent">
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
                        ? 'bg-primary/10 text-primary dark:bg-dark-secondary/20 dark:text-dark-secondary'
                        : 'text-primary/80 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-dark-secondary dark:hover:bg-dark-secondary/10'
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
            
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_THEME' })}
              className="p-3 rounded-xl transition-all duration-300 hover:scale-110 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-dark-secondary/20 dark:text-dark-secondary dark:hover:bg-dark-secondary/30"
              title={state.darkTheme ? 'Modo Claro' : 'Modo Escuro'}
            >
              {state.darkTheme ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 rounded-xl bg-primary/10 dark:bg-dark-secondary/20"
          >
            <div className={`w-5 h-5 flex flex-col justify-center items-center transition-all duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-primary dark:bg-dark-secondary ${mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-6 pb-4 pt-6 border-t border-primary/20 dark:border-gray-700">
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
                      ? 'bg-primary/10 text-primary dark:bg-dark-secondary/20 dark:text-dark-secondary'
                      : 'text-primary/80 hover:text-primary hover:bg-primary/10 dark:text-gray-300 dark:hover:text-dark-secondary dark:hover:bg-dark-secondary/10'
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
  const { state, dispatch } = useContext(AppContext);

  const features = [
    {
      icon: TrendingUp,
      title: "Análise Inteligente",
      description: "IA avançada para análise de perfil e classificação automática de nível",
    },
    {
      icon: Heart,
      title: "Saúde Personalizada",
      description: "Adaptação baseada em condições de saúde e limitações físicas",
    },
    {
      icon: Calendar,
      title: "Progressão Temporal",
      description: "Planos com mesociclos e microciclos para evolução contínua",
    },
    {
      icon: Activity,
      title: "Otimização Científica",
      description: "Algoritmos de programação linear para seleção ideal de exercícios",
    }
  ];

  return (
    <div className="min-h-screen bg-dotted dark:bg-dark-bg-primary">
      <section className="bg-gradient-to-br from-secondary/90 via-teal-500 to-teal-700 text-light py-32 relative overflow-hidden transition-colors duration-500 dark:from-dark-secondary/90 dark:via-purple-700 dark:to-purple-800">
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-light/10 backdrop-blur-sm border border-light/20 dark:bg-dark-secondary/20 dark:border-dark-accent/30 mb-6">
              <Dumbbell className="h-16 w-16 text-light" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-light">
            Sistema de Prescrição
            <br />
            Inteligente de Treinos
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed text-light font-medium">
            Gere planos de treino personalizados, 
            baseados em evidências científicas e adaptados às suas condições de saúde.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
              className="bg-white text-primary hover:bg-white/90 dark:bg-dark-accent dark:text-dark-bg-primary dark:hover:bg-dark-accent/90 px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-105 group"
            >
              Começar Avaliação
              <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'admin' })}
              className="bg-transparent border-2 border-light text-light hover:bg-light hover:text-primary dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent dark:hover:text-dark-bg-primary px-8 md:px-12 py-4 md:py-5 rounded-2xl text-lg md:text-xl font-bold transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:scale-105"
            >
              Área Administrativa
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 dark:bg-dark-bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary dark:text-dark-accent">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tecnologia de ponta para criar o plano de treino perfeito para você
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-light to-white border-gray-100 dark:bg-gradient-to-br dark:from-dark-bg-secondary dark:to-dark-bg-secondary/80 dark:border-gray-700 p-8 rounded-3xl shadow-xl text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border">
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-secondary dark:bg-dark-secondary text-light mb-6 shadow-lg">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-accent">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-secondary/90 via-teal-500 to-teal-700 py-24 relative overflow-hidden transition-colors duration-500 dark:from-dark-secondary/90 dark:via-purple-700 dark:to-purple-800">
        
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-light">
              Pronto para transformar seus treinos?
            </h2>
            <p className="text-xl md:text-2xl text-light font-medium mb-12 leading-relaxed">
              Crie seu perfil completo e receba recomendações personalizadas em minutos.
            </p>
            
            
            
            <div className="mt-12 flex justify-center items-center space-x-8 text-light font-medium">
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
    // Handle numeric values properly to avoid NaN
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

  const validateFormData = () => {
    const errors = [];
    
    if (!formData.id || formData.id.trim() === '') {
      errors.push('ID do usuário é obrigatório');
    }
    
    if (!formData.birth_date || formData.birth_date === '') {
      errors.push('Data de nascimento é obrigatória');
    }
    
    if (formData.weekly_frequency < 1 || formData.weekly_frequency > 7) {
      errors.push('Frequência semanal deve estar entre 1 e 7 dias');
    }
    
    if (formData.session_time < 15 || formData.session_time > 180) {
      errors.push('Duração da sessão deve estar entre 15 e 180 minutos');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    // Validate form data before submission
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      dispatch({ type: 'SET_ERROR', payload: `Dados inválidos: ${validationErrors.join(', ')}` });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Ensure all numeric fields are properly formatted
      const sanitizedFormData = {
        ...formData,
        weekly_frequency: Number(formData.weekly_frequency) || 3,
        session_time: Number(formData.session_time) || 60,
        uninterrupted_training_time: Number(formData.uninterrupted_training_time) || 0,
        detraining: Number(formData.detraining) || 0,
        previous_experience: Number(formData.previous_experience) || 0,
        strength_values: {
          bench_press: Number(formData.strength_values.bench_press) || 0,
          lat_pulldown: Number(formData.strength_values.lat_pulldown) || 0,
          squat: Number(formData.strength_values.squat) || 0,
          deadlift: Number(formData.strength_values.deadlift) || 0,
          handgrip_dynamometer: Number(formData.strength_values.handgrip_dynamometer) || 0
        }
      };
      
      const response = await apiService.generatePartialPrescription({ profile: sanitizedFormData });
      dispatch({ type: 'SET_PARTIAL_PRESCRIPTION', payload: response });
      dispatch({ type: 'SET_USER_PROFILE', payload: sanitizedFormData });
      dispatch({ type: 'SET_PAGE', payload: 'prescription' });
    } catch (error) {
      console.error('Error generating partial prescription:', error);
      let errorMessage = 'Erro ao gerar prescrição parcial';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando em http://localhost:8000';
      } else if (error.message.includes('422')) {
        errorMessage = 'Dados inválidos enviados para o servidor. Verifique todos os campos.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Erro do servidor: ${error.message}`;
      }
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
                {healthConditionsOptions.map(condition => (
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
              {steps.map((step, index) => {
                const Icon = step.icon;
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
  const [activeTab, setActiveTab] = useState('new'); // 'new' ou 'history'

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
        mesocycle_duration: selectedOptions.mesocycle_duration
      };
      
      const response = await apiService.generateFullPrescription(request);
      dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: response });
      
      // Adicionar ao histórico
      dispatch({ 
        type: 'ADD_TO_PRESCRIPTION_HISTORY',
        userProfile: state.userProfile,
        partialPrescription: state.partialPrescription,
        fullPrescription: response
      });
      
      setShowFullPrescription(true);
    } catch (error) {
      console.error('Error generating full prescription:', error);
      let errorMessage = 'Erro ao gerar prescrição completa';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão. Verifique se o backend está rodando em http://localhost:8000';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = `Erro do servidor: ${error.message}`;
      }
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const OptionSelector = ({ title, field, options, recommended, description }) => (
    <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-primary dark:text-dark-primary">{title}</h3>
      {description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>}
      
      <div className="space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name={field}
              value={option}
              checked={selectedOptions[field] === option}
              onChange={(e) => handleOptionChange(field, e.target.value)}
              className="text-secondary dark:text-dark-secondary"
            />
            <span className={`${option === recommended ? 'font-semibold text-secondary dark:text-dark-secondary' : 'text-gray-700 dark:text-gray-300'}`}>
              {option}
              {option === recommended && ' (Recomendado)'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  // Componente para mostrar histórico de prescrições
  const PrescriptionHistory = () => (
    <div className="space-y-6">
      {state.prescriptionHistory.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-primary">Nenhuma prescrição encontrada</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Você ainda não gerou nenhuma prescrição completa.</p>
          <button
            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
            className="bg-secondary text-light dark:bg-dark-secondary px-6 py-3 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
          >
            Criar Perfil
          </button>
        </div>
      ) : (
        state.prescriptionHistory.map(prescription => (
          <div key={prescription.id} className="bg-white dark:bg-dark-bg-primary rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary dark:text-dark-primary">
                  Prescrição #{prescription.id}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Criado em: {prescription.createdAt}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Usuário: {prescription.userProfile.id}
                </p>
              </div>
              <button
                onClick={() => {
                  dispatch({ type: 'SET_FULL_PRESCRIPTION', payload: prescription.fullPrescription });
                  setShowFullPrescription(true);
                }}
                className="bg-secondary text-light dark:bg-dark-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors"
              >
                Ver Detalhes
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-semibold text-primary dark:text-dark-primary">Divisão:</span>
                <p className="dark:text-gray-300">{prescription.fullPrescription.division_type}</p>
              </div>
              <div>
                <span className="font-semibold text-primary dark:text-dark-primary">Sequência:</span>
                <p className="dark:text-gray-300">{prescription.fullPrescription.sequency_type}</p>
              </div>
              <div>
                <span className="font-semibold text-primary dark:text-dark-primary">Periodização:</span>
                <p className="dark:text-gray-300">{prescription.fullPrescription.periodization_type}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  if (state.loading) {
    return <LoadingSpinner message="Gerando plano de treino completo..." />;
  }

  if (showFullPrescription && state.fullPrescription) {
    return <FullPrescriptionView />;
  }

  return (
    <div className="min-h-screen bg-dotted dark:bg-dark-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {state.error && (
          <ErrorMessage 
            error={state.error} 
            onDismiss={() => dispatch({ type: 'SET_ERROR', payload: null })}
          />
        )}

        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary dark:text-dark-primary">Prescrições</h1>
          
          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 dark:bg-dark-bg-primary rounded-lg p-1">
              <button
                onClick={() => setActiveTab('new')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'new' 
                    ? 'bg-secondary text-light dark:bg-dark-secondary' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary'
                }`}
              >
                Nova Prescrição
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-secondary text-light dark:bg-dark-secondary' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-dark-primary'
                }`}
              >
                Histórico ({state.prescriptionHistory.length})
              </button>
            </div>
          </div>

          {/* Conteúdo baseado na aba ativa */}
          {activeTab === 'history' ? (
            <PrescriptionHistory />
          ) : state.partialPrescription ? (
            <div>
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
                  className="bg-secondary text-light px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary/80 transition-colors inline-flex items-center"
                >
                  Gerar Plano Completo
                  <FileText className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-primary">Nenhuma prescrição parcial encontrada</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Primeiro você precisa criar um perfil e gerar uma prescrição parcial.</p>
              <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'profile' })}
                className="bg-secondary text-light dark:bg-dark-secondary px-6 py-3 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
              >
                Criar Perfil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Full Prescription View
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
      <h1 className="text-3xl font-bold mb-8 dark:text-dark-primary">Dashboard Administrativo</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Grupos Musculares</p>
              <p className="text-3xl font-bold dark:text-dark-primary">47</p>
              <p className="text-sm text-green-600 dark:text-green-400">+2 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-secondary/20 text-secondary dark:bg-dark-secondary/20 dark:text-dark-secondary">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Exercícios</p>
              <p className="text-3xl font-bold dark:text-dark-primary">245</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-accent/20 text-accent dark:bg-dark-accent/20 dark:text-dark-accent">
              <Activity className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Prescrições</p>
              <p className="text-3xl font-bold dark:text-dark-primary">1,247</p>
              <p className="text-sm text-green-600 dark:text-green-400">+89 este mês</p>
            </div>
            <div className="p-3 rounded-full bg-primary/20 text-primary dark:bg-dark-primary/20 dark:text-dark-primary">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 dark:text-dark-primary">Sistema em Funcionamento</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="dark:text-dark-primary">API Backend</span>
            </div>
            <span className="text-green-600 dark:text-green-400 font-medium">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="dark:text-dark-primary">Banco de Dados</span>
            </div>
            <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span>
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
          <h1 className="text-3xl font-bold dark:text-dark-primary">Gerenciamento de Grupos Musculares</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-secondary text-light dark:bg-dark-secondary px-4 py-2 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 inline-flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Sincronizar Dados
          </button>
        </div>

        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-dark-primary">Informações</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Use este painel para sincronizar grupos musculares. A sincronização substitui 
            completamente todos os dados existentes.
          </p>
        </div>

        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-4 dark:text-dark-primary">Sincronizar Grupos Musculares</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Cole os dados JSON dos grupos musculares:</p>
              
              <textarea
                className="w-full h-64 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg-primary rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary font-mono text-sm"
                placeholder='{"muscle_groups": [{"id": "1", "name": "bíceps", ...}]}'
              />
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-secondary text-light dark:bg-dark-secondary rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
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
      <h1 className="text-3xl font-bold mb-8 dark:text-dark-primary">Gerenciamento de Exercícios</h1>
      <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">Funcionalidade de gerenciamento de exercícios em desenvolvimento.</p>
      </div>
    </div>
  );

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

  useEffect(() => {
    localStorage.setItem('darkTheme', state.darkTheme);
    if (state.darkTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkTheme]);

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
      <div className="min-h-screen transition-colors duration-300 bg-light text-primary dark:bg-dark-bg-primary dark:text-dark-primary">
        <Header />
        <main className="pt-20">
          {renderPage()}
        </main>
      </div>
    </AppContext.Provider>
  );
};

export default App;
