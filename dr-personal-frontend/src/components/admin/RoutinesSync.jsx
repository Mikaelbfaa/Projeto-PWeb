import React from 'react';
import SyncPanel from './SyncPanel';

const RoutinesSync = () => {
  return (
    <SyncPanel
      title="Gerenciamento de Rotinas"
      syncType="routines"
      dataKey="routines"
      itemLabel="rotinas"
      itemLabelSingular="rotina"
      description="Use este painel para sincronizar rotinas de treino com o backend. A sincronização substitui completamente todos os dados existentes no sistema."
      formatDescription='O JSON deve conter um objeto com a propriedade "routines" contendo um array de rotinas.'
      placeholder='{"routines": [{"level": "beginner", "weekly_frequency": 3, "exercises": [["exercício1", "exercício2"]]}]}'
    />
  );
};

export default RoutinesSync;