import React from 'react';

const PrescriptionHistory = ({ 
  prescriptionHistory, 
  onViewDetails, 
  onCreateProfile 
}) => {
  if (prescriptionHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-4 text-primary dark:text-dark-primary">
          Nenhuma prescrição encontrada
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Você ainda não gerou nenhuma prescrição completa.
        </p>
        <button
          onClick={onCreateProfile}
          className="bg-secondary text-light dark:bg-dark-secondary px-6 py-3 rounded-lg hover:bg-secondary/80 dark:hover:bg-dark-secondary/80"
        >
          Criar Perfil
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {prescriptionHistory.map(prescription => (
        <div 
          key={prescription.id} 
          className="bg-white dark:bg-dark-bg-primary rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
        >
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
              onClick={() => onViewDetails(prescription.fullPrescription)}
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
      ))}
    </div>
  );
};

export default PrescriptionHistory;