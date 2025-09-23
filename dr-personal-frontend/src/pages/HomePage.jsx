import { CheckCircle, ChevronRight, Dumbbell } from 'lucide-react';
import { useContext } from 'react';
import FeatureCard from '../components/common/FeatureCard';
import { FEATURES, ICON_MAP } from '../constants';
import { BORDER_RADIUS, BUTTON_VARIANTS, GRADIENTS } from '../constants/styles';
import { AppContext } from '../context/AppContext';

const HomePage = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-dotted dark:bg-dark-bg-primary">
      <section className={`${GRADIENTS.primary} text-light py-32 relative overflow-hidden transition-colors duration-500 ${GRADIENTS.primaryDark}`}>
        <div className="container mx-auto px-4 text-center relative">
          <div className="mb-8">
            <div className={`inline-flex items-center justify-center p-4 ${BORDER_RADIUS.large} bg-light/10 backdrop-blur-sm border border-light/20 dark:bg-dark-secondary/20 dark:border-dark-accent/30 mb-6`}>
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
              className={`${BUTTON_VARIANTS.primary} px-8 md:px-12 py-4 md:py-5 ${BORDER_RADIUS.medium} text-lg md:text-xl font-bold transition-all duration-300 inline-flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-105 group`}
            >
              Começar Avaliação
              <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: 'admin' })}
              className={`${BUTTON_VARIANTS.secondary} px-8 md:px-12 py-4 md:py-5 ${BORDER_RADIUS.medium} text-lg md:text-xl font-bold transition-all duration-300 inline-flex items-center justify-center backdrop-blur-sm hover:scale-105`}
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
            {FEATURES.map((feature, index) => {
              const Icon = ICON_MAP[feature.title];
              return (
                <FeatureCard key={index} feature={feature} Icon={Icon} />
              );
            })}
          </div>
        </div>
      </section>

      <section className={`${GRADIENTS.primary} py-24 relative overflow-hidden transition-colors duration-500 ${GRADIENTS.primaryDark}`}>
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

export default HomePage;