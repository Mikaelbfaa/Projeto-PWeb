// Serviço que simula as respostas da API com dados realistas para demonstração

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockService = {
  generatePartialPrescription: async (profileData) => {
    // Simula delay da API
    await delay(1500);

    console.log('Using MOCK data for partial prescription:', profileData);

    // Dados mockados baseados no perfil do usuário
    const profile = profileData.profile;
    const isBeginnerLevel = profile.previous_experience <= 1;
    const hasHealthIssues = profile.health_conditions && profile.health_conditions.length > 0;

    return {
      user_id: profile.id,
      training_method: {
        recommended: isBeginnerLevel ? "traditional" : "drop_set",
        options: ["traditional", "super_set", "drop_set", "rest_pause"],
        reasoning: isBeginnerLevel
          ? "Método tradicional recomendado para iniciantes focando na técnica e adaptação."
          : "Drop set recomendado para maximizar hipertrofia com sua experiência atual."
      },
      division_type: {
        recommended: profile.weekly_frequency >= 5 ? "push_pull_legs" : "upper_lower",
        options: ["full_body", "upper_lower", "push_pull_legs", "body_part_split"],
        reasoning: profile.weekly_frequency >= 5
          ? "Divisão Push/Pull/Legs ideal para frequência alta permitindo melhor recuperação."
          : "Divisão Upper/Lower eficiente para sua frequência de treino semanal."
      },
      sequency_type: {
        recommended: "multi_articular_first",
        options: ["multi_articular_first", "unilateral_first", "pre_exhaustion"],
        reasoning: "Exercícios multiarticulares primeiro para máximo aproveitamento energético."
      },
      periodization_type: {
        recommended: hasHealthIssues ? "linear" : "undulating",
        options: ["linear", "undulating", "block", "conjugate"],
        reasoning: hasHealthIssues
          ? "Periodização linear mais segura considerando suas condições de saúde."
          : "Periodização ondulatória para variedade e adaptação contínua."
      },
      mesocycle_duration: {
        recommended: 4,
        options: [3, 4, 6, 8],
        reasoning: "4 semanas permite adaptação adequada sem estagnação."
      },
      progression_status: {
        recommended: "progressive_overload",
        options: ["progressive_overload", "deload", "maintenance", "recovery"],
        reasoning: "Sobrecarga progressiva baseada em sua experiência e objetivos."
      }
    };
  },

  generateFullPrescription: async (request) => {
    // Simula delay da API
    await delay(2000);

    console.log('Using MOCK data for full prescription:', request);

    // Gera dados dos microciclos
    const microcycles = generateMockMicrocycles(request);

    // Cria estrutura compatível com FullPrescriptionView
    const prescription = {
      user_id: request.user_id,
      division_type: request.division_type,
      sequency_type: request.sequency_type,
      periodization_type: request.periodization_type,
      training_method: request.training_method,
      mesocycle_duration: request.mesocycle_duration,
      estimated_results: {
        strength_gain: "15-25%",
        muscle_mass_gain: "2-4kg",
        endurance_improvement: "20-30%",
        expected_timeline: `${request.mesocycle_duration} semanas`
      },
      safety_notes: [
        "Mantenha sempre a técnica correta durante os exercícios",
        "Respeite os intervalos de descanso prescritos",
        "Interrompa o exercício em caso de dor ou desconforto",
        "Hidrate-se adequadamente durante o treino"
      ],
      generated_at: new Date().toISOString(),
      is_demo: true
    };

    // Adiciona microciclos como propriedades separadas (microcycle_1, microcycle_2, etc.)
    microcycles.forEach((microcycle, index) => {
      const microcycleName = `microcycle_${index + 1}`;
      prescription[microcycleName] = convertMicrocycleToExpectedFormat(microcycle, request);
    });

    return prescription;
  }
};

function generateMockMicrocycles(request) {
  const microcycles = [];

  for (let week = 1; week <= request.mesocycle_duration; week++) {
    const intensity = calculateIntensity(week, request.mesocycle_duration, request.periodization_type);

    microcycles.push({
      week_number: week,
      intensity_percentage: intensity,
      volume_percentage: 100 - (intensity - 70), // Volume inversamente proporcional
      training_sessions: generateMockSessions(request.division_type, week, intensity)
    });
  }

  return microcycles;
}

function calculateIntensity(week, totalWeeks, periodizationType) {
  switch (periodizationType) {
    case 'linear':
      return 70 + (week - 1) * (15 / (totalWeeks - 1)); // 70% a 85%
    case 'undulating':
      return week % 2 === 1 ? 75 : 80; // Alterna entre 75% e 80%
    case 'block':
      return week <= totalWeeks / 2 ? 70 : 85; // Primeiro bloco 70%, segundo 85%
    default:
      return 75; // Default
  }
}

function generateMockSessions(divisionType, week, intensity) {
  const sessions = [];

  switch (divisionType) {
    case 'upper_lower':
      sessions.push(
        createMockSession(`Upper Body - Semana ${week}`, 'upper', intensity),
        createMockSession(`Lower Body - Semana ${week}`, 'lower', intensity),
        createMockSession(`Upper Body - Semana ${week}`, 'upper', intensity),
        createMockSession(`Lower Body - Semana ${week}`, 'lower', intensity)
      );
      break;

    case 'push_pull_legs':
      sessions.push(
        createMockSession(`Push - Semana ${week}`, 'push', intensity),
        createMockSession(`Pull - Semana ${week}`, 'pull', intensity),
        createMockSession(`Legs - Semana ${week}`, 'legs', intensity),
        createMockSession(`Push - Semana ${week}`, 'push', intensity),
        createMockSession(`Pull - Semana ${week}`, 'pull', intensity)
      );
      break;

    case 'full_body':
      for (let day = 1; day <= 3; day++) {
        sessions.push(createMockSession(`Full Body ${day} - Semana ${week}`, 'full_body', intensity));
      }
      break;

    default:
      sessions.push(createMockSession(`Treino - Semana ${week}`, 'general', intensity));
  }

  return sessions;
}

function createMockSession(name, type, intensity) {
  const exercisesByType = {
    upper: [
      { name: 'Supino Reto', muscle_groups: ['Peitoral', 'Tríceps'], sets: 4, reps: '8-10', rest: '90-120s' },
      { name: 'Puxada Alta', muscle_groups: ['Dorsal', 'Bíceps'], sets: 4, reps: '8-12', rest: '90s' },
      { name: 'Desenvolvimento com Halteres', muscle_groups: ['Ombros'], sets: 3, reps: '10-12', rest: '75s' },
      { name: 'Rosca Direta', muscle_groups: ['Bíceps'], sets: 3, reps: '10-15', rest: '60s' },
      { name: 'Tríceps Pulley', muscle_groups: ['Tríceps'], sets: 3, reps: '10-15', rest: '60s' }
    ],
    lower: [
      { name: 'Agachamento Livre', muscle_groups: ['Quadríceps', 'Glúteos'], sets: 4, reps: '8-10', rest: '120s' },
      { name: 'Levantamento Terra', muscle_groups: ['Posterior de Coxa', 'Glúteos'], sets: 4, reps: '6-8', rest: '120s' },
      { name: 'Leg Press', muscle_groups: ['Quadríceps', 'Glúteos'], sets: 3, reps: '12-15', rest: '90s' },
      { name: 'Flexão Plantar', muscle_groups: ['Panturrilha'], sets: 4, reps: '15-20', rest: '60s' },
      { name: 'Abdução de Quadril', muscle_groups: ['Glúteo Médio'], sets: 3, reps: '12-15', rest: '60s' }
    ],
    push: [
      { name: 'Supino Inclinado', muscle_groups: ['Peitoral Superior'], sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Desenvolvimento Militar', muscle_groups: ['Ombros'], sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Paralelas', muscle_groups: ['Peitoral', 'Tríceps'], sets: 3, reps: '8-12', rest: '90s' },
      { name: 'Elevação Lateral', muscle_groups: ['Ombro Lateral'], sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Tríceps Francês', muscle_groups: ['Tríceps'], sets: 3, reps: '10-12', rest: '60s' }
    ],
    pull: [
      { name: 'Puxada Frontal', muscle_groups: ['Dorsal'], sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Remada Curvada', muscle_groups: ['Dorsal', 'Romboides'], sets: 4, reps: '8-10', rest: '90s' },
      { name: 'Remada Unilateral', muscle_groups: ['Dorsal'], sets: 3, reps: '10-12', rest: '75s' },
      { name: 'Rosca Martelo', muscle_groups: ['Bíceps'], sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Encolhimento', muscle_groups: ['Trapézio'], sets: 3, reps: '12-15', rest: '60s' }
    ],
    legs: [
      { name: 'Agachamento Frontal', muscle_groups: ['Quadríceps'], sets: 4, reps: '8-10', rest: '120s' },
      { name: 'Stiff', muscle_groups: ['Posterior de Coxa'], sets: 4, reps: '10-12', rest: '90s' },
      { name: 'Afundo', muscle_groups: ['Quadríceps', 'Glúteos'], sets: 3, reps: '12-15', rest: '90s' },
      { name: 'Mesa Flexora', muscle_groups: ['Posterior de Coxa'], sets: 3, reps: '12-15', rest: '75s' },
      { name: 'Elevação de Panturrilha', muscle_groups: ['Panturrilha'], sets: 4, reps: '15-20', rest: '60s' }
    ],
    full_body: [
      { name: 'Agachamento', muscle_groups: ['Quadríceps', 'Glúteos'], sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Supino', muscle_groups: ['Peitoral'], sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Remada', muscle_groups: ['Dorsal'], sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Desenvolvimento', muscle_groups: ['Ombros'], sets: 3, reps: '10-12', rest: '75s' },
      { name: 'Prancha', muscle_groups: ['Core'], sets: 3, reps: '30-60s', rest: '60s' }
    ]
  };

  const exercises = exercisesByType[type] || exercisesByType.general || exercisesByType.full_body;

  // Ajusta repetições baseado na intensidade
  const adjustedExercises = exercises.map(exercise => ({
    ...exercise,
    load_percentage: Math.round(intensity),
    reps: adjustRepsForIntensity(exercise.reps, intensity),
    notes: `Intensidade: ${Math.round(intensity)}% | Foco na técnica correta`
  }));

  return {
    session_name: name,
    session_type: type,
    estimated_duration: '60-75 minutos',
    warm_up: 'Aquecimento geral (5-10min) + aquecimento específico (5min)',
    exercises: adjustedExercises,
    cool_down: 'Alongamento estático (10-15min)',
    intensity_target: `${Math.round(intensity)}%`,
    volume_target: 'Moderado a Alto'
  };
}

function adjustRepsForIntensity(originalReps, intensity) {
  if (intensity >= 85) {
    return originalReps.replace(/\d+-\d+/, '6-8'); // Alta intensidade, menos reps
  } else if (intensity >= 80) {
    return originalReps.replace(/\d+-\d+/, '8-10');
  } else {
    return originalReps; // Mantém original para intensidades menores
  }
}

function convertMicrocycleToExpectedFormat(microcycle, request) {
  // Cria array no formato esperado pelo FullPrescriptionView
  const microcycleArray = [];

  // Primeiro item: training_parameters (informações do microciclo)
  microcycleArray.push({
    training_parameters: {
      strength_manifestation: getStrengthManifestation(request.training_method),
      maximum_strength: `${Math.round(microcycle.intensity_percentage)}%`,
      sets: getDefaultSets(request.training_method),
      repetitions: getDefaultReps(microcycle.intensity_percentage),
      pause_time: getDefaultPauseTime(request.training_method),
      concentric_contraction_tempo: "1-2s",
      eccentric_contraction_tempo: "2-3s"
    }
  });

  // Adiciona os dias de treino
  microcycle.training_sessions.forEach((session, index) => {
    const dayNumber = index + 1;
    const dayObject = {};

    dayObject[`Dia ${dayNumber}`] = {
      exercises: convertSessionExercisesToExpectedFormat(session.exercises)
    };

    microcycleArray.push(dayObject);
  });

  return microcycleArray;
}

function convertSessionExercisesToExpectedFormat(exercises) {
  return exercises.map(exercise => ({
    name: exercise.name,
    sets: exercise.sets,
    count_type: 'repetition',
    repetitions: parseRepetitions(exercise.reps),
    pause_time: exercise.rest,
    exercise_type: 'strength',
    muscle_groups: exercise.muscle_groups,
    load_percentage: exercise.load_percentage,
    notes: exercise.notes
  }));
}

function parseRepetitions(repsString) {
  // Converte "8-10" para { min: 8, max: 10 }
  const match = repsString.match(/(\d+)-(\d+)/);
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2])
    };
  }
  return { min: 8, max: 12 }; // Default
}

function getStrengthManifestation(trainingMethod) {
  const manifestations = {
    traditional: "Força Resistente",
    drop_set: "Hipertrofia",
    super_set: "Resistência Muscular",
    rest_pause: "Força Máxima"
  };
  return manifestations[trainingMethod] || "Força Geral";
}

function getDefaultSets(trainingMethod) {
  const setsByMethod = {
    traditional: "3-4",
    drop_set: "3-4",
    super_set: "2-3",
    rest_pause: "3-5"
  };
  return setsByMethod[trainingMethod] || "3-4";
}

function getDefaultReps(intensity) {
  if (intensity >= 85) {
    return { min: 6, max: 8 };
  } else if (intensity >= 80) {
    return { min: 8, max: 10 };
  } else {
    return { min: 10, max: 12 };
  }
}

function getDefaultPauseTime(trainingMethod) {
  const pauseByMethod = {
    traditional: "90-120s",
    drop_set: "60-90s",
    super_set: "45-60s",
    rest_pause: "120-180s"
  };
  return pauseByMethod[trainingMethod] || "90-120s";
}

export default mockService;