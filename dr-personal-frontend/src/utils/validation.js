export const validateFormData = (formData) => {
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

export const sanitizeFormData = (formData) => {
  return {
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
};

export const getErrorMessage = (error) => {
  let errorMessage = 'Erro desconhecido';
  
  if (error.message.includes('Failed to fetch')) {
    errorMessage = 'Erro de conexão. Verifique se o backend está rodando em http://localhost:8000';
  } else if (error.message.includes('422')) {
    errorMessage = 'Dados inválidos enviados para o servidor. Verifique todos os campos.';
  } else if (error.message.includes('500')) {
    errorMessage = 'Erro interno do servidor. Tente novamente em alguns minutos.';
  } else if (error.message.includes('HTTP error')) {
    errorMessage = `Erro do servidor: ${error.message}`;
  }
  
  return errorMessage;
};