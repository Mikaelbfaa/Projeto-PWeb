import React from 'react';
import SyncPanel from './SyncPanel';

const HealthConditionsSync = () => {
  return (
    <SyncPanel
      title="Gerenciamento de Condições de Saúde"
      syncType="healthConditions"
      dataKey="health_conditions"
      itemLabel="condições de saúde"
      itemLabelSingular="condição de saúde"
      description="Use este painel para sincronizar condições de saúde com o backend. A sincronização substitui completamente todos os dados existentes no sistema."
      formatDescription='O JSON deve conter um objeto com a propriedade "health_conditions" contendo um array de condições de saúde.'
      placeholder='{"health_conditions": [{"id": "1", "name": "Hipertensão", "description": "Pressão alta", ...}]}'
    />
  );
};

export default HealthConditionsSync;