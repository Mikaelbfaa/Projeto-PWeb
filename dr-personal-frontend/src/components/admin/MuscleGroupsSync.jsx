import React from 'react';
import SyncPanel from './SyncPanel';

const MuscleGroupsSync = () => {
  return (
    <SyncPanel
      title="Gerenciamento de Grupos Musculares"
      syncType="muscleGroups"
      dataKey="muscle_groups"
      itemLabel="grupos musculares"
      itemLabelSingular="grupo muscular"
      description="Use este painel para sincronizar grupos musculares com o backend. A sincronização substitui completamente todos os dados existentes no sistema."
      formatDescription='O JSON deve conter um objeto com a propriedade "muscle_groups" contendo um array de grupos musculares.'
      placeholder='{"muscle_groups": [{"id": "1", "name": "bíceps", "size": "small", "segment": "upper", ...}]}'
    />
  );
};

export default MuscleGroupsSync;