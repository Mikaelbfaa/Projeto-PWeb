import React, { useState } from 'react';
import { usePrescription } from '../hooks/usePrescription';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import TabNavigation from '../components/common/TabNavigation';
import PrescriptionHistory from '../components/prescription/PrescriptionHistory';
import PrescriptionForm from '../components/prescription/PrescriptionForm';
import FullPrescriptionView from './FullPrescriptionView';

const PrescriptionPage = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [showFullPrescription, setShowFullPrescription] = useState(false);
  
  const {
    selectedOptions,
    partialPrescription,
    fullPrescription,
    prescriptionHistory,
    loading,
    error,
    handleOptionChange,
    generateFullPrescription,
    viewPrescriptionDetails,
    navigateToProfile,
    clearError
  } = usePrescription();

  const tabs = [
    { id: 'new', label: 'Nova Prescrição' },
    { id: 'history', label: `Histórico (${prescriptionHistory.length})` }
  ];

  const handleGenerateFullPrescription = async () => {
    const result = await generateFullPrescription();
    if (result.success) {
      setShowFullPrescription(true);
    }
  };

  const handleViewPrescriptionDetails = (prescription) => {
    viewPrescriptionDetails(prescription);
    setShowFullPrescription(true);
  };

  if (loading) {
    return <LoadingSpinner message="Gerando plano de treino completo..." />;
  }

  if (showFullPrescription && fullPrescription) {
    return <FullPrescriptionView />;
  }

  return (
    <div className="min-h-screen bg-dotted dark:bg-dark-bg-primary py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={clearError}
          />
        )}

        <div className="bg-white dark:bg-dark-bg-secondary rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-primary dark:text-dark-primary">
            Prescrições
          </h1>
          
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {activeTab === 'history' ? (
            <PrescriptionHistory
              prescriptionHistory={prescriptionHistory}
              onViewDetails={handleViewPrescriptionDetails}
              onCreateProfile={navigateToProfile}
            />
          ) : (
            <PrescriptionForm
              partialPrescription={partialPrescription}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              onGenerateFullPrescription={handleGenerateFullPrescription}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionPage;