import React from 'react';
import { FileText } from 'lucide-react';
import OptionSelector from '../forms/OptionSelector';

const PrescriptionForm = ({ 
  partialPrescription, 
  selectedOptions, 
  onOptionChange, 
  onGenerateFullPrescription 
}) => {
  if (!partialPrescription) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-primary">
          Nenhuma prescrição parcial encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Primeiro você precisa criar um perfil e gerar uma prescrição parcial.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'profile' }))}
          className="bg-secondary text-light dark:bg-dark-secondary px-6 py-3 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
        >
          Criar Perfil
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-center text-gray-600 mb-8">
        Seu nível foi classificado como: <span className="font-semibold text-secondary">
          {partialPrescription.level}
        </span>
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <OptionSelector
          title="Método de Treino"
          field="training_method"
          options={partialPrescription.training_method.options}
          recommended={partialPrescription.training_method.recommended}
          description="Estrutura de divisão dos treinos na semana"
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />

        <OptionSelector
          title="Tipo de Divisão"
          field="division_type"
          options={partialPrescription.division_type.options}
          recommended={partialPrescription.division_type.recommended}
          description="Como os grupos musculares serão organizados"
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />

        <OptionSelector
          title="Tipo de Sequência"
          field="sequency_type"
          options={partialPrescription.sequency_type.options}
          recommended={partialPrescription.sequency_type.recommended}
          description="Ordem de execução dos exercícios"
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />

        <OptionSelector
          title="Periodização"
          field="periodization_type"
          options={partialPrescription.periodization_type.options}
          recommended={partialPrescription.periodization_type.recommended}
          description="Modelo de progressão ao longo do tempo"
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />

        <div className="bg-white dark:bg-dark-bg-secondary p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-2 text-primary dark:text-dark-primary">
            Duração do Mesociclo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Duração total do plano em semanas
          </p>
          
          <select
            value={selectedOptions.mesocycle_duration}
            onChange={(e) => onOptionChange('mesocycle_duration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border-2 border-gray-300 bg-white dark:bg-dark-bg-primary dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-dark-secondary"
          >
            {partialPrescription.mesocycle_duration.options.map(duration => (
              <option key={duration} value={duration}>
                {duration} semanas
                {duration === partialPrescription.mesocycle_duration.recommended ? ' (Recomendado)' : ''}
              </option>
            ))}
          </select>
        </div>

        {partialPrescription.progression_status && (
          <OptionSelector
            title="Status de Progressão"
            field="progression_status"
            options={partialPrescription.progression_status.options}
            recommended={partialPrescription.progression_status.recommended}
            description="Status atual da sua evolução"
            selectedOptions={selectedOptions}
            onOptionChange={onOptionChange}
          />
        )}
      </div>

      <div className="text-center">
        <button
          onClick={onGenerateFullPrescription}
          className="bg-secondary text-light dark:bg-dark-secondary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-secondary/80 dark:hover:bg-dark-secondary/80 transition-colors inline-flex items-center"
        >
          Gerar Plano Completo
          <FileText className="ml-2 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default PrescriptionForm;